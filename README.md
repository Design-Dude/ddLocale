# ddLocale
Very lightweight and easy to use JavaScript library for multilingual web apps and sites. Supports both script and inline translations for text, numbers, and dates from nestable JSON sources. Includes functionality for a fully customizable language menu.

## Dependencies
ddLocale is a completely independent JavaScript library.

The plugin was created with Sketch Plugin Manager, so if you are planning to use the source code you'll probably need [SKPM](https://github.com/skpm/skpm) too. Together with [sketch-module-web-view](https://github.com/skpm/sketch-module-web-view/tree/master/docs) as a bridge between the plugin and the overlay for user input.

## Installation
Download and double-click the [latest version.](https://github.com/Design-Dude/ddSpiral/releases/latest) Or drop it on the Sketch app icon. 

## How it works
Just select up to 2 objects and/or an open path and run 🌀 ddSpiral from 🧰 ddTools in the plugin menu. You can also hit CTRL-ALT-SHIFT-S (All future ddTools wil use CTRL-ALT-SHIFT). The plugin presents you with an overlay for adjustments. The spiral will behave slightly differently depending on the selected objects. As long as you stay in the overlay you can update the spiral by altering:
- size and rotation (preset by the selected objects)
- direction (clockwise or counterclockwise),
- number of loops,
- number of points per loop (tangents),
- tension (0%=sharp corners, 100%=optimal curves, <500%=experimental loose curves).
- transition (linear, ease in and out, ease-in or ease-out),
- and easing rate (0%=linear, 50%=standard css easing, <500%=exponetial).

```var my_color = new ddBasecolor(color, ymck=false);```
Call ```ddBasecolor``` and provide any valid web colour specification. The following examples all create a red colour object, some with alpha channel.

- [x] Make bezier from points
- [x] Use data instead of spline
- [x] Move outgoing tangents to previous point in data + adjsutment script
- [ ] ~~Change weight into weightDistribution (nope)~~

You must always click the _Spiralize_ button first to start the drawing process. Subsequent updates can be automated by checking the _Auto update_ option. The operations are terminated as soon as the ddSpiral overlay is closed or loses its focus. The last option _Remove pre-selected objects_ automatically starts a cleaning process during this final termination.

### 1. Select a single object, such as an image, group, or symbol, and then run ddSpiral
If you select 1 object, not a path, the spiral rotates from the bounding box to the center of the object. Position, size and rotation are inherited from the selected object. The spiral is drawn on top of the object in the same group.

![Screenshot](repository_images/object.svg)


If you like it you may consider [buying me a coffee](https://www.buymeacoffee.com/Mastermek).

[![Screenshot](repository_images/coffee.svg)](https://www.buymeacoffee.com/Mastermek)

Thank you for using ddSpiral.

Mek
