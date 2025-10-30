/*
	Italien (it) ordinal rules
*/

function ddOrdinals(locale = 'it', options = {}) {

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
					zero = false,
					gender = 'm' // m=maschile, f=femminile
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
			gender = 'm' // m=maschile, f=femminile
		} = o;

		const suffixType = getOrdinalSuffix(gender);

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
			case 'alt':
			case 'alternative':
			case 'caps':
			case 'upper':
				return `${n}${suffixType}`;
			default:
				return `${n}${suffixType}`;
		}
	}

	function getOrdinalSuffix(gender = 'm') {
		// Maschile: º, Femminile: ª
		return gender === 'f' ? 'ª' : 'º';
	}

	function getOrdinal(v, o = false, s = false, gender = 'm') {
		const ending = gender === 'f' ? 'a' : 'o';

		const _NS = [
			{ val: 10 ** 21, str: "sestilione", short: "Sx" },
			{ val: 10 ** 18, str: "quintilione", short: "Qi" },
			{ val: 10 ** 15, str: "quadrilione", short: "Qa" },
			{ val: 10 ** 12, str: "bilione", short: "Bn" },
			{ val: 10 ** 9, str: "miliardo", short: "Md" },
			{ val: 10 ** 6, str: "milione", short: "M" },
			{ val: 10 ** 3, str: "mille", short: "K" },
			{ val: 100, str: "cento" },
			{ val: 90, str: "novanta" },
			{ val: 80, str: "ottanta" },
			{ val: 70, str: "settanta" },
			{ val: 60, str: "sessanta" },
			{ val: 50, str: "cinquanta" },
			{ val: 40, str: "quaranta" },
			{ val: 30, str: "trenta" },
			{ val: 20, str: "venti" },
			{ val: 19, str: "diciannove" },
			{ val: 18, str: "diciotto" },
			{ val: 17, str: "diciassette" },
			{ val: 16, str: "sedici" },
			{ val: 15, str: "quindici" },
			{ val: 14, str: "quattordici" },
			{ val: 13, str: "tredici" },
			{ val: 12, str: "dodici" },
			{ val: 11, str: "undici" },
			{ val: 10, str: "dieci" },
			{ val: 9, str: "nove" },
			{ val: 8, str: "otto" },
			{ val: 7, str: "sette" },
			{ val: 6, str: "sei" },
			{ val: 5, str: "cinque" },
			{ val: 4, str: "quattro" },
			{ val: 3, str: "tre", ord: "terz" },
			{ val: 2, str: "due", ord: "second" },
			{ val: 1, str: "uno", ord: "prim" },
			{ val: 0, str: "zero", ord: "" }
		];

		for (var n of _NS) {
			let str = s && n.short ? n.short : n.str;
			if (v === n.val) {
				if (o === 'ordinal' && typeof n.ord !== 'undefined') {
					let base = n.ord;
					if (base.endsWith('z') || base.endsWith('r')) base += ending; // terz + o/a, prim + o/a
					else base = `${base}${ending}`;
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
				return `${getOrdinal(ones, o, s, gender)} e ${getOrdinal(tens, o, s, gender)}`;
			}
		}
		return v.toLocaleString(locale);
	}
};