# WYSIWYG

Demo: https://scd7896.github.io/wysiwyg/example/  
<img width="434" alt="스크린샷 2022-05-18 오후 10 02 30" src="https://user-images.githubusercontent.com/46440142/169278109-d9b1a764-cc07-4ea9-b6ac-41817334b0ac.png">. 


## Example

```javascript
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

const insertWantElement = document.createElement("div");
insertWantElement = "test Element";
wysiwyg.insertNode(insertWantElement);
```

## WYSIWYG

```typescript
class WYSIWYG {
  undo: () => void;
  redo: () => void;
  insertNode: (element: HTMLElement) => void;
  setRangeStyle: (style: Record<string, string>) => void;
  on: (type: string, listener: Function) => void;
  emit: (type: string, ...args: any[]) => void;
  removeListener: (type: string, listener: Function) => void;
  undoHistory: IDiff[][];
  redoHistory: IDiff[][];
}

interface IDiff {
  line: number;
  value: string;
  type: "insert" | "delete";
}
```

## Event

| name        | function               | description                                |
| ----------- | ---------------------- | ------------------------------------------ |
| text:change | (text: string) => void | board의 내용이 변경 될 때 마다 실행됩니다. |
