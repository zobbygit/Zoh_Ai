🚀 Zoh Ai — Real-Time AI SaaS Platform

Zoh Ai is a modern SaaS application that delivers real-time AI-powered tools for creators, developers, students and businesses.
It provides a seamless experience to generate content, images, titles, remove backgrounds/objects, review resumes, and share creations with the community — all in one place.

Built with a powerful full-stack setup using React + Vite, Tailwind, Clerk Auth, Neon Postgres, Express, and AI APIs like Clipdrop & Cloudinary.


✨ Features
📝 AI Content Tools

Write Article — Generate high-quality blog articles instantly.

Blog Titles — Create SEO-friendly, engaging blog/video titles.

🎨 AI Image Tools

Generate Images — Create stunning AI-generated images in multiple styles.

Remove Background — Automatic background removal using AI.

Remove Object — AI-powered object removal from images.

Community Gallery — Share and discover user-generated creations.

📄 Professional Tools

Review Resume — Analyze resume content and receive constructive AI feedback.

🛠️ Tech Stack
🔹 Frontend

React + Vite — Fast, modern development setup

Tailwind CSS — Beautiful, responsive UI design

Lucide-React — Icon system

React Router DOM — SPA navigation

Clerk Authentication — User auth, sessions, user profile

Prebuilt Clerk UI + Tailwind — Ready-to-use auth components

🔹 Backend

Node.js + Express — API server

Neon Postgres — Serverless, scalable database

SQL Queries — Storing prompts, results, and user data

🔹 Third-Party AI Services

Clipdrop API — AI background & object removal

Cloudinary — Image & video hosting/processing    


📂 Project Structure
Zoh_Ai/
│── client/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── assets/
│   │   └── app.jsx/
│── server/               # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── configs/
│   └── middlewares/
│── database/             # Neon postgres setup
│── README.md
└── package.json

🔐 Authentication (Clerk)

Email, Google, and OAuth login

Role-based access (free vs premium)

Billing (Clerk)

Secure routes for premium features

🧠 AI & Media Processing

Clipdrop API for background + object removal

Cloudinary for image hosting & transformations

AI models for generating text, articles, and summaries

Resume PDF parsing using server tools

📸 Screens & Features

Dashboard with quick access

Article Generator

Title Generator

Image Generator

Background Remover

Object Remover

Resume Reviewer

Community Gallery


🧾 License
This project is licensed under the MIT License.

⭐ Support
If you like this project, please ⭐ the repo — it helps a lot!
OpenAI / Gemini (Your AI Models) — Content & article generation

Clerk Billing — Stripe-powered subscription system 
