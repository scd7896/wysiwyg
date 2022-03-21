export const hasContains = (wrapper: HTMLElement | Node, target: HTMLElement | Node) => {
  let tmpTarget = target;
  let result = false;
  while (tmpTarget) {
    if (tmpTarget === wrapper) return true;
    tmpTarget = tmpTarget.parentElement;
  }

  return result;
};

export const hasStyles = (style: string, target: HTMLElement | Node) => {};

export const findSpanStyleRemove = (span: HTMLSpanElement, styles: Record<string, string>) => {
  const styleKeys = Object.keys(styles);
  styleKeys.map((key) => span.style.removeProperty(key));

  span.childNodes.forEach((child) => {
    if (child.nodeName === "SPAN") findSpanStyleRemove(child as HTMLSpanElement, styles);
  });

  if (span.style.length === 0) {
    const text = document.createTextNode(span.textContent);
    span.parentElement.replaceChild(text, span);
  }
};

export const setStyleFullText = (node: Node, styles: Record<string, string>) => {
  const span = document.createElement("span");
  span.textContent = node.textContent;
  setStyle(span, styles);
  node.parentElement.replaceChild(span, node);
};

export const setStyleStartContainer = (range: Range, styles: Record<string, string>) => {
  const contains = range.startContainer;
  if (contains.nodeName === "#text") {
    const textContent = contains.textContent;
    const fragment = document.createDocumentFragment();
    const text = document.createTextNode(textContent.slice(0, range.startOffset));
    const span = document.createElement("span");
    span.textContent = textContent.slice(range.startOffset);
    setStyle(span, styles);
    fragment.appendChild(text);
    fragment.appendChild(span);
    contains.parentElement.replaceChild(fragment, contains);
  } else {
    setStyle(contains as HTMLElement, styles);
    contains.childNodes.forEach((child) => {
      if (child.nodeName !== "#text") {
        findSpanStyleRemove(child as HTMLSpanElement, styles);
      }
    });
  }
};

export const setStyleEndContainer = (range: Range, styles: Record<string, string>) => {
  console.log(range);
  const contains = range.endContainer;
  if (contains.nodeName === "#text") {
    const textContent = contains.textContent;
    const fragment = document.createDocumentFragment();
    const span = document.createElement("span");
    setStyle(span, styles);
    span.textContent = textContent.slice(0, range.endOffset);
    const text = document.createTextNode(textContent.slice(range.endOffset));
    fragment.appendChild(span);
    fragment.appendChild(text);
    contains.parentElement.replaceChild(fragment, contains);
  } else {
    setStyle(contains as HTMLElement, styles);
    contains.childNodes.forEach((child) => {
      if (child.nodeName !== "#text") {
        findSpanStyleRemove(child as HTMLSpanElement, styles);
      }
    });
  }
};

export const setStyle = (node: HTMLElement, style: Record<string, string>) => {
  const keys = Object.keys(style);
  keys.map((key) => node.style.setProperty(key, style[key]));
};

export const findByTypeElement = (target: HTMLElement, type: string) => {
  let tmpTarget = target;
  while (tmpTarget) {
    if (tmpTarget.dataset.type === type) return tmpTarget;
    tmpTarget = tmpTarget.parentElement;
  }
  return null;
};
