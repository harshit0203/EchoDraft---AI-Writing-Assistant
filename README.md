EchoDraft — AI Writing Assistant 
A full‑stack, GenAI‑powered writing assistant that combines a modern Next.js frontend with a FastAPI backend, secure JWT authentication, MongoDB (Motor/asyncio), and LangChain + LangGraph orchestration around ChatOpenAI (gpt‑4.1‑nano).

Table of contents

Overview

Key features

Architecture

Tech stack

Repository layout

Overview
EchoDraft streamlines content ideation, drafting, and refinement using a lightweight LLM with deterministic orchestration, while providing a clean, responsive UI and a secure, scalable API layer.

Key features

Auth: Email/password with JWT access tokens and refreshless session strategy.

Writing tools: Prompted generation, guided revisions, style presets, and structured outputs.

AI orchestration: Reusable chains/graphs for prompt hygiene, safety passes, and tool calls.

Persistence: User profiles, settings, and content history in MongoDB (async Motor).

Modern UI: Next.js + React with Redux state, TailwindCSS, Material UI, and shadcn/ui.

Configurable: Environment‑driven setup for API base URL, model, and rate limiting.

Architecture

Frontend (Next.js): React app that authenticates with the API, manages drafts, and invokes generation endpoints.

Backend (FastAPI): Async REST API, auth, validation, and endpoints for generation and user settings.

Database (MongoDB): Async Motor client, indexes, and per‑user collections/documents.

Orchestration (LangChain + LangGraph): Nodes for input normalization, prompt assembly, model call, post‑processing, and optional enrichment.

Model: ChatOpenAI gpt‑4.1‑nano for fast, economical generations.

Tech stack

Frontend: Next.js, React, Redux Toolkit, TailwindCSS, Material UI, shadcn/ui

Backend: FastAPI, Pydantic, Uvicorn

Auth: JWT (HS256), password hashing with bcrypt

Database: MongoDB with Motor (asyncio)

GenAI: OpenAI client, LangChain, LangGraph

Tooling: Python 3.11+, Node 18+

Repository layout
.
├─ backend/
│ ├─ app/
│ │ ├─ main.py
│ │ ├─ auth.py
│ │ ├─ models.py
│ │ └─ schemas.py
│ ├─ config.py
│ ├─ database/init.py
│ ├─ routes/
│ │ ├─ init.py
│ │ ├─ generate_text.py
│ │ ├─ login.py
│ │ ├─ password_reset.py
│ │ ├─ settings.py
│ │ └─ signup.py
│ └─ workflow/
│ ├─ init.py
│ └─ enrichment_ai.py
└─ frontend/
└─ (Next.js app: pages/app, app router or pages router, components, store, ui)
