import React, { useState, useEffect } from "react";
import "./App.css";

import { socket } from "./socket";

interface palavraEscrita{
    nome: string
}

interface game{
    isConnected: boolean,
    numUsuarios: number,
    minhaVez: number,
    definirVencedor: (novoValor: number) => void
}

interface vencedorType{
    minhaVez: number
}

const Game: React.FC<game> = ({ isConnected, numUsuarios, minhaVez, definirVencedor }) =>{
    const [vezPlayer, setVezPlayer] = useState(1);
    const palavra = "banana";
    const [palavraEscrita, setPalavraEscrita] = useState<string[]>(Array.from(palavra, () => ""));

    useEffect(()=>{
        socket.on("palavra-escrita", (e: palavraEscrita) =>{
            Array.isArray(e.nome) && setPalavraEscrita(e.nome);
        });

        socket.on("vezPlayer", (e: number) =>{
            setVezPlayer(e);
        });

        return () => {
            socket.off("players");
            socket.off("palavra-escrita");
            socket.off("vezPlayer");
        };
    },[]);

    const defineVencedor = () =>{
        socket.emit("vencedorPlayer", vezPlayer === 1 ? numUsuarios : vezPlayer - 1);
        console.log("vencedor player " + vezPlayer);
    }

    const atualizarPalavra = (e: string, index: number) =>{
        let palavraS = [...palavraEscrita];

        palavraS[index] = e;

        if(palavraS.join("") === palavra){
            defineVencedor();
            definirVencedor(minhaVez);
        }

        setPalavraEscrita(palavraS);
        setVezPlayer(
            vezPlayer < numUsuarios ?
            vezPlayer + 1
            :
            1
        );
        socket.emit("palavra-escrita", { nome: palavraS });
        socket.emit("vezPlayer", vezPlayer);
        console.log(vezPlayer);
    }

    return (
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
                            disabled={minhaVez !== vezPlayer}
                            maxLength={1}
                        />
                    ))
                }
            </h2>
        </section>
    )
}

const Desconectado = () =>{
    return(
        <div className="jogadorInsuficiente">
            <h2>Jogo da forca online</h2>
            <p>Número de jogadores insuficientes</p>
        </div>
    );
}

const Vencedores: React.FC<vencedorType> = ({ minhaVez }) =>{
    return(
        <div className="jogadorInsuficiente">
            <p>Vencedor jogador numero {minhaVez}</p>
        </div>
    );
}

const App = () =>{
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [numUsuarios, setNumUsuarios] = useState(0);

    const [minhaVez, setMinhaVez] = useState(0);

    const [vencedor, setVencedor] = useState(0);

    const definirVencedor = (vencedorEscolhido: number) =>{
        setVencedor(vencedorEscolhido);
    }

    useEffect(()=>{
        socket.on("clients-total", (e: number) => {
            setIsConnected(true);
            setNumUsuarios(e);
        });

        socket.on("players", (e) =>{
            setMinhaVez(e);
            console.log(e);
        });

        socket.on("vencedorPlayer", (e) =>{
            setVencedor(e);
        });

        return () => {
            socket.off("clients-total");
        };
    },[]);


    return (
        <main>
            {numUsuarios >= 2 ? (
                vencedor <= 0 ? (
                <Game
                    isConnected={isConnected}
                    numUsuarios={numUsuarios}
                    minhaVez={minhaVez}
                    definirVencedor={definirVencedor}
                />
                ) : (
                    <Vencedores minhaVez={minhaVez} />
                )
            ) : (
                <Desconectado />
            )}
        </main>
    );      
}

export default App;
