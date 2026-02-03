export const handleTerminalCreation = (ws, container) => {

    container.exec({
        Cmd: ['/bin/bash'],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        User: 'sandbox',
    }, (err, exec) => {
        if (err) {
            console.log("Error while creating the exec ", err)
            return;
        }
        exec.start({
            hijack: true,
        }, (err, stream) => {
            if (err) {
                console.log("Error while staritng the exec ", err)
                return;
            }

            //Step: 1 Stream Processing
            
            //step: 2 Stream Writing
            processStreamOutput(stream, ws);
            ws.on("message", (data) => {
                stream.write(data)
            })

        })
    })

};



function processStreamOutput(stream, ws) {
    let nextDataType = null;   // Store the type of the next message
    let nextDataLength = null;  // Store the length of the next message
    let buffer = Buffer.from("");

    function processStreamData(data) {
        //helper functin to process the incoming data chunk

        if (data) {
            buffer = Buffer.concat([buffer, data])  // concatenate the incoming data to the buffer
        }

        if (!nextDataType) {
            // if the data type is not known then we need to read the next 8 bytes of the data to detemine the type and the length of the message

            if (buffer.length >= 8) {
                const header = bufferSlicer(8)

                nextDataType = header.readUInt32BE(0) // the first 4 bytes represents the type of the data
                nextDataLength = header.readUInt32BE(4)  // the next 4 bytes represents the length of the data

                processStreamData()
            }

        } else {
            if (buffer.length >= nextDataLength) {
                const content = bufferSlicer(nextDataLength); // slice the buffer and get the content: 
                ws.send(content);
                nextDataLength = null
                nextDataType = null
                processStreamData()
            }
        }

    }

    function bufferSlicer(end) {
        // helper function to slice the buffer and return it
        const output = buffer.slice(0, end) // header of the chunk
        buffer = Buffer.from(buffer.slice(end, buffer.length)); // remaining part

        return output
    }

    stream.on("data", processStreamData)

}