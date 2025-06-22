export const featherBrush = (
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
    lastPressure = 0.5,
    lastGrainOffset = 0,
    isEndOfStroke = false,
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

  // Calculate pressure based on speed (slower = more pressure)
  const rawPressure = Math.max(0.1, Math.min(1.0, 1.0 - speed * 0.05));
  const pressure = lastPressure * (1 - smoothingFactor) + rawPressure * smoothingFactor;

  // Calculate line width based on pressure and size
  const rawWidth = size * pressure * 0.8;
  const width = lastWidth * (1 - smoothingFactor) + rawWidth * smoothingFactor;

  // Keep track of recent points for curve smoothing
  const points = lastPoints.length === 0 
    ? [start, end] 
    : [...lastPoints, end];

  // Limit the number of points to avoid performance issues
  if (points.length > 5) points.shift();

  // Update grain offset for texture variation
  const grainOffset = (lastGrainOffset + 0.1) % 10;

  // Set up the context
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // For tapering effect at the start and end of strokes
  const isStartOfStroke = lastPoints.length <= 1;
  const strokeProgress = Math.min(1, lastPoints.length / 4);

  // Taper factor calculation
  let taperFactor = 1;
  if (isStartOfStroke) {
    taperFactor = 0.2 + (0.8 * strokeProgress);
  } else if (isEndOfStroke) {
    taperFactor = 0.2 + (0.8 * (1 - Math.min(1, points.length / 10)));
  }

  // Draw multiple layers for a more realistic pencil effect
  for (let layer = 0; layer < 3; layer++) {
    // Different opacity and width for each layer
    const layerOpacity = layer === 0 ? 0.7 * pressure : 0.2 * pressure;
    const layerWidth = layer === 0 ? width * taperFactor : width * 0.6 * taperFactor;

    ctx.globalAlpha = layerOpacity;
    ctx.lineWidth = layerWidth;
    ctx.strokeStyle = color;

    // Draw the main stroke with a smooth curve
    if (points.length >= 3) {
      ctx.beginPath();
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
      ctx.stroke();
    } else {
      // Not enough points for a curve, draw a line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }

    // Add texture for the pencil effect
    if (layer === 0) {
      // Add grain texture
      const grainSteps = 8;
      const dx = end.x - start.x;
      const dy = end.y - start.y;

      ctx.globalAlpha = 0.1 * pressure;

      for (let i = 0; i < grainSteps; i++) {
        const t = i / grainSteps;
        const x1 = start.x + dx * t;
        const y1 = start.y + dy * t;
        const x2 = start.x + dx * (t + 1/grainSteps);
        const y2 = start.y + dy * (t + 1/grainSteps);

        // Add random offset for grain effect
        const offsetX = (Math.sin(t * 10 + grainOffset) * width * 0.3);
        const offsetY = (Math.cos(t * 10 + grainOffset) * width * 0.3);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2 + offsetX, y2 + offsetY);
        ctx.stroke();
      }
    }
  }

  // Add pencil dust effect
  if (pressure > 0.7 && Math.random() < 0.2) {
    const dustCount = Math.floor(pressure * 5);
    ctx.globalAlpha = 0.05;

    for (let i = 0; i < dustCount; i++) {
      const dustX = end.x + (Math.random() - 0.5) * width * 2;
      const dustY = end.y + (Math.random() - 0.5) * width * 2;
      const dustSize = Math.random() * width * 0.3;

      ctx.beginPath();
      ctx.arc(dustX, dustY, dustSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Special handling for end of stroke
  if (isEndOfStroke) {
    // Add a final dust puff
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 3; i++) {
      const dustX = end.x + (Math.random() - 0.5) * width * 3;
      const dustY = end.y + (Math.random() - 0.5) * width * 3;
      const dustSize = Math.random() * width * 0.4;

      ctx.beginPath();
      ctx.arc(dustX, dustY, dustSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Return empty points to reset for next stroke
    return {
      lastTime: now,
      lastSpeed: 0,
      lastWidth: size,
      lastPoints: [],
      lastPressure: 0.5,
      lastGrainOffset: grainOffset,
    };
  }

  ctx.restore();

  // Return state for the next call
  return {
    lastTime: now,
    lastSpeed: speed,
    lastWidth: width,
    lastPoints: points,
    lastPressure: pressure,
    lastGrainOffset: grainOffset,
  };
};
