import { useMutation } from "@tanstack/react-query";
import { createProjectApi } from "../../../apis/project.js";

export const useCreateProject = () => {
  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    mutationFn: createProjectApi,
    onSuccess: (data) => {},
    onErrorL: () => {
      console.log("Error creating project");
    },
  });

  return {
    createProjectMutation: mutateAsync,
    isPending,
    isSuccess,
    error,
  };
};
