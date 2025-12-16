import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Alien from "../../entities/aliens/Alien.js";
import Bullet from "../../entities/Bullet.js";
import GameEntity from "../../entities/GameEntity.js";
import Player from "../../entities/Player.js";
import ShipType from "../../enums/PlayerShip.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, stateStack, input, timer, highScoreManager, sounds, songs } from "../../globals.js";
import GameBackground from "../../objects/Background.js";
import Level from "../../objects/Level.js";
import GameOverState from "./GameOverState.js";
import PauseState from "./PauseState.js";
import FontName from "../../enums/assets/FontName.js";
import Colour from "../../enums/assets/ColorName.js";
import LevelTransitionState from "./LevelTransitionState.js";
import SoundName from "../../enums/assets/SoundName.js";
import AbilityType from "../../enums/AbilityType.js";
import UserInterface from "../../services/UserInterface.js";
import SongName from "../../enums/assets/SongName.js";

export default class PlayState extends State {
	static RAPID_FIRE_DURATION = 6;
	static BULLET_SPREAD_DURATION = 6;
	static TIME_DILATION_DURATION = 4;

	static BASE_GAME_SPEED = 1;
	static TIME_DILATION_GAME_SPEED = 0.5;
	
	constructor(shipType, background = new GameBackground()) {
		super();
		
		this.currentLevelValue = 1;

		this.userInterface = new UserInterface(this);

		this.shipType = shipType
		this.player = new Player(this, this.shipType);

		this.currentlevel = new Level(this, this.currentLevelValue);

		this.entities = [];
		this.entities.push(this.player);
		//this.entities.push(this.alien);

		this.score = 0;

		this.isAbilityActive = false;
		this.abilityTimer = 0;

		this.isTimeDilationActive = false;

		this.background = background;

		this.currentAbility = "";

		//console.log(this.currentlevel.hordes);
	}
 
	enter() {
		songs.play(SongName.Play);
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

			entity.didGoOutOfBounds();

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
			if (!(entity instanceof Player)) {
				entity.render();
			}
		});

		this.player.render();

		this.currentlevel.render();

		this.userInterface.render();

		super.render();
	}

	pushNewEntity(entity) {
		this.entities.push(entity);
	}

	cleanUpEntities() {
		this.entities = this.entities.filter((entity) => !entity.cleanUp);
	}

	cleanUpBullets() {
		this.entities = this.entities.filter((entity) => !(entity instanceof Bullet))
	}

	nextLevel() {
		console.log("NEXT LEVEL");

		if (this.isAbilityActive) {
			this.deactivateAbilities();
		}
		
		this.player.adjustFireRate();

		this.currentLevelValue += 1
		this.currentlevel = new Level(this, this.currentLevelValue);
		stateStack.push(new LevelTransitionState(this.currentLevelValue, this.background, this.shipType, this))
		this.cleanUpBullets();
	}

	gameOver() {
		songs.stop(SongName.Play);
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
		if (this.abilityTimer <= 0 && this.isAbilityActive == true) {
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
		sounds.play(SoundName.AbilityDeactivate);

		this.currentAbility = AbilityType.Default;
		this.isAbilityActive = false;
		this.isTimeDilationActive = false;
		this.player.deactivatePlayerAbilities();
	}
}
