/*
	French (fr) ordinal rules
*/
function ddOrdinals(locale = 'fr', options = {}) {

	const sizes = ['octets', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const { type = 'cardinal' } = options;
	const [lang, region] = locale.split('-');
	const ordinalCache = new Map();

	if (type === 'ordinal' || type === 'numeral') {
		return {
			format(n, o = {}) {
				const {
					decimals = 0,
					format = 'ordinal', // 'ordinal', 'word', 'suffix', 'alt'
					short = false,
					zero = false,
					gender = 'm' // m=masculin, f=féminin
				} = o;
				const cacheKey = `${n}-${decimals}-${format}-${short}-${zero}-${gender}`;
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
			format = 'ordinal', // 'ordinal', 'word', 'suffix', 'alt'
			short = false,
			zero = false,
			gender = 'm' // m=masculin, f=féminin
		} = o;
	
		const suffixType = getOrdinalSuffix(n, gender);
	
		switch (format) {
			case 'ordinal':
				let ordinalWord = getOrdinal(n, 'ordinal', short, gender);
				if(ordinalWord.length > 0 && ordinalWord.endsWith(suffixType)) return `${ordinalWord}`;
				return ordinalWord.length > 0 ? `${ordinalWord}${suffixType}` : '';
			case 'word':
				if (!n && zero) return ddLocale.map.get(zero);
				return `${getOrdinal(n, decimals, short, gender)}`;
			case 'suffix':
				return suffixType;
			default:
				return `${n}${suffixType}`;
		}


	}

	function getOrdinalSuffix(n, gender = 'm') {
		// French rules: 1er / 1re for 1, otherwise 'e'
		if (n === 1) return gender === 'f' ? 're' : 'er';
		return 'e';
	}

	function getOrdinal(v, o = false, s = false, gender = 'm') {
		// French number words (optional, mostly numeric fallback for readability)
		const _NS = [
			{ val: 10 ** 21, str: "sextillion", short: "Sx" },
			{ val: 10 ** 18, str: "quintillion", short: "Qi" },
			{ val: 10 ** 15, str: "quadrillion", short: "Qa" },
			{ val: 10 ** 12, str: "billion", short: "Bn" },
			{ val: 10 ** 9, str: "milliard", short: "Md" },
			{ val: 10 ** 6, str: "million", short: "M" },
			{ val: 10 ** 3, str: "mille", short: "K" },
			{ val: 100, str: "cent" },
			{ val: 90, str: "quatre-vingt-dix" },
			{ val: 80, str: "quatre-vingts" },
			{ val: 70, str: "soixante-dix" },
			{ val: 60, str: "soixante" },
			{ val: 50, str: "cinquante" },
			{ val: 40, str: "quarante" },
			{ val: 30, str: "trente" },
			{ val: 20, str: "vingt" },
			{ val: 19, str: "dix-neuf" },
			{ val: 18, str: "dix-huit" },
			{ val: 17, str: "dix-sept" },
			{ val: 16, str: "seize" },
			{ val: 15, str: "quinze" },
			{ val: 14, str: "quatorze" },
			{ val: 13, str: "treize" },
			{ val: 12, str: "douze" },
			{ val: 11, str: "onze" },
			{ val: 10, str: "dix" },
			{ val: 9, str: "neuf" },
			{ val: 8, str: "huit" },
			{ val: 7, str: "sept" },
			{ val: 6, str: "six" },
			{ val: 5, str: "cinq" },
			{ val: 4, str: "quatre" },
			{ val: 3, str: "trois", ord: "troisièm" },
			{ val: 2, str: "deux", ord: "deuxièm" },
			{ val: 1, str: "un", ord: "premièr" },
			{ val: 0, str: "zéro", ord: "" }
		];

		for (var n of _NS) {
			let str = s && n.short ? n.short : n.str;
			if (v === n.val) {
				if (o === 'ordinal' && typeof n.ord !== 'undefined') {
					let base = n.ord;
					base += (gender === 'f' ? 'e' : 'e'); // e.g., premier -> première
					return base;
				}
				return `${str}`;
			} else if (v > n.val && v > 10000) {
				let num = Math.floor(v / n.val);
				if (!(v % n.val)) return `${num} ${str}`;
				if (typeof o == 'number')
					return `${(+parseFloat(num + '.' + (v - num * n.val)).toFixed(o)).toLocaleString(locale)} ${str}`;
				else return v.toLocaleString(locale);
			} else if (n.val > 99 && v > n.val && v > 1000) {
				let num = Math.floor(v / n.val);
				if (!(v % n.val)) return `${getOrdinal(num)} ${str}`;
			} else if (v > 20 && v < 100) {
				let tens = Math.floor(v / 10) * 10;
				let ones = v % 10;
				if (ones === 0) return getOrdinal(tens, o, s, gender);
				return `${getOrdinal(ones, o, s, gender)} et ${getOrdinal(tens, o, s, gender)}`;
			}
		}
		return v.toLocaleString(locale);
	}
}