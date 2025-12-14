import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Bullet from "../../entities/Bullet.js";
import Player from "../../entities/Player.js";
import SoundName from "../../enums/assets/SoundName.js";
import BulletType from "../../enums/BulletType.js";
import PlayerStateName from "../../enums/states/PlayerStateName.js";
import { input, sounds } from "../../globals.js";

export default class PlayerIdleState extends State {
    constructor(player, playstate, animation) {
        super();

        this.player = player;
        this.playstate = playstate;
        this.animation = animation;
    }

    enter() {
        this.player.sprites = this.player.shipSprites;
        this.player.currentAnimation = this.animation;
        this.player.isHittable = true;
        this.player.isDead = false;
    }

    update(dt) {
        this.player.mousePosition = input.getMousePosition();

        if (!this.player.isDead) {
            this.player.angle = this.updateAngle();
        }

        this.player.fireTimer -= dt;
        
        this.checkForShooting();
        this.checkForDying();
    }

    updateAngle() {
        // NOTE: Due to the angle being measured in radians, you can flip it by adding or subtracting pi.
        // This allow for aiming the ship from the back.
        return Math.atan2(
            this.player.mousePosition.x - this.player.position.x,
            -(this.player.mousePosition.y - this.player.position.y)
        ) - Math.PI;
    }

    checkForDying() {
        if (this.player.isDead) {
            this.loseLife();
        }
    }

    checkForShooting() {
        if (input.isMouseButtonHeld(Input.MOUSE.LEFT) && this.player.fireTimer <= 0) {
            sounds.play(SoundName.PlayerShoot);

            if (this.player.isBulletSpreadActive) {
                // (Bullet-spread power-up stuff. Hell yeah)
                this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle, BulletType.Spread));
                this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle + 0.3, BulletType.Spread)); 
                this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle - 0.3, BulletType.Spread));
            }
            else if (this.player.fireRate != this.player.normalFireRate) {
                this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle, BulletType.RapidFire));
            }
            else if (this.playstate.isTimeDilationActive) {
                this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle, BulletType.TimeDilation));
            }
            else {
                this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle, BulletType.Standard));
            }

            this.player.fireTimer = this.player.fireRate;
        }
    }

    loseLife() {
        console.log(this.player.lives);
        this.player.lives--;
        this.player.changeState(PlayerStateName.Dying);
    }
}