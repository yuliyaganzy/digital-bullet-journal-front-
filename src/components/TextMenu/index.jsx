import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TbTypography,
  TbBold,
  TbItalic,
  TbUnderline,
  TbSettings,
  TbPalette,
  TbAlignLeft,
  TbAlignCenter,
  TbAlignRight,
  TbAlignJustified,
  TbPlus,
} from "react-icons/tb";

const TextMenu = ({ textElement, onTextElementChange }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem("customColors");
    return saved ? JSON.parse(saved) : [];
  });

  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Helvetica",
    "Georgia",
    "Verdana",
    "Courier New",
    "Trebuchet MS",
    "Impact",
  ];

  const textCases = [
    { value: "none", label: "As in sentences" },
    { value: "lowercase", label: "all lowercase" },
    { value: "uppercase", label: "ALL UPPERCASE" },
    { value: "capitalize", label: "Start With Uppercase" },
  ];

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

  const [tempColor, setTempColor] = useState("");

  useEffect(() => {
    localStorage.setItem("customColors", JSON.stringify(customColors));
  }, [customColors]);

  const handleFontFamilyChange = (font) => {
    onTextElementChange({ ...textElement, fontFamily: font });
  };

  const handleBoldClick = () => {
    const newWeight = textElement.fontWeight === "700" ? "400" : "700";
    onTextElementChange({ ...textElement, fontWeight: newWeight });
  };

  const handleItalicClick = () => {
    const newStyle = textElement.fontStyle === "italic" ? "normal" : "italic";
    onTextElementChange({ ...textElement, fontStyle: newStyle });
  };

  const handleUnderlineClick = () => {
    const newDecoration = textElement.textDecoration === "underline" ? "none" : "underline";
    onTextElementChange({ ...textElement, textDecoration: newDecoration });
  };

  const handleTempColorChange = (color) => {
    setTempColor(color);
  };

  const handleColorChange = (color) => {
    onTextElementChange({ ...textElement, color });
  };

  const handleColorBlur = () => {
    if (tempColor && !defaultColors.includes(tempColor) && !customColors.includes(tempColor)) {
      setCustomColors((prev) => [...new Set([tempColor, ...prev])].slice(0, 8));
    }
    setTempColor("");
  };

  // const colorInputRef = useClickAway(handleColorBlur);

  const handleAlignmentChange = (alignment) => {
    onTextElementChange({ ...textElement, textAlign: alignment });
  };

  const renderFontTab = () => (
    <div className="py-3 max-h-[300px] overflow-y-auto">
      {fontFamilies.map((font) => (
        <button
          key={font}
          onClick={() => handleFontFamilyChange(font)}
          className="w-full px-6 py-2 text-left hover:bg-[#93C9CF] transition-colors"
          style={{ fontFamily: font }}
        >
          {font}
        </button>
      ))}
    </div>
  );

  const renderSizeTab = () => (
    <div className="p-6 space-y-6">
      <div className="space-y-3">
        <label className="block text-sm">Size</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="8"
            max="72"
            value={textElement.fontSize || 16}
            onChange={(e) => onTextElementChange({ ...textElement, fontSize: parseInt(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm w-12 text-right">{textElement.fontSize}px</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm">Kerning</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="-2"
            max="10"
            step="0.1"
            value={parseFloat(textElement.letterSpacing) || 0}
            onChange={(e) => onTextElementChange({ ...textElement, letterSpacing: `${e.target.value}px` })}
            className="flex-1"
          />
          <span className="text-sm w-12 text-right">{textElement.letterSpacing || "0px"}</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm">Leading</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0.8"
            max="3"
            step="0.1"
            value={textElement.lineHeight || 1.2}
            onChange={(e) => onTextElementChange({ ...textElement, lineHeight: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm w-12 text-right">{textElement.lineHeight || 1.2}</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm">Case</label>
        <select
          value={textElement.textTransform || "none"}
          onChange={(e) => onTextElementChange({ ...textElement, textTransform: e.target.value })}
          className="w-full p-2 border border-[#2A2A2A] rounded-lg bg-white"
        >
          {textCases.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderColorTab = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm">Color</span>
        <div className="relative">
          <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 hover:border-gray-600 flex items-center justify-center">
            <TbPlus size={20} />
          </button>
          <input
            type="color"
            value={tempColor || textElement.color}
            onChange={(e) => handleTempColorChange(e.target.value)}
            onMouseOut={handleColorBlur}
            className="absolute top-0 left-0 w-8 h-8 opacity-0 cursor-pointer"
          />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {[...defaultColors, ...customColors].map((color, index) => (
          <button
            key={`${color}-${index}`}
            onClick={() => handleColorChange(color)}
            className="w-8 h-8 rounded-full border border-gray-300 hover:border-gray-600 transition-colors"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );

  const renderAlignmentTab = () => (
    <div className="p-6 flex justify-between">
      <button
        onClick={() => handleAlignmentChange("left")}
        className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
          textElement.textAlign === "left" ? "bg-[#93C9CF]" : ""
        }`}
      >
        <TbAlignLeft size={24} />
      </button>
      <button
        onClick={() => handleAlignmentChange("center")}
        className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
          textElement.textAlign === "center" ? "bg-[#93C9CF]" : ""
        }`}
      >
        <TbAlignCenter size={24} />
      </button>
      <button
        onClick={() => handleAlignmentChange("right")}
        className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
          textElement.textAlign === "right" ? "bg-[#93C9CF]" : ""
        }`}
      >
        <TbAlignRight size={24} />
      </button>
      <button
        onClick={() => handleAlignmentChange("justify")}
        className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
          textElement.textAlign === "justify" ? "bg-[#93C9CF]" : ""
        }`}
      >
        <TbAlignJustified size={24} />
      </button>
    </div>
  );

  return (
    <div className="bg-[#C3DEE1] rounded-2xl shadow-lg w-[320px] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center p-2 border-b border-[#2A2A2A] gap-1">
        <button
          onClick={() => setActiveTab(activeTab === "font" ? null : "font")}
          className={`p-2 rounded-lg hover:bg-[#93C9CF] ${activeTab === "font" ? "bg-[#93C9CF]" : ""}`}
        >
          <TbTypography size={24} />
        </button>
        <button
          onClick={handleBoldClick}
          className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
            textElement.fontWeight === "700" ? "bg-[#93C9CF]" : ""
          }`}
        >
          <TbBold size={24} />
        </button>
        <button
          onClick={handleItalicClick}
          className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
            textElement.fontStyle === "italic" ? "bg-[#93C9CF]" : ""
          }`}
        >
          <TbItalic size={24} />
        </button>
        <button
          onClick={handleUnderlineClick}
          className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
            textElement.textDecoration === "underline" ? "bg-[#93C9CF]" : ""
          }`}
        >
          <TbUnderline size={24} />
        </button>
        <button
          onClick={() => setActiveTab(activeTab === "size" ? null : "size")}
          className={`p-2 rounded-lg hover:bg-[#93C9CF] ${activeTab === "size" ? "bg-[#93C9CF]" : ""}`}
        >
          <TbSettings size={24} />
        </button>
        <button
          onClick={() => setActiveTab(activeTab === "color" ? null : "color")}
          className={`p-2 rounded-lg hover:bg-[#93C9CF] ${activeTab === "color" ? "bg-[#93C9CF]" : ""}`}
        >
          <TbPalette size={24} />
        </button>
        <button
          onClick={() => setActiveTab(activeTab === "align" ? null : "align")}
          className={`p-2 rounded-lg hover:bg-[#93C9CF] ${activeTab === "align" ? "bg-[#93C9CF]" : ""}`}
        >
          <TbAlignLeft size={24} />
        </button>
      </div>

      {/* Content */}
      {activeTab === "font" && renderFontTab()}
      {activeTab === "size" && renderSizeTab()}
      {activeTab === "color" && renderColorTab()}
      {activeTab === "align" && renderAlignmentTab()}
    </div>
  );
};

TextMenu.propTypes = {
  textElement: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
    fontSize: PropTypes.number,
    fontFamily: PropTypes.string,
    fontWeight: PropTypes.string,
    fontStyle: PropTypes.string,
    textDecoration: PropTypes.string,
    letterSpacing: PropTypes.string,
    lineHeight: PropTypes.number,
    textTransform: PropTypes.string,
    textAlign: PropTypes.string,
    color: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    rotation: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
  onTextElementChange: PropTypes.func.isRequired,
};

export default TextMenu;
