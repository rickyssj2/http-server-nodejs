const net = require("net");
const fs = require('node:fs');
const path = require('path')

const server = net.createServer((socket) => {
    socket.on("data", (data)=>{        
        const req = data.toString()
        const [startLine, ..._headersAndBody] = req.split('\r\n');
        const [_method, resourcePath, _version] = startLine.split(' ');
        const flags = process.argv.slice(2);
        const directory = flags.find((_, index) => flags[index - 1] == "--directory");  

        if (startLine.startsWith('GET / ')) {
            socket.write("HTTP/1.1 200 OK\r\n\r\n")
        } else if (startLine.split('/')[1] == 'echo') {
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${req.split('/')[2].split(' ')[0].length}\r\n\r\n${req.split('/')[2].split(' ')[0]}`)
        } else if (startLine.split('/')[1].split(' ')[0] == 'user-agent') {
            _headersAndBody.forEach(line => {
                if(line.startsWith('User-Agent:')){
                    let value = line.split(': ')[1];
                    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${value.length}\r\n\r\n${value}`)
                }
            });
        }  else if(startLine.startsWith("/files/")){
            const filePath = startLine.slice(7);
            if(!fs.existsSync(directory + filePath)){
                socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
                socket.end();
                return;
            }
            const file = fs.readFileSync(directory + filePath);
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${file.length}\r\n\r\n${file}`);
        }
        else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
        }
        socket.end();
    });
    socket.on('error',()=>{
        console.log("Socket Error!!")
    })
    socket.on("close", () => {
        socket.end();
    });
});

server.listen(4221, "localhost");
