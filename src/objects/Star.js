import { getRandomPositiveInteger, getRandomPositiveNumber } from "../../lib/Random.js";
import Vector from "../../lib/Vector.js";
import Colour from "../enums/assets/ColorName.js";
import { context, CANVAS_WIDTH, CANVAS_HEIGHT } from "../globals.js";

export default class Star {
    static MIN_SIZE = 3;
    static MAX_SIZE = 6;
    
    constructor() {
        this.position = this.setPosition();
        this.dimensions = this.setDimensions();
    }

    setPosition() {
        let x = getRandomPositiveNumber(0, CANVAS_WIDTH);
        let y = getRandomPositiveNumber(0, CANVAS_HEIGHT);
        
        return new Vector(x, y);
    }

    setDimensions() {
        let size = getRandomPositiveInteger(Star.MIN_SIZE, Star.MAX_SIZE);
        
        return new Vector(size, size);
    }

    render() {
        context.fillStyle = Colour.White;
        context.fillRect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
    }
}