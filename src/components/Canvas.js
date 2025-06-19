import React, { useRef, useEffect } from "react";
import "../styles/Canvas.css";
import { brushHandlers } from "./brushes"; // Import brush handlers

const Canvas = React.forwardRef(({ color, brushSize, width, height, brushType }, forwardedRef) => {
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
    const currentPosition = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    lastPositionRef.current = currentPosition;
    isDrawingRef.current = true;
  };

  const handleMouseMove = (e) => {
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
    isDrawingRef.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="canvas"
    ></canvas>
  );
});

export default Canvas;
