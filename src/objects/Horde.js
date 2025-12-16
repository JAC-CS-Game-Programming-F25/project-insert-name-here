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
    static EVENT_HORIZON = 100;
    static SCION_BASE_CHANCE = 4;
    static MATRIARCH_BASE_CHANCE = 2
    
    static SCION_MAX_CHANCE = 0.5;
    static MATRIARCH_MAX_CHANCE = 0.3;
    
    constructor(level, playState) {
        this.playState = playState
        this.level = level;
        this.levelValue = level.levelValue;

        this.scionChance = Math.min((Horde.SCION_BASE_CHANCE * (this.levelValue + 2))/100, Horde.SCION_MAX_CHANCE);
        this.matriarchChance = Math.min((Horde.MATRIARCH_BASE_CHANCE * (this.levelValue + 2))/100, Horde.MATRIARCH_MAX_CHANCE);

        this.alienCount = this.levelValue + 4;

        this.aliens = this.initializeAliens()

        this.alienSpawnDuration = (-Horde.BASE_SPAWN_DURATION * (this.levelValue / Horde.EVENT_HORIZON)) + Horde.BASE_SPAWN_DURATION;
        this.alienSpawnTimer = 0;

        console.log(this.alienSpawnDuration);
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

            if (this.aliens[index] != undefined && !this.aliens[index].isActive) {
                this.aliens[index].isActive = true;
                alienSpawned = true;
            }

            this.alienSpawnTimer = this.alienSpawnDuration;
        }
    }

    initializeAliens() {
        let aliens = []

        for (let a = 0; a < this.alienCount; a++) {
            if (this.levelValue < 3) {
                aliens.push(new Alien(this.playState));
            }
            else if (this.levelValue >= 3 && this.levelValue < 6) {
                //console.log("Rolling for alien");

                if (didSucceedPercentChance(this.scionChance)) {
                    //console.log("Scion");
                    aliens.push(AlienFactory.createInstance(AlienType.Scion, this.playState));
                }
                else {
                    //console.log("Alien");
                    aliens.push(AlienFactory.createInstance(AlienType.Alien, this.playState));
                }
            }
            else {
                //console.log("Rolling for alien");
                if (didSucceedPercentChance(this.scionChance)) {
                    //console.log("Scion");
                    aliens.push(AlienFactory.createInstance(AlienType.Scion, this.playState));
                }
                else if (didSucceedPercentChance(this.matriarchChance)) {
                    //console.log("Matriarch");
                    aliens.push(AlienFactory.createInstance(AlienType.Matriarch, this.playState));
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