import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import { input, stateStack, context, CANVAS_WIDTH, CANVAS_HEIGHT, sounds } from "../../globals.js";
import PlayState from "./PlayState.js";
import FontName from "../../enums/assets/FontName.js";
import Colour from "../../enums/assets/ColorName.js";
import SoundName from "../../enums/assets/SoundName.js";

export default class PauseState extends State {
    constructor() {
        super();
    }

	enter() {
		sounds.play(SoundName.Pause);
	}

    update() {
		this.checkForPlay();
	}

	render() {
		context.globalAlpha = 0.5;
        context.fillStyle = Colour.Black;
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
        context.globalAlpha = 1;
        
        context.font = `30px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.White;
		context.fillText('PAUSED', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);

		context.font = `15px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.White;
		context.fillText('Press \'ESCAPE\' to resume playing.', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 20);
		context.fillText('Press \'ENTER\' to leave game.', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 35);
	}

	checkForPlay() {
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			sounds.play(SoundName.Leave);
			stateStack.pop();
			stateStack.pop();
			stateStack.pop();
		}
		if (input.isKeyPressed(Input.KEYS.ESCAPE)) {
			sounds.play(SoundName.Pause);
			stateStack.pop();
			sounds.stop(SoundName.Pause);
		}
	}
}