import { Res } from "./res.js";

const onStateChange = () => {
  $(".box:eq(0)").text("state: " + r.state);
  $(".box:eq(1)").text("browser: " + r.browser);
  $(".box:eq(2)").text("os: " + r.os);
  $(".box:eq(3)").text("columns: " + r.grid.cols);
  switch (r.state) {
    case "mobile":
      $(".box").each(function () {
        $(this).css("width", r.grid.colSpan[4]);
        $(this).css("top", 80 * $(this).index() + "px");
        $(this).css("left", r.grid.col[0]);
      });
      break;
    case "small":
      $(".box").css("top", "0px");
      $(".box").css("width", r.grid.colSpan[6]);
      $(".box:eq(0)").css("left", r.grid.col[0]);
      $(".box:eq(1)").css("left", r.grid.col[6]);
      $(".box:eq(2)").css("top", $(".box:eq(0)").height() + 20);
      $(".box:eq(2)").css("left", r.grid.col[0]);
      $(".box:eq(3)").css("top", $(".box:eq(0)").height() + 20);
      $(".box:eq(3)").css("left", r.grid.col[6]);
      break;
    case "desktop":
      $(".box").css("width", r.grid.colSpan[4]);
      $(".box").css("top", "0px");
      $(".box:eq(0)").css("left", r.grid.col[0]);
      $(".box:eq(1)").css("left", r.grid.col[4]);
      $(".box:eq(2)").css("left", r.grid.col[8]);
      $(".box:eq(3)").css("left", r.grid.col[12]);
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
