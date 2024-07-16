const net = require("net");

const server = net.createServer((socket) => {
    socket.on("data", (data)=>{
        const req = data.toString()
        if (req.startsWith('GET / ')) {
            socket.write("HTTP/1.1 200 OK\r\n\r\n")
        } else if (req.split('/')[1] == 'echo') {
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${req.split('/')[2].split(' ')[0].length}\r\n\r\n${req.split('/')[2].split(' ')[0]}`)
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
