interface String {
	center(maxLength: number, fillString?: string): string;
}

String.prototype.center = function (maxLength: number, fillString?: string): string {
	if (fillString === undefined) {
		fillString = " ";
	}

	let newStr = '';
	if (maxLength % 2 == 0) {
		if (this.length % 2 == 0) {
			let bothSizePad = (maxLength - this.length) / 2;
			newStr = fillString.repeat(bothSizePad) + this + fillString.repeat(bothSizePad);
		} else {
			let totalPad = maxLength - this.length;
			let startPad = Math.floor(totalPad / 2);
			let endPad = Math.ceil(totalPad / 2);
			newStr = fillString.repeat(startPad) + this + fillString.repeat(endPad);
		}
	} else if (maxLength % 2 != 0) {
		if (this.length % 2 == 0) {
			let totalPad = maxLength - this.length;
			let startPad = Math.floor(totalPad / 2);
			let endPad = Math.ceil(totalPad / 2);
			newStr = fillString.repeat(startPad) + this + fillString.repeat(endPad);
		} else {
			let bothSizePad = (maxLength - this.length) / 2;
			newStr = fillString.repeat(bothSizePad) + this + fillString.repeat(bothSizePad);
		}
	}
	return newStr;
}