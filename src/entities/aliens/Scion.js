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

export default class Scion extends Alien {
    constructor(playState) {
        super(playState = playState);

        this.idleAnimation = new Animation([1], 0);

        this.currentAnimation = this.idleAnimation
    }

    updatePosition(dt) {
        this.position.x += this.trajectory.x * (this.speed * dt);
        this.position.y += this.trajectory.y * (this.speed * dt);

        if (!this.didGoOffScreen()) {
            this.isHittable = true;
        }

        //console.log(this.position);
    }
}