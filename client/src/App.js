import React from "react";
import "./App.css";
import PlaySpace from "./components/PlaySpace";
import { io } from 'socket.io-client';
import SocketContext from "./components/SocketContext";

function App() {
    const [data, setData] = React.useState(null);
    const [socket, setSocket] = React.useState(null);

    React.useEffect(() => {
        fetch("http://localhost:3001/api")
            .then((res) => res.json())
            .then((data) => setData(data.message));

        const newSocket = io("http://localhost:3001");

        newSocket.on("connect", () => {
            console.log("Connected to server with ID:", newSocket.id);
        });
          
        newSocket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        setSocket(newSocket);
         

        return () => {
            newSocket.close(); 
        }
    }, []);

    if(!socket) {return <div>Loading...</div>}

    return (
        <SocketContext.Provider value={socket}>
            <div className="App">
                <header className="App-header">
                    <PlaySpace socket={socket}/>
                    <p>{!data ? "Loading..." : data}</p>
                </header>
            </div>
        </SocketContext.Provider>
    );
}

export default App;