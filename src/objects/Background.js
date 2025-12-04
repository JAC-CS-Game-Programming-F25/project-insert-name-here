import { getRandomPositiveInteger } from "../../lib/Random.js";
import Colour from "../enums/assets/ColorName.js";
import { context, CANVAS_WIDTH, CANVAS_HEIGHT } from "../globals.js";
import Star from "./Star.js";

export default class GameBackground {
    static MIN_STARS = 30;
    static MAX_STARS = 50;
    
    constructor() {
        this.count = getRandomPositiveInteger(GameBackground.MIN_STARS, GameBackground.MAX_STARS);
        
        this.stars = this.initializeStars(this.count);
    }

    initializeStars() {
        let stars = [];

        for (let i = 0; i < this.count; i++) {
            stars.push(new Star());
        }

        return stars;
    }

    render() {
        context.fillStyle = Colour.NavyBlue;
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.stars.forEach((star) => {
            star.render();
        });
    }
}