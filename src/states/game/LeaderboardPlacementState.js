import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Colour from "../../enums/assets/ColorName.js";
import FontName from "../../enums/assets/FontName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, highScoreManager, input, stateStack } from "../../globals.js";

export default class LeaderboardPlacementState extends State {
    constructor(background) {
        super();

        this.background = background;
    }
    
    update(dt) {
        this.background.update(dt);

		this.checkForNewGame();
	}

	render() {
		this.background.render();

        context.font = `30px ${FontName.Pixellari}`;
        context.textAlign = 'center';
		context.fillStyle = Colour.White;
        context.fillText("HIGHSCORES", CANVAS_WIDTH/2, 40);

	    highScoreManager.render();

        context.font = `15px ${FontName.Pixellari}`;
		context.fillText('Press \'ENTER\' to proceed.', CANVAS_WIDTH/2, 165);
	}

	checkForNewGame() {
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			stateStack.pop();
            stateStack.pop();
		}
	}
}