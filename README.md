<h1 align="center">📸 Everstory – Memory Sharing Platform</h1>

<p align="center">
  A scalable, fullstack, Instagram-like project built for the <strong>DataGenie Fullstack Hackathon 2025</strong>.
</p>

---

## 🧱 <u>Project Architecture</u>

### 🔧 Microservices (FastAPI + MongoDB)
- <strong>Auth Service</strong>: User signup, login, and JWT-based authentication.
- <strong>Image Service</strong>: Image upload, visibility, and metadata handling.
- <strong>Friendship Service</strong>: Follow, request, and manage user connections.

### 🌐 Frontend (React + TypeScript)
- Built with React, Zustand, and TailwindCSS.
- Clean UI for feed, upload, and friend management.

---

## 🧰 <u>Tech Stack</u>

<table>
  <tr><th>Area</th><th>Tech Used</th></tr>
  <tr><td>Frontend</td><td>React, TypeScript, TailwindCSS, Zustand</td></tr>
  <tr><td>Backend</td><td>FastAPI, MongoDB Atlas</td></tr>
  <tr><td>Storage</td><td>AWS S3 (image files)</td></tr>
  <tr><td>Auth</td><td>JWT, bcrypt</td></tr>
  <tr><td>Testing</td><td>Postman</td></tr>
  <tr><td>Deployment</td><td>Docker, Docker Compose</td></tr>
  <tr><td>Bonus</td><td>Partially implemented Kubernetes</td></tr>
</table>

---

## ☁️ <u>Why MongoDB Atlas + AWS S3?</u>

- <strong>MongoDB Atlas</strong>: Flexible schema, cloud-native, scalable.
- <strong>AWS S3</strong>: Optimized for storing large media files with high availability and fast delivery.

---

## 🔐 <u>Authentication</u>

- JWT token-based auth across services
- Passwords hashed with bcrypt
- Role-based access for secure endpoints

---

## 📦 <u>Dockerization</u>

- All services are containerized using Docker
- Managed with Docker Compose
- Kubernetes implementation initiated but not completed due to time constraints

---

## 🧪 <u>API Testing</u>

- All routes tested using <strong>Postman</strong>
- RESTful API design with proper validations and error handling

---

## 📁 <u>Folder Structure</u>

<pre>
everstory/
│
├── auth-service/             # FastAPI Auth Service
├── image-service/            # S3 integration + metadata
├── friendship-service/       # Follows & requests
├── frontend/                 # React + Tailwind
├── docker-compose.yml        # Compose orchestration
└── README.md
</pre>

---

## 📜 <u>Backend Requirements</u>

Each service contains a `requirements.txt`. Common dependencies:

<pre>
fastapi
uvicorn
motor
pydantic
python-jose
passlib
python-multipart
boto3
pillow
</pre>

---

## ✅ <u>Hackathon Checkpoints</u>

- ✅ <strong>Checkpoint 1</strong>: Microservices Setup & Dockerization  
- ✅ <strong>Checkpoint 2</strong>: Auth, Image & Friendship Microservices  
- ⚠️ <strong>Bonus</strong>:  
  - AWS S3 file storage with metadata stored on MongoDB Atlas  
  - Postman testing of all services  
  - Kubernetes implementation initiated but not completed due to limited experience & time

---

## 🙌 <u>Contributing</u>

Pull requests are welcome. For major changes, please open an issue first to discuss.

---

<p align="center">
  Made with ❤️ for DataGenie Hackathon 2025
</p>
