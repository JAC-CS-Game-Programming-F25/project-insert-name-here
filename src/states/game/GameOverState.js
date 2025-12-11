import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import { input, stateStack, context, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";
import PlayState from "./PlayState.js";
import FontName from "../../enums/assets/FontName.js"
import Colour from "../../enums/assets/ColorName.js"

export default class GameOverState extends State {
	constructor(background) {
		super();

		this.background = background;
	}

	update() {
		this.checkForNewGame();
	}

	render() {
		this.background.render();

		context.font = `30px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.Red;
		context.fillText('GAME OVER', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);

		context.font = `15px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.Red;
		context.fillText('Press \'ENTER\' to play again.', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 20);
	}

	checkForNewGame() {
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			stateStack.pop();
			stateStack.push(new PlayState());
		}
	}
}
