import AbilityType from "../enums/AbilityType.js";
import Colour from "../enums/assets/ColorName.js";
import FontName from "../enums/assets/FontName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context } from "../globals.js";

export default class UserInterface {
    constructor(playstate) {
        this.playstate = playstate;
    }

    render() {
        this.renderScore();
		
        this.renderLevelStats();

		this.renderLives();

		this.renderAbility();
    }

    renderScore() {
        context.font = `10px ${FontName.Pixellari}`;
		context.textAlign = 'left';

        context.fillStyle = Colour.Black;
		context.fillText(`Score: ${this.playstate.score}`, 6, 16);

		context.fillStyle = Colour.White;
		context.fillText(`Score: ${this.playstate.score}`, 5, 15);
    }

    renderLevelStats() {
        context.font = `10px ${FontName.Pixellari}`;
		context.textAlign = 'left';

        context.fillStyle = Colour.Black;
        context.fillText(`Level: ${this.playstate.currentLevelValue}`, 6, CANVAS_HEIGHT - 14);
		context.fillText(`Aliens Left: ${this.playstate.currentlevel.currentHorde.aliens.length}`, 6, CANVAS_HEIGHT - 4);

		context.fillStyle = Colour.White;
        context.fillText(`Level: ${this.playstate.currentLevelValue}`, 5, CANVAS_HEIGHT - 15);
		context.fillText(`Aliens Left: ${this.playstate.currentlevel.currentHorde.aliens.length}`, 5, CANVAS_HEIGHT - 5);
    }

    renderLives() {
        context.font = `10px ${FontName.Pixellari}`;
        context.textAlign = 'right';

        context.fillStyle = Colour.Black;
		context.fillText(`Lives: ${this.playstate.player.lives}`, CANVAS_WIDTH - 4, 16);

		context.fillStyle = Colour.White;
		context.fillText(`Lives: ${this.playstate.player.lives}`, CANVAS_WIDTH - 5, 15);
    }

    renderAbility() {
        context.font = `20px ${FontName.Binary}`;
		switch (this.playstate.currentAbility) {
			case AbilityType.RapidFire:
				context.fillStyle = Colour.Black;
				context.fillText(AbilityType.RapidFire, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);
				context.fillStyle = Colour.Cyan;
				context.fillText(AbilityType.RapidFire, CANVAS_WIDTH - 5, CANVAS_HEIGHT - 5);
				break;
			case AbilityType.BulletSpread:
				context.fillStyle = Colour.Black;
				context.fillText(AbilityType.BulletSpread, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);
				context.fillStyle = Colour.HotPink;
				context.fillText(AbilityType.BulletSpread, CANVAS_WIDTH - 5, CANVAS_HEIGHT - 5);
				break;
			case AbilityType.TimeDilation:
				context.fillStyle = Colour.Black;
				context.fillText(AbilityType.TimeDilation, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);
				context.fillStyle = Colour.LimeGreen;
				context.fillText(AbilityType.TimeDilation, CANVAS_WIDTH - 5, CANVAS_HEIGHT - 5);
				break;
			default:
				break;
		}
    }
}