import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import { input, stateStack, context, CANVAS_WIDTH, CANVAS_HEIGHT, songs } from "../../globals.js";
import PlayState from "./PlayState.js";
import FontName from "../../enums/assets/FontName.js"
import Colour from "../../enums/assets/ColorName.js"
import LeaderboardPlacementState from "./LeaderboardPlacementState.js";
import LevelTransitionState from "./LevelTransitionState.js";
import SongName from "../../enums/assets/SongName.js";

export default class GameOverState extends State {
	constructor(shipType, background) {
		super();

		this.shipType = shipType;
		this.background = background;
	}

	enter() {
		songs.play(SongName.GameOver);
	}

	update() {
		this.checkForNewGame();
	}

	render() {
		this.background.render();

		context.font = `30px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.Black;
		context.fillText('GAME OVER', CANVAS_WIDTH/2 + 3, CANVAS_HEIGHT/2 - 7);
		context.fillStyle = Colour.Red;
		context.fillText('GAME OVER', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 10);

		context.font = `15px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.Black;
		context.fillText('Press \'ESCAPE\' to play again.', CANVAS_WIDTH/2 + 2, CANVAS_HEIGHT/2 + 12);
		context.fillText('Press \'ENTER\' to return to proceed.', CANVAS_WIDTH/2 + 2, CANVAS_HEIGHT/2 + 27, 175);
		context.fillStyle = Colour.Red;
		context.fillText('Press \'ESCAPE\' to play again.', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 10);
		context.fillText('Press \'ENTER\' to return to proceed.', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 25, 175);
	}

	checkForNewGame() {
		if (input.isKeyPressed(Input.KEYS.ESCAPE)) {
			songs.stop(SongName.GameOver);
			stateStack.pop();
			stateStack.push(new LevelTransitionState(1, this.background, this.shipType, null));
		}
		else if (input.isKeyPressed(Input.KEYS.ENTER)) {
			stateStack.pop();
			stateStack.push(new LeaderboardPlacementState(this.background));
		}
	}
}
