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
}

export class WYSIWYG {
  constructor(target: HTMLElement | string, options?: IEditorOptions);
  undo: () => void;
  redo: () => void;
  insertNode: (element: HTMLElement) => void;
  setRangeStyle: (style: Record<string, string>) => void;
}
