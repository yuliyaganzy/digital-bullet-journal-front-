import React from "react";

// Helper function to create a path with rounded corners
const createRoundedPolygonPath = (points, radius) => {
  if (radius === 0) {
    // If radius is 0, just return a regular polygon path
    return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  }

  let path = '';
  const len = points.length;

  for (let i = 0; i < len; i++) {
    const curr = points[i];
    const next = points[(i + 1) % len];
    const prev = points[(i - 1 + len) % len];

    // Calculate direction vectors
    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    // Normalize direction vectors
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const nx1 = dx1 / len1;
    const ny1 = dy1 / len1;
    const nx2 = dx2 / len2;
    const ny2 = dy2 / len2;

    // Calculate the corner radius for this point
    // Use a smaller radius if the corner is too sharp
    const angle = Math.acos(nx1 * nx2 + ny1 * ny2);
    const cornerRadius = Math.min(radius, len1 / 2, len2 / 2, Math.tan(angle / 2) * radius);

    // Calculate the points where the rounded corner starts and ends
    const startX = curr.x - nx1 * cornerRadius;
    const startY = curr.y - ny1 * cornerRadius;
    const endX = curr.x + nx2 * cornerRadius;
    const endY = curr.y + ny2 * cornerRadius;

    if (i === 0) {
      path += `M ${startX},${startY} `;
    } else {
      path += `L ${startX},${startY} `;
    }

    // Add the arc for the rounded corner
    path += `Q ${curr.x},${curr.y} ${endX},${endY} `;
  }

  path += 'Z';
  return path;
};

const TempFormElement = ({ formType, left, top, width, height, fillColor, fillTransparency, strokeColor, strokeTransparency, cornerRadius, rotation, strokeWidth, selectedImageFile }) => {
  // Common styles for all form types
  const commonStyles = {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    pointerEvents: "none",
    zIndex: 20,
  };

  // Helper function to create rgba color string
  const createRgbaColor = (hexColor, transparency) => {
    return `rgba(${parseInt(hexColor.slice(1, 3), 16)}, ${parseInt(hexColor.slice(3, 5), 16)}, ${parseInt(hexColor.slice(5, 7), 16)}, ${transparency / 100})`;
  };

  // Render rectangle
  if (formType === "rectangle") {
    return (
      <div
        style={{
          ...commonStyles,
          backgroundColor: createRgbaColor(fillColor, fillTransparency),
          border: `${strokeWidth}px solid ${createRgbaColor(strokeColor, strokeTransparency)}`,
          borderRadius: `${cornerRadius}px`,
          transform: `rotate(${rotation}deg)`,
        }}
      />
    );
  }

  // Render line
  if (formType === "line") {
    // Calculate the angle of the line
    const dx = width;
    const dy = height;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Calculate the length of the line
    const length = Math.sqrt(dx * dx + dy * dy);

    return (
      <div
        style={{
          position: "absolute",
          left: `${left}px`,
          top: `${top}px`,
          width: `${length}px`,
          height: `${strokeWidth}px`,
          backgroundColor: createRgbaColor(strokeColor, strokeTransparency),
          borderRadius: `${cornerRadius}px`,
          transform: `rotate(${angle + rotation}deg)`,
          transformOrigin: "0 50%",
          pointerEvents: "none",
          zIndex: 30, // Higher zIndex to ensure visibility
          opacity: 0.8, // Add some transparency to make it more visible
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", // Add a subtle shadow for better visibility
        }}
      />
    );
  }

  // Render arrow
  if (formType === "arrow") {
    // Calculate the angle of the arrow
    const dx = width;
    const dy = height;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Calculate the length of the arrow
    const length = Math.sqrt(dx * dx + dy * dy);

    return (
      <div
        style={{
          position: "absolute",
          left: `${left}px`,
          top: `${top}px`,
          width: `${length}px`,
          height: `${Math.max(20, strokeWidth * 3)}px`,
          transform: `rotate(${angle + rotation}deg)`,
          transformOrigin: "0 50%",
          pointerEvents: "none",
          zIndex: 30, // Higher zIndex to ensure visibility
          opacity: 0.8, // Add some transparency to make it more visible
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", // Add a subtle shadow for better visibility
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${length} ${Math.max(20, strokeWidth * 3)}`}
          overflow="visible"
        >
          <line
            x1="0"
            y1={Math.max(10, strokeWidth * 1.5)}
            x2={length - 10}
            y2={Math.max(10, strokeWidth * 1.5)}
            stroke={createRgbaColor(strokeColor, strokeTransparency)}
            strokeWidth={strokeWidth}
            strokeLinecap={cornerRadius > 0 ? "round" : "butt"}
          />
          <polygon
            points={`${length - 10},${Math.max(10, strokeWidth * 1.5) - 5} ${length},${Math.max(10, strokeWidth * 1.5)} ${length - 10},${Math.max(10, strokeWidth * 1.5) + 5}`}
            fill={createRgbaColor(strokeColor, strokeTransparency)}
          />
        </svg>
      </div>
    );
  }

  // Render ellipse
  if (formType === "ellipse") {
    return (
      <div
        style={{
          ...commonStyles,
          backgroundColor: createRgbaColor(fillColor, fillTransparency),
          border: `${strokeWidth}px solid ${createRgbaColor(strokeColor, strokeTransparency)}`,
          borderRadius: "50%", // Make it an ellipse
          transform: `rotate(${rotation}deg)`,
        }}
      />
    );
  }

  // Render polygon (triangle)
  if (formType === "polygon") {
    // Calculate the stroke offset to prevent cutting off corners
    const strokeOffset = strokeWidth / 2;

    // Adjust the viewBox to account for the stroke width
    const viewBoxWidth = width + strokeWidth;
    const viewBoxHeight = height + strokeWidth;

    // Adjust the points to account for the stroke width
    const topX = width / 2;
    const topY = strokeOffset;
    const leftX = strokeOffset;
    const leftY = height - strokeOffset;
    const rightX = width - strokeOffset;
    const rightY = height - strokeOffset;

    // Create points array for the triangle
    const points = [
      { x: topX, y: topY },
      { x: leftX, y: leftY },
      { x: rightX, y: rightY }
    ];

    // Create the path with rounded corners
    const pathData = createRoundedPolygonPath(points, cornerRadius);

    return (
      <div
        style={{
          ...commonStyles,
          backgroundColor: "transparent",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`-${strokeOffset} -${strokeOffset} ${viewBoxWidth} ${viewBoxHeight}`}
          overflow="visible"
        >
          <path
            d={pathData}
            fill={createRgbaColor(fillColor, fillTransparency)}
            stroke={createRgbaColor(strokeColor, strokeTransparency)}
            strokeWidth={strokeWidth}
          />
        </svg>
      </div>
    );
  }

  // Render image/video placeholder or preview
  if (formType === "image") {
    // If we have a selected image file, show a preview
    if (selectedImageFile && selectedImageFile.fileUrl) {
      return (
        <div
          style={{
            ...commonStyles,
            border: `${strokeWidth}px solid ${createRgbaColor(strokeColor, strokeTransparency)}`,
            borderRadius: `${cornerRadius}px`,
            transform: `rotate(${rotation}deg)`,
            overflow: "hidden",
          }}
        >
          <img 
            src={selectedImageFile.fileUrl} 
            alt="Selected image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              opacity: fillTransparency / 100,
            }}
          />
        </div>
      );
    }

    // Otherwise show a placeholder
    return (
      <div
        style={{
          ...commonStyles,
          backgroundColor: "rgba(200, 200, 200, 0.5)",
          border: `${strokeWidth}px solid ${createRgbaColor(strokeColor, strokeTransparency)}`,
          borderRadius: `${cornerRadius}px`,
          transform: `rotate(${rotation}deg)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ 
          color: "rgba(0, 0, 0, 0.7)", 
          fontSize: "14px", 
          textAlign: "center",
          padding: "10px"
        }}>
          Image / Video<br/>Placeholder
        </div>
      </div>
    );
  }

  // Render star
  if (formType === "star") {
    // Calculate the stroke offset to prevent cutting off corners
    const strokeOffset = strokeWidth / 2;

    // Adjust the viewBox to account for the stroke width
    const viewBoxWidth = width + strokeWidth;
    const viewBoxHeight = height + strokeWidth;

    const centerX = width / 2;
    const centerY = height / 2;
    // Reduce the outer radius slightly to account for stroke width
    const outerRadius = (Math.min(width, height) / 2) - strokeOffset;
    const innerRadius = outerRadius / 2.5;

    // Calculate the points of the star
    const starPoints = [];
    for (let i = 0; i < 10; i++) {
      // Use outer or inner radius based on whether i is even or odd
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = Math.PI * i / 5;
      const x = centerX + radius * Math.sin(angle);
      const y = centerY - radius * Math.cos(angle);
      starPoints.push({ x, y });
    }

    // Create the path with rounded corners
    const pathData = createRoundedPolygonPath(starPoints, cornerRadius);

    return (
      <div
        style={{
          ...commonStyles,
          backgroundColor: "transparent",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`-${strokeOffset} -${strokeOffset} ${viewBoxWidth} ${viewBoxHeight}`}
          overflow="visible"
        >
          <path
            d={pathData}
            fill={createRgbaColor(fillColor, fillTransparency)}
            stroke={createRgbaColor(strokeColor, strokeTransparency)}
            strokeWidth={strokeWidth}
          />
        </svg>
      </div>
    );
  }

  // Default to rectangle if no matching type
  return (
    <div
      style={{
        ...commonStyles,
        backgroundColor: createRgbaColor(fillColor, fillTransparency),
        border: `${strokeWidth}px solid ${createRgbaColor(strokeColor, strokeTransparency)}`,
        borderRadius: `${cornerRadius}px`,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
};

export default TempFormElement;
