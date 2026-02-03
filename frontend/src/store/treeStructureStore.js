import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { QueryClient } from "@tanstack/react-query";
import { getProjectTree } from "../apis/project";

export const useTreeStructureStore = create(
  devtools((set, get) => {
    const queryClient = new QueryClient();

    return {
      projectId: null,
      treeStructure: null,
      setTreeStructure: async () => {
        const id = get().projectId;
        const data = await queryClient.fetchQuery({
          queryKey: [`project-${id}`],
          queryFn: () => getProjectTree(id),
        });

        set({
          treeStructure: data,
        });
      },
      setProjectId: (projectId) => {
        set({
          projectId: projectId,
        });
      },
    };
  }),
);
