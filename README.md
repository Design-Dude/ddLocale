# ddLocale
Very lightweight and easy to use JavaScript library for multilingual web apps and sites. Supports both script and inline translations for text, numbers, and dates from nestable JSON sources. Includes functionality for a fully customizable language menu.

## Dependencies
ddLocale is a completely independent JavaScript library.

The plugin was created with Sketch Plugin Manager, so if you are planning to use the source code you'll probably need [SKPM](https://github.com/skpm/skpm) too. Together with [sketch-module-web-view](https://github.com/skpm/sketch-module-web-view/tree/master/docs) as a bridge between the plugin and the overlay for user input.

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
		path: "lang", // path from the root to the language files, default "lang"
		language: "", // optional if culture is used, default "en" (lowercase)
		country: "", // optional, default "" (uppercase)
		culture: "nl-NL", // optional, overrules language and country if set
		replacement: "?", // optional, default __
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
		log: false, // optional, default true
		nocache: false // if true language files will be loaded using timestamps
	});
```

## Properties
To change the language you can ```ddLocale.set(...)``` which is an alternative to ```.init(...)```.

### cultures
Define a list of ```cultures``` to let ddLocale know which languages are available. A ```cultures``` object has a ```culture```, ```title``` and optional ```direction```.
#### culture
This is a standard country or language code like ```"nl-NL"``` or ```"en"``` Make sure the ```culture``` matches an available JSON language file name, for example ```nl-NL.json``` or ```en.json```.
#### title
The name of language in it's own language.
#### direction
Optional ```"ltr"``` or ```"rtl"```. If available the ```direction``` will be set as style and attribute to the ```body```.

### path
If your JSON-language files are not in a ```./lang/``` folder you can specify the new path. Just leave out ```./``` and ```/```.

### language, country and culture
```language``` and ```country``` define ```culture```. Make sure the combination matches the JSON language file name, for example ```nl-BE.json``` or ```en.json```.

### replacement
The optional ```replacement``` character is used as a filler for non-found placeholder expressions.

### ready
The ```ready()``` function will be called each time a new language is set and loaded. Use this function to save user settings with the new language for example.

### success
If other scripts or libraries use ```ddLocale``` you can start their initialisation from the ```success()``` function. ```success()``` will only be called once per (page) load.

## placeholder expressions

## JSON-language files

```var my_color = new ddBasecolor(color, ymck=false);```
Call ```ddBasecolor``` and provide any valid web colour specification. The following examples all create a red colour object, some with alpha channel.


You must always click the _Spiralize_ button first to start the drawing process. Subsequent updates can be automated by checking the _Auto update_ option. The operations are terminated as soon as the ddSpiral overlay is closed or loses its focus. The last option _Remove pre-selected objects_ automatically starts a cleaning process during this final termination.

### 1. Select a single object, such as an image, group, or symbol, and then run ddSpiral
If you select 1 object, not a path, the spiral rotates from the bounding box to the center of the object. Position, size and rotation are inherited from the selected object. The spiral is drawn on top of the object in the same group.


## css
Below is an simple example of all css menu options when ```menu.domId``` is set to ```"language"``` and where the additions ```.left```, ```.center``` and ```.right``` to ```...menu-container``` are examples of the ```menu.menu``` class name.
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
