<h1>📸 Everstory – A Memory Sharing Platform</h1>
Everstory is a fullstack, scalable Instagram-like application built for the DataGenie Fullstack Hackathon 2025. It allows users to capture, share, and relive memories in a seamless social experience.

Built with React + TypeScript, FastAPI microservices, and Docker, Everstory showcases a modern microservices architecture with clean UI, performance in mind, and real-time memory sharing.

🚀 Features
🔐 Authentication Service (FastAPI + MongoDB)

📷 Image Upload & Management (FastAPI + local/cloud storage)

👥 Friendship Service (Follow/Unfollow, Recommendations)

🖼️ Frontend in React + TypeScript (Modern responsive UI)

☁️ Containerized using Docker for each microservice

🧪 Built with scalability and production-readiness in mind

🧱 Tech Stack
Layer	Tech
Frontend	React, TypeScript, Tailwind
Backend	FastAPI (Python), MongoDB
Communication	REST APIs
DevOps	Docker, Docker Compose
Database	MongoDB Atlas
🔧 Setup Instructions
bash
Copy
Edit
# 1. Clone the repository
git clone https://github.com/your-username/everstory.git
cd everstory-backend

# 2. Set up environment
cp .env.example .env  # add your MongoDB URI

# 3. Build and run containers
docker-compose up --build
🧠 Architecture Overview
Microservices:

auth-service: Handles registration, login, JWT token auth

image-service: Upload and retrieve user-shared memories

friendship-service: Follows/unfollows, social graph

Shared DB (MongoDB) for simplicity (can be split for scale)

Frontend connects to all services via REST APIs

🤝 Team & Contribution
This project was created as part of the DataGenie Hackathon 2025 by a team of passionate fullstack developers. Contributions welcome!

