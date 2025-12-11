import Alien from "../entities/aliens/Alien.js"
import Player from "../entities/Player.js";
import Bullet from "../entities/Bullet.js";
import Level from "./Level.js"
import PlayState from "../states/game/PlayState.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";

export default class Horde {
    static SPAWN_TIMER = 1.5
    
    constructor(level, playState) {
        this.playState = playState
        this.level = level;
        this.levelValue = level.levelValue;

        this.alienCount = this.levelValue + 4;

        this.aliens = this.initializeAliens()

        this.alienSpawnTimer = 0;
    }

    update(dt) {
        this.alienSpawnTimer -= dt

        this.checkToSpawnNextAlien();

        this.aliens.forEach((alien) => {
            alien.update(dt);
        })

        this.cleanUpAliens();
    }

    render() {
        this.aliens.forEach((alien) => {
            alien.render();
        })
    }

    checkToSpawnNextAlien() {
        let alienSpawned = false
        
        if (this.alienSpawnTimer <= 0) {
            console.log(`Alien Count: ${this.aliens.length}`);

            let index = getRandomPositiveInteger(0, this.aliens.length - 1);

            if (!this.aliens[index].isActive) {
                this.aliens[index].isActive = true;
                alienSpawned = true;
            }

            this.alienSpawnTimer = Horde.SPAWN_TIMER;
        }
    }

    initializeAliens() {
        let aliens = []

        for (let a = 0; a < this.alienCount + 4; a++) {
            aliens.push(new Alien(this.playState));
        }

        return aliens;
    }

    cleanUpAliens() {
        this.aliens = this.aliens.filter((alien) => !alien.cleanUp)
    }

    manageCollisions(alien, entity) {
        if (alien.didCollideWithEntity(entity)) {
            alien.cleanUp = true;
            entity.cleanUp = true;
        }
    }
}