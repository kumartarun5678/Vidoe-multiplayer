# 🧩 Multiplayer Grid Game

A real-time collaborative emoji grid built with **React**, **TypeScript**, and **Socket.IO**, where multiple players can update a shared 10x10 grid simultaneously.  
Each player can place a Unicode character in a grid cell, view live updates from others, and see how many players are currently online.

---

## 📜 Project Overview

This project was built as part of a **take-home assignment** to demonstrate skills in full-stack development, real-time systems, and clean architecture.

### ✅ Core Requirements

| Requirement | Status | Details |
|--------------|---------|----------|
| Shared 10x10 grid | ✅ Complete | Single shared grid for all players |
| Unicode character updates | ✅ Complete | Players can select or type any Unicode character |
| One update per player | ✅ Complete | Player locked after one submission |
| Live player count | ✅ Complete | Real-time updates of connected players |
| Real-time grid updates | ✅ Complete | WebSocket-based instant synchronization |
| Shared state across clients | ✅ Complete | Centralized state broadcast via Socket.IO |

---

### 🌟 Extra Features (Optional)

| Feature | Status | Implementation Details |
|----------|---------|------------------------|
| Timed Restriction (1 minute) | ✅ Complete | Cooldown timer with visual countdown |
| Historical Updates | ✅ Complete | Timeline of all grid updates with timestamps |
| Grouped Updates (within 1s) | ✅ Complete | Updates made within 1 second grouped in history |

---

## 🛠️ Technology Stack

### Frontend
- ⚛️ **React 18** with Hooks and Context API  
- 🎨 **Tailwind CSS** for responsive and modern design  
- 🔌 **Socket.IO Client** for real-time updates  
- 🧠 **Custom Hooks** for state and session management  

### Backend
- 🟩 **Node.js + Express.js**  
- 🧾 **TypeScript** for type safety and maintainability  
- 🌐 **Socket.IO** for WebSocket communication  
- 💾 **In-memory Storage** for fast real-time state  

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v16 or higher**
- npm or yarn

### Installation

#### Backend (Port 8000)
```bash
cd backend
npm install
npm run dev

Frontend (Port 3000)
cd frontend
npm install
npm start

Access the App

Frontend: http://localhost:3000

Backend: https://multiplayer-backend-jzxk.onrender.com

🤖 AI Tools Usage Declaration
AI Tool Used

I used DeepSeek as a consultation and documentation aid, specifically for:

Project structure planning

Optimization suggestions

Real-time communication troubleshooting

README formatting and documentation generation

UI/UX enhancement ideas

👨‍💻 My Original Work

Architecture planning and code best practices

All application logic, code implementation, debugging, and testing were written by me

AI tools were used only as a reference, similar to consulting Stack Overflow or official docs

Final architecture, code decisions, and implementations are entirely my own