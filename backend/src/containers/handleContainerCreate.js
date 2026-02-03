import path from "path";
import fs, { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { createNewContainer, getContainerPort, removeContainer } from "./container_utilities.js";


const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
__dirname = path.join(__dirname, "../../");

export const handleContainerCreate = async (
  projectId,
  terminalSocket,
  req,
  tcpSocket,
  head
) => {

  try {
    terminalSocket.handleUpgrade(
      req,
      tcpSocket,
      head,
      async (establishedWSCnn) => {

        //  Remove the existing container before creating a new container

        removeContainer(projectId);

        const container = await createNewContainer(projectId);

        await container.start();
        await container.exec({
          Cmd: [
            "bash",
            "-lc",    
          ],
          AttachStdout: true,
          AttachStderr: true,
        });

        const hostPort = await getContainerPort(projectId)



        const evnPath = path.join(
          __dirname,
          `projects/${projectId}/sandbox`,
          ".env.local"
        );
        const envContent = `VITE_HMR_PORT=${hostPort}`;
        await writeFile(evnPath, envContent);

        terminalSocket.emit(
          "connection",
          establishedWSCnn,
          req,
          container,
          hostPort
        );
      }
    );

  } catch (error) {
    console.log("Error creating container", error);
  }
};



