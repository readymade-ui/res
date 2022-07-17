import * as mime from "mime";
import { join, extname } from "path";
const { file, serve } = Bun;

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
        "Content-Type": mime.getType(extension.split(".")[1]),
      },
    });
  },
});
