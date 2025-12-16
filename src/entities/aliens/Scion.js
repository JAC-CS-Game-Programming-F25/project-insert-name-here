import Animation from '../../../lib/Animation.js';
import Alien from './Alien.js';
import Vector from '../../../lib/Vector.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, startTime } from '../../globals.js';
import { getRandomPositiveInteger } from '../../../lib/Random.js';
import AlienStateName from '../../enums/states/AlienStateName.js';
import AlienIdleState from '../../states/alien/AlienIdleState.js';
import AlienDyingState from '../../states/alien/AlienDyingState.js';
import ScionTeleportingState from '../../states/alien/scion/ScionTeleportingState.js';
import ScionStateName from '../../enums/states/ScionStateName.js';
import ScionReappearingState from '../../states/alien/scion/ScionReappearingState.js';
import StateMachine from '../../../lib/StateMachine.js';

export default class Scion extends Alien {
    static BASE_TELEPORT_WAIT = 2.5;

    constructor(playState) {
        super(playState = playState);

        this.playState = playState;

        this.idleAnimation = new Animation([1], 0);
        this.teleportAnimation = new Animation([190,191,192,6], 0.1, 1);
        this.reappearAnimation = new Animation([6,192,191,190], 0.1, 1);

        this.currentAnimation = this.idleAnimation;

        this.points = Alien.SCION_POINTS;

        this.teleportTimer = Scion.BASE_TELEPORT_WAIT;

        this.stateMachine = this.initializeStateMachine();
    }

    updatePosition(dt) {
        if (!this.didGoOffScreen()) {
            //console.log("Set to hittable.")
            this.isHittable = true;
        }        

        this.position.x += this.trajectory.x * (this.speed * dt);
        this.position.y += this.trajectory.y * (this.speed * dt);

        if (this.teleportTimer <= 0) {
            this.changeState(ScionStateName.Teleporting);
        }

        this.teleportTimer -= dt;
    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(AlienStateName.Idle, new AlienIdleState(this, this.idleAnimation));
        stateMachine.add(ScionStateName.Teleporting, new ScionTeleportingState(this, this.teleportAnimation));
        stateMachine.add(ScionStateName.Reappearing, new ScionReappearingState(this, this.reappearAnimation));
        stateMachine.add(AlienStateName.Dying, new AlienDyingState(this, this.dyingAnimation));
        stateMachine.change(AlienStateName.Idle);

        return stateMachine;
    }
}