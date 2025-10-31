# EchoDraft: AI-Powered Writing Assistant

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-teal?logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-blue?logo=langchain)](https://www.langchain.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4.1--Nano-lightgreen?logo=openai)](https://openai.com/)

**A full-stack, GenAI-powered writing assistant to streamline your content creation process.**

</div>

---

**EchoDraft** is an intelligent writing assistant designed to help users with content ideation, drafting, and refinement. By combining a clean, responsive Next.js frontend with a powerful FastAPI backend, EchoDraft provides a seamless and efficient writing experience.

At its core, EchoDraft uses deterministic AI agent orchestration via **LangChain** and **LangGraph**, powered by the lightweight but capable **GPT-4.1-Nano** model. This ensures high-quality content generation while maintaining speed and control.

<br/>

<p align="center">
  <img src="https://your-image-host.com/echodraft_editor.png" alt="EchoDraft Editor Interface" width="800"/>
</p>

## ✨ Key Features

-   **AI-Powered Content Generation**: Quickly generate drafts, brainstorm ideas, or refine existing text for articles, emails, social media posts, and more.
-   **Deterministic Agent Orchestration**: Utilizes **LangGraph** to create predictable and reliable AI workflows, ensuring consistent output quality.
-   **Clean & Responsive UI**: A modern, minimalist user interface built with Next.js and Tailwind CSS provides a distraction-free writing environment.
-   **Secure User Authentication**: Employs JWT-based authentication to protect user accounts and ensure that all generated content and user data remain private.
-   **Asynchronous Backend**: The FastAPI backend uses **Motor** with `asyncio` for non-blocking database operations with MongoDB, ensuring the API is fast and scalable.
-   **User-Specific Content Management**: Users can save, edit, and manage their generated drafts through a personal dashboard.

## 🚀 Tech Stack

EchoDraft is built on a modern, robust, and scalable technology stack, perfect for a high-performance AI application.

### Frontend
-   **Framework**: [Next.js](https://nextjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

### Backend
-   **Framework**: [FastAPI (Python)](https://fastapi.tiangolo.com/)
-   **Asynchronous MongoDB Driver**: [Motor](https://motor.readthedocs.io/)
-   **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/)
-   **Database**: [MongoDB](https://www.mongodb.com/)

### Artificial Intelligence
-   **Core AI Orchestration**: [LangChain](https://www.langchain.com/)
-   **Stateful Agent Architecture**: [LangGraph](https://langchain-ai.github.io/langgraph/)
-   **LLM**: **GPT-4.1-Nano** (via ChatOpenAI)

## 🛠️ Getting Started

Follow these instructions to set up EchoDraft locally for development and testing.

### Prerequisites

-   Node.js (v18 or later)
-   Python (v3.10 or later)
-   MongoDB instance (local or cloud-based)
-   An OpenAI API key

### 1. Clone the Repository

git clone https://github.com/harshit0203/echodraft.git
cd echodraft


### 2. Backend Setup

Navigate to the `backend` directory, create and activate a virtual environment, and install the necessary dependencies.

cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

pip install -r requirements.txt


Create a `.env` file in the `backend` directory and add your environment variables:


MONGO_URI="your-mongodb-connection-string"
JWT_SECRET="your-super-secret-jwt-key"
OPENAI_API_KEY="your-openai-api-key"
JWT_ALGORITHM="your-jwt-algorithm"
ACCESS_TOKEN_EXPIRE_MINUTES="your-expiry-minutes" (prefer 30)


Run the FastAPI backend server:

uvicorn app.main:app --reload

The backend API will be available at `http://localhost:8000`.

### 3. Frontend Setup

In a separate terminal, navigate to the `frontend` directory and install the packages.

cd ../frontend
npm install


Create a `.env.local` file to point to your backend API:

NEXT_PUBLIC_API_URL="http://localhost:8000"


Run the Next.js development server:

npm run dev

The EchoDraft application is now running at `http://localhost:3000`.

## 🤝 Contributing

We welcome contributions of all kinds! If you have an idea for a new feature or have found a bug, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewCoolFeature`)
3.  Commit your Changes (`git commit -m 'Add some NewCoolFeature'`)
4.  Push to the Branch (`git push origin feature/NewCoolFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more information.

---
<div align="center">
  Crafted with care by Harshit Sharma
</div>
