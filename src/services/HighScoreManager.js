import Colour from "../enums/assets/ColorName.js";
import FontName from "../enums/assets/FontName.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context } from "../globals.js";

export default class HighScoreManager {
    constructor(highScores) {
        this.highScoreValues = highScores.Highscores
    }

    update(newScore) {
        //console.log(newScore);

        this.highScoreValues.push(newScore);
        this.highScoreValues.sort(function(a, b){return b - a});
        this.highScoreValues.pop();

        //console.log(this.highScoreValues);
    }

    render() {
        for (let index = 0; index < this.highScoreValues.length; index++) {
            context.font = `15px ${FontName.Binary}`;
		    context.fillText(`${index + 1} : ${this.highScoreValues[index]}pts`, CANVAS_WIDTH/2, 55 + (10 * index));
        }
    }
}