import './EditorButton.css'
import { useActiveFileTabStore } from '../../../store/activeFileTabStore.js'
import FileIcon from '../FileIcon/FileIcon.jsx';
import { RxCross2 } from 'react-icons/rx';
import { useEditorSocketStore } from '../../../store/editorSocketStore.js';
import { useEffect } from 'react';

const EditorButton = ({data}) => {    

    const { editorSocket } = useEditorSocketStore()
    const { allFileTabs, deleteTab } = useActiveFileTabStore();

    function handleClick() {
        const response = editorSocket.emit("readFile", {
      pathToFileOrFolder: data?.key,
    });
    }

    function removeFileTab() {
        
        deleteTab(data?.key);
    }

  return (
    <>
    {data &&   <div>
        <button className='editor-button' 
    style={{
        color: data?.prev?.key === null ? 'white' : '#959eba' ,
        backgroundColor: data?.prev?.key === null ? 'rgb(35 38 45)' : '#4a4859' ,
        borderTop: data?.prev?.key === null ? '2px solid rgb(10, 43, 192) ' : '2px solid rgb(49, 48, 48) ' 
    }}
    >
        <div onClick={() => handleClick()} ><FileIcon extension={data?.key?.split('.').pop()} /></div>
        <div onClick={() => handleClick()} >{`${data?.key?.split('\\').pop()}`}</div>
        <div  ><RxCross2 onClick={() => removeFileTab()} /></div>
         
        </button>
    </div> }
    </>
)
}

export default EditorButton;