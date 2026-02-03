import fs from "fs/promises";
import { getContainerPort } from "../containers/container_utilities.js";
import { isRenaming } from "../index.js";
import path from "path";

export function handleEditorSocketEvents(socket, editorNameSpace) {
  socket.on("writeFile", async ({ data, pathToFileOrFolder }) => {
    try {
      const response = await fs.writeFile(pathToFileOrFolder, data);
      editorNameSpace.emit("writeFileSuccess", {
        data: "File written successfull",
        path: pathToFileOrFolder,
      });
      
    } catch (error) {
      ("An error occured", error);
      socket.emit("error", {
        data: "Error writing the file",
      });
    }
  });

  socket.on("createFile", async ({ pathToFileOrFolder, fileName }) => {
    const newPath = path.join(pathToFileOrFolder, fileName);

    try {
      const response = await fs.writeFile(newPath, "", { flag: "wx" });
      socket.emit("createFileSuccess", {
        data: "File created successfully",
      });
    } catch (error) {
      if (error.code === "EEXIST") {
        socket.emit("error", {
          data: "File already exists",
        });
        return;
      } else {
        socket.emit("error", {
          data: "Error creating file",
        });
      }
    }
  });

  socket.on("readFile", async ({ pathToFileOrFolder }) => {
    try {
      const response = await fs.readFile(pathToFileOrFolder, {
        encoding: "utf-8",
      });
      socket.emit("readFileSuccess", {
        value: response.toString(),
        path: pathToFileOrFolder,
      });
    } catch (error) {
      socket.emit("error", {
        data: "Error reading file",
      });
    }
  });
  // **************************** Folder Events ********************************************
  socket.on("createFolder", async ({ pathToFileOrFolder, folderName }) => {
    const newPath = path.join(pathToFileOrFolder, folderName);

    try {
        const response = await fs.mkdir(newPath);
        socket.emit("createFolderSuccess", {
        data: "File created successfully",
      });
    } catch (error) {
        if(error.code === 'EEXIST') {
            socket.emit("error", {
                data: "Folder already exists"
            })
            return;
        } 
            socket.emit("error", {
                data: "Error creating folder",
            })
    }
  });

  socket.on("deleteFolder", async ({ pathToFileOrFolder }) => {
    try {
      const response = await fs.rmdir(pathToFileOrFolder);
      socket.emit("deleteFolderSuccess", {
        data: "Folder Deleted",
      });
    } catch (error) {
      ("Error deleting the folder", error);
      socket.emit("error", {
        data: "Error deleting the folder",
      });
    }
  });

  socket.on("deleteFile", async ({ pathToFileOrFolder }) => {
    try {
      const response = await fs.unlink(pathToFileOrFolder);
      socket.emit("deleteFileSuccess", {
        data: "File deleted",
      });
    } catch (error) {
      socket.emit("error", {
        data: "Error deleting the file",
      });
    }
  });

  socket.on("createFolder", async ({ pathToFileOrFolder }) => {
    try {
      const response = await fs.mkdir(pathToFileOrFolder);
      socket.emit("createFolderSuccess", {
        data: "Folder created successfully",
      });
    } catch (error) {
      socket.emit("error", {
        data: "Error creating folder",
      });
    }
  });

  socket.on("deleteFolder", async ({ pathToFileOrFolder }) => {
    try {
      const response = await fs.rmdir(pathToFileOrFolder, { recursive: true });
      socket.emit("deleteFolderSuccess", {
        data: "Folder deleted successfully",
      });
    } catch (error) {
      socket.emit("error", {
        data: "Error deleting tht folder",
      });
    }
  });

  socket.on("getPort", async ({ containerName }) => {
    const port = await getContainerPort(containerName);

    socket.emit("getPortSuccess", { port: port });
  });
}
