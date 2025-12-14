import Alien from "../entities/aliens/Alien.js";
import Scion from "../entities/aliens/Scion.js";
import AlienType from "../enums/AlienType.js";

export default class AlienFactory {
    /**
	 * Encapsulates the instantiation logic for creating aliens.
	 * This method should be extended when adding new aliens.
	 *
	 * @param {object} type Uses the AlienType enum.
	 * @returns An instance of a Alien.
	 */
    static createInstance(type, playState) {
		switch (type) {
			case AlienType.Alien:
				return new Alien(playState);
			case AlienType.Scion:
				return new Scion(playState);
		}
	}
}