import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Alien from "../../entities/aliens/Alien.js";
import Bullet from "../../entities/Bullet.js";
import GameEntity from "../../entities/GameEntity.js";
import Player from "../../entities/Player.js"
import ShipType from "../../enums/PlayerShip.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, stateStack, input, timer } from "../../globals.js";
import GameBackground from "../../objects/Background.js";
import Level from "../../objects/Level.js";
import GameOverState from "./GameOverState.js";
import PauseState from "./PauseState.js";
import FontName from "../../enums/assets/FontName.js";
import Colour from "../../enums/assets/ColorName.js";
import LevelTransitionState from "./LevelTransitionState.js";

export default class PlayState extends State {
	static RAPID_FIRE_DURATION = 6;
	static BULLET_SPREAD_DURATION = 6;
	static TIME_DILATION_DURATION = 4;

	static BASE_GAME_SPEED = 1;
	static TIME_DILATION_GAME_SPEED = 0.5;
	
	constructor(shipType = ShipType.Susie, background = new GameBackground()) {
		super();
		
		this.currentLevelValue = 1;

		this.player = new Player(this, shipType);
		this.alien = new Alien(this, this.player.angle);

		this.currentlevel = new Level(this, this.currentLevelValue);

		this.entities = [];
		this.entities.push(this.player);
		//this.entities.push(this.alien);

		this.score = 0;

		this.isAbilityActive = false;
		this.abilityTimer = 0;
		this.abilityDuration = 0;

		this.isTimeDilationActive = false;

		this.background = background;

		console.log(this.currentlevel.hordes);
	}

	update(dt) {		
		let base_dt = dt;
		
		if (this.isTimeDilationActive) {
			dt *= PlayState.TIME_DILATION_GAME_SPEED;
		}
		else {
			dt *= PlayState.BASE_GAME_SPEED;
		}

		if(this.isAbilityActive) {
			this.abilityTimer -= dt;
		}
		
		this.checkForPause();
		this.checkForAbilityEnd();

		this.background.update(dt);

		this.currentlevel.update(dt);

		this.entities.forEach((entity) => {
			if (entity instanceof Player) {
				entity.update(base_dt);
			}
			else {
				entity.update(dt);
			}

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
		if (this.isTimeDilationActive) {
			context.filter = 'grayscale(50%)';
		}
		else {
			context.filter = 'grayscale(0%)';
		}
		
		this.background.render();

		this.entities.forEach((entity) => {


			entity.render();
		});

		this.currentlevel.render();

		this.renderStats();

		super.render();
	}

	renderStats() {
		context.font = `10px ${FontName.Pixellari}`;
		context.textAlign = 'left';
		context.fillStyle = Colour.White;
		context.fillText(`Score: ${this.score}`, 5, 15);
		context.fillText(`Level: ${this.currentLevelValue}`, 5, CANVAS_HEIGHT - 5);

		context.font = `10px ${FontName.Pixellari}`;
		context.textAlign = 'right';
		context.fillStyle = Colour.White;
		context.fillText(`Lives: ${this.player.lives}`, CANVAS_WIDTH - 5, 15);
	}

	pushNewEntity(entity) {
		this.entities.push(entity);
	}

	cleanUpEntities() {
		this.entities = this.entities.filter((entity) => !entity.cleanUp);
	}

	nextLevel() {
		console.log("NEXT LEVEL");
		this.deactivateAbilities();

		this.currentlevel = new Level(this, this.currentLevelValue);
		stateStack.push(new LevelTransitionState(this.currentLevelValue + 1, this.background, this.shipType, this))
	}

	gameOver() {
		console.log("GAME OVER");

		stateStack.pop();
		stateStack.push(new GameOverState(this.shipType, this.background));
	}

	checkForPause() {
		if (input.isKeyPressed(Input.KEYS.ESCAPE)) {
			stateStack.push(new PauseState());
		}
	}

	checkForAbilityEnd() {
		if (this.abilityTimer <= 0) {
			this.isAbilityActive = false;
			this.deactivateAbilities();
		}
	}

	activateRapidFire() {
		this.isAbilityActive = true;
		this.abilityTimer = PlayState.RAPID_FIRE_DURATION;
		this.player.activateRapidFire();
		console.log("RAPID FIRE");
	}

	activateBulletSpread() {
		this.isAbilityActive = true;
		this.abilityTimer = PlayState.BULLET_SPREAD_DURATION;
		this.player.activateBulletSpread();
		console.log("BULLET SPREAD");
	}

	activateTimeDilation() {
		this.isAbilityActive = true;
		this.isTimeDilationActive = true;
		this.abilityTimer = PlayState.TIME_DILATION_DURATION;
		console.log("TIME DILATION");
	}

	deactivateAbilities() {
		console.log("ABILITY END");
		
		this.isAbilityActive = false;
		this.isTimeDilationActive = false;
		this.player.deactivatePlayerAbilities();
	}
}
