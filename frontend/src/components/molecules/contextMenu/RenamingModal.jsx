import { useEffect, useState } from "react";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { FaCheck } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import "./RenamingModal.css";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useTreeStructureStore } from "../../../store/treeStructureStore";

const RenamingModal = ({ x, y, path, creating }) => {
  
  const {editorSocket} = useEditorSocketStore();
  const { setIsOpen, setRenaming, createFileOrFolder, setCreateFileOrFolder, toBeCreate } = useFileContextMenuStore();
  const {setTreeStructure} = useTreeStructureStore();
  const [name, setName] = useState(path?.split("\\")?.pop());
  const [fileOrFolderName, setFileOrFolderName] = useState("");
  let count = 0;



  function nameChanging(e) {
    setName((prev) => (prev = e.target.value));   
  }

  function fileOrFolderNameChanging(e) {
    setFileOrFolderName((prev) => prev = e.target.value)
  }

  function handleCreateFileOrFolder() {
    if(fileOrFolderName.trim() === "") {
      return;
    }

    if(toBeCreate == 'file') {

      editorSocket.emit("createFile", {
        pathToFileOrFolder: path,
        fileName: fileOrFolderName,
      })

    } else if (toBeCreate === 'folder') {
      
      editorSocket.emit("createFolder", {
        pathToFileOrFolder: path,
        folderName: fileOrFolderName,
      })

    }

    setRenaming(false);
    setCreateFileOrFolder(false);
    setIsOpen(false);

  }

  function doneRenaming() {
      let oldPath = path;
      let newPath = oldPath?.split('\\');
      newPath.pop();
      newPath.push(name)
      newPath = newPath.join("\\");
    
    editorSocket.emit("renameFile", {
      oldPath,
      newPath
    });

    editorSocket.on("fileRenameSuccess", (data) => {
        setTreeStructure();
    })
    setRenaming(false);
    setIsOpen(false);
  }

  function cancelRenaming() {
    setRenaming(false);
    setCreateFileOrFolder(false);
    setIsOpen(false);
  }

  
  if (creating) {
    return <>
      <div
      className="fileContectOptionsWrapper"
      style={{
        position: "fixed",
        top: y,
        left: '150px',
        zIndex: 2,
      }}
    >
      <input
      
        style={{
          width: "150px",
          padding: "1px 3px",
        }}
        placeholder="Enter name"
        value={fileOrFolderName}
        autoFocus={true}
        type="text"
        onChange={(e) => fileOrFolderNameChanging(e)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <button
          title="Create File"
          style={{
            color: "cyan",
            marginRight: "1px",
          }}
          className="action-button"

          onClick={handleCreateFileOrFolder}
        >
          <FaCheck />
        </button>
        <button
          title="cancel"
          style={{
            color: "red",
            marginLeft: "1px",
          }}
          className="action-button"
          onClick={() => cancelRenaming()}
        >
          <ImCancelCircle />
        </button>
      </div>
    </div>
    </>
  }

  return (
    <div
      className="fileContectOptionsWrapper"
      style={{
        position: "fixed",
        top: y,
        left: '150px',
        zIndex: 2,
      }}
    >
      <input
        style={{
          width: "150px",
          padding: "1px 3px",
        }}
        autoFocus={true}
        value={name}
        type="text"
        onChange={(e) => nameChanging(e)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <button
          title="Rename File"
          style={{
            color: "cyan",
            marginRight: "1px",
          }}
          className="action-button"
          onClick={() => doneRenaming()}
        >
          <FaCheck />
        </button>
        <button
          title="cancel"
          style={{
            color: "red",
            marginLeft: "1px",
          }}
          className="action-button"
          onClick={() => cancelRenaming()}
        >
          <ImCancelCircle />
        </button>
      </div>
    </div>
  );
};

export default RenamingModal;
