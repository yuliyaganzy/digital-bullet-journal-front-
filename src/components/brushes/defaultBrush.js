export const defaultBrush = (
  ctx,
  {
    start,
    end,
    color,
    size,
    lastTime,
    lastSpeed = 0,
    lastWidth = size,
    lastPoints = [],
    isEndOfStroke = false, // Flag to indicate end of stroke
    // Smoothing factor for transitions
    smoothingFactor = 0.3,
  }
) => {
  const now = performance.now();
  const dt = now - (lastTime ?? now);

  // Calculate distance and speed
  const dist = Math.hypot(end.x - start.x, end.y - start.y);
  const rawSpeed = dt > 0 ? dist / dt : 0;

  // Smooth the speed
  const speed = lastSpeed * (1 - smoothingFactor) + rawSpeed * smoothingFactor;

  // Calculate line width based on speed
  // Faster = thinner, slower = thicker (like a real pen)
  const speedFactor = Math.max(0.1, 1 - speed * 0.05);
  const rawWidth = size * speedFactor;

  // Smooth the width transition
  const width = lastWidth * (1 - smoothingFactor) + rawWidth * smoothingFactor;

  // Keep track of recent points for curve smoothing
  // If this is the start of a stroke, add the start point
  const points = lastPoints.length === 0 
    ? [start, end] 
    : [...lastPoints, end];

  // Limit the number of points to avoid performance issues
  if (points.length > 4) points.shift();

  // Set up the context
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw the main stroke
  ctx.strokeStyle = color;

  // For tapering effect at the start and end of strokes
  const isStartOfStroke = lastPoints.length === 0;
  const strokeProgress = Math.min(1, lastPoints.length / 3); // 0 to 1 based on stroke progress

  // Taper factor calculation
  let taperFactor = 1;

  if (isStartOfStroke) {
    // Taper at the start of the stroke
    taperFactor = 0.3 + (0.7 * strokeProgress);
  } else if (isEndOfStroke) {
    // Taper at the end of the stroke
    taperFactor = 0.3 + (0.7 * (1 - Math.min(1, points.length / 10)));
  }
  ctx.lineWidth = width * taperFactor;

  ctx.beginPath();

  // If we have enough points, draw a smooth curve
  if (points.length >= 3) {
    ctx.moveTo(points[0].x, points[0].y);

    // Draw smooth curve through points
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    // For the last point
    if (points.length >= 4) {
      const lastPoint = points[points.length - 1];
      const controlPoint = points[points.length - 2];
      ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, lastPoint.x, lastPoint.y);
    }
  } else {
    // Not enough points for a curve, draw a line
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
  }

  ctx.stroke();

  // Add a subtle ink flow effect
  if (speed < 1.5) {
    // Slower strokes get more ink pooling
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.arc(end.x, end.y, width * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Add a subtle texture to simulate ink on paper
    const textureSize = width * 0.5;
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = 0.05;
      ctx.beginPath();
      const offsetX = (Math.random() - 0.5) * textureSize;
      const offsetY = (Math.random() - 0.5) * textureSize;
      ctx.arc(end.x + offsetX, end.y + offsetY, width * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Add tiny ink splatters occasionally for realism
  if (Math.random() < 0.1 && speed > 0.5) {
    const splatterCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < splatterCount; i++) {
      ctx.globalAlpha = 0.03 + Math.random() * 0.05;
      ctx.beginPath();
      const distance = width * (1 + Math.random());
      const angle = Math.random() * Math.PI * 2;
      const splatterX = end.x + Math.cos(angle) * distance;
      const splatterY = end.y + Math.sin(angle) * distance;
      const splatterSize = width * (0.1 + Math.random() * 0.2);
      ctx.arc(splatterX, splatterY, splatterSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Special handling for end of stroke
  if (isEndOfStroke) {
    // Draw a final tapered point
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(end.x, end.y, width * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Restore context state
    ctx.restore();

    // Return empty points to reset for next stroke
    return {
      lastTime: now,
      lastSpeed: 0,
      lastWidth: size,
      lastPoints: [],
    };
  }

  // Restore context state
  ctx.restore();

  // Return state for the next call
  return {
    lastTime: now,
    lastSpeed: speed,
    lastWidth: width,
    lastPoints: points,
  };
};
