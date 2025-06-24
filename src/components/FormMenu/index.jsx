import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import CustomRangeSlider from "../ui/CustomRangeSlider";

const FormMenu = ({ formElement, onFormElementChange }) => {
  // Check if the form element is a calendar or key object
  const isCalendarOrKey = formElement.isCalendar || formElement.isKey;
  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem("customColors");
    return saved ? JSON.parse(saved) : [];
  });

  const [tempColor, setTempColor] = useState("");
  const [tempStrokeColor, setTempStrokeColor] = useState("");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isStrokeColorPickerOpen, setIsStrokeColorPickerOpen] = useState(false);
  const draftColorRef = useRef(formElement.fillColor || "#000000");
  const draftStrokeColorRef = useRef(formElement.strokeColor || "#000000");
  const colorInputRef = useRef(null);
  const strokeColorInputRef = useRef(null);

  const defaultColors = [
    "#FFFFFF",
    "#85544D",
    "#EFB8C8",
    "#84A285",
    "#000080",
    "#000000",
    "#FFF0DB",
    "#800080",
    "#FFD700",
    "#FF69B4",
    "#808080",
    "#4B0082",
    "#008000",
    "#FFC0CB",
    "#800000",
  ];

  useEffect(() => {
    localStorage.setItem("customColors", JSON.stringify(customColors));
  }, [customColors]);

  const handleColorIconClick = () => {
    setIsColorPickerOpen(!isColorPickerOpen);
    if (!isColorPickerOpen && colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const handleStrokeColorIconClick = () => {
    setIsStrokeColorPickerOpen(!isStrokeColorPickerOpen);
    if (!isStrokeColorPickerOpen && strokeColorInputRef.current) {
      strokeColorInputRef.current.click();
    }
  };

  const handleTempColorChange = (color) => {
    setTempColor(color);
    draftColorRef.current = color;
  };

  const handleColorChange = (color) => {
    onFormElementChange({ ...formElement, fillColor: color });
    // Add to custom colors if not already included
    if (!defaultColors.includes(color) && !customColors.includes(color)) {
      setCustomColors((prev) => [...new Set([color, ...prev])].slice(0, 8));
    }
  };

  const handleTempStrokeColorChange = (color) => {
    setTempStrokeColor(color);
    draftStrokeColorRef.current = color;
  };

  const handleStrokeColorChange = (color) => {
    onFormElementChange({ ...formElement, strokeColor: color });
    // Add to custom colors if not already included
    if (!defaultColors.includes(color) && !customColors.includes(color)) {
      setCustomColors((prev) => [...new Set([color, ...prev])].slice(0, 8));
    }
  };

  // Combined rendering function for all settings in one block

  // If it's a calendar or key object, show a simplified interface
  // Render different content based on whether it's a calendar or key object
  if (isCalendarOrKey) {
    return null;
  }

  // Render all settings in one block
  const renderAllSettings = () => {
    // For line and arrow, fill options are disabled
    const isLineOrArrow = formElement.type === "line" || formElement.type === "arrow";
    // For ellipse, corner radius is disabled
    const isEllipse = formElement.type === "ellipse";
    // For image, only show opacity
    const isImage = formElement.type === "image";

    return (
      <div className="">
        {/* Fill Color */}
        {!isImage && (
          <div className={`flex items-center ${isLineOrArrow ? "opacity-50 pointer-events-none" : ""}`}>
            <span className="w-[80px] text-left mr-1 font-[300] text-[20px]">Color:</span>
            <div className="flex gap-[8px]">
              {[...defaultColors, ...customColors].slice(0, 5).map((color, index) => (
                <div
                  key={`${color}-${index}`}
                  onClick={() => {
                    if (!isLineOrArrow) {
                      setTempColor(color);
                      handleColorChange(color);
                    }
                  }}
                  className="w-[24px] h-[24px] rounded-full cursor-pointer border-[0.2px] border-[#2a2a2a]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Color picker button */}
            <div className="relative ml-8">
              <input
                type="color"
                ref={colorInputRef}
                value={tempColor || formElement.fillColor}
                onChange={(e) => handleTempColorChange(e.target.value)}
                className="absolute top-0 left-0 w-[24px] h-[24px] opacity-0 cursor-pointer"
              />
              <div
                className="w-[24px] h-[24px] cursor-pointer relative"
                onClick={handleColorIconClick}
              >
                <svg width="26" height="26" viewBox="0 0 18 18" fill={tempColor || formElement.fillColor} xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.99469 1C12.8133 4.16444 18.9626 7.75733 16.3888 12.9084C15.16 15.3671 12.1915 17 9.00002 17C5.80858 17 2.84008 15.3671 1.61129 12.9084C-0.961485 7.76178 5.18139 4.16533 8.99469 1Z" stroke="#2A2A2A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Apply/Cancel buttons for color picker */}
        {isColorPickerOpen && !isLineOrArrow && (
          <div className="py-[4px]">
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="bg-[#e0e0e0] text-[#2a2a2a] px-3 py-1 rounded-md text-sm font-[300]"
                onClick={() => {
                  setTempColor(formElement.fillColor);
                  setIsColorPickerOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-[#93C9CF] text-[#2a2a2a] px-3 py-1 rounded-md text-sm font-[300]"
                onClick={() => {
                  const selected = draftColorRef.current;
                  handleColorChange(selected);
                  setIsColorPickerOpen(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Fill Opacity */}
        <div className={`flex items-center mt-[12px] ${isLineOrArrow ? "opacity-50 pointer-events-none" : ""}`}>
          <span className="w-[70px] text-left mr-4 font-[300] text-[20px]">Opacity:</span>
          <div className="flex-1">
            <CustomRangeSlider 
              value={formElement.fillTransparency || 100}
              onChange={(value) => isLineOrArrow ? null : onFormElementChange({ ...formElement, fillTransparency: value })}
              onFinalChange={(value) => isLineOrArrow ? null : onFormElementChange({ ...formElement, fillTransparency: value })}
              min={0}
              max={100}
              unit="%"
            />
          </div>
        </div>

        {/* Stroke Color */}
        <div className="flex items-center mt-[12px]">
          <span className="w-[70px] text-left mr-4 font-[300] text-[20px]">Stroke:</span>
          <div className="flex gap-[8px]">
            {[...defaultColors, ...customColors].slice(0, 5).map((color, index) => (
              <div
                key={`stroke-${color}-${index}`}
                onClick={() => {
                  setTempStrokeColor(color);
                  handleStrokeColorChange(color);
                }}
                className="w-[24px] h-[24px] rounded-full cursor-pointer border-[0.2px] border-[#2a2a2a]"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Stroke Color picker button */}
          <div className="relative ml-8">
            <input
              type="color"
              ref={strokeColorInputRef}
              value={tempStrokeColor || formElement.strokeColor}
              onChange={(e) => handleTempStrokeColorChange(e.target.value)}
              className="absolute top-0 left-0 w-[24px] h-[24px] opacity-0 cursor-pointer"
            />
            <div
              className="w-[24px] h-[24px] cursor-pointer relative"
              onClick={handleStrokeColorIconClick}
            >
              <svg width="26" height="26" viewBox="0 0 18 18" fill={tempStrokeColor || formElement.strokeColor} xmlns="http://www.w3.org/2000/svg">
                <path d="M8.99469 1C12.8133 4.16444 18.9626 7.75733 16.3888 12.9084C15.16 15.3671 12.1915 17 9.00002 17C5.80858 17 2.84008 15.3671 1.61129 12.9084C-0.961485 7.76178 5.18139 4.16533 8.99469 1Z" stroke="#2A2A2A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Apply/Cancel buttons for stroke color picker */}
        {isStrokeColorPickerOpen && (
          <div className="py-[4px]">
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="bg-[#e0e0e0] text-[#2a2a2a] px-3 py-1 rounded-md text-sm font-[300]"
                onClick={() => {
                  setTempStrokeColor(formElement.strokeColor);
                  setIsStrokeColorPickerOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-[#93C9CF] text-[#2a2a2a] px-3 py-1 rounded-md text-sm font-[300]"
                onClick={() => {
                  const selected = draftStrokeColorRef.current;
                  handleStrokeColorChange(selected);
                  setIsStrokeColorPickerOpen(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Stroke Opacity */}
        <div className="flex items-center mt-[12px]">
          <span className="w-[70px] text-left mr-4 font-[300] text-[20px]">Opacity:</span>
          <div className="flex-1">
            <CustomRangeSlider 
              value={formElement.strokeTransparency || 100}
              onChange={(value) => onFormElementChange({ ...formElement, strokeTransparency: value })}
              onFinalChange={(value) => onFormElementChange({ ...formElement, strokeTransparency: value })}
              min={0}
              max={100}
              unit="%"
            />
          </div>
        </div>

        {/* Stroke Width */}
        <div className="flex items-center mt-[12px]">
          <span className="w-[70px] text-left mr-3 font-[300] text-[20px]">Width:</span>
          <div className="flex-1">
            <CustomRangeSlider 
              value={formElement.strokeWidth || 1}
              onChange={(value) => onFormElementChange({ ...formElement, strokeWidth: value })}
              onFinalChange={(value) => onFormElementChange({ ...formElement, strokeWidth: value })}
              min={1}
              max={100}
              unit="px"
            />
          </div>
        </div>

        {/* Corner Radius - disabled for ellipse */}
        <div className={`flex items-center mt-[12px] ${isEllipse ? "opacity-50 pointer-events-none" : ""}`}>
          <span className="w-[70px] text-left mr-4 font-[300] text-[20px]">Radius:</span>
          <div className="flex-1">
            <CustomRangeSlider 
              value={isEllipse ? 0 : (formElement.cornerRadius || 0)}
              onChange={(value) => isEllipse ? null : onFormElementChange({ ...formElement, cornerRadius: value })}
              onFinalChange={(value) => isEllipse ? null : onFormElementChange({ ...formElement, cornerRadius: value })}
              min={0}
              max={100}
              unit="px"
            />
          </div>
        </div>

        {/* Rotation */}
        <div className="flex items-center mt-[12px]">
          <span className="w-[70px] text-left mr-4 font-[300] text-[20px]">Rotation:</span>
          <div className="flex-1">
            <CustomRangeSlider 
              value={formElement.rotation || 0}
              onChange={(value) => onFormElementChange({ ...formElement, rotation: value })}
              onFinalChange={(value) => onFormElementChange({ ...formElement, rotation: value })}
              min={0}
              max={360}
              unit="°"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#C3DEE1] rounded-2xl shadow-lg w-[360px]">
      <div className="p-[20px]">
        {renderAllSettings()}
      </div>
    </div>
  );
};

FormMenu.propTypes = {
  formElement: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string,
    fillColor: PropTypes.string,
    fillTransparency: PropTypes.number,
    strokeColor: PropTypes.string,
    strokeTransparency: PropTypes.number,
    cornerRadius: PropTypes.number,
    rotation: PropTypes.number,
    strokeWidth: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    pageIndex: PropTypes.number,
  }).isRequired,
  onFormElementChange: PropTypes.func.isRequired,
};

export default FormMenu;
