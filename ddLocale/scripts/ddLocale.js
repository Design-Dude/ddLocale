/*dd
    Locale api, version 2.0
	Copywrite 2025, DesignDude
*/
window.ddLocale = {
	bytesToString: function (bytes, options) {
		const { decimals = 0 } = options;
		if (bytes === 0) return '0 bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = (typeof ddOrdinals === 'function') ? ddOrdinals().getSizes() : ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
		return `${value.toLocaleString(this.culture)} ${sizes[i]}`;
	},
	clickButton: function(e) {
		if (typeof (this.menu.menu) === 'undefined') {
			let currentCulture = this.culture;
			let newCulture = -1;
			let firstCulture = false;
			for (let c in this.cultures) {
				if (!firstCulture && this.cultures[c].culture != currentCulture) firstCulture = this.cultures[c].culture;
				if (newCulture == -1 && this.cultures[c].culture == currentCulture) newCulture = 0;
				if (newCulture == 0 && this.cultures[c].culture != currentCulture) newCulture = this.cultures[c].culture;
			}
			this.set({
				culture: newCulture != 0 ? newCulture : firstCulture
			});
		} else {
			this.setButton(true);
			this.setMenu();
		}
	},
	clickItem: function(e) {
		this.set({
			culture: e.target.getAttribute('culture')
		});
	},
	closeMenu: function(e = false) {
		if(window.ddLocale && window.ddLocale.menu && window.ddLocale.menu.domId) {
			const menu = document.getElementById(window.ddLocale.menu.domId + '-menu-container');
			if(menu && (!e || e.target.getAttribute('id') !== ddLocale.menu.domId + '-menu-button')) {
				document.getElementById(window.ddLocale.menu.domId).classList.remove('open');
				menu.remove();
				if(e) e.preventDefault();
			}
		}
	},
	html: function (id = false) {
		let target = id ? document.getElementById(id) : document;
		target.querySelectorAll("[t]").forEach((element) => {
			let str = element.getAttribute('t');
			let dataset = [{
				trigger: 't',
				key: str
			}];
			for (let ed in element.dataset) {
				dataset.push({
					trigger: ed,
					key: element.dataset[ed]
				});
			}
			if (dataset.length) dataset.sort(ddLocale.sorter);
			for (let d in dataset) {
				if (dataset[d].trigger.slice(-1) !== '+') {
					let short = dataset.find(o => o.trigger === dataset[d].trigger + '+');
					short = short ? short.key : false;
					if (short) {
						let teststr = this.map.get(dataset[d].key);
						if (short.indexOf('s') === 0) {
						} else {
							teststr = this.map.get(dataset[d].key);
						}
						if (typeof teststr === 'string' && teststr.indexOf('->') > 0) {
							short = parseFloat(short);
							short = isNaN(short) ? -1 : Math.ceil(short);
							dataset[d].key = this.doPlural(teststr, short);
						} else if (short.indexOf('d') === 0) {
							try {
								short = short.split('|');
								let options = short.length == 2 ? short[1] : {};
								let num = parseFloat(dataset[d].key);
								dataset[d].key = this.toString(new Date(num), options);
							} catch (error) {
							}
						} else if (short.indexOf('n') === 0) {
							short = short.split('|');
							let options = short.length == 2 ? short[1] : {};
							let num = parseFloat(dataset[d].key);
							dataset[d].key = this.toString(num, options);
						}
					} else {
						let options = {}
						for (let ds in dataset) {
							let testTrigger = dataset[ds].trigger;
							if (testTrigger.indexOf(dataset[d].trigger) > -1) {
								if (testTrigger !== dataset[d].trigger && testTrigger !== dataset[d].trigger + '_') {
									if (dataset[d].trigger.split('_').length === testTrigger.split('_').length - 1) {
										let splitter = dataset[ds].trigger.split('_');
										splitter = splitter[splitter.length - 1];
										options[splitter] = dataset[ds].key;
									}
								}
							}
						}
						options['aAttr'] = true;
						dataset[d].key = ddLocale.t(dataset[d].key, options);
					}
				}
			}
			element.innerHTML = dataset.find(o => o.trigger === 't').key;
		});
	},
	init: function(options) {
		this.set(options);
	},
	initiateCloseMenu: function(e) {
		if(ddLocale.timer) clearTimeout(ddLocale.timer);
		ddLocale.timer = setTimeout(function(that) {
			that.closeMenu();
		}, ddLocale.menu.autoClose, this);
	},
	load: async function(nocache) {
		let path = this.path + this.culture + ".json";
		if(nocache) path += "?d" + new Date().getTime();
		try {
			await fetch(path)
				.then((response) => response.json())
				.then((json) => {
					this.map.clear();
					for (let key in json) this.map.set(key, json[key]);
					document.documentElement.lang = this.culture ? this.culture : this.language;
					let dir = this.cultures.filter(obj => obj.culture === this.culture)[0].direction
					if(dir) {
						document.body.style.direction = dir;
						document.body.setAttribute('direction', dir);
					} else {
						document.body.removeAttribute('direction');
						document.body.style.direction = '';
					}
					if (this.loading && typeof (this.success) == 'function') {
						// once
						if(this.usePrototypes) {
							if (typeof String.prototype.t !== "function") {
								String.prototype.t = function (...args) {
									if(window.ddLocale) {
										if (args.length === 1 && typeof (args[0]) === 'object') args = args[0];
										return window.ddLocale.t(`${this}`, args);
									} else return this;
								};
							}
							if (typeof Number.prototype.t !== "function") {
								Number.prototype.t = function (options, attr) {
									if (window.ddLocale) return window.ddLocale.toString(parseFloat(this), options, attr);
									return this.toLocaleString();
								};
							}
							if (typeof Date.prototype.t !== "function") {
								Date.prototype.t = function (options, attr) {
									if (window.ddLocale) return window.ddLocale.toString(this, options, attr);
									return this.toLocaleString();
								};
							}
							if (typeof Element.prototype.setAttributes !== "function") {
								Element.prototype.setAttributes = function(attrs) {
									for (const [key, value] of Object.entries(attrs)) {
										this.setAttribute(key, value);
									}
									return this;
							  	};
							}
						}
						this.version();
						this.success();
						this.loading = false;
					}
					if(this.log) console.log('Language installed (' + this.culture + ')');
					let ordinalName = this.culture;
					if (this.ordinalRules) {
						let ordinalPath = this.path + (typeof this.ordinalRules === 'string' ? this.ordinalRules : 'ordinalRules/') + ordinalName + (this.minified ? ".min" : "") + ".js";
						this.loadOrdinalRules(ordinalPath, ordinalName, (error) => {
							if (this.log) console.warn('Failed loading ordinal rules (' + ordinalName + ')');
							if (ordinalName != this.language) {
								ordinalName = this.language;
								ordinalPath = this.path + 'ordinalRules/' + ordinalName + ".js";
								this.loadOrdinalRules(ordinalPath, ordinalName, (error) => {
									if (this.log) console.warn('Failed loadin ordinal rules ' + ordinalPath);
									this.readyLoading();
								});
							} else {
								this.readyLoading();
							}
						});
					} else this.readyLoading();
				});
		} catch (error) {
			if (this.log) console.warn('Trouble loading ' + path);
			if (typeof (this.failed) == 'function') this.failed();
			this.loading = false;
		}
	},
	loadOrdinalRules: async function (url, ordinalName, onError) {
		const old = document.querySelector(`script[dynamic=ddOrdinals]`);
		if (old) old.remove();
		if (typeof ddOrdinals === 'function') ddOrdinals = undefined;
		const script = document.createElement('script');
		script.src = url;
		script.type = 'text/javascript';
		script.setAttribute('dynamic', 'ddOrdinals');
		script.async = true;
		script.onload = () => {
			if (this.log) console.log('Ordinal rules installed (' + ordinalName + ')');
			this.readyLoading();
		};
		script.onerror = (err) => {
			const old = document.querySelector(`script[dynamic=ddOrdinals]`);
			if (old) old.remove();
			if (typeof onError === 'function') onError(err);
		};
		document.head.appendChild(script);
	},
	readyLoading: function () {
		if (typeof this.ready === 'function') this.ready({
			language: this.language,
			country: this.country,
			culture: this.culture,
			title: this.cultures.filter(obj => obj.culture === this.culture)[0].title
		});
		if(this.autoInline) this.html();
		this.setButton();
	},
	set: function (options) {
		if (options.culture) {
			let cultureArr = options.culture.split('-');
			options.language = cultureArr[0];
			options.country = cultureArr.length === 2 ? cultureArr[1] : '';
		}
		const oldLanguage = this.language;
		const oldCountry = this.country;
		const oldPath = this.path;

		this.language = (options.language && options.language !== '' ? options.language : "en").toLowerCase();
		this.country = (options.country ? options.country : "").toUpperCase();
		this.culture = this.language + ((this.country && this.country != "") ? "-" + this.country : "");

		if (!this.map) this.map = new Map();
		if (!this.key) this.key = "";
		if (typeof(this.loading) == 'undefined') this.loading = true;
		this.stringFormats = options.stringFormats ? options.stringFormats : this.stringFormats ? this.stringFormats : {};
		this.path = options.path ? options.path : this.path ? this.path : 'languages/';
		this.replacement = options.replacement ? options.replacement : (this.replacement ? this.replacement : "__");
		this.log = options.log ? options.log : typeof(this.log) == 'undefined' ? true : this.log;
		this.cultures = typeof(options.cultures) !== 'undefined' ? options.cultures : this.cultures ? this.cultures : false;
		this.ordinalRules = typeof(options.ordinalRules) !== 'undefined' ? options.ordinalRules : this.ordinalRules ? this.ordinalRules : false;
		this.autoInline = typeof(options.autoInline) !== 'undefined' ? options.autoInline :  typeof(this.autoInline) !== 'undefined' ? this.autoInline : true;

		if (options.menu) this.menu = options.menu;

		if (options.ready) this.ready = options.ready;
		if (options.failed) this.failed = options.failed;
		if (options.success) this.success = options.success;
		if (this.language != oldLanguage || this.country != oldCountry || this.path != oldPath) this.load(options.nocache ? options.nocache : false);

		this.minified = typeof(options.minified) !== 'undefined' ? options.minified : this.minified ? this.minified : false;
		this.usePrototypes = typeof(options.usePrototypes) !== 'undefined' ? options.usePrototypes : this.usePrototypes ? this.usePrototypes : false;
		this.timer = false;
	},
	setButton: function(isOpen = false) {
		if (this.menu && this.menu.domId && typeof(this.menu.button) === 'string') {
			let button = document.getElementById(this.menu.domId);
			button.setAttribute('culture', this.culture);
			if(isOpen) button.classList.add('open');
			let link = document.createElement('a');
			link.setAttribute('id', this.menu.domId + '-menu-button');
			link.setAttribute('href', 'javascript:void(0)');
			link.setAttribute('aria-label', 'language menu');
			link.setAttribute('aria-haspopup', 'menu');
			let short = this.culture.split('-');
			if (this.menu.button === 'long') {
				link.innerHTML = this.cultures.filter(obj => obj.culture === this.culture)[0].title;
			} else if (this.menu.button === 'short') {
				link.innerHTML = short[short.length - 1].toUpperCase();
			} else if (typeof (this.menu.button) === 'string') {
				link.innerHTML = this.t(this.menu.button);
			}
			if (!link._binding) {
				link._binding = true;
				link.addEventListener('click', (e) => this.clickButton(e));
				link.addEventListener('mouseover', (e) => {
					if(ddLocale.timer) clearTimeout(ddLocale.timer);
					if(this.menu && this.menu.domId && this.menu.autoOpen) {
						ddLocale.timer = setTimeout(function() {
							const menu = document.getElementById(window.ddLocale.menu.domId + '-menu-container');
							if(!menu) ddLocale.clickButton(e)
						}, this.menu.autoOpen);
					}
				});
				link.addEventListener('mouseout', (e) => {
					if(ddLocale.timer) clearTimeout(ddLocale.timer);
					if(this.menu && this.menu.domId && this.menu.autoClose) {
						this.initiateCloseMenu()
					}
				});
				window.addEventListener('click', e => {
					if(window.ddLocale) ddLocale.closeMenu(e);
				});

			}
			button.innerHTML = '';
			button.appendChild(link);
		}
	},
	setMenu: function() {
		if (this.menu && this.menu.domId) {
			let button = document.getElementById(this.menu.domId);
			const menu = document.createElement('div');
			menu.classList.add(this.menu.menu);
			menu.setAttribute('id', this.menu.domId + '-menu-container');
			for (let c in this.cultures) {
				let link = document.createElement('a');
				link.setAttribute('href', 'javascript:void(0)');
				link.addEventListener('click', (e) => this.clickItem(e));
				link.innerHTML = this.cultures[c].title;
				if (this.cultures[c].culture === this.culture) {
					link.classList.add('selected');
					link.setAttribute('aria-current', 'language');
				}
				link.setAttribute('culture', this.cultures[c].culture);
				link.innerHTML = this.cultures[c].title;
				menu.appendChild(link);
			}
			menu.addEventListener('mouseover', (e) => {
				if(ddLocale.timer) clearTimeout(ddLocale.timer); 
			});
			menu.addEventListener('mouseout', (e) => {
				if(ddLocale.timer) clearTimeout(ddLocale.timer); 
				if(this.menu && this.menu.domId && this.menu.autoClose) this.initiateCloseMenu();
			});
			button.appendChild(menu);
		}
	},
	sorter: function (o1, o2) {
		let l1 = o1.trigger.split('+').length - 1;
		let l2 = o2.trigger.split('+').length - 1;
		if (l1 > l2) return -1;
		if (l1 < l2) return 1;
		l1 = o1.trigger.slice(-1);
		l2 = o2.trigger.slice(-1);
		if (l1 > l2) return -1;
		if (l1 < l2) return 1;
		return 0;
	},
	split: function(key) {
		return key.split(/\.(?=[a-zA-Z0-9])/);
	},
	t: function (key, ...args) {

		let eAttr = false;
		let ePlural = false;
		if(typeof key.getMonth === 'function') return this.toString(key, args[0], args[1] && args[1] === true ? true : false);
		if (typeof key === 'number') return this.toString(key, args[0], args[1] && args[1] === true ? true : false);
		
		if (args[args.length - 1] === true) {
			args.pop();
			eAttr = true;
		} else if (typeof args[args.length - 1] === 'object') {
			if (args[0][args[0].length - 1] === true) {
				args[args.length - 1].pop();
				if (typeof args[0] === 'object') args = args[0];
				eAttr = true;
			}
		}

		if (args && args.length === 1 && (typeof (args[0]) === 'string' || typeof (args[0]) === 'number')) args = [args];
		if(args && args.length > 1) {
			let temp = [];
			for(let a in args) temp.push(args[a]);
			args = [temp];
		}
		args = args.length ? args[0] : args;

		let str;
		let keys = this.split(key);

		if(keys.length == 1) {
			str = this.map.get(key) && this.map.get(key) != "" ? this.map.get(key) : key;
			if(typeof(str) != 'string') str = key;
		} else {
			str = this.map.get(keys[0]);
			if(typeof(str) == 'object') {
				for(let k in keys) {
					if(k != 0) {
						str = str[keys[k]];
						if(typeof(str) == 'undefined' || str === '') {
							str = str === '' ? keys[k] : key;
							break;
						}
					}
				}
			} else {
				str = key;
			}
		}
		if (str.indexOf('->=') > -1 || str.indexOf('->+') > -1 || str.indexOf('->-') > -1) {
			let testval = typeof args[0] == 'number' ? Math.ceil(args[0]) : -1;
			str = this.doPlural(str, testval);
			ePlural = true;
		}
		if (eAttr) {
			eAttr = typeof args['eAttr'] === 'string' ? {} : { t: key };
		}
		
		if(Object.keys(args).length) {
			let counter = 0;
			let parent = typeof args['eAttr'] === 'string' ? args['eAttr'] : '';
			for (let k in args) {
				if (k != 'eAttr' && typeof (args[k]) != 'string' && typeof (args[k]) != 'number') {
					if(!counter) {
						counter++;
						Object.entries(args[k]).forEach(([key, value]) => {
							let short = false;
							if (args[1] && typeof (args[1]) == 'object' && Object.keys(args[1]).length && (args[1][key] || args[1][key] === 0)) {
								short = args[1][key];
							}
							if (eAttr) {
								if (value instanceof Date) value = value.getTime();
								eAttr['data-t_' + parent + key] = value;
								if(typeof short !== 'object') eAttr['data-t_' + parent + key + '_'] = short;
							}
							if (short || short === 0) {
								if (typeof short == 'number') {
									value = this.doPlural(this.map.get(value), short);
								} else if (typeof short == 'string' && short.indexOf('d') === 0) {
									try {
										short = short.split('|');
										let options = short.length == 2 ? short[1] : {};
										let date = value instanceof Date ? value : new Date(parseFloat(value));
										value = this.toString(date, options);
									} catch (error) {
										value = this.replacement ? this.replacement : value;
									}
								} else if (typeof short == 'string' && short.indexOf('o') === 0) {  // TOTO ordinal
									short = short.split('|');
									let options = short.length == 2 ? short[1] : {};
									let num = parseFloat(value);
									value = this.toString(num, options);
								} else if (typeof short == 'string' && short.indexOf('n') === 0) {
									short = short.split('|');
									let options = short.length == 2 ? short[1] : {};
									let num = parseFloat(value);
									value = this.toString(num, options);
								} else if (typeof short == 'string' && short.indexOf('s') !== -1) {
									//
								} else if (typeof short == 'object') {
									if (eAttr) {

										short['eAttr'] = key + '_';
										let tempVal = this.t(value, short, true);
										value = tempVal[0];
										for(let i in tempVal[1]) eAttr[i] = tempVal[1][i];
									} else {
										value = this.t(value, short);
									}
								} else {
									value = this.replacement ? this.replacement : value;
								}
							} else {
								value = this.map.get(value);
								str = str.replaceAll("\{"+key+"\}", value);
							}
							str = str.replaceAll("\{"+key+"\}", value);
						});
					}
				} else if (k != 'eAttr') {
					
					let value = this.map.get(args[k]);
					if(!value) value = args[k];

					if(args['aAttr'] === true) value = args[k];
					if (!ePlural && eAttr) eAttr['data-t_' + parent + k] = args[k];
					else if (ePlural && eAttr) eAttr['data-t_'] = parent + args[k];
					str = str.replaceAll("\{"+k+"\}", value);
				}
			}
		}
		if (this.replacement) str = str.replaceAll(/{(\w+)}/ig, this.replacement);
		str = str.replace(/(\ ){2,}/, ' ');
		if (eAttr) return [str, eAttr];
		return str;
	},
	doPlural: function (str, value) {
		if (value === -1) {
			str = str.split('->');
			return str[0];
		} else {
			let _plrl;
			try {
				_plrl = new Intl.PluralRules(this.culture);
			} catch {
				_plrl = new Intl.PluralRules('en');
			}
			if (_plrl.select(value) === 'one') {
				str = str.split('->');
				return str[0];
			} else {
				if (str.indexOf('->=') > 0) {
					str = str.split('->=');
					return str[1];
				} else if (str.indexOf('->-') > 0) {
					str = str.split('->-');
					let actions = str[1].split('+');
					return str[0].replace(actions[0], '') + (actions[1] ? actions[1] : '');
				} else {
					str = str.split('->+');
					return str[0] + str[1];
				}
			}
		}
		return str;
	},
	version: function () {
		if (this.log) console.log('ddLocale translation library is now ready for use', {
			buymeacoffee: "",
			copyright: "design-dude.nl",
			git: "",
			latest: "17/10/2025",
			version: "2.0"
		});
	},
	toString: function (obj, options, attr = false) {
		if (typeof obj === 'number' && options === true && !attr) {
			options = "";
			attr = true;
		}
		let oOptions = typeof options === 'string' && options !== '' ? '|' + options : "";
		options = this.stringFormats && typeof options === 'string' && this.stringFormats[options] ? structuredClone(this.stringFormats[options]) : typeof options === 'object' ? options : {};
		if(attr) options['eAttr'] = true;
		if (typeof ddOrdinals === 'function' && typeof obj === 'number' && typeof options === 'object' && typeof options.format === 'string') {
			if (options.format === 'bytes') {
				let result = this.bytesToString(obj, options);
				if (options.eAttr) return [result, { t: obj, 'data-t_': 'n'+oOptions }];
				return result;
			} else {
				const p = ddOrdinals(this.culture, { type: 'ordinal'});
				let result = p.format(obj, options);
				if (options.eAttr) return [result, { t: obj, 'data-t_': 'n'+oOptions }];
				return result;
			}
		}
		let result = obj.toLocaleString(this.culture, options);
		if (typeof obj === 'number' && (options.day || options.weekday || options.year || options.month || options.hour || options.minute || options.second)) {
			obj = new Date(obj);
			result = obj.toLocaleString(this.culture, options);
			if (options.eAttr) return [result, { t: obj.getTime(), 'data-t_': 'd'+oOptions }];
		} else if (options.eAttr) {
			if (obj instanceof Date) obj = obj.getTime();
			return [result, { t: obj, 'data-t_': 'n'+oOptions }];
		}
		return result;
	}
};