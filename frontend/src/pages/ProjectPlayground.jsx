import { useParams } from "react-router-dom";
import EditorComponents from "../components/molecules/EditorComponent/EditorComponents";
import TreeStructure from "../components/organisms/TreeStructure/TreeStructure.jsx";
import { useEffect, useState } from "react";
import { useTreeStructureStore } from "../store/treeStructureStore.js";
import { io } from "socket.io-client";
import { useEditorSocketStore } from "../store/editorSocketStore.js";
import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal.jsx";
import Browser from "../components/organisms/Browser/Browser.jsx";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import "./ProjectPlayground.css";

const ProjectPlayground = () => {
  const { projectId: projectIdFromUrl } = useParams();
  const { setProjectId, projectId } = useTreeStructureStore();
  const { setEditorSocket } = useEditorSocketStore();
  const [showTreeStructure, setShowTreeStructure] = useState(true);
  const [treeWidth, setTreeWidth] = useState("18%");

  function toggleFileMenu() {
    setShowTreeStructure((prev) => (prev = !prev));
    setTreeWidth((prev) => (prev == "18%" ? "4%" : "18%"));
  }

  useEffect(() => {
    const editorSocketConnection = io(
      `${import.meta.env.VITE_BACKEND_URL}/editor`,
      {
        query: {
          projectId: projectIdFromUrl,
        },
      },
    );
    setEditorSocket(editorSocketConnection);
    setProjectId(projectIdFromUrl);
  }, [projectIdFromUrl]);

  return (
    <>
      <div
        style={{
          display: "flex",
          backgroundColor: "white",
        }}
      >
        {projectId && (
          <div
            className="treeStructure-container"
            style={{
              width: treeWidth,
            }}
          >
            {showTreeStructure && (
              <>
                <div className="filemenu-button">
                  <GoSidebarExpand
                    color="white"
                    size="18px"
                    onClick={toggleFileMenu}
                  />
                </div>
                <TreeStructure />
              </>
            )}

            {!showTreeStructure && (
              <div className="filemenu-button">
                <GoSidebarCollapse
                  color="white"
                  size="22px"
                  onClick={toggleFileMenu}
                />
              </div>
            )}
          </div>
        )}
        <div
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <Allotment>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                backgroundColor: "#282a36",
              }}
            >
              <Allotment vertical={true}>
                <EditorComponents />

                <BrowserTerminal />
              </Allotment>
            </div>
            {<Browser />}
          </Allotment>
        </div>
      </div>
    </>
  );
};

export default ProjectPlayground;
