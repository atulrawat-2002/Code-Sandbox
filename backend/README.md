# Sandbox Backend

This is the backend service for the Sandbox Clone project.  
It is responsible for creating and managing isolated user projects, Docker containers, and handling real-time communication with the frontend.


## What this backend does

- Creates a project with unique id for each user
- Starts a Docker container per project
- Mounts the project folder into the container
- Runs a Vite dev server inside the container
- Maps container port `5173` to a random host port
- Sends the mapped port back to the frontend
- Manages container lifecycle (create, stop, remove)
- Handles file operations like read, delete, and rename
- Provides terminal access using PTY and WebSockets


## Tech stack

- Node.js
- Express
- Docker & Dockerode
- Socket.IO / WebSocket
- node-pty
- Chokidar
- fs/promises

---

## How it works (high level)

1. Frontend requests a new project
2. Backend creates a project folder
3. A Docker container is created and started
4. The project folder is mounted into the container
5. Vite runs inside the container
6. Port `5173` is mapped to a random host port
7. Frontend connects to that port
8. File and terminal actions are handled via sockets

---

## Notes

- Each project runs in its own container
- Containers are removed when no longer needed
- PTY sessions are tied to container lifecycle

This backend is not focused on authentication or persistence.  
Its main goal is orchestration and isolation.
