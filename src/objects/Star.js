import { getRandomPositiveInteger, getRandomPositiveNumber } from "../../lib/Random.js";
import Vector from "../../lib/Vector.js";
import Colour from "../enums/assets/ColorName.js";
import { context, CANVAS_WIDTH, CANVAS_HEIGHT } from "../globals.js";

export default class Star {
    static MIN_SIZE = 2;
    static MAX_SIZE = 6;
    static HALF_WAY = 4;
    
    constructor() {
        this.position = this.setPosition();
        this.dimensions = this.setDimensions();

        this.isGrowing = false;

        if (this.dimensions.x <= Star.HALF_WAY) {
            this.isGrowing = true;
        }
    }

    update() {
        this.twinkle();
    }

    render() {
        context.fillStyle = Colour.White;
        context.fillRect(this.position.x - this.dimensions.x/2, this.position.y - this.dimensions.y/2, this.dimensions.x, this.dimensions.y);
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

    updateDimensions(size) {
        this.dimensions = new Vector(size, size);
    }

    twinkle() {
        if (this.isGrowing) {
            this.updateDimensions(this.dimensions.x + 0.02);

            if (this.dimensions.x == Star.HALF_WAY || this.dimensions.x <= Star.MIN_SIZE || this.dimensions.x >= Star.MAX_SIZE) {
                this.isGrowing = false;
            }
        }
        else {
            this.updateDimensions(this.dimensions.x - 0.02);

            if (this.dimensions.x == Star.HALF_WAY || this.dimensions.x <= Star.MIN_SIZE || this.dimensions.x >= Star.MAX_SIZE) {
                this.isGrowing = true;
            }
        }
    }
}