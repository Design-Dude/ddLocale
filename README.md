# ddLocale
```ddLocale``` is a fairly lightweight and pretty easy to use JavaScript library for multilingual web apps and sites. Supports both script and inline translations for text, numbers, and dates from nestable JSON sources. Includes functionality for a fully customizable language menu.

## Features

- [x] Just a simple yet comprehensive library with no dependencies.
- [x] Nested language files for easy maintanance.
- [x] Multiple syntax options, such as attributes, arrays, or objects.
- [x] Extensive options for inline translation.
- [x] Supports language switching of static elements without reloading the page.
- [x] Support for Right To Left (RTL) languages.
- [ ] Plural support with rules defined in the JSON language files.
- [x] Extends the Javascript ```String``` and ```Date``` functionality.
- [x] Fully functional language menu with behavior settings and styling options.

## Installation

Download and double-click the [latest version.](https://github.com/Design-Dude/ddSpiral/releases/latest) and include the Javascript in your project.
You can also use this link for the latest version.
```
	<script src="./.../ddLocale.js"></script>
```


## Initialisation

Always initialize ```ddLocale``` after loading. Normally, you'll probably load your settings first, which store the user's language choice. You can also use your browser's local date/time settings to specify ```ddLocale```. By default, ```ddLocale``` is set to "en", regardless of whether that translation exists.

```
	ddLocale.init({
		cultures: [ // all available languages
			{
				culture: "en",
				title: "English"
			},
			{
				culture: "nl-NL",
				title: "Nederlands",
				direction: "ltr" // optional ltr or rtl
			}
		],
		path: "lang/", // path from the root to the language files, default "lang/"
		language: "", // optional if culture is used, default "en" (lowercase)
		country: "", // optional, default "" (uppercase)
		culture: "nl-NL", // optional, overrules language and country if set
		replacement: "__", // optional, default __
		menu: {
			domId: "language", // id of dom-node where language menu will be triggered
			button: "", // "long" title, "short" language code or some translation "key"
			menu: "center" // optional, className for the dropdown menu
		},
		ready: function (object) {
			/*
				new language loaded
				you can use object to save settings for example
				object = {
					language: "nl",
					country: "NL",
					culture: "nl-NL",
					title: "Nederlands"
				}
			*/
		},
		success: function (err) { // ddLocale is now ready for use
			// resume initialisation scripts
		},
		failed: function (err) { // something went wrong
		},
		toStringOptions: { // your collection of option for use with toLocaleString
			eur: { // name your options
				style: "currency", // known options for number translations
				currency: "EUR",
				minimumFractionDigits: 1,
				maximumFractionDigits: 2
			},
			shortDate: {
				year: "numeric", // or known options for date translations
				month: "short",
				day: "numeric",
			}
		}
		log: false, // optional, default true
		nocache: false // if true language files will be loaded using timestamps
	});
```


## Properties

To change the language you may use ```ddLocale.set(...)``` which is just an alternative to ```.init(...)```.

### cultures
Define a list of ```cultures``` to let ddLocale know which languages are available. A ```cultures``` object has a ```culture```, ```title``` and optional ```direction```.

**culture:** this is a standard country or language code like ```"nl-NL"``` or ```"en"```. Make sure that ```culture``` matches the corresponding JSON language file name, for example ```nl-NL```.json or ```en```.json.

**title:** the name of language in it's own language for use in the drop down language menu.

**direction:** optional ```"ltr"``` or ```"rtl"```. If available the ```direction``` will be set as style and attribute to the ```body```.

### path
If your JSON-language files are not in a ```./lang/``` folder you can specify the new path. Just leave out ```./``` and ```/```.

### language, country and culture
```language``` and ```country``` define ```culture```. Make sure that ```culture``` matches one of ```cultures``` objects.

### replacement
The optional ```replacement``` character is used as a filler for non-found placeholder expressions.

### menu
**domId:** ```ddLocale``` only needs a ```DOM element``` with an ```id``` to place a button and a menu in.

**button:** ```button``` determines the button text:
- ```"long"``` will place ```cultures[].title``` inside the button.
- ```"short"``` will place the property ```ddLocale.language``` inside the button.
- An empty string ```""``` will leave button empty.
- Any other string is considered a ```key``` to be translated.
**menu:** without the ```menu``` option, the button cycles through the available languages. With the ```menu``` option selected, the button opens a popup menu with all available languages ​​from ```cultures```. The value of ```menu``` is used as the className to style the popup menu.

### ready
The ```ready()``` function will be called each time a new language is set and loaded. Use this function to save user settings with the new language for example.

### success
If other scripts or libraries use ```ddLocale``` you can start their initialisation from the ```success()``` function. ```success()``` will only be called once per (page) load.

### toStringOptions
Your set of existing options for use with ```toLocaleString()``` which allows dates and numeric values ​​to be represented in locale format.


## JSON-language files

Language files are json files. Make sure the ```culture``` matches the JSON language file name, for example ```nl-BE.json``` or ```en.json```. Please note the following rules:
- All language files should have the same ```keys```.
- ```keys``` are case sensitive.
- non-existing ```keys```, or ```keys``` without ```value``` will be returned unaltered.
- You can use nested ```keys```.
- You can also use placeholders as numbers ```{0}``` (Array-style) or as ```{names}``` (JSON-style).
```
	{
		"bitcoins": "On {0} I had {1} {2} worth {3}.",
		"exit": {
			"goodbye": "A presto {0} {1} {2}."
		},
		"fullname": "{firstName} {middleName} {lastName}",
		"hello": "Hello {name} {lastname}.",
		"hi": "Hi {fullname}.",
		"tool name": "ddLocale"
	}
```


## Basic usage

You can put ```ddLocal``` to work via scripting. **Remember:** ```ddLocal``` is not recursive. The name of a placeholder will **not** be translated if a key with the same name exists. First, create the translation for the desired placeholder and feed that to the placeholder.

The following example make use of the above JSON. Just pass the ```key``` to ```ddLocale.t()``` translation function. 
```
	let myTranslation = ddLocale.t("tool name");
```
Or use the extended ```String.t()``` function:
```
	let myTranslation = "tool name".t();
	let key = "tool name";
	myTranslation = key.t();
```
Nested values ​​can be accessed by using a period between the keys. 
```
	let bye = "exit.goodbye".t();
```
This wil return ```"A presto __ __ __."``` because the values for the placeholders are missing. You can pass values for placeholders in 3 different ways (per ```attribute``` or ```array``` only works with sequential numbered placeholders, such as ```{0}```):
```
	let byAttributes = ddLocale.t( "exit.goodbye", "Mek", "van’t", "Hoff" );
	let byArray = ddLocale.t( "exit.goodbye", ["Mek", "van’t", "Hoff"] );
	let byObject = ddLocale.t("exit.goodbye", {0:"Mek", 1:"van’t", 2:"Hoff"} );
```
You may use ```{names}``` instead of numbers ```{0}``` as placeholders when using the object notation. Fill empty values for placeholders with an empty string, like ```middleName``` in the second example below. Multiple spaces are reduced to one.
```
	let myName = "my name is " + "fullname".t( {"firstName":"Mek", "middleName":"van’t", "lastName":"Hoff"} );
	let myName = "my name is " + ddLocale.t("fullname", {firstName:"Mek", middleName:"", lastName:"Hoff"} );
```
To localize numbers and dates you can pass ```ddLocale.culture``` to the standard ```toLocaleString``` and/or ```toLocaleDateString```.
```
	let dateString = new Date().toLocaleString(ddLocale.culture, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
```
To make things a bit easier and shorter, you can store your options in ```toStringOptions``` (see ```Initialisation``` above) and then use the extended functions ```Number.t()``` and ```Date.t()``` with the option ```name``` you want to use.
```
	let dateString = new Date().t('shortDate');
	let currency = (12345.678).t('eur');
```
Or you can use ```ddLocale``` to pass a date or a number for localisation. 
```
	let dateString = ddLocale.t(new Date(), 'shortDate');
	let currency = ddLocale.t(12345.678, 'eur');
```
Passing ```timestamps``` is allowed, but without specific ```date options``` it will be treated as a ```number```.
```
	let dateString1 = ddLocale.t(1760565600000, 'shortDate');
	let dateString2 = (1760565600000).t('shortDate');
```



You can fill placeholders with dates and numbers too, but you can only do this using arrays or objects, because you have to pass an additional array or object with special binders.
```
	let bitcoins1 = ddLocale.t("bitcoins", {0:1760620872050, 1:2.58, 2:'bitcoins', 3:(2.58*95339.54)}, { 0:'d|shortDate', 1:'n', 3:'n|eur' });
	let bitcoins2 = "bitcoins".t([new Date(), 2.56, 'bitcoins', (2.56*95339.54)], ['date|shortDate', 'number', 'string', 'num|eur']);
```
Dates can be passed as a ```Date object``` or as a ```timestamp```.
- ```Date``` binders start with a ```d``` or ```date``` for that matter, optionally followed by a ```|``` and the option ```name``` from ```toStringOptions```.
- ```Number``` binders start with a ```n```, ```num``` or ```number```, optionally followed by a ```|``` and the option ```name``` from ```toStringOptions```.
- ```String``` binders start with a ```s```, ```str``` or ```string```.


## Finally PLURAL INFO...
```
	plural example with bitcoin from above
```

## Inline

Static elements can be translatable too. Just place the ```key``` inside a ```t``` attribute and ```ddLocale``` will place the translation in the ```innerHTML```.
```
	<div id="container">
		<h1 t="tool name"></h1>
	</div>
```
If the inline key has placeholders the corrresponding values must be present in data-t+* attributes, where * is a corresponding key.
```
	<div id="container">
		<h1 t="hello" data-t+name="Master" data-t+lastname="Mek"></h1>
	</div>
```

### Dates and numbers

Dates and numbers can also be static, but only if any options are stored in ```toStringOptions```.

Numbers...
```
	<div id="container">
		<span t="1760565600000" data-t-num="eur"></span>
	</div>
```
For dates, the static representation must be a timestamp ```new Date().getTime()``` and the option name must be in the attribute ```data-t-date```. The option name is cumpulory because with it the timestamp is just a number.
```
	<div id="container">
		<span t="1760565600000" data-t-date="shortDate"></span>
	</div>
```

## Translation menu

To use the ```ddLocale``` menu you will need a placeholder in your HTML document.
```
	<div id="language"></div>
```
This is an example of what the functional menu looks like after initialisation with ```domId="language"``` and ```menu.menu=left```. With ```css``` you can style the menu, using ```id```, ```class``` and ```atrributes```.
```
	<div id="language" culture="nl-NL" class="open">
		<a id="language-menu-button"></a>
		<div class="left" id="language-menu-container">
			<a culture="en">English</a>
			<a class="selected" culture="nl-NL">Nederlands</a>
		</div>
	</div>
```

## css

Below is a simple css example to style the menu.
An important note about the main div with ```id="language"``` though. Because the popup menu is inside the main div with ```id="language"```, this main div must have an explicit ```absolute``` or ```relative``` position and the menu's container with ```id="language-menu-container"``` should be ```absolute```!
```
#language {
	position: absolute;
	width: 16px;
	height: 16px;
	border: 0px solid #1D6F42;
	top: 25px;
	left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 50%;
	cursor: hand;
	cursor: pointer;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	box-shadow: 0 2px 2px rgba(0,0,0,0.5);
	z-index: 10;
}
#language[culture=nl-NL] {
	background-image: url('../images/flags/nl.svg');
}
#language[culture=en] {
	background-image: url('../images/flags/en.svg');
}
#language.open {}
#language-menu-container {
	position: absolute;
	background-color: white;
	z-index: 100;
	top: 100%;
	left: 0;
	transform: translate(0, 10px);
}
#language-menu-container.left {
	left: 0;
	transform: translate(0, 10px);
}
body[direction=rtl] #language-menu-container.left {
	left: 100%;
	transform: translate(-100%, 10px);
}
#language-menu-container.right
{
	left: 100%;
	transform: translate(-100%, 10px);
}
#language-menu-container.center {
	left: 50%;
	transform: translate(-50%, 10px);
}
#language-menu-button {
	display: inline-block;
	width: 100%;
	height: 100%;
}
#language-menu-container a {
	display: block;
	line-height: 16px;
	border-bottom: 1px solid black;
	padding: 8px 10px;
}
#language-menu-container.center a {
	text-align: center;
}
#language-menu-container a.selected {
	background-color: lightgrey;
	cursor: default;
	text-decoration: none;
	color: black;
}
#language-menu-container a:not(.selected):hover {
	background-color: grey;
	color: white;
}
#language-menu-container a:last-child {
	border-bottom: 0;
}
```

## Whishlist

- [ ] Active placeholder expressions in static inline attributes...



If you like ```ddLocale``` you may consider [buying me a coffee](https://www.buymeacoffee.com/Mastermek).

[![Screenshot](repository_images/coffee.svg)](https://www.buymeacoffee.com/Mastermek)

Thank you for using ddLocale.

Mek
