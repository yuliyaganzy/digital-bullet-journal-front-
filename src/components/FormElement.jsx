import React from "react";

const FormElement = ({ element, isActive, onClick, onMouseDown }) => {
  const renderRectangle = () => (
    <div
      className={`absolute form-element ${isActive ? 'cursor-move' : 'cursor-pointer'}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        backgroundColor: `rgba(${parseInt(element.fillColor.slice(1, 3), 16)}, ${parseInt(element.fillColor.slice(3, 5), 16)}, ${parseInt(element.fillColor.slice(5, 7), 16)}, ${element.fillTransparency / 100})`,
        border: `${element.strokeWidth}px solid rgba(${parseInt(element.strokeColor.slice(1, 3), 16)}, ${parseInt(element.strokeColor.slice(3, 5), 16)}, ${parseInt(element.strokeColor.slice(5, 7), 16)}, ${element.strokeTransparency / 100})`,
        borderRadius: `${element.cornerRadius}px`,
        transform: `rotate(${element.rotation}deg)`,
        position: "absolute",
        zIndex: 15,
        outline: isActive ? "1px dashed #2A2A2A" : "none",
      }}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {isActive && (
        <>
          {/* Corner resize handles */}
          <div className="resize-handle absolute top-0 left-0 w-4 h-4 bg-[#2A2A2A] cursor-nw-resize" data-resize-handle="top-left" />
          <div className="resize-handle absolute top-0 right-0 w-4 h-4 bg-[#2A2A2A] cursor-ne-resize" data-resize-handle="top-right" />
          <div className="resize-handle absolute bottom-0 left-0 w-4 h-4 bg-[#2A2A2A] cursor-sw-resize" data-resize-handle="bottom-left" />
          <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-[#2A2A2A] cursor-se-resize" data-resize-handle="bottom-right" />

          {/* Edge resize handles */}
          <div className="resize-handle absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2A2A2A] cursor-n-resize" data-resize-handle="top" />
          <div className="resize-handle absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2A2A2A] cursor-s-resize" data-resize-handle="bottom" />
          <div className="resize-handle absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A2A2A] cursor-w-resize" data-resize-handle="left" />
          <div className="resize-handle absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A2A2A] cursor-e-resize" data-resize-handle="right" />
        </>
      )}
    </div>
  );

  const renderLine = () => {
    // Calculate the angle of the line
    const dx = element.width;
    const dy = element.height;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Calculate the length of the line
    const length = Math.sqrt(dx * dx + dy * dy);

    return (
      <div
        className={`absolute form-element ${isActive ? 'cursor-move' : 'cursor-pointer'}`}
        style={{
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${length}px`,
          height: `${element.strokeWidth}px`,
          backgroundColor: `rgba(${parseInt(element.strokeColor.slice(1, 3), 16)}, ${parseInt(element.strokeColor.slice(3, 5), 16)}, ${parseInt(element.strokeColor.slice(5, 7), 16)}, ${element.strokeTransparency / 100})`,
          borderRadius: `${element.cornerRadius}px`,
          transform: `rotate(${angle + element.rotation}deg)`,
          transformOrigin: "0 50%",
          position: "absolute",
          zIndex: 15,
          outline: isActive ? "1px dashed #2A2A2A" : "none",
        }}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        {isActive && (
          <>
            {/* Start and end resize handles for the line */}
            <div className="resize-handle absolute top-1/2 left-0 w-4 h-4 bg-[#2A2A2A] cursor-w-resize -translate-y-1/2" data-resize-handle="start" />
            <div className="resize-handle absolute top-1/2 right-0 w-4 h-4 bg-[#2A2A2A] cursor-e-resize -translate-y-1/2" data-resize-handle="end" />
          </>
        )}
      </div>
    );
  };

  const renderArrow = () => {
    // Calculate the angle of the arrow
    const dx = element.width;
    const dy = element.height;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Calculate the length of the arrow
    const length = Math.sqrt(dx * dx + dy * dy);

    // Create an SVG arrow
    return (
      <div
        className={`absolute form-element ${isActive ? 'cursor-move' : 'cursor-pointer'}`}
        style={{
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${length}px`,
          height: `${Math.max(20, element.strokeWidth * 3)}px`,
          transform: `rotate(${angle + element.rotation}deg)`,
          transformOrigin: "0 50%",
          position: "absolute",
          zIndex: 15,
          outline: isActive ? "1px dashed #2A2A2A" : "none",
        }}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        <svg width="100%" height="100%" viewBox={`0 0 ${length} ${Math.max(20, element.strokeWidth * 3)}`}>
          <defs>
            <marker
              id={`arrowhead-${element.id}`}
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill={`rgba(${parseInt(element.strokeColor.slice(1, 3), 16)}, ${parseInt(element.strokeColor.slice(3, 5), 16)}, ${parseInt(element.strokeColor.slice(5, 7), 16)}, ${element.strokeTransparency / 100})`}
                rx={element.cornerRadius}
                ry={element.cornerRadius}
              />
            </marker>
          </defs>
          <line
            x1="0"
            y1={Math.max(10, element.strokeWidth * 1.5)}
            x2={length - 10}
            y2={Math.max(10, element.strokeWidth * 1.5)}
            stroke={`rgba(${parseInt(element.strokeColor.slice(1, 3), 16)}, ${parseInt(element.strokeColor.slice(3, 5), 16)}, ${parseInt(element.strokeColor.slice(5, 7), 16)}, ${element.strokeTransparency / 100})`}
            strokeWidth={element.strokeWidth}
            strokeLinecap={element.cornerRadius > 0 ? "round" : "butt"}
            markerEnd={`url(#arrowhead-${element.id})`}
          />
        </svg>
        {isActive && (
          <>
            {/* Start and end resize handles for the arrow */}
            <div className="resize-handle absolute top-1/2 left-0 w-4 h-4 bg-[#2A2A2A] cursor-w-resize -translate-y-1/2" data-resize-handle="start" />
            <div className="resize-handle absolute top-1/2 right-0 w-4 h-4 bg-[#2A2A2A] cursor-e-resize -translate-y-1/2" data-resize-handle="end" />
          </>
        )}
      </div>
    );
  };

  const renderEllipse = () => (
    <div
      className={`absolute form-element ${isActive ? 'cursor-move' : 'cursor-pointer'}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        backgroundColor: `rgba(${parseInt(element.fillColor.slice(1, 3), 16)}, ${parseInt(element.fillColor.slice(3, 5), 16)}, ${parseInt(element.fillColor.slice(5, 7), 16)}, ${element.fillTransparency / 100})`,
        border: `${element.strokeWidth}px solid rgba(${parseInt(element.strokeColor.slice(1, 3), 16)}, ${parseInt(element.strokeColor.slice(3, 5), 16)}, ${parseInt(element.strokeColor.slice(5, 7), 16)}, ${element.strokeTransparency / 100})`,
        borderRadius: "50%", // Make it an ellipse
        transform: `rotate(${element.rotation}deg)`,
        position: "absolute",
        zIndex: 15,
        outline: isActive ? "1px dashed #2A2A2A" : "none",
      }}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {isActive && (
        <>
          {/* Corner resize handles */}
          <div className="resize-handle absolute top-0 left-0 w-4 h-4 bg-[#2A2A2A] cursor-nw-resize" data-resize-handle="top-left" />
          <div className="resize-handle absolute top-0 right-0 w-4 h-4 bg-[#2A2A2A] cursor-ne-resize" data-resize-handle="top-right" />
          <div className="resize-handle absolute bottom-0 left-0 w-4 h-4 bg-[#2A2A2A] cursor-sw-resize" data-resize-handle="bottom-left" />
          <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-[#2A2A2A] cursor-se-resize" data-resize-handle="bottom-right" />

          {/* Edge resize handles */}
          <div className="resize-handle absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2A2A2A] cursor-n-resize" data-resize-handle="top" />
          <div className="resize-handle absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2A2A2A] cursor-s-resize" data-resize-handle="bottom" />
          <div className="resize-handle absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A2A2A] cursor-w-resize" data-resize-handle="left" />
          <div className="resize-handle absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A2A2A] cursor-e-resize" data-resize-handle="right" />
        </>
      )}
    </div>
  );

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

  const renderPolygon = () => {
    // Create a triangle
    const width = element.width;
    const height = element.height;

    // Calculate the stroke offset to prevent cutting off corners
    const strokeOffset = element.strokeWidth / 2;

    // Adjust the viewBox to account for the stroke width
    const viewBoxWidth = width + element.strokeWidth;
    const viewBoxHeight = height + element.strokeWidth;

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
    const pathData = createRoundedPolygonPath(points, element.cornerRadius);

    return (
      <div
        className={`absolute form-element ${isActive ? 'cursor-move' : 'cursor-pointer'}`}
        style={{
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${width}px`,
          height: `${height}px`,
          position: "absolute",
          zIndex: 15,
          outline: isActive ? "1px dashed #2A2A2A" : "none",
          transform: `rotate(${element.rotation}deg)`,
        }}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`-${strokeOffset} -${strokeOffset} ${viewBoxWidth} ${viewBoxHeight}`}
          overflow="visible"
        >
          <path
            d={pathData}
            fill={`rgba(${parseInt(element.fillColor.slice(1, 3), 16)}, ${parseInt(element.fillColor.slice(3, 5), 16)}, ${parseInt(element.fillColor.slice(5, 7), 16)}, ${element.fillTransparency / 100})`}
            stroke={`rgba(${parseInt(element.strokeColor.slice(1, 3), 16)}, ${parseInt(element.strokeColor.slice(3, 5), 16)}, ${parseInt(element.strokeColor.slice(5, 7), 16)}, ${element.strokeTransparency / 100})`}
            strokeWidth={element.strokeWidth}
          />
        </svg>
        {isActive && (
          <>
            {/* Corner resize handles */}
            <div className="resize-handle absolute top-0 left-0 w-4 h-4 bg-[#2A2A2A] cursor-nw-resize" data-resize-handle="top-left" />
            <div className="resize-handle absolute top-0 right-0 w-4 h-4 bg-[#2A2A2A] cursor-ne-resize" data-resize-handle="top-right" />
            <div className="resize-handle absolute bottom-0 left-0 w-4 h-4 bg-[#2A2A2A] cursor-sw-resize" data-resize-handle="bottom-left" />
            <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-[#2A2A2A] cursor-se-resize" data-resize-handle="bottom-right" />

            {/* Edge resize handles */}
            <div className="resize-handle absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2A2A2A] cursor-n-resize" data-resize-handle="top" />
            <div className="resize-handle absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2A2A2A] cursor-s-resize" data-resize-handle="bottom" />
            <div className="resize-handle absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A2A2A] cursor-w-resize" data-resize-handle="left" />
            <div className="resize-handle absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A2A2A] cursor-e-resize" data-resize-handle="right" />
          </>
        )}
      </div>
    );
  };

  const renderStar = () => {
    // Create a five-pointed star
    const width = element.width;
    const height = element.height;

    // Calculate the stroke offset to prevent cutting off corners
    const strokeOffset = element.strokeWidth / 2;

    // Adjust the viewBox to account for the stroke width
    const viewBoxWidth = width + element.strokeWidth;
    const viewBoxHeight = height + element.strokeWidth;

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
    const pathData = createRoundedPolygonPath(starPoints, element.cornerRadius);

    return (
      <div
        className={`absolute form-element ${isActive ? 'cursor-move' : 'cursor-pointer'}`}
        style={{
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${width}px`,
          height: `${height}px`,
          position: "absolute",
          zIndex: 15,
          outline: isActive ? "1px dashed #2A2A2A" : "none",
          transform: `rotate(${element.rotation}deg)`,
        }}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`-${strokeOffset} -${strokeOffset} ${viewBoxWidth} ${viewBoxHeight}`}
          overflow="visible"
        >
          <path
            d={pathData}
            fill={`rgba(${parseInt(element.fillColor.slice(1, 3), 16)}, ${parseInt(element.fillColor.slice(3, 5), 16)}, ${parseInt(element.fillColor.slice(5, 7), 16)}, ${element.fillTransparency / 100})`}
            stroke={`rgba(${parseInt(element.strokeColor.slice(1, 3), 16)}, ${parseInt(element.strokeColor.slice(3, 5), 16)}, ${parseInt(element.strokeColor.slice(5, 7), 16)}, ${element.strokeTransparency / 100})`}
            strokeWidth={element.strokeWidth}
          />
        </svg>
        {isActive && (
          <>
            {/* Corner resize handles */}
            <div className="resize-handle absolute top-0 left-0 w-4 h-4 bg-[#2A2A2A] cursor-nw-resize" data-resize-handle="top-left" />
            <div className="resize-handle absolute top-0 right-0 w-4 h-4 bg-[#2A2A2A] cursor-ne-resize" data-resize-handle="top-right" />
            <div className="resize-handle absolute bottom-0 left-0 w-4 h-4 bg-[#2A2A2A] cursor-sw-resize" data-resize-handle="bottom-left" />
            <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-[#2A2A2A] cursor-se-resize" data-resize-handle="bottom-right" />

            {/* Edge resize handles */}
            <div className="resize-handle absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2A2A2A] cursor-n-resize" data-resize-handle="top" />
            <div className="resize-handle absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2A2A2A] cursor-s-resize" data-resize-handle="bottom" />
            <div className="resize-handle absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A2A2A] cursor-w-resize" data-resize-handle="left" />
            <div className="resize-handle absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A2A2A] cursor-e-resize" data-resize-handle="right" />
          </>
        )}
      </div>
    );
  };

  // Render the appropriate form element based on its type
  switch (element.type) {
    case "rectangle":
      return renderRectangle();
    case "line":
      return renderLine();
    case "arrow":
      return renderArrow();
    case "ellipse":
      return renderEllipse();
    case "polygon":
      return renderPolygon();
    case "star":
      return renderStar();
    default:
      return renderRectangle(); // Default to rectangle
  }
};

export default FormElement;
