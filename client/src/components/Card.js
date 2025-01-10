import Konva from "konva";

class Card {
    constructor({ x = 0, y = 0, width = 250, height = 350, imageUrl, draggable = true, name = "Unnamed Card", sendDragUpdate}) {
        this.name = name; // Additional data for the card
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.draggable = draggable;
        this.imageUrl = imageUrl;
        this.tapped = false;
        this.sendDragUpdate = sendDragUpdate;

        // Create the Konva.Image instance
        this.image = new Konva.Image({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            draggable: this.draggable,
            offset: {
                x: this.width / 2,
                y: this.height / 2,
            },
        });

        this.oldx = this.x;
        this.oldy = this.y;

        // Load the image and apply it to the Konva.Image
        const imageObj = new window.Image();
        imageObj.src = this.imageUrl;

        imageObj.onload = () => {
            this.image.image(imageObj); // Attach the loaded image
            this.image.getLayer()?.batchDraw(); // Redraw the layer if available
        };

        // Add card-specific interactions
        this.image.on("dblclick", this.handleDoubleClick.bind(this));
        this.image.on("dragend", this.handleDragEnd.bind(this));
    }

    // Example method to handle double-click
    handleDoubleClick() {
        this.tapped = !this.tapped;
        const rotation = this.tapped ? 90 : 0;
        this.image.rotation(rotation);
        this.image.getLayer()?.batchDraw(); // Redraw the layer
        console.log("Card Tapped");
    }

    handleDragEnd() {
        // const data = { cardID: 0, oldx: this.oldx, oldy:this.oldy, newx:this.x, newy:this.y };

        // this.oldx = this.x;
        // this.oldy = this.y;

        console.log("Card Dragged");
        this.sendDragUpdate();
    }

    // // Additional methods to interact with the card
    // setPosition(x, y) {
    //   this.image.x(x);
    //   this.image.y(y);
    // }

    // getPosition() {
    //   return { x: this.image.x(), y: this.image.y() };
    // }

    attachToLayer(layer) {
        layer.add(this.image);
    }
}

export default Card;