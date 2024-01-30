import React, { useState, useEffect } from "react";
import "./App.css";

import { socket } from "./socket";

interface palavraEscrita{
    nome: string
}

const App = () =>{
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [numUsuarios, setNumUsuarios] = useState(0);

    const [minhaVez, setMinhaVez] = useState(numUsuarios);

    const [vezPlayer, setVezPlayer] = useState(1);
    const [palavra, setPalavra] = useState("banana");
    const [palavraEscrita, setPalavraEscrita] = useState<string[]>(Array.from(palavra, () => ""));

    useEffect(()=>{
        socket.on("clients-total", (e: number) => {
            setIsConnected(true);
            setNumUsuarios(e);
        });

        socket.on("players", (e) =>{
            //setMinhaVez(e[0].id);
            console.log(e);
        });

        socket.on("palavra-escrita", (e: palavraEscrita) =>{
            Array.isArray(e.nome) && setPalavraEscrita(e.nome);
        });

        socket.on("vezPlayer", (e: number) =>{
            setVezPlayer(e);
        });

        return () => {
            socket.off("clients-total");
            socket.off("players");
            socket.off("palavra-escrita");
            socket.off("vezPlayer");
        };
    },[]);

    const atualizarPalavra = (e: string, index: number) =>{
        let palavraS = [...palavraEscrita];

        palavraS[index] = e;

        setPalavraEscrita(palavraS);
        setVezPlayer(vezPlayer + 1 > numUsuarios ? 1 : vezPlayer + 1);
        socket.emit("palavra-escrita", { nome: palavraS });
    }

    return (
        <main>
            <section>
                <h1>Jogo da velha Online</h1>
                <div>
                    {
                        isConnected
                        ?
                        <>
                            <p>sou player {minhaVez}</p>
                            <p>conectados {numUsuarios}</p>
                            <p>vez player: {vezPlayer}</p>
                        </>
                        :
                        "desconectado"
                    }
                </div>
                <h3>Palavra</h3>
                <h2>
                    {
                        palavra.split("").map((caractere, i)=>(
                            <input
                                className="charinput"
                                key={i}
                                type="text"
                                onChange={(e) => {
                                    atualizarPalavra(e.target.value.toLocaleLowerCase(), i);
                                }}
                                value={palavraEscrita[i]} 
                                placeholder="_"
                                disabled={minhaVez === vezPlayer}
                                maxLength={1}
                            />
                        ))
                    }
                </h2>
            </section>
        </main>
    );
}

export default App;
