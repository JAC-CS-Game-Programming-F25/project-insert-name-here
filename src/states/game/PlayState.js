import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import GameEntity from "../../entities/GameEntity.js";
import Player from "../../entities/Player.js"
import ShipType from "../../enums/PlayerShip.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT, context } from "../../globals.js";
import GameBackground from "../../objects/Background.js";

export default class PlayState extends State {
	static RAPID_FIRE_CHANCE = 5;
	static SHIELD_CHANCE = 2;
	static RAPID_FIRE_DURATION = 6;
	
	constructor(shipType = ShipType.Susie) {
		super();
		
		this.currentLevelValue = 1;

		this.player = new Player(this, shipType);

		this.entities = [];
		this.entities.push(this.player);

		this.background = new GameBackground();
	}

	update(dt) {
		this.entities.forEach((entity) => {
			entity.update(dt);
		})

		this.cleanUpEntities();
		
		super.update(dt);
	}

	render() {
		this.background.render();
		this.player.render();
		super.render();
	}

	pushNewEntity(entity) {
		this.entities.push(entity);
	}

	cleanUpEntities() {
		this.entities.filter((entity) => !entity.cleanUp);
	}
}
