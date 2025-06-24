export const pencilBrush = (
  ctx,
  {
    start,
    end,
    color,
    size,
    opacity = 1,
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
  // Pencil gets slightly thicker with pressure but not as much as other tools
  const rawWidth = size * (0.7 + pressure * 0.3);
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

  // Parse the color to get RGB values
  let r, g, b;
  if (color.startsWith('#')) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    [r, g, b] = match;
  } else {
    // Default to black if color format is unknown
    r = g = b = 0;
  }

  // Draw multiple layers for a more realistic graphite pencil effect
  for (let layer = 0; layer < 3; layer++) {
    // Different opacity for each layer based on pressure
    // Light pressure creates semi-transparent lines, heavy pressure creates darker lines
    const baseOpacity = pressure * (layer === 0 ? 0.7 : 0.3);

    // Adjust opacity based on speed - faster strokes are more "dry" and less saturated
    // Increased the speed multiplier to make the effect more pronounced at moderate speeds
    const speedFactor = Math.max(0.3, 1 - speed * 0.2);
    const layerOpacity = baseOpacity * speedFactor;

    // Adjust width slightly for each layer to create micro-variations
    const layerWidth = width * taperFactor * (1 - layer * 0.2);

    // Apply the opacity parameter from the Canvas component
    ctx.globalAlpha = layerOpacity * opacity;
    ctx.lineWidth = layerWidth;

    // Create a slightly grainy color for graphite effect
    const grainVariation = Math.random() * 10 - 5;
    ctx.strokeStyle = `rgb(${r + grainVariation}, ${g + grainVariation}, ${b + grainVariation})`;

    // Draw the main stroke with a smooth curve
    if (points.length >= 3) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      // Draw smooth curve through points
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;

        // Add micro-variations to control points for natural look
        const variation = (Math.random() - 0.5) * width * 0.1;
        ctx.quadraticCurveTo(
          points[i].x + variation, 
          points[i].y + variation, 
          xc, yc
        );
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
  }

  // Add graphite texture and granular particles
  // Enhanced texture intensity calculation to be more visible at all speeds
  const textureIntensity = pressure * 0.8 * (1 + (1 - Math.min(1, speed)) * 0.5); // More pressure and slower speed = more visible texture
  ctx.globalAlpha = 0.15 * textureIntensity * opacity;

  // Add texture along the stroke path
  const grainSteps = Math.max(3, Math.floor(dist / 2));
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  for (let i = 0; i < grainSteps; i++) {
    const t = i / grainSteps;
    const x = start.x + dx * t;
    const y = start.y + dy * t;

    // Create tiny granular particles
    const particleCount = Math.floor(pressure * 5) + 1;

    for (let j = 0; j < particleCount; j++) {
      // Random offset within the stroke width
      const offsetX = (Math.random() - 0.5) * width * 1.2;
      const offsetY = (Math.random() - 0.5) * width * 1.2;

      // Random size for particles
      const particleSize = Math.random() * width * 0.15 * pressure;

      // Random opacity for natural look
      ctx.globalAlpha = Math.random() * 0.1 * textureIntensity * opacity;

      ctx.beginPath();
      ctx.arc(x + offsetX, y + offsetY, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add edge fluctuations - tiny strokes perpendicular to main stroke
    if (Math.random() < 0.3) {
      const angle = Math.atan2(dy, dx) + (Math.PI / 2);
      const edgeLength = width * 0.3 * Math.random();

      ctx.globalAlpha = 0.05 * textureIntensity * opacity;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(angle) * edgeLength,
        y + Math.sin(angle) * edgeLength
      );
      ctx.stroke();
    }
  }

  // Add "dry" effect for strokes - small gaps in the line
  // Lowered threshold to make dispersion visible at slower speeds
  if (speed > 0.3) {
    // Adjusted gap count calculation to work better with lower speeds
    const gapCount = Math.max(2, Math.floor(speed * 3));
    ctx.globalCompositeOperation = 'destination-out';

    for (let i = 0; i < gapCount; i++) {
      const t = Math.random();
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;

      // Increased base opacity to make gaps more visible at lower speeds
      ctx.globalAlpha = 0.15 * Math.min(1, speed * 0.5 + 0.2) * opacity;
      ctx.beginPath();
      // Slightly increased gap size for better visibility
      ctx.arc(x, y, width * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  // Special handling for end of stroke
  if (isEndOfStroke) {
    // Add a final graphite dust puff
    ctx.globalAlpha = 0.05 * opacity;
    for (let i = 0; i < 5; i++) {
      const dustX = end.x + (Math.random() - 0.5) * width * 3;
      const dustY = end.y + (Math.random() - 0.5) * width * 3;
      const dustSize = Math.random() * width * 0.3;

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
