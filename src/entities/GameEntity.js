import Colour from '../enums/assets/ColorName.js'
import Hitbox from '../../lib/Hitbox.js';
import Vector from '../../lib/Vector';

export default class GameEntity {
	static WIDTH = 16;
	static HEIGHT = 16;

	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {object} entityDefinition
	 */
	constructor() {
		this.position = new Vector();
		this.canvasPosition = new Vector();
		this.dimensions = new Vector();
		this.hitbox = new Hitbox();
		this.stateMachine = null;
		this.currentFrame = 0;
        this.speed = 0;
        this.isDead = false;
		this.sprites = [];
	}

	/**
	 * At this time, stateMachine will be null for Pokemon.
	 */
	update(dt) {
		this.stateMachine?.update(dt);
	}

	render(x, y) {
		this.stateMachine?.render();
		this.sprites[this.currentFrame].render(x, y);
	}

	changeState(state, params) {
		this.stateMachine?.change(state, params);
	}

    didCollideWithEntity(GameEntity entity) {

    }
}