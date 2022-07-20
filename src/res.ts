interface GridSettings {
  numberOfColumns?: number;
  center?: boolean;
  columnPositions?: number[];
  columnSpan?: (index: number) => number;
  width?: number;
  gutterOnOutside?: boolean;
  gutter?: number;
  columnWidth?: number;
  offset?: number;
  totalWidth?: number;
}

class Res {
  browser: string;
  device: string;
  initCallback: (args: any) => any;
  input: string;
  grid: GridSettings;
  gridSettings: Record<string, GridSettings>;
  orientation: string;
  os: string;
  state: string;
  states: Record<string, number[]>;
  userAgent: string;
  version: string;
  width: number;
  constructor(json, cb) {
    this.userAgent = navigator.userAgent.toLowerCase();
    this.state = undefined;
    this.input = undefined;
    this.orientation = undefined;
    this.device = undefined;
    this.os = undefined;
    this.browser = undefined;
    this.version = undefined;
    this.width = 0;
    this.grid = {};
    this.states = {};
    this.gridSettings = {};
    let lastBreakpoint = 0;

    for (let i = 0; i < json.length; i++) {
      this.states[json[i].state] = [lastBreakpoint + 1, json[i].breakpoint];
      this.gridSettings[json[i].state] = json[i];
      lastBreakpoint = json[i].breakpoint;
    }
    this.initCallback = cb;
    this.init();
  }

  onInit(args) {
    setTimeout(() => this.initCallback(args), 1);
  }

  setState() {
    if (this.device === "desktop") {
      this.width = window.innerWidth;
    } else if (this.device !== "desktop") {
      if (this.orientation === "portrait") {
        this.width = screen.width;
      } else if (this.orientation === "landscape") {
        this.width = screen.height;
      }
    }

    for (let key in this.states) {
      if (this.states.hasOwnProperty(key)) {
        if (
          this.width >= this.states[key][0] &&
          this.width <= this.states[key][1]
        ) {
          if (this.state != key) {
            this.state = key;
            return this.state;
          }
        }
      }
    }
  }

  inputCheck() {
    if (this.os === "ios" || this.os === "android" || this.os === "winphone") {
      this.input = "touch";
    } else {
      this.input = "mouse";
    }
  }

  browserCheck() {
    let tem,
      M =
        this.userAgent.match(
          /(edge|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];

    if (this.userAgent.match(/(edg(?=\/))\/?\s*(\d+)/i)) {
      M = this.userAgent.match(/(edg(?=\/))\/?\s*(\d+)/i);
      this.browser = "edge";
      this.version = M[2];
      return "Edge " + (M[2] || "");
    }
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(this.userAgent) || [];
      this.browser = "msie";
      this.version = tem[1];
      return "IE " + (tem[1] || "");
    }
    if (M[1] === "Chrome") {
      tem = this.userAgent.match(/\bOPR\/(\d+)/);
      if (tem != null) {
        this.browser = "opera";
        this.version = tem[1];
        return "Opera " + tem[1];
      }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];

    if ((tem = this.userAgent.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
    this.browser = M[0];
    this.version = M[1];
    return M.join(" ");
  }

  osCheck() {
    if (navigator.appVersion.indexOf("Win") != -1) {
      this.os = "windows";
      this.device = "desktop";
    } else if (
      navigator.appVersion.indexOf("Mac") != -1 &&
      navigator.userAgent.match(/(iPhone|iPod|iPad)/) == null
    ) {
      this.os = "macos";
      this.device = "desktop";
    } else if (navigator.userAgent.indexOf("Android") > -1) {
      this.os = "android";
      if (navigator.userAgent.indexOf("Mobile") > -1) {
        this.device = "mobile";
      } else {
        this.device = "tablet";
      }
    } else if (navigator.userAgent.indexOf("windows phone") > 0) {
      this.os = "windows";
      this.device = "mobile";
    } else if (navigator.appVersion.indexOf("X11") != -1) {
      this.os = "unix";
      this.device = "desktop";
    } else if (navigator.appVersion.indexOf("Linux") != -1) {
      this.os = "linux";
      this.device = "desktop";
    } else if (
      navigator.userAgent.match(/(iPhone|iPod|iPad)/) !== null &&
      navigator.userAgent.match(/(iPhone|iPod|iPad)/).length > 0
    ) {
      this.os = "ios";
      if (this.userAgent.indexOf("iphone") > 0) {
        this.device = "iphone";
      }
      if (this.userAgent.indexOf("ipod") > 0) {
        this.device = "ipod";
      }
      if (this.userAgent.indexOf("ipad") > 0) {
        this.device = "ipad";
      }
    } else {
      this.os = "unknown";
    }
  }

  gridHelper(key) {
    let columnPositions,
      colArr = [],
      columnSpan,
      span = [],
      margin,
      gutter,
      numberOfColumns,
      width,
      columnWidth,
      offset,
      centeredOffset;

    numberOfColumns = this.gridSettings[key].numberOfColumns;
    gutter = this.gridSettings[key].gutter;
    margin = this.gridSettings[key].gutterOnOutside === true ? gutter : 0;
    offset = this.gridSettings[key].offset ? this.gridSettings[key].offset : 0;
    centeredOffset = this.gridSettings[key].center
      ? window.innerWidth / 2 - this.gridSettings[key].totalWidth / 2
      : 0;

    columnPositions = [];
    columnSpan = [];
    width =
      (this.gridSettings[key].totalWidth
        ? this.gridSettings[key].totalWidth
        : window.innerWidth) -
      margin * 2 +
      gutter;
    columnWidth = this.gridSettings[key].columnWidth
      ? this.gridSettings[key].columnWidth - gutter
      : width / numberOfColumns - gutter;

    for (let i = 0; i < numberOfColumns; i++) {
      if (i === 0) {
        columnSpan = 0;
      } else {
        columnSpan =
          columnWidth * i +
          gutter * (i - 1) -
          (this.gridSettings[key].columnWidth ? i : 0);
      }
      columnPositions =
        (width / numberOfColumns) * i + margin + offset + centeredOffset;
      colArr.push(columnPositions);
      span.push(columnSpan);

      if (i === numberOfColumns - 1) {
        columnSpan = columnWidth * (i + 1) + gutter * i;
        span.push(columnSpan);
      }
    }
    return {
      gutterOnOutside: this.gridSettings[key].gutterOnOutside,
      numberOfColumns,
      columnPositions: colArr,
      columnSpan: (index) => span[index],
      width,
      gutter,
    };
  }

  resize() {
    if (window.innerHeight > window.innerWidth) {
      this.orientation = "portrait";
    } else {
      this.orientation = "landscape";
    }

    this.setState();

    if (this.gridSettings.hasOwnProperty(this.state)) {
      this.grid = this.gridHelper(this.state);
    }

    this.onInit(this);

    window.dispatchEvent(
      new CustomEvent("stateChange", {
        bubbles: false,
        cancelable: true,
      })
    );

    return this;
  }

  init() {
    this.osCheck();
    this.inputCheck();
    this.browserCheck();
    this.setState();

    if (this.gridSettings.hasOwnProperty(this.state)) {
      this.grid = this.gridHelper(this.state);
    }

    window.onorientationchange = () => {
      this.resize();
    };

    window.onresize = () => {
      this.resize();
    };

    this.resize();
  }
}

export { Res };
