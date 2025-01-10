import React, { useContext ,useEffect, useRef } from "react";
import Konva from "konva";
import SocketContext from "./SocketContext.js";

import Card from "./Card.js";

const PlaySpace = () => {
    const containerRef = useRef(null);
    const socket = useContext(SocketContext);
    
    const cardDragged = React.useCallback(() => {
        if(socket){
            socket.emit("card-dragged", { message: "Hello, server!" });
            console.log("sentmessage");
        }
        else{
            console.log("No Socket");
            return;
        }
    }, [socket]);

    useEffect(() => {
        var width = window.innerWidth;
        var height = window.innerHeight;

        // Initialize the stage only after the DOM has rendered the container
        const stage = new Konva.Stage({
            container: containerRef.current, // DOM element via ref
            width: width,
            height: height,
        });

        const layer = new Konva.Layer();
        stage.add(layer);

        // Create a new Card instance
        const firstCard = new Card({
            x: 125,
            y: 175,
            imageUrl: "http://localhost:3001/images/MTGCardBack.jpg",
            name: "Magic Card",
            sendDragUpdate: cardDragged,
        });

        // Add the card to the layer
        firstCard.attachToLayer(layer);
        layer.draw(); // Render the layer
    }, [cardDragged]);

    return (
        <div
            ref={containerRef} // This div serves as the container
            style={{
                width: "1000px",
                height: "1000px",
                border: "1px solid black", // Optional: To visualize the container
            }}
        ></div>
    )
}

export default PlaySpace;