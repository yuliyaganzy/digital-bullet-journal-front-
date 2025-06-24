import React, { useRef, useEffect } from "react";
import { brushHandlers } from "./brushes"; // Import brush handlers

const Canvas = React.forwardRef(({ 
  color, 
  brushSize, 
  width, 
  height, 
  brushType, 
  className, 
  style, 
  isDrawingActive = false,
  opacity = 100,
  rotation = 0
}, forwardedRef) => {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());
  const brushStateRef = useRef({});

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

    // Initialize or reset brush state for the current brush type
    if (brushType) {
      // Keep some properties like lastPoints for smooth transitions between strokes
      const existingState = brushStateRef.current[brushType] || {};
      brushStateRef.current[brushType] = {
        // Keep lastPoints if they exist, otherwise initialize to empty array
        lastPoints: existingState.lastPoints || [],
        // Reset other properties
        lastSpeed: 0,
        lastWidth: brushSize,
        lastPressure: 0.5,
        lastGrainOffset: existingState.lastGrainOffset || 0,
      };
    }
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

    // Apply opacity
    context.globalAlpha = opacity / 100;

    // Apply rotation if needed
    if (rotation !== 0) {
      // Save the current context state
      context.save();

      // Translate to the center of the canvas
      context.translate(canvas.width / 2, canvas.height / 2);

      // Rotate the context
      context.rotate((rotation * Math.PI) / 180);

      // Translate back
      context.translate(-canvas.width / 2, -canvas.height / 2);
    }

    const currentPosition = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

    const brushHandler = brushHandlers[brushType] || brushHandlers.default;

    // Get the current brush state or initialize an empty object
    const currentBrushState = brushStateRef.current[brushType] || {};

    // Call the brush handler with the current state
    const newBrushState = brushHandler(context, {
      start: lastPositionRef.current,
      end: currentPosition,
      color,
      size: brushSize,
      opacity: opacity / 100, // Pass opacity to brush handler
      lastTime: lastTimeRef.current,
      ...currentBrushState, // Spread the current brush state
    });

    // Update the brush state if the handler returned a new state
    if (newBrushState) {
      brushStateRef.current[brushType] = newBrushState;
    }

    // Restore the context state if rotation was applied
    if (rotation !== 0) {
      context.restore();
    }

    lastPositionRef.current = currentPosition;
    lastTimeRef.current = Date.now();
  };

  const handleMouseUp = (e) => {
    // Only allow drawing if isDrawingActive is true
    if (!isDrawingActive) {
      return;
    }

    // If we were drawing, add a final point with isEndOfStroke flag
    if (isDrawingRef.current && brushType) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const currentPosition = { x: e.nativeEvent?.offsetX || lastPositionRef.current.x, y: e.nativeEvent?.offsetY || lastPositionRef.current.y };

      // Apply opacity
      context.globalAlpha = opacity / 100;

      // Apply rotation if needed
      if (rotation !== 0) {
        // Save the current context state
        context.save();

        // Translate to the center of the canvas
        context.translate(canvas.width / 2, canvas.height / 2);

        // Rotate the context
        context.rotate((rotation * Math.PI) / 180);

        // Translate back
        context.translate(-canvas.width / 2, -canvas.height / 2);
      }

      const brushHandler = brushHandlers[brushType] || brushHandlers.default;
      const currentBrushState = brushStateRef.current[brushType] || {};

      // Call the brush handler with isEndOfStroke flag
      const newBrushState = brushHandler(context, {
        start: lastPositionRef.current,
        end: currentPosition,
        color,
        size: brushSize,
        opacity: opacity / 100, // Pass opacity to brush handler
        lastTime: lastTimeRef.current,
        isEndOfStroke: true, // Flag to indicate end of stroke
        ...currentBrushState,
      });

      // Update the brush state
      if (newBrushState) {
        brushStateRef.current[brushType] = newBrushState;
      }

      // Restore the context state if rotation was applied
      if (rotation !== 0) {
        context.restore();
      }
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
