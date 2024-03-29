class Res {
  constructor(json, cb) {
    this.userAgent = navigator.userAgent.toLowerCase();
    this.state = void 0;
    this.input = void 0;
    this.orientation = void 0;
    this.device = void 0;
    this.os = void 0;
    this.browser = void 0;
    this.version = void 0;
    this.width = 0;
    this.grid = {};
    this.states = {};
    this.gridSettings = {};
    let lastBreakpoint = 0;
    for (let i = 0; i < json.length; i++) {
      this.states[json[i].state] = [lastBreakpoint + 1, json[i].breakpoint];
      if (json[i].cols !== void 0 && json[i].margin !== void 0 && json[i].gutter !== void 0) {
        this.gridSettings[json[i].state] = [json[i].cols, json[i].margin, json[i].gutter];
      }
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
        if (this.width >= this.states[key][0] && this.width <= this.states[key][1]) {
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
      M = this.userAgent.match(/(edge|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
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
    } else if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.match(/(iPhone|iPod|iPad)/) == null) {
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
    } else if (navigator.userAgent.match(/(iPhone|iPod|iPad)/) !== null && navigator.userAgent.match(/(iPhone|iPod|iPad)/).length > 0) {
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
    let col,
      colArr = [],
      colSpan,
      colSpanArr = [],
      margin,
      gutter,
      cols,
      width,
      columnWidth;
    cols = this.gridSettings[key][0];
    margin = this.gridSettings[key][1];
    gutter = this.gridSettings[key][2];
    col = [];
    colSpan = [];
    width = window.innerWidth - margin * 2 + gutter;
    columnWidth = width / cols - gutter;
    for (let i = 0; i < cols; i++) {
      if (i === 0) {
        colSpan = 0;
      } else {
        colSpan = columnWidth * i + gutter * (i - 1);
      }
      col = (width / cols) * i + margin;
      colArr.push(col);
      colSpanArr.push(colSpan);
      if (i === cols - 1) {
        colSpan = columnWidth * (i + 1) + gutter * i;
        colSpanArr.push(colSpan);
      }
    }
    return {
      cols,
      col: colArr,
      colSpan: colSpanArr,
      width,
      margin,
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
