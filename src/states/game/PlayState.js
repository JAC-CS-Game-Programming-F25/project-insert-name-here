import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Player from "../../entities/Player.js"
import ShipType from "../../enums/PlayerShip.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";

export default class PlayState extends State {
	static RAPID_FIRE_CHANCE = 5;
	static SHIELD_CHANCE = 2;
	static RAPID_FIRE_DURATION = 6;
	
	constructor(shipType = ShipType.Susie) {
		super();
		
		this.currentLevelValue = 1;
		this.player = new Player(this, shipType);
	}

	update(dt) {
		this.player.update(dt);
		
		super.update(dt);
	}

	render() {
		this.player.render();
		super.render();
	}
}
