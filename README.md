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
		log: false, // optional, default true
		language: "", // optional if culture is used, default "en" (lowercase)
		country: "", // optional, default "" (uppercase)
		culture: "nl-NL", // optional, overrules language and country if set
		replacement: "?", // optional, default __
		path: "lang", // path from the root to the language files, default "lang"
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
		menu: {
			domId: "language", // id of dom-node where language menu will be triggered
			button: "", // "long" title, "short" language code or some translation "key"
			menu: "center" // optional, className for the dropdown menu
		},
		cultures: [ // all available languages
			{
				code: "en",
				title: "English"
			},
			{
				code: "nl-NL",
				title: "Nederlands",
				direction: "ltr" // optional ltr or rtl
			}
		],
		nocache: false // if true language files will be loaded using timestamps
	});
```

## Properties
To change the language you can ```ddLocale.set(...)``` which is an alternative to ```.init(...)```.

#### language, country an d culture
```language``` and ```country``` determine ```culture``` which is the als the name of JSON-language file.

#### replacement
The ```replacement``` character is used as a filler for non-found placeholder expressions.

#### path
If your JSON-language files are not in a ```./lang/``` folder you can specify the new path. Leave out the preceding ```./``` and leading ```/```. 


## placeholder expressions

## JSON-language files

```var my_color = new ddBasecolor(color, ymck=false);```
Call ```ddBasecolor``` and provide any valid web colour specification. The following examples all create a red colour object, some with alpha channel.

- [x] Make bezier from points
- [x] Use data instead of spline
- [x] Move outgoing tangents to previous point in data + adjsutment script
- [ ] ~~Change weight into weightDistribution (nope)~~

You must always click the _Spiralize_ button first to start the drawing process. Subsequent updates can be automated by checking the _Auto update_ option. The operations are terminated as soon as the ddSpiral overlay is closed or loses its focus. The last option _Remove pre-selected objects_ automatically starts a cleaning process during this final termination.

### 1. Select a single object, such as an image, group, or symbol, and then run ddSpiral
If you select 1 object, not a path, the spiral rotates from the bounding box to the center of the object. Position, size and rotation are inherited from the selected object. The spiral is drawn on top of the object in the same group.

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


If you like it you may consider [buying me a coffee](https://www.buymeacoffee.com/Mastermek).

[![Screenshot](repository_images/coffee.svg)](https://www.buymeacoffee.com/Mastermek)

Thank you for using ddSpiral.

Mek
