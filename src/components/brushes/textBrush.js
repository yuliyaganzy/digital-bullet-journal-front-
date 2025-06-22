export const textBrush = (ctx, { x, y, text, fontSize, fontFamily, fontWeight, fontStyle, color }) => {
  // Set text properties
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  
  // Draw the text
  ctx.fillText(text, x, y);
};