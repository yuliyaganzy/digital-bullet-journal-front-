import React, { useRef, useEffect } from "react";
import { brushHandlers } from "./brushes"; // Import brush handlers

const Canvas = React.forwardRef(({ color, brushSize, width, height, brushType, className, style, isDrawingActive = false }, forwardedRef) => {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    if (forwardedRef) {
      forwardedRef.current = canvasRef.current;
    }
  }, [forwardedRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [width, height]);

  const handleMouseDown = (e) => {
    // Only allow drawing if isDrawingActive is true
    if (!isDrawingActive) {
      return;
    }

    const currentPosition = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    lastPositionRef.current = currentPosition;
    isDrawingRef.current = true;
  };

  const handleMouseMove = (e) => {
    // Only allow drawing if isDrawingActive is true
    if (!isDrawingActive) {
      return;
    }

    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.lineCap = "round";
    context.lineJoin = "round";

    const currentPosition = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

    const brushHandler = brushHandlers[brushType] || brushHandlers.default;
    brushHandler(context, {
      start: lastPositionRef.current,
      end: currentPosition,
      color,
      size: brushSize,
      lastTime: lastTimeRef.current,
    });

    lastPositionRef.current = currentPosition;
    lastTimeRef.current = Date.now();
  };

  const handleMouseUp = () => {
    // Only allow drawing if isDrawingActive is true
    if (!isDrawingActive) {
      return;
    }

    isDrawingRef.current = false;
  };


  return (
      <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`shadow-lg block transition-shadow duration-300 ease-in-out hover:shadow-xl ${className}`}
          style={style}
      />
  );
});

export default Canvas;