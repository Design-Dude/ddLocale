// on load
window.addEventListener('load', e => {
	app_init();
});
window.addEventListener('online', () => console.log('online'));

let settings = {
	locale: {
		language: 'en',
		country: ''
	}
}
// initialisation
function app_init() {

	ddLocale.init({
		log: false,
		language: settings.locale.language,
		country: settings.locale.country,
		ready: function (object) {
			settings.locale.language = object.language;
			settings.locale.country = object.country;
			app_ready();
		},
		success: function (err) {
		},
		failed: function (err) {
			console.log('oops');
		},
		menu: {
			domId: 'language',
			button: '', // long, short or translation key
			menu: 'center', // className
			autoOpen: 200, // delay in ms
			autoClose: 200 // delay in ms
		},
		ordinalRules: true,
		autoInline: true,
		minified: true,
		cultures: [
			{
				culture: "en",
				title: "English"
			},
			{
				culture: "nl",
				title: "Nederlands"
			},
			{
				culture: "nl-FY",
				title: "Fries"
			},
			{
				culture: "nl-BE",
				title: "Belgisch"
			},
			{
				culture: "de",
				title: "Deutsch"
			},
			{
				culture: "it",
				title: "Italiano"
			},
			{
				culture: "es",
				title: "Español"
			},
			{
				culture: "fr",
				title: "Français"
			},
			{
				culture: "ar",
				title: "عربية",
				direction: 'rtl'
			}
		],
		stringFormats: {
			eur: {
				style: "currency",
				currency: "EUR",
				minimumFractionDigits: 1,
				maximumFractionDigits: 2
			},
			shortDate: {
				year: "numeric",
				month: "short",
				day: "numeric",
			},
			ordinal: {
				format: "ordinal",
			},
			wordShort: {
				format: "word",
				short: true,
			},
			ordinalValue: {
				format: "value",
			},
			ordinalWord: {
				format: "word",
			},
			ordinalDecimalWord: {
				format: "word",
				decimals: 2
			},
			ordinalZeroWord: {
				format: "word",
				zero: "none",
			},
			ordinalAlt: {
				format: "alt",
			},
			ordinalSuffix: {
				format: "suffix",
				gender: "f"
			},
			bytes: {
				format: "bytes",
				decimals: 2
			},
			plural: {
				format: "plural",
			}
		},
		nocache: false,
		usePrototypes: true
	});
}

// initialisation
function app_ready() {

	console.clear();

	console.log(ddLocale.t("tool name") );
	console.log(ddLocale.t("seePage") );
	console.log(ddLocale.t("seeWeb") );
	console.log(ddLocale.t("seeWeb"), true);
	
	console.log("--------------");
	console.log("/* STRINGS */");
	console.log("--------------");
	console.log(1, "tool name".t(true));
	console.log(2, ddLocale.t( "exit.goodbye", "Benicio", "del", "Toro"));
	console.log(3, ddLocale.t( "exit.goodbye", ["Benicio", "del", "Toro"] ));
	console.log(4, ddLocale.t("exit.goodbye", {0:"Benicio", 1:"del", 2:"Toro"}));
	console.log(5,"my name is".t({fullname: "fullname"}, {fullname:{firstname:"Benicio", middlename:"del", lastname:"Toro"}}));
	console.log(6,"my name is".t({fullname: "fullname"}, {fullname:{firstname:"Benicio", middlename:"del", lastname:"Toro"}}, true));
	console.log(7,"man".t(false));
	console.log(8, 0, "man".t(0));
	console.log(9, 1, "man".t(1));
	console.log(10, 100, "man".t(100));
	console.log(11, 100, "man".t(100), true);
	console.log(12, "the door is".t('closed'));
	console.log(13, "the door is".t(['closed']));
	console.log(14, "the door is".t({0:'closed'}));
	console.log(15, ddLocale.t("the door is", {0:'closed'}));
	console.log(16, ddLocale.t("the door is", {0:'closed'}, true));

	console.log("--------------");
	console.log("/* NUMBERS */");
	console.log("--------------");
	console.log(17, (129).t());
	console.log(18, ddLocale.t(129));
	console.log(19, (18.18).t('ordinalWord'));
	console.log(20, (18).t('ordinalWord'));
	console.log(21, (1345236).t('ordinalValue'));
	console.log(22, ddLocale.t(1345236, 'bytes'));
	console.log(23, (3).t('ordinalWord'));
	console.log(24, (300000).t('ordinal'));
	console.log(25, (1345236).t('wordShort'));
	console.log(26, (78).t('ordinalAlt'));
	console.log(27, (0).t('ordinalZeroWord'));
	console.log(28, (1345236).t('ordinalWord'));
	console.log(29, (23).t('ordinalWord'));
	console.log(30, (1345236).t('ordinalDecimalWord'));
	console.log(31, (345236).t('ordinalSuffix'));
	console.log(32, (12345.678).t('eur'));
	console.log(33, (12345.678).t('eur', true));

	console.log("--------------");
	console.log("/* DATES */");
	console.log("--------------");
	console.log(34, new Date().t('shortDate'));
	console.log(35, ddLocale.t(1760565600000, 'shortDate'));
	console.log(36, ddLocale.t(1760565600000, 'shortDate', true));

	console.log("--------------");
	console.log("/* MIXED */");
	console.log("--------------");
	console.log(37, ddLocale.t("bitcoins", {0:1760620872050, 1:2.58, 2:'bitcoin', 3:(2.58*95339.54)}, { 0:'d|shortDate', 1:'n', 2: 2.58, 3:'n|eur' }));
	console.log(38, "bitcoins".t([new Date(), 1, 'bitcoin', (1*95339.54)], ['date|shortDate', 'number', 1, 'num|eur']));
	console.log(39, "ordinalTest".t({ 0: 12542334567, 1: 1, 2: 1536000 }, { 0: 'n|ordinalWord', 1: 'n|ordinal', 2: 'n|bytes' }));
	console.log(40, "hi".t({ fullname: 'fullname' }, { fullname: { firstname: 'Benicio', middlename: 'del', lastname: 'Toro' } }));
	
	let getTranslation = "hi".t({ fullname: 'fullname' }, { fullname: { firstname: 'Benicio', middlename: 'del', lastname: 'Toro' } }, true);
	console.log(41, getTranslation);
	let lastEntry = document.getElementById('lastEntry');
	if (lastEntry) {
		lastEntry.setAttributes(getTranslation[1]).innerHTML = getTranslation[0];
	}
	
	console.log("--------------");
	console.log("/* ATTRIBUTES */");
	console.log("--------------");
	console.log(42, (129.88).t('ordinalWord', true));
	console.log(43, (129.88).t('ordinal', true));
	console.log(44, (129.88).t('bytes', true));
	console.log(45, "bitcoins".t([new Date(), 2, 'bitcoin', (2*95339.54)], ['date|shortDate', 'number', 2, 'num|eur']));
	console.log(45, "bitcoins".t([new Date(), 2, 'bitcoin', (2*95339.54)], ['date|shortDate', 'number', 2, 'num|eur']));
	console.log(45, "bitcoins".t([new Date(), 2, 'bitcoin', (2*95339.54)], ['date|shortDate', 'number', 2, 'num|eur'], true));
	console.log(46, (1760565600000).t('shortDate', true));
	console.log(47, (1760565600000).t('shortDate', true));

}
