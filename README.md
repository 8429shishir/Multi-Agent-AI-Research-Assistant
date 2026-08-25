# 🤖 Multi-Agent AI Research Assistant

A powerful, full-stack SaaS application that leverages Multi-Agent AI to perform automated, deep-dive research. Built with Next.js, FastAPI, LangChain, and Supabase, this platform automates the entire research workflow—from searching and web scraping to synthesizing comprehensive reports.

---

## ✨ Features

- **Multi-Agent Research Pipeline**: Utilizes LangGraph and LangChain ReAct agents to autonomously search, scrape, and analyze information.
- **Modern SaaS Dashboard**: A beautiful, responsive user interface built with Next.js, Tailwind CSS, and Framer Motion for smooth micro-animations.
- **Secure Authentication**: Integrated Google OAuth and user management powered by Supabase.
- **Persistent Storage**: Saves generated research reports and user data reliably via Supabase PostgreSQL.
- **High Performance API**: Fast, asynchronous backend processing powered by FastAPI and Uvicorn.
- **Intelligent Web Scraping**: Integrates Tavily and BeautifulSoup for high-quality data extraction.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (App Router, Turbopack)
- React
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase Auth

**Backend & AI**
- Python 3.11+
- FastAPI & Uvicorn
- LangChain & LangGraph
- OpenAI API (LLM capabilities)
- Tavily API (Search capabilities)
- BeautifulSoup4 (Web Scraping)

**Database**
- Supabase (PostgreSQL)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- API Keys for OpenAI, Tavily, and Supabase

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/multi-agent-ai-research-assistant.git
cd multi-agent-ai-research-assistant
```

### 2. Backend Setup (FastAPI + AI Agents)

Open a terminal and navigate to the `backend` directory:

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory and add your API keys:
```env
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Run the backend server:
```bash
python3 main.py
# Server will start on http://localhost:8000
```

### 3. Frontend Setup (Next.js)

Open a new terminal window and navigate to the `frontend` directory:

```bash
cd frontend

# Install dependencies
npm install
```

Create a `.env.local` file in the `frontend` directory for Supabase configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the frontend development server:
```bash
npm run dev
# Server will start on http://localhost:3000
```

---

## 🎯 Usage

1. Start both the backend and frontend servers as described above.
2. Navigate to `http://localhost:3000` in your browser.
3. Sign in using your Google account (via Supabase OAuth).
4. Enter a topic in the research dashboard and let the AI agents do the heavy lifting!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
