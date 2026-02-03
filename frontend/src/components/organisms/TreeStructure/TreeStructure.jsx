import { useEffect } from "react";
import { useTreeStructureStore } from "../../../store/treeStructureStore.js";
import TreeNode from "../../molecules/TreeNode/TreeNode.jsx";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore.js";
import FileContextMenu from "../../molecules/contextMenu/FileContextMenu.jsx";
import FolderContextMenu from "../../molecules/contextMenu/FolderContextMenu.jsx";

const TreeStructure = () => {

    const {treeStructure, setTreeStructure} = useTreeStructureStore();
    const {
      x: fileContextX,
      y: fileContextY,
      isOpen: isFileContextOpen,  
      file,
      folder,
    } = useFileContextMenuStore();

    useEffect(() => {
        
        setTreeStructure(true)

    }, [])

  return (
    <div
      style={{
      }}
    >  
      {
        file && isFileContextOpen && fileContextX && fileContextY &&  (
          <FileContextMenu 
            x = {fileContextX}
            y = {fileContextY}
            path = {file}
          />
        )
      } {
        folder && isFileContextOpen && fileContextX && fileContextY && (
          <FolderContextMenu 
          x = {fileContextY}
          y = {fileContextY}
          path = {folder}
          />
        )
      }
        <TreeNode fileFolderData={treeStructure} />
    </div>
  )
}

export default TreeStructure