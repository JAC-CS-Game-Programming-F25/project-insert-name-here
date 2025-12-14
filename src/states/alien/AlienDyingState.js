import State from "../../../lib/State.js";
import SoundName from "../../enums/assets/SoundName.js";
import { sounds } from "../../globals.js";

export default class AlienDyingState extends State {
    constructor(alien, animation) {
        super();

        this.alien = alien;
        this.animation = animation;
    }

    enter() {
        sounds.play(SoundName.EnemyDeath);
        this.alien.sprites = this.alien.blueEffectSprites;
        this.alien.currentAnimation = this.animation;
        this.alien.isHittable = false;
    }

    update(dt) {
        this.checkForCleanUp();
    }

    checkForCleanUp() {
        if (this.alien.currentAnimation.isDone()) {
            this.alien.cleanUp = true;
        }
    }
}