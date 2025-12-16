import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import { input, stateStack, context, CANVAS_WIDTH, CANVAS_HEIGHT, images, sounds, songs, timer } from "../../globals.js";
import PlayState from "./PlayState.js";
import FontName from "../../enums/assets/FontName.js";
import Colour from "../../enums/assets/ColorName.js";
import PlayerShipNames from "../../enums/PlayerShipNames.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/assets/ImageName.js";
import Player from "../../entities/Player.js";
import LevelTransitionState from "./LevelTransitionState.js";
import SoundName from "../../enums/assets/SoundName.js";
import SongName from "../../enums/assets/SongName.js";
import Vector from "../../../lib/Vector.js";

export default class ShipSelectScreenState extends State {
    static SELECT_ARROW_BASE = 10;
    static SELECT_ARROW_HEIGHT = 10;
    
    constructor(background) {
        super();

		this.background = background;

        this.playerShipSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Spaceships),
            Player.WIDTH,
            Player.HEIGHT
        );

        this.currentShipIndex = 0;

        this.leftArrowPosition = new Vector(0,0);
        this.rightArrowPosition = new Vector(0,0);
    }

    update(dt) {
		this.background.update(dt);

        this.checkForCommands();
	}

	render() {
		this.background.render();
        
        context.font = `20px ${FontName.Pixellari}`;
		context.textAlign = 'center';
        context.fillStyle = Colour.Black;
		context.fillText('SELECT YOUR SHIP', CANVAS_WIDTH/2 + 3, CANVAS_HEIGHT/2 - 27);
		context.fillStyle = Colour.White;
		context.fillText('SELECT YOUR SHIP', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 30);

        context.filter = 'brightness(0%)';
        this.playerShipSprites[this.currentShipIndex].render(CANVAS_WIDTH/2 - Player.WIDTH/2 + 1, CANVAS_HEIGHT/2 - Player.HEIGHT + 8);
        context.filter = 'brightness(100%)';
        this.playerShipSprites[this.currentShipIndex].render(CANVAS_WIDTH/2 - Player.WIDTH/2, CANVAS_HEIGHT/2 - Player.HEIGHT + 7);

        context.font = `16px ${FontName.Pixellari}`;
		context.textAlign = 'center';
        context.fillStyle = Colour.Black;
        context.fillText(PlayerShipNames[this.currentShipIndex], CANVAS_WIDTH/2 + 1, CANVAS_HEIGHT/2 + 32);
		context.fillStyle = Colour.White;
        context.fillText(PlayerShipNames[this.currentShipIndex], CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 30);

		context.font = `15px ${FontName.Binary}`;
		context.textAlign = 'center';
        context.fillStyle = Colour.Black;
		context.fillText('Press \'ENTER\' to start.', CANVAS_WIDTH/2 + 2, CANVAS_HEIGHT/2 + 52);
		context.fillStyle = Colour.White;
		context.fillText('Press \'ENTER\' to start.', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 50);

        this.renderSelectionArrows();
	}

	async checkForCommands() {
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
            stateStack.pop();
            songs.stop(SongName.Menu);
            stateStack.push(new LevelTransitionState(1, this.background, this.currentShipIndex, null));
		}
        else if (input.isKeyPressed(Input.KEYS.ESCAPE)) {
            sounds.play(SoundName.ShipSelect);
            stateStack.pop();
		}
        else if (input.isKeyPressed(Input.KEYS.ARROW_LEFT)) {
            this.leftArrowPosition.y -= 3;
            sounds.play(SoundName.ShipSelect);
            this.currentShipIndex -= 1;

            if (this.currentShipIndex < 0) {
                this.currentShipIndex = 8;
            }
        }
        else if (input.isKeyPressed(Input.KEYS.ARROW_RIGHT)) {
            this.rightArrowPosition.y -= 3;
            sounds.play(SoundName.ShipSelect);
            this.currentShipIndex += 1;

            if (this.currentShipIndex > 8) {
                this.currentShipIndex = 0;
            }
        }

        await timer.wait(0.5).then(() => {
            this.resetArrowPositions();
        });
	}

    renderSelectionArrows() {
		this.renderLeftArrow();
        this.renderRightArrow();
	}

    renderLeftArrow() {
        context.save();
		context.translate(CANVAS_WIDTH/2 - 20, CANVAS_HEIGHT/2);
		context.beginPath();
		context.moveTo(this.leftArrowPosition.x, this.leftArrowPosition.y - ShipSelectScreenState.SELECT_ARROW_BASE/2);
		context.lineTo(-ShipSelectScreenState.SELECT_ARROW_HEIGHT, this.leftArrowPosition.y);
		context.lineTo(this.leftArrowPosition.x, this.leftArrowPosition.y + ShipSelectScreenState.SELECT_ARROW_BASE/2);
        context.lineTo(this.leftArrowPosition.x, this.leftArrowPosition.y);
		context.closePath();
		context.fill();
		context.restore();
    }

    renderRightArrow() {
        context.save();
		context.translate(CANVAS_WIDTH/2 + 20, CANVAS_HEIGHT/2);
		context.beginPath();
		context.moveTo(this.rightArrowPosition.x, this.rightArrowPosition.y - ShipSelectScreenState.SELECT_ARROW_BASE/2);
		context.lineTo(ShipSelectScreenState.SELECT_ARROW_HEIGHT, this.rightArrowPosition.y);
		context.lineTo(this.rightArrowPosition.x, this.rightArrowPosition.y + ShipSelectScreenState.SELECT_ARROW_BASE/2);
        context.lineTo(this.rightArrowPosition.x, this.rightArrowPosition.y);
		context.closePath();
		context.fill();
		context.restore();
    }

    resetArrowPositions() {
        this.leftArrowPosition = new Vector(0,0);
        this.rightArrowPosition = new Vector(0,0);
    }
}