import Animation from '../../../lib/Animation.js';
import Alien from './Alien.js';

export default class Matriarch extends Alien {
    constructor(playState) {
        super(playState = playState);

        this.idleAnimation = new Animation([2], 0);

        this.currentAnimation = this.idleAnimation;

        this.points = Alien.MATRIARCH_POINTS;

        this.speed = Alien.MAX_MATRIARCH_SPEED;

        this.angle += Math.PI/2;
        this.trajectory = this.calculateTrajectory();
    }

    updatePosition(dt) {
        if (!this.didGoOffScreen()) {
            //console.log("Set to hittable.")
            this.isHittable = true;
        }        

        this.position.x += this.trajectory.x * (this.speed * dt);
        this.position.y += this.trajectory.y * (this.speed * dt);

        this.recalculateAngleAndTrajectory();
    }

    recalculateAngleAndTrajectory() {
        this.angle = Math.atan2(
            this.playerPosition.x - this.position.x,
            -(this.playerPosition.y - this.position.y)
        );

        this.angle += Math.PI/2 - 0.2;

        this.trajectory = this.calculateTrajectory();
    }
}