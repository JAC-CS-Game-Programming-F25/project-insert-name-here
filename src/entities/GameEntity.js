import Colour from '../enums/assets/ColorName.js'
import Hitbox from '../../lib/Hitbox.js';
import Vector from '../../lib/Vector.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, DEBUG } from '../globals.js';

export default class GameEntity {
	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {object} entityDefinition
	 */
	constructor(entityDefinition = {}, playstate) {
		this.playstate = playstate
		this.position = entityDefinition.position ?? new Vector();
		this.dimensions = entityDefinition.dimensions ?? new Vector();
		this.canvasPosition = entityDefinition.canvasPosition ?? new Vector();
		this.hitboxOffsets = entityDefinition.hitboxOffsets ?? new Hitbox();
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
		this.stateMachine = null;
		this.currentAnimation = null;
		this.currentFrame = 0;
		this.sprites = [];
        this.speed = 0;
        this.isDead = false;
		this.cleanUp = false;
		this.renderPriority = 0;
		this.angle = 0;
		this.angleInDegrees = 0;
	}

	/**
	 * At this time, stateMachine will be null for Pokemon.
	 */
	update(dt) {
		if (!this.cleanUp) {
			this.stateMachine.update(dt);
			this.currentAnimation.update(dt);
			this.hitbox.set(
				this.position.x + this.hitboxOffsets.position.x,
				this.position.y + this.hitboxOffsets.position.y,
				this.dimensions.x + this.hitboxOffsets.dimensions.x,
				this.dimensions.y + this.hitboxOffsets.dimensions.y,
			);

			this.didGoOffScreen();
		}
	}

	render(offset = { x: 0, y: 0 }) {
		if (!this.cleanUp) {
			const x = this.position.x + offset.x;
			const y = this.position.y + offset.y;

			this.stateMachine.render();
			this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));
		}
	}

	changeState(state, params) {
		this.stateMachine?.change(state, params);
	}

	didGoOffScreen() {
		if (this.position.x < -10 || this.position.x > CANVAS_WIDTH + 10 && 
			this.position.y < -10 || this.position.y > CANVAS_HEIGHT + 10
		) {
			this.cleanUp = true;
		}
	}

    /**
	 * @param {Hitbox} hitbox
	 * @returns Whether this hitbox collided with another using AABB collision detection.
	 */
	didCollideWithEntity(hitbox) {
		return this.hitbox.didCollide(hitbox);
	}
}