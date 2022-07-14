import "./demo.css";

import { Res } from "./res";

const onStateChange = () => {
  const boxes = document.querySelectorAll(".box");
  console.log(r.grid);
  boxes[0].innerText = "state: " + r.state;
  boxes[1].innerText = "browser: " + r.browser;
  boxes[2].innerText = "os: " + r.os;
  boxes[3].innerText = "columns: " + r.grid.cols;
  switch (r.state) {
    case "mobile":
      boxes.forEach((box, index) => {
        box.style.width = r.grid.colSpan[4];
        box.style.top = 80 * index + "px";
        box.style.left = r.grid.col[0];
      });
      break;
    case "small":
      boxes.forEach((box) => {
        box.style.width = r.grid.colSpan[6];
        box.style.top = "0px";
      });
      boxes[0].style.left = r.grid.col[0];
      boxes[1].style.left = r.grid.col[6];
      boxes[2].style.top = boxes[0].clientHeight + 20;
      boxes[2].style.left = r.grid.col[0];
      boxes[3].style.top = boxes[0].clientHeight + 20;
      boxes[3].style.left = r.grid.col[6];
      break;
    case "desktop":
      boxes.forEach((box) => {
        box.style.width = r.grid.colSpan[4];
        box.style.top = "0px";
      });
      boxes[0].style.left = r.grid.col[0];
      boxes[1].style.left = r.grid.col[4];
      boxes[2].style.left = r.grid.col[8];
      boxes[3].style.left = r.grid.col[12];
      break;
  }
};

var r = new Res(
  [
    {
      state: "mobile",
      breakpoint: 640,
      cols: 4,
      margin: 20,
      gutter: 10,
    },
    {
      state: "small",
      breakpoint: 1024,
      cols: 12,
      margin: 40,
      gutter: 20,
    },
    {
      state: "desktop",
      breakpoint: 1920,
      cols: 16,
      margin: 80,
      gutter: 20,
    },
  ],
  onStateChange
);

window.addEventListener("stateChange", onStateChange);
