import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import "./FileContextMenu.css";
import RenamingModal from "./RenamingModal";

const FolderContextMenu = ({ x, y, path }) => {
  const { setIsOpen } = useFileContextMenuStore();
  const { editorSocket } = useEditorSocketStore();
  const { renaming, setRenaming, createFileOrFolder, setCreateFileOrFolder, setToBeCreate } =
    useFileContextMenuStore();

  const handleDeleteFolder = () => {
    editorSocket.emit("deleteFolder", {
      pathToFileOrFolder: path,
    });
    setIsOpen(false);
  };

  const handleRenameFile = (path, editorSocket) => {
    setRenaming(true);
  };


  return (
    <>
      {renaming ? (
        <RenamingModal x={x} y={y} path={path} creating={createFileOrFolder} />
      ) : (
        <div
          className="fileContectOptionsWrapper"
          style={{
            top: y,
            left: "160px",
            zIndex: 1,
            padding: "1px 0px",
            border: "1px solid #ababab",
            borderRadius: "1px",
          }}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button className="fileContectButton" onClick={handleDeleteFolder}>
            Delete Folder
          </button>
          <button
            className="fileContectButton"
            onClick={() => handleRenameFile(path, editorSocket)}
          >
            Rename Folder
          </button>
          <button
            className="fileContectButton"
            onClick={() => {
                setCreateFileOrFolder(true);
                 setRenaming(true);
                setToBeCreate("folder")
            }}
          >
            Create Folder
          </button>
          <button
            className="fileContectButton"
            onClick={() => {
                setCreateFileOrFolder(true);
                 setRenaming(true);
                 setToBeCreate("file");
            }}
          >
            Create File
          </button>
          <button
            className="fileContectButton"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
};

export default FolderContextMenu;
