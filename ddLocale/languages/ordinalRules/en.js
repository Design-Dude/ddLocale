/*
	English (en) ordinal rules
*/
function ddOrdinals(locale = 'en', options = {}) {

	const sizes = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const { type = 'cardinal' } = options;
	const [lang, region] = locale.split('-');
	const ordinalCache = new Map();

	if (type === 'ordinal' || type === 'numeral') {
		return {
			format(n, o = {}) {
				const {
					decimals = 0,
					format = 'ordinal',
					short = false,
					zero = false
				} = o;
				const cacheKey = `${n}-${decimals}-${format}-${short}-${zero}`;
				if (ordinalCache.has(cacheKey)) return ordinalCache.get(cacheKey);
				const result = computeOrdinal(n, o);
				ordinalCache.set(cacheKey, result);
				return result;
			}
		};
	} else
	return { getSizes() { return sizes; } };

	function computeOrdinal(n, o) {
		const {
			decimals = 0,
			format = 'ordinal',
			short = false,
			zero = false
		} = o;

		const suffixType = getOrdinalSuffix(n);

		switch (format) {
			case 'ordinal':
				let ordinalWord = getOrdinal(n, 'ordinal');
				if(ordinalWord.length > 0 && ordinalWord.endsWith(suffixType)) return `${ordinalWord}`;
				return ordinalWord.length > 0 ? `${ordinalWord}${suffixType}` : '';
			case 'word':
				if (!n && zero) return ddLocale.map.get(zero);
				return `${getOrdinal(n, decimals, short)}`;
			case 'suffix':
				return `${suffixType}`;
			default:
				return `${n}${suffixType}`;
		}
	}

	function getOrdinalSuffix(n) {
		const j = n % 10, k = n % 100;
		if (j === 1 && k !== 11) return 'st';
		if (j === 2 && k !== 12) return 'nd';
		if (j === 3 && k !== 13) return 'rd';
		return 'th';
	}

	function getOrdinal(v, o = false, s = false) {
		const _NS = [
			{ val: 10 ** 21, str: "sextillion", short: "Sx" },
			{ val: 10 ** 18, str: "quintillion", short: "Qi" },
			{ val: 10 ** 15, str: "quadrillion", short: "Qa" },
			{ val: 10 ** 12, str: "trillion", short: "T" },
			{ val: 10 ** 9, str: "billion", short: "B" },
			{ val: 10 ** 6, str: "million", short: "M" },
			{ val: 10 ** 3, str: "thousand", short: "K" },
			{ val: 10 ** 2, str: "hundred" },
			{ val: 90, str: "ninety" },
			{ val: 80, str: "eighty" },
			{ val: 70, str: "seventy" },
			{ val: 60, str: "sixty" },
			{ val: 50, str: "fifty" },
			{ val: 40, str: "forty" },
			{ val: 30, str: "thirty" },
			{ val: 20, str: "twenty" },
			{ val: 19, str: "nineteen" },
			{ val: 18, str: "eighteen" },
			{ val: 17, str: "seventeen" },
			{ val: 16, str: "sixteen" },
			{ val: 15, str: "fifteen" },
			{ val: 14, str: "fourteen" },
			{ val: 13, str: "thirteen" },
			{ val: 12, str: "twelve", ord: "twelfth" },
			{ val: 11, str: "eleven" },
			{ val: 10, str: "ten" },
			{ val: 9, str: "nine", ord: "ninth" },
			{ val: 8, str: "eight", ord: "eighth" },
			{ val: 7, str: "seven", ord: "seventh" },
			{ val: 6, str: "six", ord: "sixth" },
			{ val: 5, str: "five", ord: "fifth" },
			{ val: 4, str: "four", ord: "fourth" },
			{ val: 3, str: "three", ord: "third" },
			{ val: 2, str: "two", ord: "second" },
			{ val: 1, str: "one", ord: "first" },
			{ val: 0, str: "zero", ord: "" }
		];
		
		for (var n of _NS) {
			let str = s && n.short ? n.short : n.str;
			if (v === n.val)
				return o === 'ordinal' && typeof n.ord !== 'undefined' ? `${n.ord}` : `${str}`;
			else if (v > n.val && v > 10000) {
				let num = Math.floor(v / n.val);
				if (!(v % n.val)) return `${num} ${str}`;
				if (typeof o == 'number') return `${(+parseFloat(num + '.' + (v - num * n.val)).toFixed(o)).toLocaleString(locale)} ${str}`;
				else return v.toLocaleString(locale);
			} else if (n.val > 99 && v > n.val && v > 1000) {
				if (!(v % n.val)) {
					if (typeof o == 'number') +(v / n.val).toFixed(o);
					else return `${getOrdinal(Math.floor(v / n.val))} ${str}`;
				}
			} else if (v > 20 && v < 100) {
				let tens = Math.floor(v / 10) * 10;
				let ones = v % 10;
				if (ones === 0) return getOrdinal(tens, o);
				return `${getOrdinal(tens)}-${getOrdinal(ones, o)}`;
			}
		}
		return v.toLocaleString(locale);
	}
}