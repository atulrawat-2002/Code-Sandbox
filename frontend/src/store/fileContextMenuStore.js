import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useFileContextMenuStore = create(
  devtools((set) => ({
    x: null,
    y: null,
    isOpen: false,
    file: null,
    renaming: false,
    folder: null,
    createFileOrFolder: false,
    toBeCreate: null,
    setX: (incomingX) => {
      set({
        x: incomingX,
      });
    },
    setY: (incomingY) => {
      set({
        y: incomingY,
      });
    },
    setIsOpen: (incomingIsOpen) => {
      set({
        isOpen: incomingIsOpen,
      });
    },
    setFile: (incomingFile) => {
      set({
        file: incomingFile,
      });
    },
    setFolder: (incomingFolder) => {
      set({
        folder: incomingFolder,
      });
    },
    setRenaming: (value) => {
      set((state) => ({
        renaming: value,
      }));
    },
    setCreateFileOrFolder: (value) => {
      set((state) => ({
        createFileOrFolder: value,
      }));
    },
    setToBeCreate: (value) => {
      set({
        toBeCreate: value,
      });
    },
  })),
);
