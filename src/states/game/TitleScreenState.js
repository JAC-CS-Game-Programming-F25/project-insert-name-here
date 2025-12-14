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

export default class TitleScreenState extends State {
	constructor() {
        super();

		this.background = new GameBackground();
    }

    update(dt) {
		this.background.update(dt);
		
		this.checkForPlay();
	}

	render() {
		this.background.render();
        
        context.font = `25px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.White;
		context.fillText('ASTRAL ASSAULT', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);

		context.font = `15px ${FontName.Binary}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.White;
		context.fillText('Press \'ENTER\' to proceed.', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 20);
	}

	checkForPlay() {
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			sounds.play(SoundName.ShipSelect);
			stateStack.push(new ShipSelectScreenState(this.background));
		}
	}
}
