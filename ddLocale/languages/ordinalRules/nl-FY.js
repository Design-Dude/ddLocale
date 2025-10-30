/*
	Dutch Fries (nl-FY) ordinal rules
*/
function ddOrdinals(locale = 'nl-FY', options = {}) {

	const sizes = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const { type = 'cardinal' } = options;
	const [ lang, region ] = locale.split('-');
	const ordinalCache = new Map();

	if (type === 'ordinal' || type === 'numeral') {
		return {
			format(n, o) {
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
		const suffixType = (n % 10 === 1 || n % 10 === 8 || n >= 20) ? 'ste' : 'de';
		switch (format) {
			case 'ordinal':
				let ordinalWord = getOrdinal(n, 'ordinal');
				return ordinalWord.length > 0 ? `${ordinalWord}${suffixType}` : '';
			case 'word':
				if (!n && zero) return ddLocale.map.get(zero);
				return `${getOrdinal(n, decimals, short)}`;
			case 'suffix':
				return `${suffixType}`;
			case 'alt':
			case 'alternative':
				return `${n}ᵉ`;
			default:
				return `${n}${suffixType}`;
		}
	}

	function getOrdinal(v, o = false, s = false) {
		const _NS = [
			{ val: 10**21, str: "triljard", short: "tld" },
			{ val: 10**18, str: "triljoen", short: "tln" },
			{ val: 10**15, str: "biljard", short: "bld" },
			{ val: 10**12, str: "biljoen", short: "bln" },
			{ val: 10**9, str: "miljard", short: "mld" },
			{ val: 10**6, str: "miljoen", short: "mln" },
			{ val: 10**3, str: "tûzend", short: "K" },
			{ val: 10**2, str: "hûndert" },
			{ val: 90, str: "njoggentich" },
			{ val: 80, str: "tachtich" },
			{ val: 70, str: "santich" },
			{ val: 60, str: "sechtich" },
			{ val: 50, str: "fyftich" },
			{ val: 40, str: "fjirtich" },
			{ val: 30, str: "tritich" },
			{ val: 20, str: "twintig" },
			{ val: 19, str: "njoggentjin" },
			{ val: 18, str: "achtjin" },
			{ val: 17, str: "santein" },
			{ val: 16, str: "sechtjin" },
			{ val: 15, str: "fyftjin" },
			{ val: 14, str: "fjirtjin" },
			{ val: 13, str: "trettjin" },
			{ val: 12, str: "tolve" },
			{ val: 11, str: "alve" },
			{ val: 10, str: "tsien" },
			{ val: 9, str: "njoggen" },
			{ val: 8, str: "acht" },
			{ val: 7, str: "sân" },
			{ val: 6, str: "seis" },
			{ val: 5, str: "fiif" },
			{ val: 4, str: "fjouwer" },
			{ val: 3, str: "trije", ord: "der" },
			{ val: 2, str: "twa" },
			{ val: 1, str: "ien", ord: "eer" },
			{ val: 0, str: "nul", ord: "" }
		];
		for (var n of _NS) {
			let str = s && n.short ? n.short : n.str;
			if (v === n.val) return o === 'ordinal' && typeof n.ord !== 'undefined' ? `${n.ord}` : `${str}`;
			else if (v > n.val && v > 10000) {
				let num = Math.floor(v / n.val);
				if (!(v % n.val)) return `${num} ${str}`;
				if(typeof o == 'number') return `${(+parseFloat(num + '.' + (v - num * n.val)).toFixed(o)).toLocaleString(locale) } ${str}`;
				else return v.toLocaleString(locale);
			} else if (n.val > 99 && v > n.val && v > 1000) {
				if (typeof o == 'number') +(v / n.val).toFixed(o);
				else return `${getOrdinal(Math.floor(v / n.val))}${str}`;
			} else if (v > 20 && v < 100) {
				if (!(v % n.val)) return `${getOrdinal(v % 10)}en${getOrdinal(Math.floor(v / 10) * 10)}`;
			}
		}
		return v.toLocaleString(locale);
	}
}