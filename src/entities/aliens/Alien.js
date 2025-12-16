import Animation from '../../../lib/Animation.js';
import Colour from '../../enums/assets/ColorName.js'
import Hitbox from '../../../lib/Hitbox.js';
import Vector from '../../../lib/Vector.js';
import GameEntity from '../GameEntity.js';
import Sprite from '../../../lib/Sprite.js'
import ImageName from '../../enums/assets/ImageName.js';
import StateMachine from '../../../lib/StateMachine.js';
import { 
    context, 
    DEBUG, 
    images, 
    sounds, 
    timer, 
    CANVAS_WIDTH, 
    CANVAS_HEIGHT,
    input,
    keys,
    canvas
} from '../../globals.js';
import AlienStateName from "../../enums/states/AlienStateName.js"
import AlienIdleState from "../../states/alien/AlienIdleState.js";
import AlienDyingState from "../../states/alien/AlienDyingState.js";
import { didSucceedPercentChance, getRandomPositiveInteger } from '../../../lib/Random.js';
import Bullet from '../Bullet.js';

export default class Alien extends GameEntity {
    static WIDTH = 16;
    static HEIGHT = 16;
    static MAX_SPEED = 40;
    static MAX_MATRIARCH_SPEED = 80;    
    static BASE_POINTS = 10;
    static SCION_POINTS = 15;
    static MATRIARCH_POINTS = 30;

    constructor(playState) {
        super(playState = playState);
        
        this.playstate = playState;

        this.isActive = false;

        this.isHittable = false;

        this.isDead = false;

        this.alienSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Aliens),
            Alien.WIDTH,
            Alien.HEIGHT
        );

        this.blueEffectSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.BlueEffects),
            Alien.WIDTH,
            Alien.HEIGHT
        );

        this.idleAnimation = new Animation([0], 0);
        this.dyingAnimation = new Animation([139,140,141,142,143], 0.1, 1);

        this.sprites = this.alienSprites;
        this.currentAnimation = this.idleAnimation;

        this.position = this.initializePosition();

		this.dimensions.x = Alien.WIDTH;
		this.dimensions.y = Alien.HEIGHT;

        this.hitboxOffsets = new Hitbox(
            4,
            4,
            -6,
            -6
        );
        
        this.hitbox = new Hitbox(
            this.position.x + this.hitboxOffsets.position.x,
            this.position.y + this.hitboxOffsets.position.y,
            this.dimensions.x + this.hitboxOffsets.dimensions.x,
            this.dimensions.y + this.hitboxOffsets.dimensions.y,
        );

        this.renderPriority = 2;

        this.stateMachine = this.initializeStateMachine();

        this.playerPosition = this.playstate.player.position;

        this.angle = Math.atan2(
            this.playerPosition.x - this.position.x,
            -(this.playerPosition.y - this.position.y)
        );

        this.trajectory = this.calculateTrajectory();

        this.speed = Alien.MAX_SPEED;

        this.points = Alien.BASE_POINTS;

        this.alpha = 1;
    }

    updatePosition(dt) {
        this.position.x += this.trajectory.x * (this.speed * dt);
        this.position.y += this.trajectory.y * (this.speed * dt);

        if (!this.didGoOffScreen()) {
            //console.log("Set to hittable.")
            this.isHittable = true;
        }

        //console.log(this.position);
    }

    render() {
        context.save();
        context.imageSmoothingEnabled = false;

        context.globalAlpha = this.alpha;
        context.translate(this.position.x + this.dimensions.x/2, this.position.y + this.dimensions.y/2);
        context.rotate(this.angle + Math.PI);

        super.render({x: -this.position.x - this.dimensions.x/2, y: -this.position.y - this.dimensions.y/2});

        context.restore();

        if (DEBUG) {
            this.hitbox.render(context);
        }
    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(AlienStateName.Idle, new AlienIdleState(this, this.idleAnimation));
        stateMachine.add(AlienStateName.Dying, new AlienDyingState(this, this.dyingAnimation));
        stateMachine.change(AlienStateName.Idle);

        return stateMachine;
    }

    initializePosition() { 
        let spawnPosition = getRandomPositiveInteger(1,4);

        if (spawnPosition === 1) {
            return new Vector(-20, getRandomPositiveInteger(0, CANVAS_HEIGHT));
        } else if (spawnPosition === 2) {
            return new Vector(CANVAS_WIDTH + 20, getRandomPositiveInteger(0, CANVAS_HEIGHT));
        } else if (spawnPosition === 3) {
            return new Vector(getRandomPositiveInteger(0, CANVAS_WIDTH), -20);
        } else if (spawnPosition === 4) {
            return new Vector(getRandomPositiveInteger(0, CANVAS_WIDTH), CANVAS_HEIGHT + 20);
        } else {
            return new Vector(-20, getRandomPositiveInteger(0, CANVAS_HEIGHT));
        }
    }

    calculateTrajectory() {
        return new Vector(Math.sin(this.angle), -Math.cos(this.angle));
    }

    /**
	 * @param {GameEntity} entity
	 * @returns Whether this entity's hitbox collided with another using AABB collision detection.
	 */
	didCollideWithEntity(entity) {
        if (this.isHittable) {
            return this.hitbox.didCollide(entity.hitbox);
        }

        return false;
	}
}