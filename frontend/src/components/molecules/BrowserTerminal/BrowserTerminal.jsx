import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import '@xterm/xterm/css/xterm.css'
import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { AttachAddon } from "@xterm/addon-attach"
import "./BrowserTerminal.css"
import { usePortStore } from "../../../store/portStore"

export const BrowserTerminal = () => {

    const terminalRef = useRef(null)
    const socket = useRef(null)
    const { setTerminalConnection } = usePortStore();
    const  { projectId: projectIdFromUrl }  = useParams();

    useEffect(() => {        

        const term = new Terminal({
            
            cursorBlink: true,
            theme: {
                background: "#1c2027",
                foreground: "#f8f8f3",
                cursorAccent: "#f8f8f3",
                blue: '#000270',
            },
            fontSize: 16,
            fontFamily: "Cascadia Code",
            convertEol: true,
            
        })
                
        term.open(terminalRef.current);
        // let fitAddon = new FitAddon()
        // term.loadAddon(fitAddon);
        // fitAddon.fit()
        


        const ws = new WebSocket("ws://localhost:3000/terminal?projectId="+projectIdFromUrl);
        
        ws.onopen = (s) => {
            const attachAddon = new AttachAddon(ws);
            term.loadAddon(attachAddon);
            socket.current = ws;
            setTerminalConnection(ws)
                        
            }

         
        return () => {
            term.dispose()
            if (socket?.current) socket?.current.close();
        }

    }, [])

    
    return (
        <>

        <div
        id='browser-terminal'
        ref={terminalRef}
            
            className="terminal"
        >

        </div>
        </>

    )
}