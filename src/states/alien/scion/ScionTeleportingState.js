import { getRandomPositiveInteger } from "../../../../lib/Random.js";
import State from "../../../../lib/State.js";
import AlienStateName from "../../../enums/states/AlienStateName.js";
import ScionStateName from "../../../enums/states/ScionStateName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../../globals.js";

export default class ScionTeleportingState extends State {
    static TELEPORT_BOUNDARY = 40;
    
    constructor(scion, animation) {
        super();

        this.scion = scion;
        this.animation = animation;
    }

    enter() {
        this.scion.sprites = this.scion.blueEffectSprites;
        this.scion.currentAnimation = this.animation;
        this.scion.isHittable = false;
    }

    update(dt) {
        this.checkForReappear();
    }

    checkForReappear() {
        if (this.scion.currentAnimation.isDone()) {
            this.teleport();
            this.scion.changeState(ScionStateName.Reappearing);
        }
    }

    teleport() {
        let teleportPath = getRandomPositiveInteger(1,2);

        switch (teleportPath) {
            case 1:
                if (this.scion.position.x <= this.scion.playState.player.position.x) {
                    this.scion.position.x = getRandomPositiveInteger(CANVAS_WIDTH/2 + ScionTeleportingState.TELEPORT_BOUNDARY, (CANVAS_WIDTH - this.scion.position.x));

                    if (this.scion.position.y <= this.scion.playState.player.position.y) {
                        this.scion.position.y -= ScionTeleportingState.TELEPORT_BOUNDARY;
                    }
                    else {
                        this.scion.position.y += ScionTeleportingState.TELEPORT_BOUNDARY;
                    }
                }
                else {
                    this.scion.position.x = getRandomPositiveInteger(this.scion.position.x, CANVAS_WIDTH/2 - ScionTeleportingState.TELEPORT_BOUNDARY);

                    if (this.scion.position.y <= this.scion.playState.player.position.y) {
                        this.scion.position.y -= ScionTeleportingState.TELEPORT_BOUNDARY;
                    }
                    else {
                        this.scion.position.y += ScionTeleportingState.TELEPORT_BOUNDARY;
                    }
                }
                break;
            default:
                if (this.scion.position.y <= this.scion.playState.player.position.y) {
                    this.scion.position.y = getRandomPositiveInteger(CANVAS_HEIGHT/2 + ScionTeleportingState.TELEPORT_BOUNDARY, (CANVAS_HEIGHT - this.scion.position.y));

                    if (this.scion.position.x <= this.scion.playState.player.position.x) {
                        this.scion.position.x -= ScionTeleportingState.TELEPORT_BOUNDARY;
                    }
                    else {
                        this.scion.position.x += ScionTeleportingState.TELEPORT_BOUNDARY;
                    }
                }
                else {
                    this.scion.position.y = getRandomPositiveInteger(this.scion.position.y, CANVAS_HEIGHT/2 - ScionTeleportingState.TELEPORT_BOUNDARY);

                    if (this.scion.position.x <= this.scion.playState.player.position.x) {
                        this.scion.position.x -= ScionTeleportingState.TELEPORT_BOUNDARY;
                    }
                    else {
                        this.scion.position.x += ScionTeleportingState.TELEPORT_BOUNDARY;
                    }
                }
                break;
        }

            
    }
}