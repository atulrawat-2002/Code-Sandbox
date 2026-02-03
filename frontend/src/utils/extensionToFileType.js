const extensionToFileMapper = {
  js: "javascript",
  jsx: "javascript",
  txs: "typescript",
  html: "html",
  css: "css",
  json: "json",
  md: "markdown",
  yaml: "yaml",
  svg: "svg",
  local: "env",
  env: "env",
  gitignore: "gitignore",
  doker: "docker",
};

export const extensionToFileType = (extension) => {
  if (!extension) return undefined;

  return extensionToFileMapper[extension];
};
