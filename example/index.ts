import { WYSIWYG } from "../src/wysiwyg";

const wysiwyg = new WYSIWYG("#root");

wysiwyg.on("text:change", (value: string) => {
  console.log(value);
});
