import State from "../../../lib/State.js";
import SongName from "../../enums/assets/SongName.js";
import SoundName from "../../enums/assets/SoundName.js";
import PlayerStateName from "../../enums/states/PlayerStateName.js";
import { songs, sounds } from "../../globals.js";

export default class PlayerRevivingState extends State {
    constructor(player, animation) {
        super();

        this.player = player;
        this.animation = animation;
    }

    enter() {
        sounds.play(SoundName.PlayerRevive);
        this.player.sprites = this.player.orangeEffectSprites;
        this.player.currentAnimation = this.animation;
    }

    update(dt) {
        this.checkForRevived();
    }

    checkForRevived() {
        if (this.player.currentAnimation.isDone()) {
            songs.play(SongName.Play);

            this.player.currentAnimation.refresh();
            this.player.changeState(PlayerStateName.Idle);
        }
    }
}