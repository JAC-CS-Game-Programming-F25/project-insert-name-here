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
    input
} from '../globals.js';
import PlayerStateName from '../enums/states/PlayerStateName.js';
import PlayerIdleState from '../states/player/PlayerIdleState.js';
import PlayerShootingState from '../states/player/PlayerShootingState.js';
import PlayerDyingState from '../states/player/PlayerDyingState.js';
import PlayerRevivingState from '../states/player/PlayerRevivingState.js';
import Input from '../../lib/Input.js';


export default class Player extends GameEntity {
    static WIDTH = 16;
    static HEIGHT = 16;
    static BASE_FIRE_RATE = 0.5;
    static MAX_LIVES = 3;

    constructor(playState, shipType) {
        super(playState = playState);
        
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

        this.hitboxOffsets = new Hitbox(
            5,
            5,
            5,
            5
        );

        this.position.x = (CANVAS_WIDTH / 2) - (Player.WIDTH / 2);
		this.position.y = (CANVAS_HEIGHT / 2) - (Player.HEIGHT / 2);
		this.dimensions.x = Player.WIDTH;
		this.dimensions.y = Player.HEIGHT;
        this.alpha = 1;
        this.stateMachine = this.initializeStateMachine();
        this.mousePosition = input.getMousePosition();
    }

    update(dt) {
        this.mousePosition = input.getMousePosition();

        this.angle = Math.atan2(
            this.mousePosition.x - this.position.x,
            -(this.mousePosition.y - this.position.y)
        )

        super.update(dt);
    }

    render() {
        context.fillRect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);

        context.save();
        context.imageSmoothingEnabled = false;

		context.globalAlpha = this.alpha;
        context.translate(this.position.x + this.dimensions.x/2, this.position.y + this.dimensions.y/2);
        context.rotate(this.angle);

		super.render({x: -this.position.x - this.dimensions.x/2, y: -this.position.y - this.dimensions.y/2});

		context.restore();
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

    loseLife() {
        this.lives--;
    }
}