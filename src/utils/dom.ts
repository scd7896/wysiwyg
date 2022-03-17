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
