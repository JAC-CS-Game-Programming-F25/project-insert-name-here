import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Alien from "../../entities/aliens/Alien.js";
import Bullet from "../../entities/Bullet.js";
import GameEntity from "../../entities/GameEntity.js";
import Player from "../../entities/Player.js"
import ShipType from "../../enums/PlayerShip.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, stateStack, input, timer, highScoreManager, sounds } from "../../globals.js";
import GameBackground from "../../objects/Background.js";
import Level from "../../objects/Level.js";
import GameOverState from "./GameOverState.js";
import PauseState from "./PauseState.js";
import FontName from "../../enums/assets/FontName.js";
import Colour from "../../enums/assets/ColorName.js";
import LevelTransitionState from "./LevelTransitionState.js";
import SoundName from "../../enums/assets/SoundName.js";
import AbilityType from "../../enums/AbilityType.js";

export default class PlayState extends State {
	static RAPID_FIRE_DURATION = 6;
	static BULLET_SPREAD_DURATION = 6;
	static TIME_DILATION_DURATION = 4;

	static BASE_GAME_SPEED = 1;
	static TIME_DILATION_GAME_SPEED = 0.5;
	
	constructor(shipType, background = new GameBackground()) {
		super();
		
		this.currentLevelValue = 1;

		this.shipType = shipType
		this.player = new Player(this, this.shipType);

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

		this.currentAbility = "";

		//console.log(this.currentlevel.hordes);
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

		this.currentlevel.update(dt);

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
		context.fillText(`Level: ${this.currentLevelValue}`, 5, CANVAS_HEIGHT - 15);
		context.fillText(`Hordes Left: ${this.currentlevel.hordes.length}`, 5, CANVAS_HEIGHT - 5);

		context.textAlign = 'right';
		context.fillStyle = Colour.White;
		context.fillText(`Lives: ${this.player.lives}`, CANVAS_WIDTH - 5, 15);

		context.font = `20px ${FontName.Binary}`;
		switch (this.currentAbility) {
			case AbilityType.RapidFire:
				context.fillStyle = Colour.Black;
				context.fillText(AbilityType.RapidFire, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);
				context.fillStyle = Colour.Cyan;
				context.fillText(AbilityType.RapidFire, CANVAS_WIDTH - 5, CANVAS_HEIGHT - 5);
				break;
			case AbilityType.BulletSpread:
				context.fillStyle = Colour.Black;
				context.fillText(AbilityType.BulletSpread, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);
				context.fillStyle = Colour.HotPink;
				context.fillText(AbilityType.BulletSpread, CANVAS_WIDTH - 5, CANVAS_HEIGHT - 5);
				break;
			case AbilityType.TimeDilation:
				context.fillStyle = Colour.Black;
				context.fillText(AbilityType.TimeDilation, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);
				context.fillStyle = Colour.LimeGreen;
				context.fillText(AbilityType.TimeDilation, CANVAS_WIDTH - 5, CANVAS_HEIGHT - 5);
				break;
			default:
				break;
		}
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

		this.currentLevelValue += 1
		this.currentlevel = new Level(this, this.currentLevelValue);
		stateStack.push(new LevelTransitionState(this.currentLevelValue, this.background, this.shipType, this))
	}

	gameOver() {
		console.log("GAME OVER");

		highScoreManager.update(this.score);

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
		sounds.play(SoundName.RapidFire);

		this.currentAbility = AbilityType.RapidFire
		this.isAbilityActive = true;
		this.abilityTimer = PlayState.RAPID_FIRE_DURATION;
		this.player.activateRapidFire();
	}

	activateBulletSpread() {
		sounds.play(SoundName.Shield);

		this.currentAbility = AbilityType.BulletSpread;
		this.isAbilityActive = true;
		this.abilityTimer = PlayState.BULLET_SPREAD_DURATION;
		this.player.activateBulletSpread();
	}

	activateTimeDilation() {
		sounds.play(SoundName.TimeDilation);

		this.currentAbility = AbilityType.TimeDilation
		this.isAbilityActive = true;
		this.isTimeDilationActive = true;
		this.abilityTimer = PlayState.TIME_DILATION_DURATION;
	}

	deactivateAbilities() {
		this.currentAbility = AbilityType.Default;
		this.isAbilityActive = false;
		this.isTimeDilationActive = false;
		this.player.deactivatePlayerAbilities();
	}
}
