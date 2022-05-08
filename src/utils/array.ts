export function findByAfterIndex(array: string[], target: string, index: number) {
  let result = -1;
  const diff: string[] = [];
  for (let i = index; i < array.length; i++) {
    if (array[i] === target) {
      return {
        result: i,
        diff,
      };
    } else {
      diff.push(array[i]);
    }
  }

  return {
    result,
    diff,
  };
}
