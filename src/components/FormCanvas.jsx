import React, { useRef, useEffect } from "react";

const FormCanvas = React.forwardRef(({ width, height, className, style, isFormActive = false, onFormStart, onFormMove, onFormEnd }, forwardedRef) => {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

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
    context.fillStyle = "rgba(255, 255, 255, 0)"; // Transparent background
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [width, height]);

  const handleMouseDown = (e) => {
    // Only allow interaction if isFormActive is true
    if (!isFormActive) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    startPosRef.current = { x, y };
    isDrawingRef.current = true;

    if (onFormStart) {
      onFormStart(x, y);
    }
  };

  const handleMouseMove = (e) => {
    // Only allow interaction if isFormActive is true and we're drawing
    if (!isFormActive || !isDrawingRef.current) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (onFormMove) {
      onFormMove(startPosRef.current.x, startPosRef.current.y, x, y);
    }
  };

  const handleMouseUp = (e) => {
    // Only allow interaction if isFormActive is true and we're drawing
    if (!isFormActive || !isDrawingRef.current) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = false;

    if (onFormEnd) {
      onFormEnd(startPosRef.current.x, startPosRef.current.y, x, y);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`shadow-lg block transition-shadow duration-300 ease-in-out hover:shadow-xl ${className}`}
      style={{
        ...style,
        pointerEvents: isFormActive ? "auto" : "none", // Only allow interaction when form tool is active
      }}
    />
  );
});

export default FormCanvas;
