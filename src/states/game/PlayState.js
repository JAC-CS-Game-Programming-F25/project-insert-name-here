import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Alien from "../../entities/aliens/Alien.js";
import Bullet from "../../entities/Bullet.js";
import GameEntity from "../../entities/GameEntity.js";
import Player from "../../entities/Player.js"
import ShipType from "../../enums/PlayerShip.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, stateStack, input } from "../../globals.js";
import GameBackground from "../../objects/Background.js";
import Level from "../../objects/Level.js";
import GameOverState from "./GameOverState.js";
import PauseState from "./PauseState.js";

export default class PlayState extends State {
	static RAPID_FIRE_CHANCE = 5;
	static SHIELD_CHANCE = 2;
	static RAPID_FIRE_DURATION = 6;
	
	constructor(shipType = ShipType.Susie) {
		super();
		
		this.currentLevelValue = 1;

		this.player = new Player(this, shipType);
		this.alien = new Alien(this, this.player.angle);

		this.currentlevel = new Level(this, this.currentLevelValue);

		this.entities = [];
		this.entities.push(this.player);
		//this.entities.push(this.alien);

		this.background = new GameBackground();

		console.log(this.currentlevel.hordes);
	}

	update(dt) {
		// dt /= 2 (Literally how time dilation will work. Wahoo)
		this.checkForPause();

		this.currentlevel.update(dt);
		
		this.entities.forEach((entity) => {
			entity.update(dt);

			if (!(entity instanceof Alien)) {
				entity.didGoOffScreen();
			}

			this.currentlevel.currentHorde.aliens.forEach((alien) => {
				this.currentlevel.currentHorde.manageCollisions(alien, entity)
			});
		});

		this.cleanUpEntities();

		if(this.player.cleanUp) {
			this.gameOver();
		}
		
		super.update(dt);
	}

	render() {
		this.background.render();

		this.entities.forEach((entity) => {
			entity.render();
		});

		this.currentlevel.render();

		super.render();
	}

	pushNewEntity(entity) {
		this.entities.push(entity);
	}

	cleanUpEntities() {
		this.entities = this.entities.filter((entity) => !entity.cleanUp);
	}

	nextLevel() {
		console.log("NEXT LEVEL");

		this.currentLevelValue += 1;
		this.currentlevel = new Level(this, this.currentLevelValue);
	}

	gameOver() {
		console.log("GAME OVER");

		stateStack.pop();
		stateStack.push(new GameOverState(this.background));
	}

	checkForPause() {
		if (input.isKeyPressed(Input.KEYS.ESCAPE)) {
			stateStack.push(new PauseState());
		}
	}

	// manageCollisions(entity1, entity2) {
	// 	if (entity1.didCollideWithEntity(entity2)) {
	// 		if (entity1 instanceof Bullet && entity2 instanceof Alien) {
	// 			entity1.cleanUp = true;
	// 			entity2.cleanUp = true;
	// 		}

	// 		if (entity1 instanceof Player && entity2 instanceof Alien) {
	// 			entity1.cleanUp = true;
	// 			entity2.cleanUp = true;
	// 		}
	// 	}
	// }
}
