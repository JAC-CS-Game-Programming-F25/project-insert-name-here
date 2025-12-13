import State from "../../../lib/State.js";
import PlayerStateName from "../../enums/states/PlayerStateName.js";

export default class PlayerRevivingState extends State {
    constructor(player, animation) {
        super();

        this.player = player;
        this.animation = animation;
    }

    enter() {
        this.player.sprites = this.player.orangeEffectSprites;
        this.player.currentAnimation = this.animation;
    }

    update(dt) {
        console.log("Check player animation.");
        this.checkForRRevived();
    }

    checkForRRevived() {
        if (this.player.currentAnimation.isDone()) {
            this.player.changeState(PlayerStateName.Idle);
        }
    }
}