/*
	Spanish (es) ordinal rules
*/
function ddOrdinals(locale = 'es', options = {}) {

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
			gender = 'm' // m=masculino, f=femenino
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
			default:
				return `${n}${suffixType}`;
		}
	}

	function getOrdinalSuffix(gender = 'm') {
		// Masculine: º, Feminine: ª
		return gender === 'f' ? 'ª' : 'º';
	}

	function getOrdinal(v, o = false, s = false, gender = 'm') {
		const ending = gender === 'f' ? 'a' : 'o';

		const _NS = [
			{ val: 10 ** 21, str: "sextillón", short: "Sx" },
			{ val: 10 ** 18, str: "quintillón", short: "Qi" },
			{ val: 10 ** 15, str: "cuatrillón", short: "Qa" },
			{ val: 10 ** 12, str: "billón", short: "Bn" },
			{ val: 10 ** 9, str: "mil millones", short: "Mm" },
			{ val: 10 ** 6, str: "millón", short: "M" },
			{ val: 10 ** 3, str: "mil", short: "K" },
			{ val: 100, str: "cien" },
			{ val: 90, str: "noventa" },
			{ val: 80, str: "ochenta" },
			{ val: 70, str: "setenta" },
			{ val: 60, str: "sesenta" },
			{ val: 50, str: "cincuenta" },
			{ val: 40, str: "cuarenta" },
			{ val: 30, str: "treinta" },
			{ val: 20, str: "veinte" },
			{ val: 19, str: "diecinueve" },
			{ val: 18, str: "dieciocho" },
			{ val: 17, str: "diecisiete" },
			{ val: 16, str: "dieciséis" },
			{ val: 15, str: "quince" },
			{ val: 14, str: "catorce" },
			{ val: 13, str: "trece" },
			{ val: 12, str: "doce" },
			{ val: 11, str: "once" },
			{ val: 10, str: "diez" },
			{ val: 9, str: "nueve" },
			{ val: 8, str: "ocho" },
			{ val: 7, str: "siete" },
			{ val: 6, str: "seis" },
			{ val: 5, str: "cinco" },
			{ val: 4, str: "cuatro" },
			{ val: 3, str: "tres", ord: "tercer" },
			{ val: 2, str: "dos", ord: "segund" },
			{ val: 1, str: "uno", ord: "primer" },
			{ val: 0, str: "cero", ord: "" }
		];

		for (var n of _NS) {
			let str = s && n.short ? n.short : n.str;
			if (v === n.val) {
				if (o === 'ordinal' && typeof n.ord !== 'undefined') {
					// Special case: "primer" -> "primero" / "primera"
					let base = n.ord;
					if (base.endsWith('r')) base += ending; // primer -> primero/a
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
				return `${getOrdinal(ones, o, s, gender)} y ${getOrdinal(tens, o, s, gender)}`;
			}
		}
		return v.toLocaleString(locale);
	}
}