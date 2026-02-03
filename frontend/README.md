# Sandbox Frontend

This is the frontend for the Sandbox Clone project.  
It provides the UI for interacting with isolated coding environments running in Docker containers.

---

## What this frontend does

- Allows users to create a new React project
- Displays a file tree for the project
- Supports file operations (open, rename, delete)
- Provides an in-browser code editor
- Provides a terminal inside the browser
- Connects to container services using dynamic ports
- Communicates with backend via WebSockets

## Tech stack

- React
- Vite
- Zustand
- Monaco Editor
- xterm.js
- Socket.IO client

## Notes

- This frontend does not run user code locally
- All project execution happens inside containers
- The frontend only acts as a client and controller

The focus of this frontend is usability and responsiveness rather than visual polish.
