import * as mime from "mime/lite";
import { file, serve, Transpiler } from "bun";
import { join, extname } from "path";

const transpiler = new Transpiler({ loader: "ts" });

async function fetch(req) {
  const { pathname } = new URL(req.url);
  const extension = extname(req.url) ? extname(req.url) : ".html";
  let blob;
  let filepath;
  let contentType;
  if (pathname === "/") {
    filepath = join(process.cwd(), "./public/index.html");
    blob = file(filepath);
  } else {
    filepath = join(process.cwd(), pathname);
    blob = await file(filepath);
  }
  if (extension === ".ts") {
    const contents = await blob.text();
    blob = transpiler.transformSync(contents, "ts");
    contentType = mime.getType("js");
  } else {
    contentType = mime.getType(extension.split(".")[1]);
  }
  return new Response(blob, {
    headers: {
      "Content-Type": contentType,
    },
  });
}

serve({
  port: 3000,
  fetch,
});
