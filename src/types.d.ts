export interface IImageOptions {
  onUploadSingle?: (file: File) => Promise<string>;
}

export interface IVideoOptions {
  onUpload?: (file: File) => Promise<string>;
}

export interface IEditorOptions {
  image?: IImageOptions;
  video?: IVideoOptions;
  defaultValue?: string;
  menus?: string[];
}

export class WYSIWYG {
  constructor(target: HTMLElement | string, options?: IEditorOptions);
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

export interface IDiff {
  line: number;
  value: string;
  type: "insert" | "delete";
}
