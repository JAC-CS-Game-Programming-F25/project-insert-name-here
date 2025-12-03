import AlienType from "../enums/AlienType.js";

export default class AlienFactory {
    /**
	 * Encapsulates the instantiation logic for creating birds.
	 * This method should be extended when adding new birds.
	 *
	 * @param {object} type Uses the BirdType enum.
	 * @returns An instance of a Bird.
	 */
    static createInstance(type, x, y) {
		switch (type) {
			case AlienType.Pawn:
				return new Pawn();
			case AlienType.Scion:
				return new Scion();
		}
	}
}