export const hasContains = (wrapper: HTMLElement, target: HTMLElement) => {
  let tmpTarget = target;
  let result = false;
  while (tmpTarget) {
    if (tmpTarget === wrapper) return true;
    tmpTarget = tmpTarget.parentElement;
  }

  return result;
};

export const setStyle = (node: HTMLElement, style: Record<string, string>) => {
  const keys = Object.keys(style);
  keys.map((key) => node.style.setProperty(key, style[key]));
};