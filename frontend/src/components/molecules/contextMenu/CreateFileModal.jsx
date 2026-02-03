import { useEffect, useState } from "react";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { FaCheck } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import "./RenamingModal.css";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useTreeStructureStore } from "../../../store/treeStructureStore";

const RenamingModal = ({ x, y, path }) => {
  const renamingSetter = useFileContextMenuStore.getState().setRenaming;
  const {editorSocket} = useEditorSocketStore();
  const { setIsOpen } = useFileContextMenuStore();
  const {setTreeStructure} = useTreeStructureStore();
  let count = 0;

  function nameChanging(e) {
    setName((prev) => (prev = e.target.value));   
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
        placeholder="Enter file name"
        autoFocus={true}
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
