class Level {
	index;
	level;
	colour;

	constructor(index, level, colour) {
		this.index = index;
		this.level = level;
		this.colour = colour;
	}

	getColour(){
		return this.colour;
	}

	toString() {
		return this.level;
	}

	isLessThanOrEqualTo(otherLevel) {
		return this.index >= otherLevel.index;
	}
}

export default Level;
