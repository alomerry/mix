export const getFileTypeByName = (fileName: String): String => {
  const arr = fileName.split(".");
  return arr.length >= 2 ? arr[arr.length - 1] : "";
};
