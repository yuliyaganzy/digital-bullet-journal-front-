import React, { useRef } from "react";
import PropTypes from "prop-types";


const KeySetupModal = ({
  isOpen,
  onClose,
  keyForm,
  setKeyForm,
  keyError,
  keyDrawingCanvas,
  setKeyDrawingCanvas,
  keyBrushStateRef,
  currentKeyColorRef,
  setSvgPathData,
  onCreateKey,
}) => {
  const modalRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Darkened background */}
      <div className="absolute inset-0 bg-[#2A2A2A] opacity-73" onClick={onClose}></div>

      {/* Modal content */}
      <div 
        ref={modalRef}
        className="bg-white rounded-lg relative z-10 w-[800px]"
      >
        <h2 className="text-center mt-[40px] font-[400] text-[32px] font-['American_BT'] text-[#2A2A2A]">Set up your key</h2>

        {/* Error message */}
        {keyError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded mx-[40px]">
            {keyError}
          </div>
        )}

        <div className="flex mt-[40px]">
          {/* Left side - Drawing area */}
          <div>
            <label className="block font-[300] text-[20px] ml-[44px]">Draw the symbol</label>
            <div className="relative mt-[4px]">
              {/* Canvas container */}
              <div 
                className="border rounded w-[431px] h-[263px] flex items-center justify-center bg-white relative overflow-hidden ml-[40px]"
                ref={(el) => {
                  if (el && !keyDrawingCanvas) {
                    // Create a canvas element
                    const canvas = document.createElement('canvas');
                    // Set canvas size to match container size
                    canvas.width = el.clientWidth;
                    canvas.height = el.clientHeight;
                    canvas.style.border = 'none';
                    canvas.style.width = '100%';
                    canvas.style.height = '100%';
                    canvas.style.cursor = `url('/images/img_default_cursor.svg'), auto`;

                    // Clear the canvas
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Append the canvas to the container
                    el.innerHTML = '';
                    el.appendChild(canvas);

                    // Store the canvas reference
                    setKeyDrawingCanvas(canvas);

                    // Set up drawing variables
                    let isDrawing = false;
                    let points = [];
                    // Store all completed strokes with their colors
                    // Attach to canvas so it can be accessed from outside
                    canvas.allStrokes = [];

                    // Set up canvas properties for better drawing
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
                    ctx.lineWidth = 3;

                    // Function to get coordinates from event (mouse or touch)
                    const getCoords = (e) => {
                      const rect = canvas.getBoundingClientRect();
                      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
                      return {
                        x: clientX - rect.left,
                        y: clientY - rect.top
                      };
                    };

                    // Function to start drawing
                    const startDrawing = (e) => {
                      e.preventDefault();
                      isDrawing = true;

                      // Reset points array
                      points = [];

                      // Get starting coordinates
                      const coords = getCoords(e);
                      points.push(coords);

                      // Set canvas drawing properties
                      ctx.strokeStyle = currentKeyColorRef.current;

                      // Start a new path
                      ctx.beginPath();
                      ctx.moveTo(coords.x, coords.y);

                      // Start SVG path data
                      setSvgPathData(`M ${coords.x} ${coords.y}`);
                    };

                    // Function to draw
                    const draw = (e) => {
                      if (!isDrawing) return;
                      e.preventDefault();

                      // Get current coordinates
                      const coords = getCoords(e);
                      points.push(coords);

                      // Clear canvas and redraw all points for smoother lines
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                      ctx.fillStyle = '#ffffff';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);

                      // First, redraw all previous strokes with their original colors
                      canvas.allStrokes.forEach(stroke => {
                        // Set the color for this stroke
                        ctx.strokeStyle = stroke.color;

                        // Draw the stroke
                        ctx.beginPath();
                        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

                        for (let i = 1; i < stroke.points.length; i++) {
                          if (i < stroke.points.length - 1) {
                            // Calculate control point (midpoint between points)
                            const xc = (stroke.points[i].x + stroke.points[i+1].x) / 2;
                            const yc = (stroke.points[i].y + stroke.points[i+1].y) / 2;

                            // Draw quadratic curve
                            ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
                          } else {
                            // For the last point, draw a line
                            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
                          }
                        }

                        ctx.stroke();
                      });

                      // Now draw the current stroke with the current color
                      ctx.strokeStyle = currentKeyColorRef.current;

                      // Start drawing path
                      ctx.beginPath();
                      ctx.moveTo(points[0].x, points[0].y);

                      // Build SVG path data for the current stroke
                      let currentPathData = `M ${points[0].x} ${points[0].y}`;

                      // Draw smooth curve through all points
                      for (let i = 1; i < points.length; i++) {
                        // Use quadratic curves for smoother lines
                        if (i < points.length - 1) {
                          // Calculate control point (midpoint between points)
                          const xc = (points[i].x + points[i+1].x) / 2;
                          const yc = (points[i].y + points[i+1].y) / 2;

                          // Draw quadratic curve
                          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);

                          // Add to SVG path
                          currentPathData += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
                        } else {
                          // For the last point, draw a line
                          ctx.lineTo(points[i].x, points[i].y);
                          currentPathData += ` L ${points[i].x} ${points[i].y}`;
                        }
                      }

                      // Stroke the path
                      ctx.stroke();

                      // Build complete SVG path data from all strokes
                      let completePathData = "";

                      // Add paths from previous strokes
                      canvas.allStrokes.forEach(stroke => {
                        if (completePathData) completePathData += " ";
                        completePathData += stroke.pathData;
                      });

                      // Add current path
                      if (completePathData) completePathData += " ";
                      completePathData += currentPathData;

                      // Update SVG path data
                      setSvgPathData(completePathData);
                    };

                    // Function to end drawing
                    const endDrawing = (e) => {
                      if (!isDrawing) return;

                      // Final draw to ensure last point is captured
                      if (e) {
                        const coords = getCoords(e);
                        points.push(coords);
                        draw(e);
                      }

                      // Store the completed stroke with its color
                      if (points.length > 1) {
                        // Build path data for this stroke
                        let strokePathData = `M ${points[0].x} ${points[0].y}`;
                        for (let i = 1; i < points.length; i++) {
                          if (i < points.length - 1) {
                            const xc = (points[i].x + points[i+1].x) / 2;
                            const yc = (points[i].y + points[i+1].y) / 2;
                            strokePathData += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
                          } else {
                            strokePathData += ` L ${points[i].x} ${points[i].y}`;
                          }
                        }

                        // Add the stroke to allStrokes
                        canvas.allStrokes.push({
                          points: [...points], // Create a copy of points
                          color: currentKeyColorRef.current,
                          pathData: strokePathData
                        });
                      }

                      isDrawing = false;
                      // Reset points array for the next stroke
                      points = [];
                    };

                    // Add mouse event listeners
                    canvas.addEventListener('mousedown', startDrawing);
                    canvas.addEventListener('mousemove', draw);
                    canvas.addEventListener('mouseup', endDrawing);
                    canvas.addEventListener('mouseleave', endDrawing);

                    // Add touch event listeners for mobile support
                    canvas.addEventListener('touchstart', startDrawing);
                    canvas.addEventListener('touchmove', draw);
                    canvas.addEventListener('touchend', endDrawing);
                    canvas.addEventListener('touchcancel', endDrawing);

                    // Set cursor style
                    canvas.style.cursor = `url('/images/img_default_cursor.svg'), auto`;
                  }
                }}
              ></div>

              {/* Canvas controls */}
              <div className="absolute top-2 right-2 flex gap-1">
                <button 
                  className="bg-white p-1 rounded border hover:bg-gray-100"
                  onClick={() => {
                    if (keyDrawingCanvas) {
                      const ctx = keyDrawingCanvas.getContext('2d');
                      ctx.fillStyle = '#ffffff';
                      ctx.fillRect(0, 0, keyDrawingCanvas.width, keyDrawingCanvas.height);
                      // Clear all strokes
                      keyDrawingCanvas.allStrokes = [];
                      // Reset SVG path data
                      setSvgPathData("");
                    }
                  }}
                  title="Clear canvas"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Parameters */}
          <div className="ml-[20px] mt-[26px]">
            {/* Key name input */}
            <div className="mb-[18px] flex items-center gap-4">
              <label className="block font-[300] text-[20px]">Key name:</label>
              <input 
                type="text" 
                value={keyForm.name}
                onChange={(e) => setKeyForm({...keyForm, name: e.target.value})}
                className="flex w-auto border-b-1 outline-none focus:outline-none focus:ring-0"
              />
            </div>

            {/* Color picker */}
            <div className="flex gap-4">
              <label className="block font-[300] text-[20px] mb-1">Select a color:</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <svg width="26" height="26" viewBox="0 0 18 18" fill={keyForm.color} xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.99469 1C12.8133 4.16444 18.9626 7.75733 16.3888 12.9084C15.16 15.3671 12.1915 17 9.00002 17C5.80858 17 2.84008 15.3671 1.61129 12.9084C-0.961485 7.76178 5.18139 4.16533 8.99469 1Z" stroke="#2A2A2A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input 
                    type="color" 
                    value={keyForm.color}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      currentKeyColorRef.current = newColor;
                      setKeyForm({...keyForm, color: newColor});
                    }}
                    className="absolute top-0 left-0 w-6 h-6 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-[28px] mr-[40px] mb-[40px] mt-[40px]">
          <button 
            className="px-[24px] py-[8px] border-[3px] border-[#C3DEE1] rounded-[10px] font-[300] text-[20px] hover:bg-[#C3DEE1]"
            onClick={() => {
              // Reset drawing canvas and brush state
              setKeyDrawingCanvas(null);
              keyBrushStateRef.current = {};
              // Reset SVG path data
              setSvgPathData("");
              onClose();
            }}
          >
            Cancel
          </button>
          <button 
            className="px-[24px] py-[8px] border-[3px] border-[#C3DEE1] rounded-[10px] font-[300] text-[20px] hover:bg-[#C3DEE1]"
            onClick={onCreateKey}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

KeySetupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  keyForm: PropTypes.object.isRequired,
  setKeyForm: PropTypes.func.isRequired,
  keyError: PropTypes.string,
  keyDrawingCanvas: PropTypes.object,
  setKeyDrawingCanvas: PropTypes.func.isRequired,
  keyBrushStateRef: PropTypes.object.isRequired,
  currentKeyColorRef: PropTypes.object.isRequired,
  setSvgPathData: PropTypes.func.isRequired,
  onCreateKey: PropTypes.func.isRequired,
};

export default KeySetupModal;
