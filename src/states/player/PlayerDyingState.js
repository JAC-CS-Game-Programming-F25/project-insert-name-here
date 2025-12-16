import State from "../../../lib/State.js";
import SongName from "../../enums/assets/SongName.js";
import SoundName from "../../enums/assets/SoundName.js";
import PlayerStateName from "../../enums/states/PlayerStateName.js";
import { songs, sounds, timer } from "../../globals.js";

export default class PlayerDyingState extends State {
    static DEAD_DURATION = 2;
    
    constructor(player, animation) {
        super();

        this.player = player;
        this.animation = animation;

        this.deadTimer = PlayerDyingState.DEAD_DURATION;
    }

    enter() {
        songs.pause(SongName.Play);
        sounds.play(SoundName.PlayerDeath);
        this.player.sprites = this.player.orangeEffectSprites;
        this.player.currentAnimation = this.animation;
        this.player.isHittable = false;
    }

    update(dt) {
        //console.log("Check player animation.");
        this.checkForCleanUp();

        this.deadTimer -= dt
    }

    checkForCleanUp() {
        if (this.player.currentAnimation.isDone()) {
            if (this.deadTimer <= 0) {
                if (this.checkForGameOver()) {
                     this.player.cleanUp = true;
                }

                this.deadTimer = PlayerDyingState.DEAD_DURATION;
                this.player.currentAnimation.refresh();
                this.player.changeState(PlayerStateName.Reviving);
            }
        }
    }

    checkForGameOver() {
        if (this.player.lives <= 0) {
            return true;
        }

        return false;
    }
}