import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import Konva from "konva";
import SocketContext from "./SocketContext.js";

import Card from "./Card.js";

const PlaySpace = () => {
    const containerRef = useRef(null);
    const socket = useContext(SocketContext);
    const [cards, setCards] = useState({});
    const [cardCounter, setCardCounter] = useState(0);
    const [stage, setStage] = useState(null); 
    
    
    const cardDragged = useCallback((cardDraggedData) => {
        if(!socket) {return}
        socket.emit("card-dragged", cardDraggedData);
    }, [socket]);

    const cardTapped = useCallback((cardTappedData) => {
        if(!socket) {return}
        socket.emit("card-tapped", cardTappedData)
    }, [socket]);


    const createCard = useCallback((eventData, isCaughtNetworkEvent, cardData) => {
        if (!stage) return;

        const tempCardImages = ["http://localhost:3001/images/MTGCardBack.jpg",  "http://localhost:3001/images/atraxa-praetors-voice.png"];

        const layer = stage.findOne("Layer");
        const newCardID = cardCounter;
        if(!cardData){
            cardData = {
                ID: newCardID,
                x: 500,
                y: 500,
                imageUrl: tempCardImages[newCardID],
                name: `Magic Card #${newCardID}`,
            };
        }

        const newCard = new Card({
            ...cardData,
            sendDragUpdate: cardDragged,
            sendTappedUpdate: cardTapped, 
        });       
        
        // Attach the card to the layer and redraw
        newCard.attachToLayer(layer);
        layer.draw();

        // Add the new card to the state
        setCards((prevCards) => ({ ...prevCards, [newCardID]: newCard }));
        setCardCounter((prevCounter) => prevCounter + 1); 

        if(socket && !isCaughtNetworkEvent){
            socket.emit("card-created", cardData);
        }
    }, [stage, cardCounter, cardDragged, cardTapped, socket]);


    useEffect(() => {
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
                    
        socket.on("card-created-update", (cardCreatedData) =>{
            createCard(null, true, cardCreatedData);
        });
                
        return () => {
            socket.off("card-dragged-update");
            socket.off("card-tapped-update");
            socket.off("card-created-update");
        };
    }, [socket, cards, createCard]);

    useEffect(() => {
        var width = window.innerWidth;
        var height = window.innerHeight;

        // Initialize the stage only after the DOM has rendered the container
        const newStage = new Konva.Stage({
            container: containerRef.current, // DOM element via ref
            width: width,
            height: height,
        });

        const layer = new Konva.Layer();
        newStage.add(layer);

        setStage(newStage);
    }, []);

    return (
        <div>
            <div
            ref={containerRef} // This div serves as the container
            style={{
                border: "1px solid black", // Optional: To visualize the container
            }}
            ></div>
            <button onClick={createCard} style={{ marginTop: "10px" }}>
                Add Card
            </button>
        </div>
    )
}

export default PlaySpace;