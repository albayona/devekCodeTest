# Chat Application

This is a real-time chat application hosted on an AWS S3 bucket for front-end deployment, with a FastAPI backend and a WebSocket server handling communication.

## Live Application

You can access the chat app here: [Chat App](http://andresbayonadebek.s3-website.us-east-2.amazonaws.com/)

## Features

- **User Authentication**: Sign up and log in securely using your email and password.
- **Group Chat**: Join existing groups and communicate in real-time.
- **WebSocket Integration**: Instant message updates with a Node.js WebSocket server.
- **AWS Hosting**: The front-end is deployed using AWS S3 for static hosting.

## How to Use

1. **Sign Up**
   - Navigate to `/signup`
   - Enter your name, email, and password to create an account.

2. **Log In**
   - Go to `/login`
   - Use your registered email and password to access the chat platform.

3. **Join a Group**
   - Browse the available chat groups.
   - Select a group to join the conversation.

4. **Start Chatting**
   - Send and receive messages in real-time with other users in the group.

## Technology Stack

- **Front-end**: React (deployed on AWS S3)
- **Back-end**: FastAPI (handles authentication and data management, deployed on Google Cloud)
- **WebSocket Server**: Node.js with Socket.IO (manages real-time messaging)
- **Database**: SQLAlchemy with a local SQLite database
- **Authentication**: JWT-based authentication for secure login

## Deployment Details

- The front-end is built in `devekCodeTest/Front-end/devek/build` and deployed to AWS S3.
- The FastAPI backend is located in `devekCodeTest/Back-end/AuthHistoryProject` and deployed on Google Cloud.
- The WebSocket server is in `devekCodeTest/Back-end/WebSocketsServer`, runs with `app.js` as the entry point, and is implemented using Socket.IO.

## Future Enhancements

- Private messaging
- User profile customization
- Notifications for new messages
- Improved UI/UX design

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit pull requests.

## Contact

For any issues or support, please reach out to the project owner.




# Local Setup Guide

## Overview

This project consists of three parts:

- **Frontend**: React app located in `devekCodeTest/Front-end/devek/build`
- **Backend**: FastAPI app located in `devekCodeTest/Back-end/AuthHistoryProject`
- **WebSocket Server**: Node.js server located in `devekCodeTest/Back-end/WebSocketsServer`

## Prerequisites

Before setting up the project locally, ensure you have the following installed:

- **Node.js**: [Download and install](https://nodejs.org/)
- **Python 3**: [Download and install](https://www.python.org/downloads/)
- `npm` and `pip` should be available after installing Node.js and Python.

## Running Locally

### 1. Frontend (React)

1. Navigate to the frontend directory:
   ```sh
   cd devekCodeTest/Front-end/devek/build
   ```
2. Run the app using a static file server (e.g., `serve`):
   ```sh
   npx serve .
   ```

### 2. Backend (FastAPI)

1. Navigate to the backend directory:
   ```sh
   cd devekCodeTest/Back-end/AuthHistoryProject
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run the FastAPI app:
   ```sh
   uvicorn main:app --reload
   ```

### 3. WebSocket Server (Node.js)

1. Navigate to the WebSocket server directory:
   ```sh
   cd devekCodeTest/Back-end/WebSocketsServer
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the WebSocket server:
   ```sh
   node app.js
   ```

Your local development environment should now be set up and running!

