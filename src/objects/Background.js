import { getRandomPositiveInteger } from "../../lib/Random.js";
import Colour from "../enums/assets/ColorName.js";
import { context, CANVAS_WIDTH, CANVAS_HEIGHT } from "../globals.js";
import Star from "./Star.js";

export default class GameBackground {
    static MIN_STARS = 30;
    static MAX_STARS = 50;
    static BASE_STAR_SPEED = 10;
    static FAST_STAR_SPEED = 700;

    constructor() {
        this.count = getRandomPositiveInteger(GameBackground.MIN_STARS, GameBackground.MAX_STARS);
        
        this.stars = this.initializeStars(this.count);
        this.starSpeed = GameBackground.BASE_STAR_SPEED;
    }

    initializeStars() {
        let stars = [];

        for (let i = 0; i < this.count; i++) {
            stars.push(new Star());
        }

        return stars;
    }

    update(dt) {
        this.stars.forEach((star) => {
            star.position.x += this.starSpeed * dt;

            if (star.position.x >= CANVAS_WIDTH + star.dimensions.x) {
                star.position.x = 0 - star.dimensions.x
                star.position.y = getRandomPositiveInteger(0, CANVAS_HEIGHT);
            }

            star.update();
        })
    }

    render() {
        context.fillStyle = Colour.NavyBlue;
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.stars.forEach((star) => {
            star.render();
        });
    }
}