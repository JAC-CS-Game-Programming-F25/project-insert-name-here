import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Bullet from "../../entities/Bullet.js";
import Player from "../../entities/Player.js";
import SoundName from "../../enums/assets/SoundName.js";
import BulletType from "../../enums/BulletType.js";
import PlayerStateName from "../../enums/states/PlayerStateName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, input, sounds, timer } from "../../globals.js";

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
        
        //this.checkForMovement(dt);
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

    checkForMovement(dt) {
        if (input.isKeyPressed(Input.KEYS.W)) {
            this.player.position.y -= this.player.speed * dt;

            if (
				this.player.position.y <= 0
			) {
				this.player.position.y =
					0
			}
        }
        else if (input.isKeyPressed(Input.KEYS.A)) {
            this.player.position.x -= this.player.speed * dt;

            if (
				this.player.position.x <= 0
			) {
				this.player.position.x =
					0
			}
        }
        else if (input.isKeyPressed(Input.KEYS.S)) {
            this.player.position.y += this.player.speed * dt;

            if (
				this.player.position.y >= CANVAS_HEIGHT
			) {
				this.player.position.y =
					CANVAS_HEIGHT
			}
        }
        else if (input.isKeyPressed(Input.KEYS.D)) {
            this.player.position.x += this.player.speed * dt;

            if (
				this.player.position.x >= CANVAS_WIDTH
			) {
				this.player.position.x =
					CANVAS_WIDTH
			}
        }
    }

    checkForShooting() {
        if (input.isMouseButtonHeld(Input.MOUSE.LEFT) && this.player.fireTimer <= 0) {
            sounds.play(SoundName.PlayerShoot);

            if (this.player.isBulletSpreadActive) {
                // (Bullet-spread power-up stuff.)
                //this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle, BulletType.Spread));
                this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle + 0.50, BulletType.Spread));
                this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle - 0.50, BulletType.Spread));
                this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle + 0.125, BulletType.Spread)); 
                this.playstate.pushNewEntity(new Bullet(this.playstate, this.player.angle - 0.125, BulletType.Spread));
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