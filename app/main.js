const net = require("net");
const fs = require('node:fs');

const server = net.createServer((socket) => {
    socket.on("data", (data)=>{
        const req = data.toString()
        const [startLine, ..._headersAndBody] = req.split('\r\n');
        const [_method, path, _version] = startLine.split(' ');
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
        }  else if (startLine.split('/')[1].split(' ')[0] == 'files') {
            loc = startLine.split('/')[1].split(' ')[1] || ''
            let value;            
            try {
                const data = fs.readFileSync(loc, 'utf8');
                value = data;
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${value.length}\r\n\r\n${value}`)
            } catch (err) {
                console.log('File not found!')
                socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`);
            }          
        }
        else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
        }
        socket.end();
    });
    socket.on("close", () => {
        socket.end();
    });
});

server.listen(4221, "localhost");
