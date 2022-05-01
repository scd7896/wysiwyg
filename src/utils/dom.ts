export const hasContains = (wrapper: HTMLElement | Node, target: HTMLElement | Node) => {
  let tmpTarget = target;
  let result = false;
  while (tmpTarget) {
    if (tmpTarget === wrapper) return true;
    tmpTarget = tmpTarget.parentElement;
  }

  return result;
};

export const removeStyles = (target: HTMLElement | Node, key: string, value: string) => {
  let tmpTarget = target;

  while (tmpTarget) {
    if (tmpTarget instanceof HTMLElement) {
      if (tmpTarget.style.getPropertyValue(key) === value) tmpTarget.style.removeProperty(key);
    }
    tmpTarget = tmpTarget.parentElement;
  }
};

export const getParentStyleValues = (target: HTMLElement | Node, style: string) => {
  let tmpTarget = target;
  const result: Record<string, number> = {};
  while (tmpTarget) {
    if (tmpTarget instanceof HTMLElement) {
      result[tmpTarget.style.getPropertyValue(style)] = 1;
    }
    tmpTarget = tmpTarget.parentElement;
  }

  return Object.keys(result);
};

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

const splitTextStyle = (node: Node, offset: number, applyStyleIndex: 0 | 1, styles: Record<string, string>) => {
  const fragment = document.createDocumentFragment();
  const textContent = node.textContent;
  const textArrays = [textContent.slice(0, offset), textContent.slice(offset)];
  const span = document.createElement("span");
  setStyle(span, styles);
  span.textContent = textArrays[applyStyleIndex];
  const textNode = document.createTextNode(textArrays[applyStyleIndex === 1 ? 0 : 1]);
  if (applyStyleIndex) {
    fragment.appendChild(textNode);
    fragment.appendChild(span);
  } else {
    fragment.appendChild(span);
    fragment.appendChild(textNode);
  }

  return [fragment, span];
};

export const setRangeContainerStyle = (range: Range, node: Node, styles: Record<string, string>, isStart: boolean) => {
  const offset = isStart ? range.startOffset : range.endOffset;
  const [fragment, span] = splitTextStyle(node, offset, isStart ? 1 : 0, styles);
  node.parentElement.replaceChild(fragment, node);
  return span;
};

export const setStyle = (node: HTMLElement, style: Record<string, string>) => {
  const keys = Object.keys(style);
  keys.map((key) => node.style.setProperty(key, style[key]));
};

export const findElementByType = (target: HTMLElement, type: string) => {
  let tmpTarget = target;
  while (tmpTarget) {
    if (tmpTarget.dataset.type === type) return tmpTarget;
    tmpTarget = tmpTarget.parentElement;
  }
  return null;
};

export const findResizeNodeByParentNode = (target: HTMLElement) => {
  let tmpTarget = target;
  while (tmpTarget) {
    if (tmpTarget.nodeName === "IMG" || tmpTarget.dataset.nodeName === "IFRAME") return tmpTarget;
    tmpTarget = tmpTarget.parentElement;
  }
  return null;
};

export const findParentByNodeName = (target: HTMLElement, nodeName: string) => {
  let tmpTarget = target;

  while (tmpTarget) {
    if (tmpTarget.nodeName === nodeName) return tmpTarget;
    tmpTarget = tmpTarget.parentElement;
  }

  return null;
};
