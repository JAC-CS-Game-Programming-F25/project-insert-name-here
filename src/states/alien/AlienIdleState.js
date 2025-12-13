import State from "../../../lib/State.js";
import AlienStateName from "../../enums/states/AlienStateName.js";

export default class AlienIdleState extends State {
    constructor(alien, animation) {
        super();

        this.alien = alien;
        this.animation = animation;
    }

    enter() {
        this.alien.sprites = this.alien.alienSprites;
        this.alien.currentAnimation = this.animation;
    }

    update(dt) {
        if (this.alien.isActive && !this.alien.isDead && !this.alien.playstate.player.isDead) {
            this.alien.updatePosition(dt);
        }

        this.checkForDying();
    }

    checkForDying() {
        if (this.alien.isDead) {
            this.alien.changeState(AlienStateName.Dying);
        }
    }
}