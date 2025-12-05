import Fonts from '../lib/Fonts.js';
import Images from '../lib/Images.js';
import Sounds from '../lib/Sounds.js';
import StateStack from '../lib/StateStack.js';
import Timer from '../lib/Timer.js';
import Input from '../lib/Input.js';
import AlienFactory from './services/AlienFactory.js'

export const canvas = document.createElement('canvas');
export const context =
	canvas.getContext('2d') || new CanvasRenderingContext2D();
const assetDefinition = await fetch('./config/assets.json').then((response) =>
	response.json()
);

// Replace these values according to how big you want your canvas.
export const CANVAS_WIDTH = 240;
export const CANVAS_HEIGHT = 180;

const resizeCanvas = () => {
	const scaleX = window.innerWidth / CANVAS_WIDTH;
	const scaleY = window.innerHeight / CANVAS_HEIGHT;
	const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

	canvas.style.width = `${CANVAS_WIDTH * scale}px`;
	canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
};

// Listen for canvas resize events
window.addEventListener('resize', resizeCanvas);

resizeCanvas(); // Call once to scale initially

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateStack = new StateStack();
export const timer = new Timer();
export const input = new Input(canvas);
export const sounds = new Sounds();

export const alienFactory = new AlienFactory();

// If true, render all hitboxes.
export const DEBUG = true;
