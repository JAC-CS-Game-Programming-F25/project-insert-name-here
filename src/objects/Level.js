import SoundName from "../enums/assets/SoundName.js";
import { sounds } from "../globals.js";
import Horde from "./Horde.js";

export default class Level {
    constructor(playstate, levelValue) {
        this.playstate = playstate;
        this.levelValue = levelValue;

        this.hordes = this.intializeHordes();

        this.currentHordeValue = 0;
        this.currentHorde = this.hordes[this.currentHordeValue];
    }

    update(dt) {
        this.checkForNextHorde();

        this.currentHorde.update(dt);
    }

    render() {
        this.currentHorde.render();
    }

    intializeHordes() {
        let hordes = []
        
        for (let h = 0; h < this.levelValue; h++) {
            hordes.push(new Horde(this, this.playstate));
        }

        return hordes;
    }

    checkForNextHorde() {
        if (this.currentHorde.aliens.length <= 0) {
            if (this.currentHordeValue === this.hordes.length - 1) {
                this.playstate.nextLevel();
            }
            else {
                console.log("NEXT HORDE");
                
                sounds.play(SoundName.NextHorde)

                let tempHordes = [...this.hordes];
                tempHordes.reverse();
                tempHordes.pop();
                tempHordes.reverse();

                this.hordes = tempHordes;
                this.currentHorde = this.hordes[this.currentHordeValue];
            }
        }
    }
}