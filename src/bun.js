import { join, extname } from "path";
const { file, serve } = Bun;

const MIME_TYPES = {
  ico: "image/x-icon",
  css: "text/css",
  js: "text/javascript",
  json: "application/json",
  html: "text/html",
};

serve({
  port: 3000,
  async fetch(req) {
    const { pathname } = new URL(req.url);
    const extension = extname(req.url) ? extname(req.url) : ".html";
    let blob;
    if (pathname === "/") {
      blob = file(join(process.cwd(), "./public/index.html"));
    } else {
      blob = file(join(process.cwd(), "./public/", new URL(req.url).pathname));
    }
    return new Response(blob, {
      headers: {
        "Content-Type": MIME_TYPES[extension.split(".")[1]],
      },
    });
  },
});
