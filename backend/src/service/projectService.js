import { v4 as uuid } from 'uuid'
import fs, { writeFile } from 'fs/promises'
import { REACT_PROJECT_COMMAND } from '../config/serverConfig.js'
import { execPromisify } from '../utils/execUtility.js'
import path from 'path';
import directoryTree from 'directory-tree';
import { fileURLToPath } from 'url';
import { sequence } from '../index.js';


const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
__dirname = path.join(__dirname, '../../')


async function writeViteConfig(projectName) {
    const configPath = path.join(__dirname, `projects/${projectName}/sandbox`, 'vite.config.js');
    try {
        await writeFile(configPath, viteTemplate);
    } catch (error) {
        ("error updating vite config", error)
    }   
}

const viteTemplate = `
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      hmr: {
        clientPort: parseInt(env.VITE_HMR_PORT) || 5173,
      },
      watch: {
        usePolling: true,
      }
    }
  }
})`;



export const createProjectService = async () => {
  
    const projectId = uuid()

   await fs.mkdir(`./projects/${projectId}`)

    const response = await execPromisify(`${REACT_PROJECT_COMMAND}`, {
        cwd: `./projects/${projectId}`
    })

    writeViteConfig(projectId)
   
    return projectId;
}

export const getProjectTreeService = (projectId) => {
    const projectPath = path.resolve(`./projects/${projectId}`);
    const tree = directoryTree(projectPath)
    return tree;
}