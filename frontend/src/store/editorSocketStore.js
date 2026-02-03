import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useActiveFileTabStore } from "./activeFileTabStore";
import { useTreeStructureStore } from "./treeStructureStore";
import { usePortStore } from "./portStore";

export const useEditorSocketStore = create(
  devtools((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {
      const activeFileTabSetter = useActiveFileTabStore.getState().setTab;
      const treeStructureSetter =
        useTreeStructureStore.getState().setTreeStructure;
      const portSetter = usePortStore.getState().setPort;

      incomingSocket?.on("readFileSuccess", (data) => {
        activeFileTabSetter(data);
      });

      incomingSocket?.on("writeFileSuccess", (data) => {
        incomingSocket.emit("readFile", {
          pathToFileOrFolder: data.path,
        });
      });

      incomingSocket?.on("deleteFileSuccess", (data) => {
        treeStructureSetter();
      });

      incomingSocket?.on("deleteFolderSuccess", (data) => {
        treeStructureSetter();
      });

      incomingSocket?.on("createFileSuccess", () => {
        treeStructureSetter();
      });

      incomingSocket?.on("createFolderSuccess", () => {
        treeStructureSetter();
      });

      incomingSocket?.on("getPortSuccess", (port) => {
        portSetter(port);
      });

      incomingSocket.on("error", (data) => {
        console.log("socket error", data);
      });

      set({
        editorSocket: incomingSocket,
      });
    },
  })),
);
