import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import { input, stateStack, context, CANVAS_WIDTH, CANVAS_HEIGHT, sounds } from "../../globals.js";
import PlayState from "./PlayState.js";
import FontName from "../../enums/assets/FontName.js";
import Colour from "../../enums/assets/ColorName.js";
import GameBackground from "../../objects/Background.js";
import ShipType from "../../enums/PlayerShip.js";
import ShipSelectScreenState from "./ShipSelectScreenState.js";
import SoundName from "../../enums/assets/SoundName.js";

export default class InstructionsScreenState extends State {
	constructor(background) {
        super();

		this.background = background;
    }

    update(dt) {
		this.background.update(dt);
		
		this.checkForPlay();
	}

	render() {
		this.background.render();
		
		context.fillStyle = ""
        context.font = `32px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.Black;
		context.fillText('INSTRUCTIONS', CANVAS_WIDTH/2 + 3, 43);
		context.fillStyle = Colour.White;
		context.fillText('INSTRUCTIONS', CANVAS_WIDTH/2, 40);

		context.font = `8px ${FontName.Minecraftia}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.Black;
		context.fillText('Aim with your mouse from the back of your ship.', CANVAS_WIDTH/2 + 1, 70 + 1, 220);
		context.fillText('Left click to shoot.', CANVAS_WIDTH/2 + 1, 90 + 1, 100);
		context.fillText('Clear all aliens to proceed to next level.', CANVAS_WIDTH/2 + 2, 110 + 1, 220);
		context.fillText('Defeating aliens will sometimes give temporary power-ups.', CANVAS_WIDTH/2 + 1, 130 + 1, 220);
		context.fillText('Survive', CANVAS_WIDTH/2 + 1, 150 + 1);
		
		context.font = `15px ${FontName.Pixellari}`;
		context.fillText('Press \'SPACE\' to go back.', CANVAS_WIDTH/2 + 2, CANVAS_HEIGHT - 15 + 2);

		context.font = `8px ${FontName.Minecraftia}`; 
		context.fillStyle = Colour.White;
		context.fillText('Aim with your mouse from the back of your ship.', CANVAS_WIDTH/2, 70, 220);
		context.fillText('Left click to shoot.', CANVAS_WIDTH/2, 90, 100);
		context.fillText('Clear all aliens to proceed to next level.', CANVAS_WIDTH/2, 110, 220);
		context.fillText('Defeating aliens will sometimes give temporary power-ups.', CANVAS_WIDTH/2, 130, 220);
		context.fillStyle = Colour.Red;
		context.fillText('Survive', CANVAS_WIDTH/2, 150);

		context.font = `15px ${FontName.Pixellari}`;
		context.fillStyle = Colour.White; 
		context.fillText('Press \'SPACE\' to go back.', CANVAS_WIDTH/2, CANVAS_HEIGHT - 15);
	}

	checkForPlay() {
		if (input.isKeyPressed(Input.KEYS.SPACE)) {
			sounds.play(SoundName.ShipSelect);
			stateStack.pop();
		}
	}
}