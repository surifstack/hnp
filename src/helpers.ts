import stringWidth from "string-width";


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


export function clampVisual(text: string, max: number) {
  let result = "";
  let width = 0;

  for (const char of text) {
    const charWidth = stringWidth(char);

    if (width + charWidth > max) break;

    result += char;
    width += charWidth;
  }

  return result;
}



export const clampLines = (text: string, maxLines: number) => {
  return (text || "").split("\n").slice(0, maxLines).join("\n");
};

export const clampChars = (text: string, maxChars: number) => {
  const t = text || "";
  return t.length > maxChars ? t.slice(0, maxChars) : t;
};

export const softLimit = (text: string, maxChars: number) => {
  const t = text || "";
  return t.length > maxChars + 5 ? t.slice(0, maxChars + 5) : t;
};