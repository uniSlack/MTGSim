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
    const [cardSearchBoxText, setCardSearchBoxText] = useState("");
    
    
    const cardDragged = useCallback((cardDraggedData) => {
        if(!socket) {return}
        socket.emit("card-dragged", cardDraggedData);
    }, [socket]);

    const cardTapped = useCallback((cardTappedData) => {
        if(!socket) {return}
        socket.emit("card-tapped", cardTappedData)
    }, [socket]);


    const createCard = useCallback((cardData) => {
        if (!stage) return;

        const layer = stage.findOne("Layer");
        const newCardID = cardCounter;

        const newCard = new Card({
            ID: newCardID,
            x: 500,
            y: 500,
            imageUrl: cardData.image_uris.png ? cardData.image_uris.png : "http://localhost:3001/images/MTGCardBack.jpg",
            name: cardData.name ? cardData.name : `Magic Card #${newCardID}`,
            sendDragUpdate: cardDragged,
            sendTappedUpdate: cardTapped, 
        });       
        
        // Attach the card to the layer and redraw
        newCard.attachToLayer(layer);
        layer.draw();

        // Add the new card to the state
        setCards((prevCards) => ({ ...prevCards, [newCardID]: newCard }));
        setCardCounter((prevCounter) => prevCounter + 1); 

    }, [stage, cardCounter, cardDragged, cardTapped]);


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
            createCard(cardCreatedData);
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

    const handleCardSearchBoxTextChange = (event) => {
        setCardSearchBoxText(event.target.value);
    }

    const SearchCard = useCallback(() => {
        socket.emit("card-search", cardSearchBoxText);
    }, [socket, cardSearchBoxText]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            SearchCard();
        }
      };

    return (
        <div>
            <div
            ref={containerRef} // This div serves as the container
            style={{
                border: "1px solid black", // Optional: To visualize the container
            }}
            ></div>
            <input
                type="text"
                value={cardSearchBoxText}
                onChange={handleCardSearchBoxTextChange}
                onKeyDown={handleKeyDown}
                placeholder="Search Card"
            />
            <button onClick={SearchCard} style={{ marginTop: "10px" }}>
                Add Card
            </button>
        </div>
    )
}

export default PlaySpace;