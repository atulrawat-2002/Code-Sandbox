import Docker from 'dockerode';
import { sequence } from '../index.js';


const docker = new Docker();


// ********************** Method to get the assigned port to the container
export async function getContainerPort(containerName) {
    const containers = await docker.listContainers({ name: containerName });
    
    if (containers.length > 0) {
        const currentContainer =
        (await docker.getContainer(containers[0].Id)) || undefined;
        const containerInfo = await currentContainer.inspect();
        
        return containerInfo?.NetworkSettings?.Ports["5173/tcp"][0].HostPort;
    }
}


// **********************  Method to Create a new Container *****************
export async function createNewContainer(projectId) {
  const container = await docker.createContainer({
    Image: "sandbox",
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Cmd: ["bash", "-l"],
    Tty: true,
    User: "sandbox",
    ExposedPorts: {
      "5173/tcp": {},
    },
    ENV: ["HOST=0.0.0.0"],
    HostConfig: {
      Binds: [`${process.cwd()}/projects/${projectId}:/home/sandbox/app`],
      PortBindings: {
        "5173/tcp": [
          {
            HostPort: "0",
          },
        ],
      },
    },
  });

  return container;
}



// ********************* Method to remove the existing container for the same project ***************

export const removeContainer = async (projectId) => {
        try {
          const existingContainers = await docker.listContainers({name: projectId});

        if(existingContainers.length > 0) {
          const container = docker.getContainer(existingContainers[0].Id);
          await container.remove({force: true});
          
        }
        } catch (error) {
          console.log("Error removing the container container utility file", error)
        }
}