import { Editor } from "@monaco-editor/react";
import { dracula } from "../../../../dracula";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useActiveFileTabStore } from "../../../store/activeFileTabStore";
import { extensionToFileType } from "../../../utils/extensionToFileType";
import EditorButton from "../../atoms/EditorButton/EditorButton";
import { useEffect } from "react";

const EditorComponents = () => {
  let timerId = null;
  const { editorSocket } = useEditorSocketStore();
  const { allFileTabs } = useActiveFileTabStore();
  

  const handleEditorTheme = (editor, monaco) => {
    monaco.editor.defineTheme("dracula", dracula);
    monaco.editor.setTheme("dracula");
  };

  function handleChange(value, e) {
    if (timerId != null) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      const editorcontent = value;
      editorSocket.emit("writeFile", {
        data: editorcontent,
        pathToFileOrFolder: allFileTabs?.head?.next?.key,
      });
    }, 1500);
  }

  useEffect(() => {
    
      }, [allFileTabs?.map]);

  return (
    <>
      
      {
        <div className="editor-buttons-container" >
          {
            Array.from(allFileTabs?.map?.values()).map((data) => {
          return <EditorButton key={Math.random()} data={data} />
        })
          }
        </div>
      }

      <Editor
        width="100%"
        language={
          allFileTabs?.head?.next?.key
            ? extensionToFileType(
                allFileTabs?.head?.next?.key?.split(".").pop()
              )
            : "js"
        }
        value={
          allFileTabs?.head?.next?.data
            ? allFileTabs?.head?.next?.data
            : "// Code here"
        }
        options={{
          fontSize: 13,
          fontFamily: "monospace",
        }}
        onMount={handleEditorTheme}
        onChange={handleChange}
      />
      
    </>
  );
};

export default EditorComponents;
