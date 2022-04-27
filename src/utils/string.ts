export const getHostName = (url: string) => {
  const a = document.createElement("a");
  a.href = url;
  return a.hostname;
};
