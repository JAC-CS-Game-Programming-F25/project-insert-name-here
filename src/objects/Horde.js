import Alien from "../entities/aliens/Alien.js"
import Player from "../entities/Player.js";
import Bullet from "../entities/Bullet.js";
import Level from "./Level.js"
import PlayState from "../states/game/PlayState.js";
import { didSucceedPercentChance, getRandomPositiveInteger, oneInXChance } from "../../lib/Random.js";
import AlienType from "../enums/AlienType.js";
import AlienFactory from "../services/AlienFactory.js";

export default class Horde {
    static BASE_SPAWN_DURATION = 1.5;
    
    constructor(level, playState) {
        this.playState = playState
        this.level = level;
        this.levelValue = level.levelValue;

        this.scionSpawnBaseChance = 4;

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
            //console.log(`Alien Count: ${this.aliens.length}`);

            let index = getRandomPositiveInteger(0, this.aliens.length - 1);

            if (!this.aliens[index].isActive) {
                this.aliens[index].isActive = true;
                alienSpawned = true;
            }

            this.alienSpawnTimer = Horde.BASE_SPAWN_DURATION;
        }
    }

    initializeAliens() {
        let aliens = []
        let scionChance = (this.scionSpawnBaseChance * (this.levelValue + 2))/100;

        if (this.levelValue  < 3) {
            for (let a = 0; a < this.alienCount; a++) {
                aliens.push(new Alien(this.playState));
            }
        }
        else {
            for (let a = 0; a < this.alienCount; a++) {
                //console.log("Rolling for alien");

                if (didSucceedPercentChance(scionChance)) {
                    //console.log("Scion");
                    aliens.push(AlienFactory.createInstance(AlienType.Scion, this.playState));
                }
                else {
                    //console.log("Alien");
                    aliens.push(AlienFactory.createInstance(AlienType.Alien, this.playState));
                }
            }
        }

        return aliens;
    }

    cleanUpAliens() {
        this.aliens = this.aliens.filter((alien) => !alien.cleanUp)
    }

    manageCollisions(alien, entity) {
        if (alien.didCollideWithEntity(entity) && entity instanceof Bullet) {
            alien.isDead = true;
            entity.cleanUp = true;

            this.increaseScore(alien.points);

            if (!this.playState.isAbilityActive) {
                this.rollForAbility();
            }
        }
        else if (alien.didCollideWithEntity(entity) && entity instanceof Player) {
            alien.isDead = true;
            entity.isDead = true;

            if (alien.cleanUp) {
                entity.loseLife();
            }
        }
    }

    increaseScore(points) {
        this.playState.score += points;
    }

    rollForAbility() {
        if (didSucceedPercentChance(0.05)) {
            this.playState.activateRapidFire();
        }
        else if (didSucceedPercentChance(0.05)) {
            this.playState.activateBulletSpread();
        }
        else if (didSucceedPercentChance(0.05)) {
            this.playState.activateTimeDilation();
        }
    }
}