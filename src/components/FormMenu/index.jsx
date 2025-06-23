import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TbSettings,
  TbPalette,
  TbRotate,
  TbBorderRadius,
  TbBorderStyle,
  TbPlus,
} from "react-icons/tb";

const FormMenu = ({ formElement, onFormElementChange }) => {
  // Check if the form element is a calendar or key object
  const isCalendarOrKey = formElement.isCalendar || formElement.isKey;
  const [activeTab, setActiveTab] = useState(null);
  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem("customColors");
    return saved ? JSON.parse(saved) : [];
  });

  const [tempColor, setTempColor] = useState("");
  const [tempStrokeColor, setTempStrokeColor] = useState("");

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

  const handleTempColorChange = (color) => {
    setTempColor(color);
  };

  const handleColorChange = (color) => {
    onFormElementChange({ ...formElement, fillColor: color });
  };

  const handleTempStrokeColorChange = (color) => {
    setTempStrokeColor(color);
  };

  const handleStrokeColorChange = (color) => {
    onFormElementChange({ ...formElement, strokeColor: color });
  };

  const handleColorBlur = () => {
    if (tempColor && !defaultColors.includes(tempColor) && !customColors.includes(tempColor)) {
      setCustomColors((prev) => [...new Set([tempColor, ...prev])].slice(0, 8));
    }
    setTempColor("");
  };

  const handleStrokeColorBlur = () => {
    if (tempStrokeColor && !defaultColors.includes(tempStrokeColor) && !customColors.includes(tempStrokeColor)) {
      setCustomColors((prev) => [...new Set([tempStrokeColor, ...prev])].slice(0, 8));
    }
    setTempStrokeColor("");
  };

  const renderFillTab = () => {
    // Don't show fill options for line and arrow
    if (formElement.type === "line" || formElement.type === "arrow") {
      return (
        <div className="p-6">
          <div className="text-center text-gray-500">
            Fill options are not available for this shape type.
          </div>
        </div>
      );
    }

    // For image/video, only show transparency option
    if (formElement.type === "image") {
      return (
        <div className="p-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm">Image/Video Transparency</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formElement.fillTransparency || 100}
                  onChange={(e) => onFormElementChange({ ...formElement, fillTransparency: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm w-12 text-right">{formElement.fillTransparency || 100}%</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm">Fill Color</label>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-[8px]">
                {[...defaultColors, ...customColors].slice(0, 5).map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    onClick={() => handleColorChange(color)}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:border-gray-600 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="relative">
                <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 hover:border-gray-600 flex items-center justify-center">
                  <TbPlus size={20} />
                </button>
                <input
                  type="color"
                  value={tempColor || formElement.fillColor}
                  onChange={(e) => handleTempColorChange(e.target.value)}
                  onMouseOut={handleColorBlur}
                  className="absolute top-0 left-0 w-8 h-8 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm">Fill Transparency</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={formElement.fillTransparency || 100}
                onChange={(e) => onFormElementChange({ ...formElement, fillTransparency: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{formElement.fillTransparency || 100}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStrokeTab = () => (
    <div className="p-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm">Stroke Color</label>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-[8px]">
              {[...defaultColors, ...customColors].slice(0, 5).map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  onClick={() => handleStrokeColorChange(color)}
                  className="w-8 h-8 rounded-full border border-gray-300 hover:border-gray-600 transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="relative">
              <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 hover:border-gray-600 flex items-center justify-center">
                <TbPlus size={20} />
              </button>
              <input
                type="color"
                value={tempStrokeColor || formElement.strokeColor}
                onChange={(e) => handleTempStrokeColorChange(e.target.value)}
                onMouseOut={handleStrokeColorBlur}
                className="absolute top-0 left-0 w-8 h-8 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm">Stroke Transparency</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={formElement.strokeTransparency || 100}
              onChange={(e) => onFormElementChange({ ...formElement, strokeTransparency: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm w-12 text-right">{formElement.strokeTransparency || 100}%</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm">Stroke Width</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="20"
              value={formElement.strokeWidth || 1}
              onChange={(e) => onFormElementChange({ ...formElement, strokeWidth: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm w-12 text-right">{formElement.strokeWidth || 1}px</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShapeTab = () => (
    <div className="p-6">
      <div className="space-y-6">
        {formElement.type !== "ellipse" && (
          <div className="space-y-3">
            <label className="block text-sm">Corner Radius</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                value={formElement.cornerRadius || 0}
                onChange={(e) => onFormElementChange({ ...formElement, cornerRadius: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{formElement.cornerRadius || 0}px</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-sm">Rotation</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="360"
              value={formElement.rotation || 0}
              onChange={(e) => onFormElementChange({ ...formElement, rotation: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm w-12 text-right">{formElement.rotation || 0}°</span>
          </div>
        </div>
      </div>
    </div>
  );

  // If it's a calendar or key object, show a simplified interface
  // Render different content based on whether it's a calendar or key object
  if (isCalendarOrKey) {
    return
  }

  return (
    <div className="bg-[#C3DEE1] rounded-2xl shadow-lg w-[320px] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center p-2 border-b border-[#2A2A2A] gap-1">
        <button
          onClick={() => setActiveTab(activeTab === "fill" ? null : "fill")}
          className={`p-2 rounded-lg hover:bg-[#93C9CF] ${activeTab === "fill" ? "bg-[#93C9CF]" : ""}`}
        >
          <TbPalette size={24} />
        </button>
        <button
          onClick={() => setActiveTab(activeTab === "stroke" ? null : "stroke")}
          className={`p-2 rounded-lg hover:bg-[#93C9CF] ${activeTab === "stroke" ? "bg-[#93C9CF]" : ""}`}
        >
          <TbBorderStyle size={24} />
        </button>
        <button
          onClick={() => setActiveTab(activeTab === "shape" ? null : "shape")}
          className={`p-2 rounded-lg hover:bg-[#93C9CF] ${activeTab === "shape" ? "bg-[#93C9CF]" : ""}`}
        >
          <TbSettings size={24} />
        </button>
      </div>

      {/* Content */}
      {activeTab === "fill" && renderFillTab()}
      {activeTab === "stroke" && renderStrokeTab()}
      {activeTab === "shape" && renderShapeTab()}
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
