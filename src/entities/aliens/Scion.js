import Animation from '../../../lib/Animation.js';
import Alien from './Alien.js';
import Vector from '../../../lib/Vector.js';
import { startTime } from '../../globals.js';

export default class Scion extends Alien {
    constructor(playState) {
        super(playState = playState);

        this.distance = this.calculateDistanceToPlayer();

        this.movementAngle, this.radius = this.calculateDistanceToPlayer();

        this.angleSpeed = this.speed;
        this.radialSpeed = -this.angleSpeed/4;

        this.idleAnimation = new Animation([1], 0);

        this.currentAnimation = this.idleAnimation

        this.points = Alien.SCION_POINTS;
    }

    updateScionPosition(dt) {
        let currentTime = Date.now() - startTime

        let t = 10 - ((currentTime * 2) % 10);

        this.movementAngle = this.angleSpeed * t;
        this.radius -= this.radialSpeed * t;

        this.radius = Math.max(0, this.radius);

        this.position.x = this.radius * Math.cos(this.degreesToRadians(this.movementAngle))
        this.position.y = this.radius * Math.sin(this.degreesToRadians(this.movementAngle))

        if (!this.didGoOffScreen()) {
            this.isHittable = true;
        }

        //console.log(this.position);
    }

    calculateDistanceToPlayer() {
        return Math.sqrt((this.playerPosition.x - this.position.x)**2 + (this.playerPosition.y - this.position.y)**2)
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI/180);
    }
}