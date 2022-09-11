![res.js](https://raw.githubusercontent.com/steveblue/res/master/res-logo.png)

Res is a Swiss-army knife for responsive sites. The class handles responsive state, parses the user agent, displays a visual grid for engineers to reference, acts as a singleton for resize and orientation change events.

Minified, Res comes in at 1.45KB gzipped, making it a perfect complement to your next project. Res is not dependent on any library or framework.

Res is simple to include in your project. Res takes one argument, an `Object` that describes responsive states: name, breakpoint information, and visual grid settings. Each state is defined with a key: name (`state`). `breakpoint` is the only required property on this `Object`, the maximum pixel value of the responsive state, equivocal to `max-width` in a CSS media query.

If you wish to position elements via responsive design grid, you can also provide optional number of columns (`numberOfColumns`), outer margin (`gutterOnOutside`) and gutter (`gutter`). The visual grid is by default centered horizontally, although an optional offset (`offset`) from the left can be provided to position the grid appropriately. Res will calculate the position of columns and size of column spans automatically. An example of setting multiple breakpoints and supplying the units needed to create a grid for each breakpoint is below.

```javascript
const states = {
  mobile: {
    breakpoint: 640,
    numberOfColumns: 4,
    gutterOnOutside: true,
    gutter: 10,
    offset: 0,
  },
  tablet: {
    breakpoint: 1024,
    numberOfColumns: 12,
    gutterOnOutside: true,
    gutter: 20,
    offset: 0,
  },
  desktop: {
    breakpoint: 1920,
    totalWidth: 960,
    columnWidth: 60,
    numberOfColumns: 16,
    gutterOnOutside: true,
    gutter: 22,
    offset: 0,
    center: true,
  },
};
```

Reference the position and width of elements on a visual design grid in JavaScript. In the below example, `width` is set to the horizontal width of four columns by passing `4` to the `columnSpan` method. The element can be placed on the eighth column by calling the `columnPosition` method.

```javascript
const width = r.grid.columnSpan(4);
const xPosition = r.grid.columnPosition(8);
```

### Singleton

Res emits a `stateChange` Event on `window.onresize` or `window.onorientationchange`. You can listen for the `stateChange` event on the window and reposition and resize elements based on `stateChange`. This way you can make your app more performant by not repeating `window.onresize` events.

```javascript
window.addEventListener("stateChange", function (ev) {
  if (r.state === "portrait") {
    width = r.grid.columnSpan(4);
    xPosition = r.grid.columnPosition(8);
  }

  if (r.state === "tablet") {
    width = r.grid.columnSpan(6);
    xPosition = r.grid.columnPosition(6);
  }
});
```

### Browser Detection

Res doesn't just define breakpoints in Javascript. The instance of the Res class also provides easy access to OS and Browser type, detects whether a device is in portrait or landscape, and if the device operates with mouse or touch input. Once instantiated as an object, you can do things based on device type, input, orientation, os, and breakpoint. For example, this statement checks if the device type is Android and the device is oriented in landscape.

```javascript
if (r.os === "android" && r.device === "tablet" && r.orientation === "landscape") {
  // do something here for android tablets in landscape mode
}
```

Some may think browser detection like in the above example is gross. Given the fragmentation of the browser landscape, feature detection en masse comes at the cost of bundle size. It wouldn't be viable to provide a solution that detects every feature, for instance. Detecting features should be done ad hoc for performance.

The small footprint of Res is meant to provide an easy-to-understand interface for browser detection that compliments feature detection methods. By standardizing the way the user agent is referenced, Res makes it easier to deprecate browser detection past its use value. User-agent detection is tried and tested in Res since 2013.

### Beta

Res is currently in beta. Use at your discretion.

Res has been around since 2013 in one form or another and portions of the library have been tested in production since then. The user agent parsing and grid were in use on production websites for several years before getting refactored to TypeScript and ES2020 compliant code. This refactor, combined with new features, and inclusion under the `@readymade` namespace prompted a new beta. Res is not dependent on other parts of the `@readymade` ecosystem.

### Roadmap

Prior to 1.0.0, Res should gain the following features:

- Web Component that displays the visual design grid for development
- CSS framework that provides CSS variables in real-time for the grid

### Report a Problem

Submit issues in the issue tracker, fork the repo and make a pull request to add a feature.
