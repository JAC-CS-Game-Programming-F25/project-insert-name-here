import State from "../../../lib/State.js";
import { input, stateStack, context, CANVAS_WIDTH, CANVAS_HEIGHT, sounds } from "../../globals.js";
import PlayState from "./PlayState.js";
import FontName from "../../enums/assets/FontName.js";
import Colour from "../../enums/assets/ColorName.js";
import GameBackground from "../../objects/Background.js";
import SoundName from "../../enums/assets/SoundName.js";

export default class LevelTransitionState extends State {
    static TRANSITION_DURATION = 3
    
    constructor(levelValue = 1, background, shipType, playState) {
        super();

        this.levelValue = levelValue
        this.background = background;
        this.shipType = shipType;
        this.playState = playState ?? null;

        this.background.starSpeed = GameBackground.FAST_STAR_SPEED;

        this.transitionTimer = LevelTransitionState.TRANSITION_DURATION; 
    }

    enter() {
        sounds.play(SoundName.NextLevel);
    }

    update(dt) {
        this.background.update(dt);

        if (this.transitionTimer <= 0) {
            this.background.starSpeed = GameBackground.BASE_STAR_SPEED;

            if (this.levelValue === 1) {
                stateStack.pop();
                stateStack.push(new PlayState(this.shipType, this.background));
            }
            else {
                stateStack.pop();
                this.playState.background = this.background;
            }
        }

        this.transitionTimer -= dt;


    }

    render() {
        this.background.render();

        context.font = `25px ${FontName.Pixellari}`;
		context.textAlign = 'center';
        context.fillStyle = Colour.Black;
		context.fillText(`LEVEL ${this.levelValue}`, CANVAS_WIDTH/2 + 3, CANVAS_HEIGHT/2 + 3);
		context.fillStyle = Colour.White;
		context.fillText(`LEVEL ${this.levelValue}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    }
}