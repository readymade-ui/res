/*
   @readymade/res 0.0.1

   Author: Steve Belovarich

   The MIT License (MIT)
   Copyright (c) 2022 Steve Belovarich

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.

   Usage: const r = new Res([{
                     "state": "portrait",
                     "breakpoint": 420,
                     "cols": 4,
                     "margin": 10,
                     "gutter": 10
                 },
                 {
                     "state": "landscape",
                     "breakpoint": 640,
                     "cols": 4,
                     "margin": 10,
                     "gutter": 10
                 },
                 {
                     "state": "tablet",
                     "breakpoint": 768,
                     "cols": 12,
                     "margin": 40,
                     "gutter": 10
                 }], onStateChange);

                 function onStateChange(ev,i){

                    console.log(r.state); // get the state from the object you created

                 }

                 window.addEventListener('stateChange',onStateChange);
*/

class Res {
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
      if (
        json[i].cols !== undefined &&
        json[i].margin !== undefined &&
        json[i].gutter !== undefined
      ) {
        this.gridSettings[json[i].state] = [
          json[i].cols,
          json[i].margin,
          json[i].gutter,
        ];
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
      cols: cols,
      col: colArr,
      colSpan: colSpanArr,
      width: width,
      margin: margin,
      gutter: gutter,
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
