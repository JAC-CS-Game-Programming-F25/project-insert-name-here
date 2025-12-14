import State from "../../../../lib/State.js";
import Scion from "../../../entities/aliens/Scion.js";
import AlienStateName from "../../../enums/states/AlienStateName.js";
import ScionStateName from "../../../enums/states/ScionStateName.js";

export default class ScionReappearingState extends State {
    constructor(scion, animation) {
        super();

        this.scion = scion;
        this.animation = animation;
    }

    enter() {
        this.scion.sprites = this.scion.blueEffectSprites;
        this.scion.currentAnimation = this.animation;
    }

    update(dt) {
        this.checkForIdle();
    }

    checkForIdle() {
        if (this.scion.currentAnimation.isDone()) {
            this.scion.isHittable = true;
            this.scion.teleportTimer = Scion.BASE_TELEPORT_WAIT;
            this.adjustTrajectory();
            this.scion.changeState(AlienStateName.Idle);
        }
    }

    adjustTrajectory() {
        this.scion.angle = Math.atan2(
            this.scion.playerPosition.x - this.scion.position.x,
            -(this.scion.playerPosition.y - this.scion.position.y)
        );

        this.scion.trajectory = this.scion.calculateTrajectory();
    }
}