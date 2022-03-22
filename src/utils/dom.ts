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

  return fragment;
};

export const setRangeContainerStyle = (range: Range, node: Node, styles: Record<string, string>, isStart: boolean) => {
  const offset = isStart ? range.startOffset : range.endOffset;
  let flag = false;

  const nodeDFS = (currentNode: Node) => {
    if (range.startContainer === currentNode || range.endContainer === currentNode) {
      if (currentNode.nodeName === "#text") {
        const fragment = splitTextStyle(currentNode, offset, isStart ? 1 : 0, styles);
        currentNode.parentElement.replaceChild(fragment, currentNode);
      } else {
        setStyle(currentNode as HTMLElement, styles);
        currentNode.childNodes.forEach((child) => {
          if (child.nodeName !== "#text") {
            findSpanStyleRemove(child as HTMLSpanElement, styles);
          }
        });
      }
      flag = !flag;
      return;
    }
    const childNodes: Node[] = [];
    currentNode.childNodes.forEach((child) => childNodes.push(child));
    if (flag) {
      if (currentNode.nodeName === "#text") {
        const fragment = splitTextStyle(currentNode, offset, 0, styles);
        currentNode.parentElement.replaceChild(fragment, currentNode);
      } else {
        setStyle(currentNode as HTMLElement, styles);
        currentNode.childNodes.forEach((child) => {
          if (child.nodeName !== "#text") {
            findSpanStyleRemove(child as HTMLSpanElement, styles);
          }
        });
      }
    }

    const startIndex = isStart ? 0 : childNodes.length - 1;
    const isLast = (index: number) => {
      return isStart ? index < childNodes.length : index >= 0;
    };

    for (let i = startIndex; ; ) {
      if (isLast(i)) {
        const child = childNodes[i];
        nodeDFS(child);
        if (isStart) {
          i += 1;
        } else {
          i -= 1;
        }
      } else {
        break;
      }
    }
  };

  nodeDFS(node);
};

export const setStyleEndContainer = (range: Range, node: Node, styles: Record<string, string>) => {
  console.log(range);
  const contains = range.endContainer;
  if (contains.nodeName === "#text") {
    const fragment = splitTextStyle(node, range.startOffset, 1, styles);
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
