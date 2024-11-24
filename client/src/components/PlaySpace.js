import React, { useEffect, useRef } from "react";
import Konva from "konva";


const PlaySpace = () => {
    const containerRef = useRef(null);
    useEffect(() => {
        // Initialize the stage only after the DOM has rendered the container
        const stage = new Konva.Stage({
          container: containerRef.current, // DOM element via ref
          width: 1000,
          height: 1000,
        });
    
        const layer = new Konva.Layer();
        stage.add(layer);
    
       
        const imageObj = new window.Image();
        imageObj.src = "http://localhost:3001/images/MTGCardBack.jpg";

        imageObj.onload = () => {
            const konvaImage = new Konva.Image({
              x: stage.width() / 2 - 75, 
              y: stage.height() / 2 - 75,
              image: imageObj,
              width: 250, 
              height: 350,
              draggable: true,
              offset: {
                x : 125,
                y : 175
              }
            });
        
        konvaImage.on('click', function() {
          console.log("double click");
          konvaImage.rotate(90);
        })
      
        layer.add(konvaImage);
        layer.draw(); // Render the layer
        };
    }, []);

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