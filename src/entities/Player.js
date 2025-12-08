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
import Bullet from './Bullet.js';

export default class Player extends GameEntity {
    static WIDTH = 16;
    static HEIGHT = 16;
    static BASE_FIRE_RATE = 0.3;
    static MAX_LIVES = 3;

    constructor(playState, shipType) {
        super(playState = playState);
        
        this.playstate = playState;
        this.shipType = shipType;
        //this.level = this.playstate.level;
        this.lives = Player.MAX_LIVES;
        this.fireRate = Player.BASE_FIRE_RATE;

        this.shipSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Spaceships),
            Player.WIDTH,
            Player.HEIGHT
        );

        this.alienSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Matriarch),
            Player.WIDTH,
            Player.HEIGHT
        );

        this.orangeEffectSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.OrangeEffects),
            Player.WIDTH,
            Player.HEIGHT
        );

        this.sprites = this.shipSprites;

        this.currentAnimation = new Animation([shipType], 0);

        this.position.x = (CANVAS_WIDTH / 2) - (Player.WIDTH / 2);
		this.position.y = (CANVAS_HEIGHT / 2) - (Player.HEIGHT / 2);
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

        this.alpha = 1;
        this.stateMachine = this.initializeStateMachine();
        this.mousePosition = input.getMousePosition();

        this.fireTimer = 0;

        console.log(this.hitbox.position.x);
        console.log(this.hitbox.position.y);
        console.log(this.hitbox.dimensions.x);
        console.log(this.hitbox.dimensions.y);
    }

    update(dt) {
        this.mousePosition = input.getMousePosition();
        this.angle = Math.atan2(
            this.mousePosition.x - this.position.x,
            -(this.mousePosition.y - this.position.y)
        )

        this.fireTimer -= dt;

        this.checkForShooting();

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

        if (DEBUG) {
			this.hitbox.render(context);
		}
    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(PlayerStateName.Idle, new PlayerIdleState());
        stateMachine.add(PlayerStateName.Shooting, new PlayerShootingState());
        stateMachine.add(PlayerStateName.Dying, new PlayerDyingState());
        stateMachine.add(PlayerStateName.Reviving, new PlayerRevivingState());
        stateMachine.change(PlayerStateName.Idle);

        return stateMachine;
    }

    checkForShooting() {
        if (input.isMouseButtonHeld(Input.MOUSE.LEFT) && this.fireTimer <= 0) {
            console.log("Shoot!");
            console.log(this.playstate);

            let bullet = new Bullet(this.playstate, this)

            this.playstate.pushNewEntity(bullet);

            this.fireTimer = this.fireRate;
        }
    }

    loseLife() {
        this.lives--;
    }
}