const net = require("net");

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
                    value = line.split(': ')[1];
                    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${value.length}\r\n\r\n${value}`)
                }
            });
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
