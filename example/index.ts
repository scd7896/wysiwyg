import { WYSIWYG } from "../src";

const wysiwyg = new WYSIWYG("#root", {
  image: {
    onUploadSingle: async (file: File) => {
      const url = URL.createObjectURL(file);

      return url;
    },
  },
});

wysiwyg.on("text:change", (value: string) => {
  console.log(value);
});
