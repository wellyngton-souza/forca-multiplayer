const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 4000;

const server = app.listen(port, () => console.log("server está rodando na porta " + port ));

let socketConected = new Set();
let players = new Set();
let vezJogadas = 1;
let vencedorPlayer = 0;

let playerChegada = 0;

const io = require("socket.io")(server, {
    cors: {
        origin: port, // Substitua pelo URL do seu cliente
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) =>{
    if(socketConected.size < 1){
        playerChegada = 1;
    } else playerChegada++;

    socketConected.add(socket.id);

    io.emit("clients-total", socketConected.size); // encapsula o valor e envia
    socket.emit("players", playerChegada);
    console.log(socketConected);

    socket.on("disconnect", () => {
        console.log("socket disconnected", socket.id);
        socketConected.delete(socket.id);
        io.emit("clients-total", socketConected.size);
    });
    
    socket.on("palavra-escrita", (data) =>{
        socket.broadcast.emit("palavra-escrita", data);
        vezJogadas++;
        socket.broadcast.emit("vezPlayer", (vezJogadas % socketConected.size) + 1);
    });

    socket.on("vencedorPlayer", (data) =>{
        socket.broadcast.emit("vencedorPlayer", data);
    })
});