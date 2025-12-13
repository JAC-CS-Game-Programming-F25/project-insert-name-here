import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import { input, stateStack, context, CANVAS_WIDTH, CANVAS_HEIGHT, images } from "../../globals.js";
import PlayState from "./PlayState.js";
import FontName from "../../enums/assets/FontName.js";
import Colour from "../../enums/assets/ColorName.js";
import PlayerShipNames from "../../enums/PlayerShipNames.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/assets/ImageName.js";
import Player from "../../entities/Player.js";
import LevelTransitionState from "./LevelTransitionState.js";

export default class ShipSelectScreenState extends State {
    constructor(background) {
        super();

		this.background = background;

        this.playerShipSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Spaceships),
            Player.WIDTH,
            Player.HEIGHT
        );

        this.currentShipIndex = 0;
    }

    update(dt) {
		this.background.update(dt);

        this.checkForCommands();
	}

	render() {
		this.background.render();
        
        context.font = `20px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.White;
		context.fillText('SELECT YOUR SHIP', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 30);

        this.playerShipSprites[this.currentShipIndex].render(CANVAS_WIDTH/2 - Player.WIDTH, CANVAS_HEIGHT/2 - Player.HEIGHT);

        context.font = `15px ${FontName.Pixellari}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.White;
        context.fillText(PlayerShipNames[this.currentShipIndex], CANVAS_WIDTH/2 - 7.5, CANVAS_HEIGHT/2 + 15);

		context.font = `15px ${FontName.Binary}`;
		context.textAlign = 'center';
		context.fillStyle = Colour.White;
		context.fillText('Press \'ENTER\' to start.', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 35);
	}

	checkForCommands() {
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
            stateStack.push(new LevelTransitionState(1, this.background, this.currentShipIndex, null));
		}
        else if (input.isKeyPressed(Input.KEYS.ARROW_LEFT)) {
            this.currentShipIndex -= 1;

            if (this.currentShipIndex < 0) {
                this.currentShipIndex = 8;
            }
        }
        else if (input.isKeyPressed(Input.KEYS.ARROW_RIGHT)) {
            this.currentShipIndex += 1;

            if (this.currentShipIndex > 8) {
                this.currentShipIndex = 0;
            }
        }
	}
}