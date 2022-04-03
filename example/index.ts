import { WYSIWYG } from "../src";

new WYSIWYG("#root", {
  image: {
    onUploadSingle: async (file: File) => {
      const url = URL.createObjectURL(file);
      console.log(url);
      return url;
    },
  },
});
