import React, { useContext ,useEffect, useRef } from "react";
import Konva from "konva";
import SocketContext from "./SocketContext.js";

import Card from "./Card.js";

const PlaySpace = () => {
    const containerRef = useRef(null);
    const socket = useContext(SocketContext);
    const [cards, setCards] = React.useState({});
    
    React.useEffect(() => {
        if(!socket){ return;}

        // Listen for updates from other clients
        socket.on("card-dragged-update", (cardDraggedData) => {           
            const {cardID, newx, newy} = cardDraggedData;

            if(cards[cardID]){
                cards[cardID].setPosition(newx, newy);
            }
        });

        socket.on("card-tapped-update", (cardTappedData) => {
            const {cardID, tapped} = cardTappedData;

            if(cards[cardID]){
                cards[cardID].setTapped(tapped);
            }
        })
                
        return () => {
            socket.off("card-dragged-update");
        };
    }, [socket, cards]);

    const cardDragged = React.useCallback((cardDraggedData) => {
        if(!socket) {return}
        socket.emit("card-dragged", cardDraggedData);
    }, [socket]);

    const cardTapped = React.useCallback((cardTappedData) => {
        if(!socket) {return}
        socket.emit("card-tapped", cardTappedData)
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
            sendTappedUpdate: cardTapped,
        });

        // Add the card to the layer
        firstCard.attachToLayer(layer);
        layer.draw(); // Render the layer

        setCards((prevCards) => ({ ...prevCards, 0: firstCard }));
    }, [cardDragged, cardTapped]);

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