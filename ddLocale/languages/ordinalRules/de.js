/*
	German (de) ordinal rules
*/
function ddOrdinals(locale = 'de', options = {}) {

	const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
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
					gender = 'm' // m=maskulin, f=feminin, n=neutral
				} = o;
				const cacheKey = `${n}-${decimals}-${format}-${short}-${zero}-${gender}`;
				if (ordinalCache.has(cacheKey)) return ordinalCache.get(cacheKey);
				const result = computeOrdinal(n, o);
				ordinalCache.set(cacheKey, result);
				return result;
			}
		}
	} else
	return { getSizes() { return sizes; } };

	function computeOrdinal(n, o) {
		const {
			decimals = 0,
			format = 'ordinal', // 'ordinal', 'word', 'suffix', 'alt'
			short = false,
			zero = false,
			gender = 'm' // m=maskulin, f=feminin, n=neutral
		} = o;

		const suffixType = getOrdinalSuffix(n);

		switch (format) {
			case 'ordinal':
				let ordinalWord = getOrdinal(n, 'ordinal', short, gender);
				if(ordinalWord.length > 0 && ordinalWord.endsWith(suffixType)) return `${ordinalWord}`;
				return ordinalWord.length > 0 ? `${ordinalWord}${suffixType}` : '';
			case 'word':
				if (!n && zero) return ddLocale.map.get(zero);
				return `${getOrdinal(n, decimals, short, gender)}`;
			case 'suffix':
				return `${suffixType}`;
			default:
				return `${n}${suffixType}`;
		}
	}

	function getOrdinalSuffix(n) {
		// German uses a period after numbers for ordinals: 1., 2., 3., etc.
		return '.';
	}

	function getOrdinal(v, o = false, s = false, gender = 'm') {
		const ending = {
			m: 'er',
			f: 'e',
			n: 'es'
		}[gender] || 'er';

		const _NS = [
			{ val: 10 ** 21, str: "Sextillion", short: "Sx" },
			{ val: 10 ** 18, str: "Quintillion", short: "Qi" },
			{ val: 10 ** 15, str: "Quadrillion", short: "Qa" },
			{ val: 10 ** 12, str: "Billion", short: "Bn" },
			{ val: 10 ** 9, str: "Milliarde", short: "Mrd" },
			{ val: 10 ** 6, str: "Million", short: "Mio" },
			{ val: 10 ** 3, str: "tausend", short: "Tsd" },
			{ val: 100, str: "hundert" },
			{ val: 90, str: "neunzig" },
			{ val: 80, str: "achtzig" },
			{ val: 70, str: "siebzig" },
			{ val: 60, str: "sechzig" },
			{ val: 50, str: "fünfzig" },
			{ val: 40, str: "vierzig" },
			{ val: 30, str: "dreißig" },
			{ val: 20, str: "zwanzig" },
			{ val: 19, str: "neunzehn" },
			{ val: 18, str: "achtzehn" },
			{ val: 17, str: "siebzehn" },
			{ val: 16, str: "sechzehn" },
			{ val: 15, str: "fünfzehn" },
			{ val: 14, str: "vierzehn" },
			{ val: 13, str: "dreizehn" },
			{ val: 12, str: "zwölf", ord: "zwölfte" },
			{ val: 11, str: "elf", ord: "elfte" },
			{ val: 10, str: "zehn", ord: "zehnte" },
			{ val: 9, str: "neun", ord: "neunte" },
			{ val: 8, str: "acht", ord: "achte" },
			{ val: 7, str: "sieben", ord: "siebte" },
			{ val: 6, str: "sechs", ord: "sechste" },
			{ val: 5, str: "fünf", ord: "fünfte" },
			{ val: 4, str: "vier", ord: "vierte" },
			{ val: 3, str: "drei", ord: "dritte" },
			{ val: 2, str: "zwei", ord: "zweite" },
			{ val: 1, str: "eins", ord: "erste" },
			{ val: 0, str: "null", ord: "" }
		];

		for (var n of _NS) {
			let str = s && n.short ? n.short : n.str;
			if (v === n.val)
				return o === 'ordinal' && typeof n.ord !== 'undefined'
					? `${n.ord}${ending}`
					: `${str}`;
			else if (v > n.val && v > 10000) {
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
				return `${getOrdinal(ones, o, s, gender)}und${getOrdinal(tens, o, s, gender)}`;
			}
		}
		return v.toLocaleString(locale);
	}
}
