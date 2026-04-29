export const getVisualLines = (text, element) => {
  if (!element) return 0;

  const style = window.getComputedStyle(element);

  const canvas = document.createElement("div");
  canvas.style.position = "absolute";
  canvas.style.visibility = "hidden";
  canvas.style.whiteSpace = "pre-wrap";
  canvas.style.width = style.width;
  canvas.style.font = style.font;
  canvas.style.fontSize = style.fontSize;
  canvas.style.lineHeight = style.lineHeight;

  canvas.innerText = text;

  document.body.appendChild(canvas);

  const height = canvas.scrollHeight;
  const lineHeight = parseInt(style.lineHeight || "16", 10);

  document.body.removeChild(canvas);

  return Math.round(height / lineHeight);
};