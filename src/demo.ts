import { Res } from "./res";
class ResGrid extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = `
    <style>
    :host {
      display: block;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.1);
      width: 100%;
      height: 100%;
    }
    </style>
    <div class="grid-container"></div>
    `;
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
  get container$() {
    return this.shadowRoot.querySelector(".grid-container");
  }
}

customElements.define("res-grid", ResGrid);
const grid = document.createElement("res-grid") as ResGrid;
document.body.appendChild(grid);

const onStateChange = () => {
  const boxes: HTMLUListElement[] = Array.from(
    document.querySelectorAll(".box")
  );
  console.log(r.grid);
  boxes[0].innerText = "state: " + r.state;
  boxes[1].innerText = "browser: " + r.browser;
  boxes[2].innerText = "os: " + r.os;
  boxes[3].innerText = "columns: " + r.grid.cols;

  grid.container$.innerHTML = "";

  switch (r.state) {
    case "mobile":
      boxes.forEach((box, index) => {
        box.style.width = r.grid.colSpan[4] + "px";
        box.style.top = 80 * index + "px";
        box.style.left = r.grid.col[0] + "px";
      });
      break;
    case "small":
      boxes.forEach((box) => {
        box.style.width = r.grid.colSpan[6] + "px";
        box.style.top = "0px";
      });
      boxes[0].style.left = r.grid.col[0] + "px";
      boxes[1].style.left = r.grid.col[6] + "px";
      boxes[2].style.top = boxes[0].clientHeight + 20 + "px";
      boxes[2].style.left = r.grid.col[0] + "px";
      boxes[3].style.top = boxes[0].clientHeight + 20 + "px";
      boxes[3].style.left = r.grid.col[6] + "px";
      break;
    case "desktop":
      boxes.forEach((box) => {
        box.style.width = r.grid.colSpan[4] + "px";
        box.style.top = "0px";
      });
      boxes[0].style.left = r.grid.col[0] + "px";
      boxes[1].style.left = r.grid.col[4] + "px";
      boxes[2].style.left = r.grid.col[8] + "px";
      boxes[3].style.left = r.grid.col[12] + "px";
      break;
  }

  r.grid.col.forEach((col) => {
    const guide = document.createElement("div");
    guide.style.position = "absolute";
    guide.style.width = r.grid.colSpan[1] + "px";
    guide.style.height = "100%";
    guide.style.left = col + "px";
    guide.style.background = "rgba(0,0,255,0.1)";
    grid.container$.appendChild(guide);
  });
};

var r = new Res(
  [
    {
      state: "mobile",
      breakpoint: 640,
      cols: 4,
      gutter: 20,
      margin: 10,
    },
    {
      state: "small",
      breakpoint: 1024,
      cols: 12,
      gutter: 40,
      margin: 20,
    },
    {
      state: "desktop",
      breakpoint: 1920,
      cols: 16,
      gutter: 80,
      margin: 20,
    },
  ],
  onStateChange
);

window.addEventListener("stateChange", onStateChange);
