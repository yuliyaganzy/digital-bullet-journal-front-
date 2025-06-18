import React, { useState } from "react";
import PropTypes from "prop-types";

// TODO: Import icons from a library like react-icons or heroicons

const TextMenu = ({ textElement, onTextElementChange }) => {
  const [activeTab, setActiveTab] = useState("text"); // text, style, case

  const fontFamilies = [
    "Monoton",
    "Monotype Corsiva",
    "Montagu Slab",
    "Moon Light",
    "Montserrat",
    "Noto Sans Lao",
    "Mooli",
    "Moon Dance",
  ];

  const fontWeights = [
    { value: "100", label: "Thin" },
    { value: "200", label: "Extra Light" },
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi Bold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra Bold" },
    { value: "900", label: "Black" },
  ];

  const fontStyles = [
    { value: "normal", label: "Normal" },
    { value: "italic", label: "Italic" },
  ];

  const textCases = [
    { value: "none", label: "As in sentences" },
    { value: "lowercase", label: "all lowercase" },
    { value: "uppercase", label: "ALL UPPERCASE" },
    { value: "capitalize", label: "Start With Uppercase" },
  ];

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    onTextElementChange({ ...textElement, fontSize: newSize });
  };

  const handleFontFamilyChange = (font) => {
    onTextElementChange({ ...textElement, fontFamily: font });
  };

  const handleFontWeightChange = (weight) => {
    onTextElementChange({ ...textElement, fontWeight: weight });
  };

  const handleFontStyleChange = (style) => {
    onTextElementChange({ ...textElement, fontStyle: style });
  };

  const handleTextCaseChange = (textCase) => {
    onTextElementChange({ ...textElement, textTransform: textCase });
  };

  const handleKerningChange = (e) => {
    const newKerning = parseFloat(e.target.value);
    onTextElementChange({ ...textElement, letterSpacing: `${newKerning}px` });
  };

  const handleLeadingChange = (e) => {
    const newLeading = parseFloat(e.target.value);
    onTextElementChange({ ...textElement, lineHeight: newLeading });
  };

  return (
    <div className=" bg-[#C3DEE1] rounded-lg shadow-lg w-[300px]">
      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A]">
        <button
          className={`flex-1 p-3 text-center ${activeTab === "text" ? "bg-[#93C9CF]" : ""}`}
          onClick={() => setActiveTab("text")}
        >
          {/* TODO: Add Text icon */}
          Text
        </button>
        <button
          className={`flex-1 p-3 text-center ${activeTab === "style" ? "bg-[#93C9CF]" : ""}`}
          onClick={() => setActiveTab("style")}
        >
          {/* TODO: Add Style icon */}
          Style
        </button>
        <button
          className={`flex-1 p-3 text-center ${activeTab === "case" ? "bg-[#93C9CF]" : ""}`}
          onClick={() => setActiveTab("case")}
        >
          {/* TODO: Add Case icon */}
          Case
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "text" && (
          <div className="space-y-4">
            {/* Font Family Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Font Family</label>
              <div className="relative">
                <select
                  value={textElement.fontFamily || "Montserrat"}
                  onChange={(e) => handleFontFamilyChange(e.target.value)}
                  className="w-full p-2 border border-[#2A2A2A] rounded bg-white"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Size</label>
              <input
                type="range"
                min="8"
                max="72"
                value={textElement.fontSize || 16}
                onChange={handleFontSizeChange}
                className="w-full"
              />
              <div className="text-sm text-right">{textElement.fontSize}px</div>
            </div>

            {/* Kerning */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Kerning</label>
              <input
                type="range"
                min="-2"
                max="10"
                step="0.1"
                value={parseFloat(textElement.letterSpacing) || 0}
                onChange={handleKerningChange}
                className="w-full"
              />
              <div className="text-sm text-right">{textElement.letterSpacing || "0px"}</div>
            </div>

            {/* Leading */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Leading</label>
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.1"
                value={textElement.lineHeight || 1.2}
                onChange={handleLeadingChange}
                className="w-full"
              />
              <div className="text-sm text-right">{textElement.lineHeight || 1.2}</div>
            </div>
          </div>
        )}

        {activeTab === "style" && (
          <div className="space-y-4">
            {/* Font Weight */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Font Weight</label>
              <div className="grid grid-cols-3 gap-2">
                {fontWeights.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleFontWeightChange(value)}
                    className={`p-2 text-sm border rounded ${
                      textElement.fontWeight === value
                        ? "bg-[#93C9CF] border-[#2A2A2A]"
                        : "border-transparent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Font Style</label>
              <div className="flex gap-2">
                {fontStyles.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleFontStyleChange(value)}
                    className={`flex-1 p-2 text-sm border rounded ${
                      textElement.fontStyle === value ? "bg-[#93C9CF] border-[#2A2A2A]" : "border-transparent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "case" && (
          <div className="space-y-4">
            {/* Text Case */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Change Case</label>
              <div className="space-y-2">
                {textCases.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleTextCaseChange(value)}
                    className={`w-full p-2 text-sm text-left border rounded ${
                      textElement.textTransform === value
                        ? "bg-[#93C9CF] border-[#2A2A2A]"
                        : "border-transparent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
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
    letterSpacing: PropTypes.string,
    lineHeight: PropTypes.number,
    textTransform: PropTypes.string,
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
