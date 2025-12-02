import Colour from '../enums/assets/ColorName.js'
import Hitbox from '../../lib/Hitbox.js';
import Vector from '../../lib/Vector';
import GameEntity from './GameEntity.js';
import Sprite from '../../lib/Sprite.js'
import ImageName from '../enums/assets/ImageName.js';
import StateMachine from '../../lib/StateMachine.js';
import { context, DEBUG, images, sounds, stateMachine, timer } from '../globals.js';
import PlayerStateName from '../enums/states/PlayerStateName.js';
import PlayerIdleState from '../states/player/PlayerIdleState.js';
import PlayerShootingState from '../states/player/PlayerShootingState.js';
import PlayerDyingState from '../states/player/PlayerDyingState.js';
import PlayerRevivingState from '../states/player/PlayerRevivingState.js';


export default class Player extends GameEntity {
    static WIDTH = 16;
    static HEIGHT = 16;
    static BASE_FIRE_RATE = 0.5;
    static MAX_LIVES = 3;

    constructor(shipType) {
        super();
        
        this.shipType = shipType;
        this.level = this.playstate.level;
        this.lives = Player.MAX_LIVES;
        this.fireRate = Player.BASE_FIRE_RATE;
        this.angle = 0;

        this.shipSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.SpaceShips),
            Player.WIDTH,
            Player.HEIGHT
        );

        this.orangeEffectSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.OrangeEffects),
            Player.WIDTH,
            Player.HEIGHT
        );

        this.sprites = this.shipSprites;
        this.currentFrame = shipType;

        this.hitboxOffsets = new Hitbox(
            5,
            5,
            5,
            5
        );

        this.position.x = Room.CENTER_X - Player.WIDTH / 2;
		this.position.y = Room.CENTER_Y - Player.HEIGHT / 2;
		this.dimensions.x = Player.WIDTH;
		this.dimensions.y = Player.HEIGHT;
        this.alpha = 1;
        this.stateMachine = this.initializeStateMachine();
    }

    render() {
        context.save();

		context.globalAlpha = this.alpha;

		super.render(this.positionOffset);

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