import Vector from "../../lib/Vector.js";
import Colour from "../enums/assets/ColorName.js";
import FontName from "../enums/assets/FontName.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context } from "../globals.js";

export default class HighScoreManager {
    static PANEL_WIDTH = 110;
    static PANEL_HEIGHT = 105;
    
    constructor(highScores) {
        this.highScoreValues = highScores.Highscores

        this.panelDimensions = new Vector(HighScoreManager.PANEL_WIDTH, HighScoreManager.PANEL_HEIGHT)
    }

    update(newScore) {
        //console.log(newScore);
        this.highScoreValues.push(newScore);
        this.highScoreValues.sort(function(a, b){return b - a});
        this.highScoreValues.pop();

        //console.log(this.highScoreValues);
    }

    render() {
        context.globalAlpha = 0.5;
        context.fillStyle = Colour.Black;
        context.fillRect(CANVAS_WIDTH/2 - HighScoreManager.PANEL_WIDTH/2, CANVAS_HEIGHT/2 - HighScoreManager.PANEL_HEIGHT/2 + 6.5, this.panelDimensions.x, this.panelDimensions.y);
        context.globalAlpha = 1;

        for (let index = 0; index < this.highScoreValues.length; index++) {
            context.font = `15px ${FontName.Binary}`;
            context.fillStyle = Colour.White;
		    context.fillText(`${index + 1}. ${this.highScoreValues[index]}pts`, CANVAS_WIDTH/2, 55 + (10 * index));
        }
    }
}