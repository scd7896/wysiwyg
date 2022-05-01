export const getHostName = (url: string) => {
  const a = document.createElement("a");
  a.href = url;
  return a.hostname;
};

export const queryParse = (url: string) => {
  const a = document.createElement("a");
  a.href = url;
  const search = a.search
    .replace("?", "")
    .split("=")
    .reduce<Record<string, string>>((acc, string, index, arr) => {
      if (index % 2 === 0) {
        acc[string] = "";
      } else {
        acc[arr[index - 1]] = string;
      }
      return acc;
    }, {});

  return search;
};
