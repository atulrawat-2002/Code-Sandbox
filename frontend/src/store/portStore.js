import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const usePortStore = create(
  devtools((set) => {
    return {
      port: null,
      terminalConnection: null,
      setPort: (port) => {
        set({
          port: port,
        });
      },
      setTerminalConnection: (socket) => {
        set({
          terminalConnection: socket,
        });
      },
    };
  }),
);
