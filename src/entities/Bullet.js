import Animation from '../../lib/Animation.js';
import Hitbox from '../../lib/Hitbox.js';
import Vector from '../../lib/Vector.js';
import GameEntity from './GameEntity.js';
import Sprite from '../../lib/Sprite.js'
import ImageName from '../enums/assets/ImageName.js';
import { 
    context, 
    DEBUG, 
    images, 
    sounds, 
    timer, 
    CANVAS_WIDTH, 
    CANVAS_HEIGHT,
    input,
} from '../globals.js';
import Player from './Player.js';

export default class Bullet extends GameEntity {
    static WIDTH = 5;
    static HEIGHT = 5;
    static MAX_SPEED = 250;

    constructor(playState, angle, bulletType = 1) {
        super(playState = playState);

        this.playstate = playState;

        this.bulletSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Projectiles),
            Bullet.WIDTH,
            Bullet.HEIGHT
        );

        this.bulletType = bulletType;

        this.sprites = this.bulletSprites;

        this.currentAnimation = new Animation([bulletType], 0);

        this.position.x = this.playstate.player.position.x + (Player.WIDTH/2) - (Bullet.WIDTH / 2);
		this.position.y = this.playstate.player.position.y + (Player.HEIGHT/2)  - (Bullet.HEIGHT / 2);

		this.dimensions.x = Bullet.WIDTH;
		this.dimensions.y = Bullet.HEIGHT;

        this.hitbox = new Hitbox(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y
        );

        this.renderPriority = 3;

        this.angle = angle;
        this.trajectory = this.calculateTrajectory();

        this.speed = Bullet.MAX_SPEED;

        this.alpha = 1;
        this.mousePosition = input.getMousePosition();

        //console.log(this.trajectory);
    }

    update(dt) {
        this.updatePosition(dt);

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

    calculateTrajectory() {
        return new Vector(Math.sin(this.angle), -Math.cos(this.angle));
    }

    updatePosition(dt) {
        this.position.x += this.trajectory.x * (this.speed * dt);
        this.position.y += this.trajectory.y * (this.speed * dt);
    }

    didGoOffOutOfBounds() {
		if (this.position.x < -10 || this.position.x > CANVAS_WIDTH + 10 && 
			this.position.y < -10 || this.position.y > CANVAS_HEIGHT + 10
		) {
			this.cleanUp = true;
		}
	}
}