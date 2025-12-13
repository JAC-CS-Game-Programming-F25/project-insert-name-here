import State from "../../../lib/State.js";

export default class AlienDyingState extends State {
    constructor(alien, animation) {
        super();

        this.alien = alien;
        this.animation = animation;
    }

    enter() {
        this.alien.sprites = this.alien.blueEffectSprites;
        this.alien.currentAnimation = this.animation;
        this.alien.isHittable = false;
    }

    update(dt) {
        console.log("Check alien animation.");
        this.checkForCleanUp();
    }

    checkForCleanUp() {
        if (this.alien.currentAnimation.isDone()) {
            this.alien.cleanUp = true;
        }
    }
}