import Animation from '../../lib/Animation.js';
import Colour from '../enums/assets/ColorName.js'
import Hitbox from '../../lib/Hitbox.js';
import Vector from '../../lib/Vector.js';
import GameEntity from './GameEntity.js';
import Sprite from '../../lib/Sprite.js'
import ImageName from '../enums/assets/ImageName.js';
import StateMachine from '../../lib/StateMachine.js';
import { 
    context, 
    DEBUG, 
    images, 
    sounds, 
    timer, 
    CANVAS_WIDTH, 
    CANVAS_HEIGHT,
    input,
    keys
} from '../globals.js';
import PlayerStateName from '../enums/states/PlayerStateName.js';
import PlayerIdleState from '../states/player/PlayerIdleState.js';
import PlayerShootingState from '../states/player/PlayerShootingState.js';
import PlayerDyingState from '../states/player/PlayerDyingState.js';
import PlayerRevivingState from '../states/player/PlayerRevivingState.js';
import Input from '../../lib/Input.js';
import BulletStateName from '../enums/states/BulletStateName.js';

export default class Bullet extends GameEntity {
    static WIDTH = 5;
    static HEIGHT = 5;
    static MAX_SPEED = 250;

    constructor(playState, player, angle) {
        super(playState = playState);

        this.bulletSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Projectiles),
            Bullet.WIDTH,
            Bullet.HEIGHT
        );

        this.sprites = this.bulletSprites;

        this.currentAnimation = new Animation([0], 0);

        this.player = player;

        this.position.x = (CANVAS_WIDTH / 2) - (Bullet.WIDTH / 2);
		this.position.y = (CANVAS_HEIGHT / 2) - (Bullet.HEIGHT / 2);
		this.dimensions.x = Bullet.WIDTH;
		this.dimensions.y = Bullet.HEIGHT;

        this.hitbox = new Hitbox(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y
        );

        this.stateMachine = this.initializeStateMachine();

        this.angle = angle;
        this.trajectory = this.calculateTrajectory();

        this.speed = Bullet.MAX_SPEED;

        this.alpha = 1;
        this.mousePosition = input.getMousePosition();

        //console.log(this.trajectory);
    }

    update(dt) {
        this.updatePosition(dt);
        
        if (!this.cleanUp) {
            console.log({x: this.position.x, y: this.position.y});
        }

        super.update(dt);
    }

    render() {
        context.save();
        context.imageSmoothingEnabled = false;

		context.globalAlpha = this.alpha;
        context.translate(this.position.x + this.dimensions.x/2, this.position.y + this.dimensions.y/2);
        context.rotate(this.angle);

		super.render({x: -this.position.x - this.dimensions.x/2, y: -this.position.y - this.dimensions.y/2});

		context.restore();

        super.render(this.position.x, this.position.y);

        if (DEBUG) {
			this.hitbox.render(context);
		}
    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(BulletStateName.Idle, new PlayerIdleState());
        stateMachine.change(BulletStateName.Idle);

        return stateMachine;
    }

    calculateTrajectory() {
        return new Vector(Math.sin(this.angle), -Math.cos(this.angle));
    }

    updatePosition(dt) {
        this.position.x += this.trajectory.x * (this.speed * dt);
        this.position.y += this.trajectory.y * (this.speed * dt);
    }
}