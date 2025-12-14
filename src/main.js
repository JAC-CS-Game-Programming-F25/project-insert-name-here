/**
 * Astral Assault
 *
 * Original by: Aristedes Patelis (6256545@johnabbott.qc.ca)
 *
 * Brief description
 *
 * Asset sources
 */
import Game from '../lib/Game.js';
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	timer,
	sounds,
	stateStack,
} from './globals.js';
import TitleScreenState from './states/game/TitleScreenState.js';

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

const assetDefinition = await fetch('./config/assets.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(assetDefinition.images);
fonts.load(assetDefinition.fonts);
sounds.load(assetDefinition.sounds);

const game = new Game(
	stateStack,
	context,
	timer,
	canvas.width,
	canvas.height
);

// Add all the states to the state machine.
stateStack.push(new TitleScreenState());

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
