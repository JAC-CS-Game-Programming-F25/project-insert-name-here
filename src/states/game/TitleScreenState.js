import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import { input, stateStack, context, CANVAS_WIDTH, CANVAS_HEIGHT, sounds, timer, GAME_TITLE, songs } from "../../globals.js";
import PlayState from "./PlayState.js";
import FontName from "../../enums/assets/FontName.js";
import Colour from "../../enums/assets/ColorName.js";
import GameBackground from "../../objects/Background.js";
import ShipType from "../../enums/PlayerShip.js";
import ShipSelectScreenState from "./ShipSelectScreenState.js";
import SoundName from "../../enums/assets/SoundName.js";
import Easing from "../../../lib/Easing.js";
import InstructionsScreenState from "./InstructionsScreenState.js";
import SongName from "../../enums/assets/SongName.js"

export default class TitleScreenState extends State {
	constructor() {
        super();

		this.background = new GameBackground();

		this.optionsOpacity = 1;
    }

	enter() {
		songs.play(SongName.Menu);
	}

    update(dt) {
		this.background.update(dt);
		this.checkForPlay();
	}

	render() { 
		this.background.render();
		
        context.font = `25px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.Black;
		context.fillText(GAME_TITLE, CANVAS_WIDTH/2 + 3, CANVAS_HEIGHT/2 - 20 + 3);
		context.fillStyle = Colour.White;
		context.fillText(GAME_TITLE, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 20);

		context.font = `15px ${FontName.Binary}`;
		context.textAlign = 'center';
		context.fillStyle = `rgb(0, 0, 0, ${this.optionsOpacity})`;
		context.fillText('Press \'SPACE\' to view guide.', CANVAS_WIDTH/2 + 2, CANVAS_HEIGHT/2 + 20 + 2);
		context.fillText('Press \'ENTER\' to proceed.', CANVAS_WIDTH/2 + 2, CANVAS_HEIGHT/2 + 40 + 2);
		context.fillStyle = `rgb(255, 255, 255, ${this.optionsOpacity})`;
		context.fillText('Press \'SPACE\' to view guide.', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 20);
		context.fillText('Press \'ENTER\' to proceed.', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 40);
	}

	checkForPlay() {
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			sounds.play(SoundName.ShipSelect);
			stateStack.push(new ShipSelectScreenState(this.background));
		}
		else if (input.isKeyPressed(Input.KEYS.SPACE)) {
			sounds.play(SoundName.ShipSelect);
			stateStack.push(new InstructionsScreenState(this.background));
		}
	}
}
