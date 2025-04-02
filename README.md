Local Setup Guide
Overview

This project consists of three parts:

    Frontend: React app in devekCodeTest/Front-end/devek/build

    Backend: FastAPI app in devekCodeTest/Back-end/AuthHistoryProject

    WebSocket Server: Node.js server in devekCodeTest/Back-end/WebSocketsServer

Prerequisites

    Node.js: Install from here

    Python 3: Install from here

    npm and pip should be available after installing Node.js and Python.

Running Locally
1. Frontend (React)

    Navigate to devekCodeTest/Front-end/devek/build

    Run the app using a static file server (e.g., serve):

    npx serve .

2. Backend (FastAPI)

    Navigate to devekCodeTest/Back-end/AuthHistoryProject

    Install dependencies:

pip install -r requirements.txt

Run the FastAPI app:

    uvicorn main:app --reload

3. WebSocket Server (Node.js)

    Navigate to devekCodeTest/Back-end/WebSocketsServer

    Install dependencies:

npm install

Run the WebSocket server:

node app.js
