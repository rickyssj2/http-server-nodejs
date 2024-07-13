const net = require("net");

const server = net.createServer((socket) => {
    socket.write("HTTP/1.1 200 OK\r\n\r\n");
    socket.on("data", (data)=>{
        const req = data.toString()
        if (req.startsWith('GET / ')) {
            socket.write("HTTP/1.1 200 OK\r\n\r\n")
        } else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
        }
        socket.end();
    });
    socket.on("close", () => {
        socket.end();
    });
});

server.listen(4221, "localhost");
