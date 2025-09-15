from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage, SystemMessage
from pydantic import BaseModel
from typing import TypedDict, List, Annotated, Dict
import re
import operator
from dotenv import load_dotenv

load_dotenv()

class Cycle(BaseModel):
    cycle_number: int
    enriched_text: str
    rating: float
    feedback: str = ""
    hashtags: List[str] = []

class OutputSchema(BaseModel):
    refinement_journey: List[Cycle]
    final_enriched_text: str

class InputRequest(BaseModel):
    prompt_idea: str
    tone: str
    platform: str
    enrichment_cycles: int

class AgentState(TypedDict):
    prompt_idea: str
    tone: str
    platform: str
    enrichment_cycles: int
    current_cycle: int
    messages: Annotated[List[BaseMessage], operator.add]
    refinement_journey: List[Dict]
    final_enriched_text: str

llm = ChatOpenAI(
    model="gpt-4.1-nano",
    temperature=0.3
)

def get_ensemble_rating(content: str, platform: str, tone: str) -> float:
    """Get stable rating by averaging multiple samples"""
    rating_system = SystemMessage(content="""Rate content quality 1-10. Output ONLY a number.""")
    
    rating_prompt = f"""Rate this {platform} content (1-10):
        - Tone match ({tone}): /10
        - Platform fit: /10  
        - Engagement potential: /10

        Content: {content}

        Rating:"""
    
    ratings = []
    for _ in range(2):
        try:
            rating_response = llm.invoke([rating_system, HumanMessage(content=rating_prompt)])
            rating_val = float(re.findall(r"\d+\.?\d*", rating_response.content)[0])
            ratings.append(max(1, min(10, rating_val)))
        except (IndexError, ValueError):
            ratings.append(7.0)
    
    return round(sum(ratings) / len(ratings), 1)

def get_comparative_rating(current_text: str, previous_text: str, feedback: str, previous_rating: float, platform: str) -> float:
    """Rate improvement relative to previous cycle"""
    
    comparative_prompt = f"""Compare these {platform} content versions:

        Previous: {previous_text}
        Current: {current_text}
        Feedback applied: {feedback}

        Rate improvement (-2 to +2):
        -2 = Much worse, -1 = Worse, 0 = Same, +1 = Better, +2 = Much better

        Output only the number:"""
    
    try:
        response = llm.invoke([SystemMessage(content="Output only number -2 to +2"), 
                              HumanMessage(content=comparative_prompt)])
        improvement = float(re.findall(r"[-]?\d+", response.content)[0])
        improvement = max(-2, min(2, improvement))
    except (IndexError, ValueError):
        improvement = 0
    
    new_rating = max(1, min(10, previous_rating + improvement))
    return round(new_rating, 1)

def llm_agent_node(state: AgentState) -> AgentState:
    """Generate enriched text"""
    messages = state.get("messages", [])
    journey = state.get("refinement_journey", [])
    cycle_number = state.get("current_cycle", 1)
    
    feedback_text = journey[-1]["feedback"] if journey else "No previous feedback"
    
    system_message = SystemMessage(content="""Generate social media content ONLY. 
        - NO introductory phrases
        - NO questions at the end
        - Just return clean, ready-to-post content""")
    
    if feedback_text == "No previous feedback":
        user_prompt = f"""Create {state['platform']} content with {state['tone']} tone.
            Idea: {state['prompt_idea']}
            Output content directly:"""
    else:
        user_prompt = f"""Improve this {state['platform']} content:
            Idea: {state['prompt_idea']}
            Tone: {state['tone']}
            Previous feedback: {feedback_text}
            Output improved content directly:"""
    
    response = llm.invoke([system_message, HumanMessage(content=user_prompt)])
    enriched_text = response.content.strip()
    
    if cycle_number == 1:
        rating = get_ensemble_rating(enriched_text, state['platform'], state['tone'])
    else:
        previous_text = journey[-1]["enriched_text"]
        previous_rating = journey[-1]["rating"]
        feedback = journey[-1]["feedback"]
        rating = get_comparative_rating(enriched_text, previous_text, feedback, previous_rating, state['platform'])
    
    cycle_data = {
        "cycle_number": cycle_number,
        "enriched_text": enriched_text,
        "rating": rating,
        "hashtags": [],
        "feedback": ""
    }
    
    new_journey = journey + [cycle_data]
    new_messages = [AIMessage(content=f"Cycle {cycle_number} completed")]
    
    return {**state, "messages": new_messages, "refinement_journey": new_journey}

def critic_node(state: AgentState) -> AgentState:
    """Provide feedback"""
    journey = state.get("refinement_journey", [])
    if not journey:
        return state
    
    latest_entry = journey[-1]
    latest_text = latest_entry["enriched_text"]
    current_rating = latest_entry["rating"]
    
    system_message = SystemMessage(content="""Provide concise feedback.
        - NO conversational phrases
        - Under 80 words
        - Specific improvements only""")
    
    critic_prompt = f"""Analyze this {state['platform']} content:
        Content: {latest_text}
        Rating: {current_rating}/10
        Target tone: {state['tone']}

        Specific feedback for improvement:"""
    
    feedback_response = llm.invoke([system_message, HumanMessage(content=critic_prompt)])
    feedback = feedback_response.content.strip()
    
    updated_journey = journey.copy()
    updated_journey[-1]["feedback"] = feedback
    
    return {**state, "refinement_journey": updated_journey}

def hashtag_node(state: AgentState) -> AgentState:
    """Generate hashtags"""
    journey = state.get("refinement_journey", [])
    if not journey:
        return state
    
    latest_entry = journey[-1]
    latest_text = latest_entry["enriched_text"]
    platform = state["platform"]
    
    system_message = SystemMessage(content="""Generate hashtags ONLY.
        Format: #hashtag1 #hashtag2 #hashtag3
        Maximum 6 hashtags""")
    
    hashtag_prompt = f"""Generate hashtags for this {platform} post: {latest_text} Hashtags:"""
    
    try:
        hashtag_response = llm.invoke([system_message, HumanMessage(content=hashtag_prompt)])
        all_hashtags = re.findall(r"#\w+", hashtag_response.content.strip())[:6]
        if not all_hashtags:
            all_hashtags = [f"#{platform.lower()}", "#content", "#social"]
    except Exception:
        all_hashtags = [f"#{platform.lower()}", "#content", "#social"]
    
    updated_journey = journey.copy()
    updated_journey[-1]["hashtags"] = all_hashtags
    
    return {**state, "refinement_journey": updated_journey}

def should_continue_cycles(state: AgentState) -> str:
    """Check if should continue cycling"""
    current_cycle = state.get("current_cycle", 1)
    max_cycles = state.get("enrichment_cycles", 1)
    return "continue" if current_cycle < max_cycles else "finalize"

def increment_and_continue(state: AgentState) -> AgentState:
    """Increment cycle counter"""
    return {**state, "current_cycle": state.get("current_cycle", 1) + 1}

def finalize_node(state: AgentState) -> AgentState:
    """Finalize and select best content (prefer latest cycle on ties)."""
    journey = state.get("refinement_journey", [])

    if not journey:
        return {**state, "final_enriched_text": state["prompt_idea"]}

    best_entry = max(
        journey,
        key=lambda x: (x.get("rating", 0), x.get("cycle_number", 0)) 
    )

    final_text = best_entry["enriched_text"]

    return {**state, "final_enriched_text": final_text}


def build_enrichment_graph():
    """Build the workflow graph"""
    graph = StateGraph(AgentState)
    
    graph.add_node("llm_agent", llm_agent_node)
    graph.add_node("critic", critic_node)
    graph.add_node("hashtags", hashtag_node)
    graph.add_node("increment", increment_and_continue)
    graph.add_node("finalize", finalize_node)
    
    graph.set_entry_point("llm_agent")
    graph.add_edge("llm_agent", "critic")
    graph.add_edge("critic", "hashtags")
    graph.add_edge("hashtags", "increment")
    
    graph.add_conditional_edges(
        "increment",
        should_continue_cycles,
        {"continue": "llm_agent", "finalize": "finalize"}
    )
    
    graph.set_finish_point("finalize")
    return graph.compile()

def run_enrichment_workflow(input_data: InputRequest) -> OutputSchema:
    """Main function to run enrichment and return formatted output"""
    
    initial_state: AgentState = {
        "prompt_idea": input_data.prompt_idea,
        "tone": input_data.tone,
        "platform": input_data.platform,
        "enrichment_cycles": input_data.enrichment_cycles + 1,
        "current_cycle": 1,
        "messages": [],
        "refinement_journey": [],
        "final_enriched_text": ""
    }
    
    graph = build_enrichment_graph()
    recursion_limit = (input_data.enrichment_cycles * 4) + 10
    
    final_state = graph.invoke(
        initial_state, 
        config={"recursion_limit": recursion_limit}
    )
    
    journey_cycles = [
        Cycle(
            cycle_number=cycle["cycle_number"],
            enriched_text=cycle["enriched_text"],
            rating=cycle["rating"],
            feedback=cycle.get("feedback", ""),
            hashtags=cycle.get("hashtags", [])
        )
        for cycle in final_state["refinement_journey"]
    ]
    
    return OutputSchema(
        refinement_journey=journey_cycles,
        final_enriched_text=final_state["final_enriched_text"]
    )
