module.exports = {
	uniqueRandomNumbers(numRandomNumbers, lowerLimit, upperLimit) {
		var uniqueNumbers = [];
		while( uniqueNumbers.length != numRandomNumbers ) {
			var currentRandomNumber = this.randomNumberInRange(lowerLimit, upperLimit);
			if( uniqueNumbers.indexOf(currentRandomNumber) === -1 ) 
				uniqueNumbers.push(currentRandomNumber);
		}
		return uniqueNumbers;
	},

	randomNumberInRange(lowerLimit, upperLimit) {
		return Math.floor( Math.random() * (1 + upperLimit - lowerLimit) ) + lowerLimit;
	}

};