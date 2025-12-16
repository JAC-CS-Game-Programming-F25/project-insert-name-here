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
import PlayerDyingState from '../states/player/PlayerDyingState.js';
import PlayerRevivingState from '../states/player/PlayerRevivingState.js';
import Input from '../../lib/Input.js';
import Bullet from './Bullet.js';
import BulletType from '../enums/BulletType.js';

export default class Player extends GameEntity {
    static WIDTH = 16;
    static HEIGHT = 16;
    static BASE_FIRE_RATE = 0.3;
    static LASER_THRESHOLD = 100;
    static MAX_LIVES = 1;

    constructor(playState, shipType) {
        super(playState = playState);
        
        this.playstate = playState;
        this.shipType = shipType;
        this.lives = Player.MAX_LIVES;

        this.normalFireRate = Player.BASE_FIRE_RATE;
        this.fireRate = this.normalFireRate;

        this.isHittable = true;

        this.isDead = false;

        this.shipSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Spaceships),
            Player.WIDTH,
            Player.HEIGHT
        );

        this.orangeEffectSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.OrangeEffects),
            Player.WIDTH,
            Player.HEIGHT
        );

        this.idleAnimation = new Animation([shipType], 0);
        this.dyingAnimation = new Animation([139,140,141,142,143,6], 0.1, 1);
        this.revivingAnimation = new Animation([143,142,141,140,139], 0.1, 1);

        this.sprites = this.shipSprites;
        this.currentAnimation = this.idleAnimation;

        this.position = new Vector((CANVAS_WIDTH / 2) - (Player.WIDTH / 2), (CANVAS_HEIGHT / 2) - (Player.HEIGHT / 2));

		this.dimensions.x = Player.WIDTH;
		this.dimensions.y = Player.HEIGHT;

        this.hitboxOffsets = new Hitbox(
            4,
            4,
            -9,
            -9
        );
        
        this.hitbox = new Hitbox(
            this.position.x + this.hitboxOffsets.position.x,
            this.position.y + this.hitboxOffsets.position.y,
            this.dimensions.x + this.hitboxOffsets.dimensions.x,
            this.dimensions.y + this.hitboxOffsets.dimensions.y,
        );

        this.renderPriority = 1;

        this.alpha = 1;
        this.stateMachine = this.initializeStateMachine();
        this.mousePosition = input.getMousePosition();

        this.fireTimer = 0;

        this.isBulletSpreadActive = false;

        // console.log(this.hitbox.position.x);
        // console.log(this.hitbox.position.y);
        // console.log(this.hitbox.dimensions.x);
        // console.log(this.hitbox.dimensions.y);
    }

    render() {
        context.save();
        context.filter = 'grayscale(0%)';
        context.imageSmoothingEnabled = false;

		context.globalAlpha = this.alpha;
        context.translate(this.position.x + this.dimensions.x/2, this.position.y + this.dimensions.y/2);
        context.rotate(this.angle);

		super.render({x: -this.position.x - this.dimensions.x/2, y: -this.position.y - this.dimensions.y/2});

		context.restore();

        if (DEBUG) {
			this.hitbox.render(context);
		}
    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this, this.playstate, this.idleAnimation));
        stateMachine.add(PlayerStateName.Dying, new PlayerDyingState(this, this.dyingAnimation));
        stateMachine.add(PlayerStateName.Reviving, new PlayerRevivingState(this, this.revivingAnimation));
        stateMachine.change(PlayerStateName.Idle);

        return stateMachine;
    }

    activateRapidFire() {
        this.fireRate *= 0.5;
    }

    activateBulletSpread() {
        this.isBulletSpreadActive = true;
    }

    deactivatePlayerAbilities() {
        this.fireRate = this.normalFireRate;
        this.isBulletSpreadActive = false;
    }

    adjustFireRate() {
        this.normalFireRate = (-Player.BASE_FIRE_RATE * (this.playstate.currentLevelValue / Player.LASER_THRESHOLD)) + Player.BASE_FIRE_RATE;
        this.fireRate = this.normalFireRate;
        console.log(this.fireRate);
    }
}