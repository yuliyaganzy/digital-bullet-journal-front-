import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { TbPlus } from "react-icons/tb";

// Custom styles for range inputs
const rangeInputStyles = {
  // Container styles to ensure consistent positioning
  container: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Set gap to 12px for spacing between slider and value
    width: "100%",
  },
  // Slider container to ensure consistent width
  sliderContainer: {
    position: "relative",
    width: "140px",
    height: "6px",
    backgroundColor: "#969696", // Unfilled part color
    borderRadius: "3px",
  },
  // Range input styling
  rangeInput: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    appearance: "none",
    backgroundColor: "transparent",
    margin: "0",
    padding: "0",
    cursor: "pointer",
  },
  // Thumb styling (the draggable part)
  thumb: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#2A2A2A",
    border: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
  },
  // Progress bar (filled part)
  progress: {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    backgroundColor: "#2A2A2A", // Filled part color
    borderRadius: "3px",
    pointerEvents: "none",
  },
  // Value display with fixed width
  valueDisplay: {
    minWidth: "50px",
    textAlign: "left",
  },
  // Input for manual value entry
  valueInput: {
    width: "35px",
    textAlign: "right",
    padding: "2px 4px",
    fontSize: "20px",
    fontWeight: "300",
    backgroundColor: "transparent",
    marginRight: "2px",
  },
};

// Custom Range Slider component
const CustomRangeSlider = ({ value, onChange, min, max, step = 1 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const progressRef = useRef(null);

  // Update progress bar width based on value
  useEffect(() => {
    if (progressRef.current) {
      const percentage = ((value - min) / (max - min)) * 100;
      progressRef.current.style.width = `${percentage}%`;
    }

    // Update input value when not editing
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, min, max, isEditing]);

  // Handle slider change
  const handleSliderChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle input blur - validate and update value
  const handleInputBlur = () => {
    setIsEditing(false);
    let newValue = parseFloat(inputValue);

    // Validate input
    if (isNaN(newValue)) {
      newValue = value; // Revert to previous value if invalid
    } else {
      // Clamp value between min and max
      newValue = Math.max(min, Math.min(max, newValue));
    }

    setInputValue(newValue.toString());
    onChange(newValue);
  };

  // Handle key press in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur(); // Trigger blur event to validate
    }
  };

  // Custom CSS for range input thumb
  const thumbStyles = `
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #2A2A2A;
      cursor: pointer;
      margin-top: -2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    input[type=range]::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #2A2A2A;
      cursor: pointer;
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    input[type=range]::-ms-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #2A2A2A;
      cursor: pointer;
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    input[type=range]:focus {
      outline: none;
    }
  `;

  return (
    <div style={rangeInputStyles.container}>
      <style>{thumbStyles}</style>
      <div style={rangeInputStyles.sliderContainer}>
        <div 
          ref={progressRef} 
          style={rangeInputStyles.progress} 
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          style={rangeInputStyles.rangeInput}
        />
      </div>
      <div style={rangeInputStyles.valueDisplay}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsEditing(true)}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            style={rangeInputStyles.valueInput}
          />
        </div>
      </div>
    </div>
  );
};

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #93C9CF;
    border-radius: 3px;
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #93C9CF transparent;
  }
`;

const TextMenu = ({ textElement, onTextElementChange }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [loadedFonts, setLoadedFonts] = useState({});
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
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Roboto Condensed",
    "Oswald",
    "Source Sans Pro",
    "Slabo 27px",
    "Raleway",
    "PT Sans",
    "Roboto Slab",
    "Merriweather",
    "Ubuntu",
    "Noto Sans",
    "Playfair Display",
    "Poppins",
    "Lora",
    "PT Serif",
    "Nunito",
    "Work Sans",
    "Fira Sans",
    "Quicksand",
    "Titillium Web",
    "Arimo",
    "Noto Serif",
    "Dosis",
    "Crimson Text",
    "Anton",
    "Cabin",
    "Bitter",
    "Libre Baskerville",
    "Fjalla One",
    "Josefin Sans",
    "Inconsolata",
    "Indie Flower",
    "Arvo",
    "Hind",
    "Lobster",
    "Karla",
    "Oxygen",
    "Abel",
    "Pacifico",
    "Dancing Script",
    "Exo 2",
    "Signika",
    "Varela Round",
    "Merriweather Sans",
    "Archivo Narrow",
    "Shadows Into Light",
    "Nunito Sans",
    "Asap",
    "Bree Serif",
    "Francois One",
    "Comfortaa",
    "Orbitron",
    "Questrial",
    "Amatic SC",
    "Righteous",
    "Abril Fatface",
    "Yanone Kaffeesatz",
    "Rokkitt",
    "Vollkorn",
    "Ubuntu Condensed",
    "Teko",
    "Prompt",
    "Crete Round",
    "Acme",
    "Russo One",
    "Barlow",
    "Archivo Black",
    "Satisfy",
    "ABeeZee",
    "Alegreya",
    "Alegreya Sans",
    "Archivo",
    "Barlow Condensed",
    "Barlow Semi Condensed",
    "Cantarell",
    "Cardo",
    "Chivo",
    "Cormorant",
    "Domine",
    "Eczar",
    "Fira Sans Condensed",
    "Gentium Book Basic",
    "Heebo",
    "IBM Plex Sans",
    "IBM Plex Serif",
    "Inknut Antiqua",
    "Inter",
    "Josefin Slab",
    "Kalam",
    "Kreon",
    "Libre Franklin",
    "Manrope",
    "Martel",
    "Neuton",
    "Old Standard TT",
    "Overpass",
    "Philosopher",
    "Playfair Display SC",
    "Proza Libre",
    "Rubik",
    "Spectral",
    "Taviraj",
    "Tinos",
    "Zilla Slab",
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

  // Load Google Fonts dynamically for the selected font
  useEffect(() => {
    if (textElement && textElement.fontFamily) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css?family=${textElement.fontFamily.replace(/ /g, '+')}`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [textElement?.fontFamily]);

  // Load all fonts for the font selection list
  useEffect(() => {
    // System fonts are already loaded
    const systemFonts = {
      'Arial': true,
      'Times New Roman': true,
      'Helvetica': true,
      'Georgia': true,
      'Verdana': true,
      'Courier New': true,
      'Trebuchet MS': true,
      'Impact': true
    };

    // Initialize loadedFonts with system fonts
    setLoadedFonts(prevState => ({
      ...prevState,
      ...systemFonts
    }));

    // Create a link for each font family
    const links = fontFamilies.map(font => {
      // Skip system fonts that don't need to be loaded from Google Fonts
      if (systemFonts[font]) {
        return null;
      }

      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css?family=${font.replace(/ /g, '+')}`;
      link.rel = 'stylesheet';

      // Update loadedFonts state when the font is loaded
      link.onload = () => {
        setLoadedFonts(prevState => ({
          ...prevState,
          [font]: true
        }));
      };

      document.head.appendChild(link);
      return link;
    }).filter(Boolean); // Filter out null values

    // Clean up function to remove all links
    return () => {
      links.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [fontFamilies]);

  useEffect(() => {
    localStorage.setItem("customColors", JSON.stringify(customColors));
  }, [customColors]);

  const handleFontFamilyChange = (font) => {
    // Load the font if it's not a system font
    if (!['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Courier New', 'Trebuchet MS', 'Impact'].includes(font)) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css?family=${font.replace(/ /g, '+')}`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

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
      setCustomColors((prev) => [...new Set([tempColor, ...prev])]);
    }
    setTempColor("");
  };

  // const colorInputRef = useClickAway(handleColorBlur);

  const handleAlignmentChange = (alignment) => {
    onTextElementChange({ ...textElement, textAlign: alignment });
  };

  const renderFontTab = () => (
    <div className="py-3 max-h-[300px] overflow-y-auto custom-scrollbar">
      {fontFamilies.map((font) => (
          <button
              key={font}
              onClick={() => handleFontFamilyChange(font)}
              className={`w-full px-[16px] py-[8px] text-left text-[20px] transition-colors 
    hover:text-[#2A2A2A] 
    ${textElement.fontFamily === font ? 'text-[#2A2A2A]' : 'text-[#969696]'}
  `}
          >
            <span style={{ fontFamily: loadedFonts[font] ? font : 'inherit' }}>{font}</span>
          </button>
      ))}
    </div>
  );

  const renderSizeTab = () => (
    <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
      <div className="flex items-center">
        <span className="w-[70px] text-left mr-11.5 font-montserrat font-[300] text-[20px]">Size:</span>
        <div className="flex-1">
          <CustomRangeSlider
            value={textElement.fontSize || 16}
            onChange={(value) => onTextElementChange({ ...textElement, fontSize: value })}
            min={5}
            max={100}
          />
        </div>
      </div>

      <div className="flex items-center">
        <span className="w-[70px] text-left mr-4 font-montserrat font-[300] text-[20px]">Kerning:</span>
        <div className="flex-1">
          <CustomRangeSlider
            value={parseFloat(textElement.letterSpacing) || 0}
            onChange={(value) => onTextElementChange({ ...textElement, letterSpacing: `${value}px` })}
            min={-2}
            max={10}
            step={0.1}
          />
        </div>
      </div>

      <div className="flex items-center">
        <span className="w-[70px] text-left mr-3.5 font-montserrat font-[300] text-[20px]">Leading:</span>
        <div className="flex-1">
          <CustomRangeSlider
            value={textElement.lineHeight || 1.2}
            onChange={(value) => onTextElementChange({ ...textElement, lineHeight: value })}
            min={0.5}
            max={3}
            step={0.1}
          />
        </div>
      </div>

      <div className="flex items-center">
        <span className="w-[75px] text-left mr-2 font-montserrat font-[300] text-[20px]">Case:</span>
        <div className="flex-1">
          <select
            value={textElement.textTransform || "none"}
            onChange={(e) => onTextElementChange({ ...textElement, textTransform: e.target.value })}
            className="w-full border-b-[2px] border-[#2A2A2A] font-[300] text-[20px]"
          >
            {textCases.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderColorTab = () => (
    <div className="p-6 max-h-[300px] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <span className="font-montserrat font-[300] text-[20px]">Color</span>
        <div className="relative">
          <div className="w-10 h-10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 18 18" fill={textElement.color} xmlns="http://www.w3.org/2000/svg">
              <path d="M8.99469 1C12.8133 4.16444 18.9626 7.75733 16.3888 12.9084C15.16 15.3671 12.1915 17 9.00002 17C5.80858 17 2.84008 15.3671 1.61129 12.9084C-0.961485 7.76178 5.18139 4.16533 8.99469 1Z" stroke="#2A2A2A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <input
            type="color"
            value={tempColor || textElement.color}
            onChange={(e) => handleTempColorChange(e.target.value)}
            onMouseOut={handleColorBlur}
            className="absolute top-0 left-0 w-8 h-8 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Recently used colors - grid layout with 6 per row */}
      {customColors.length > 0 && (
        <div className="mb-6">
          <div className="max-h-[120px] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-6 gap-3 pb-3">
              {customColors.map((color, index) => (
                <button
                  key={`recent-${color}-${index}`}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border transition-colors ${
                    textElement.color === color ? 'border-[#2A2A2A] border-2' : 'border-gray-300 hover:border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAlignmentTab = () => (
    <div className="p-6 flex justify-between max-h-[300px] overflow-y-auto custom-scrollbar">
      <button
        onClick={() => handleAlignmentChange("left")}
        className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
          textElement.textAlign === "left" ? "bg-[#93C9CF]" : ""
        }`}
      >
        <img 
          src={textElement.textAlign === "left" ? "/images/img_text_leftalign.svg" : "/images/img_text_leftalign.svg"} 
          alt="Left Align" 
          width={24} 
          height={24} 
        />
      </button>
      <button
        onClick={() => handleAlignmentChange("center")}
        className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
          textElement.textAlign === "center" ? "bg-[#93C9CF]" : ""
        }`}
      >
        <img 
          src={textElement.textAlign === "center" ? "/images/img_text_centeralign.svg" : "/images/img_text_centeralign.svg"} 
          alt="Center Align" 
          width={24} 
          height={24} 
        />
      </button>
      <button
        onClick={() => handleAlignmentChange("right")}
        className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
          textElement.textAlign === "right" ? "bg-[#93C9CF]" : ""
        }`}
      >
        <img 
          src={textElement.textAlign === "right" ? "/images/img_text_rightalign.svg" : "/images/img_text_rightalign.svg"} 
          alt="Right Align" 
          width={24} 
          height={24} 
        />
      </button>
      <button
        onClick={() => handleAlignmentChange("justify")}
        className={`p-2 rounded-lg hover:bg-[#93C9CF] ${
          textElement.textAlign === "justify" ? "bg-[#93C9CF]" : ""
        }`}
      >
        <img 
          src={textElement.textAlign === "justify" ? "/images/img_text_justifyalign.svg" : "/images/img_text_justifyalign.svg"} 
          alt="Justify Align" 
          width={24} 
          height={24} 
        />
      </button>
    </div>
  );

  return (
    <div className="bg-[#C3DEE1] rounded-2xl shadow-lg w-[320px] overflow-hidden relative">
      {/* Tail on the right */}
      <div className="absolute right-[-14px] top-[20px] w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-[#C3DEE1] border-b-[10px] border-b-transparent z-[60]" />
      <style>{scrollbarStyles}</style>
      {/* Toolbar */}
      <div className="flex items-center p-2 border-b border-[#2A2A2A] gap-1">
        <button
          onClick={() => setActiveTab(activeTab === "font" ? null : "font")}
          className={`p-2 rounded-lg  ${activeTab === "font" ? "" : ""}`}
        >
          <img 
            src={activeTab === "font" ? "/images/img_text_style(s).svg" : "/images/img_text_style.svg"} 
            alt="Font Style" 
            width={24} 
            height={24} 
          />
        </button>
        <button
          onClick={handleBoldClick}
          className={`p-2 rounded-lg ${
            textElement.fontWeight === "700" ? "" : ""
          }`}
        >
          <img 
            src={textElement.fontWeight === "700" ? "/images/img_text_bold(s).svg" : "/images/img_text_bold.svg"} 
            alt="Bold" 
            width={24} 
            height={24} 
          />
        </button>
        <button
          onClick={handleItalicClick}
          className={`p-2 rounded-lg ${
            textElement.fontStyle === "italic" ? "" : ""
          }`}
        >
          <img 
            src={textElement.fontStyle === "italic" ? "/images/img_text_italic(s).svg" : "/images/img_text_italic.svg"} 
            alt="Italic" 
            width={24} 
            height={24} 
          />
        </button>
        <button
          onClick={handleUnderlineClick}
          className={`p-2 rounded-lg ${
            textElement.textDecoration === "underline" ? "" : ""
          }`}
        >
          <img 
            src={textElement.textDecoration === "underline" ? "/images/img_text_underline(s).svg" : "/images/img_text_underline.svg"} 
            alt="Underline" 
            width={24} 
            height={24} 
          />
        </button>
        <button
          onClick={() => setActiveTab(activeTab === "size" ? null : "size")}
          className={`p-2 rounded-lg ${activeTab === "size" ? "" : ""}`}
        >
          <img 
            src={activeTab === "size" ? "/images/img_text_settings(s).svg" : "/images/img_text_settings.svg"} 
            alt="Settings" 
            width={24} 
            height={24} 
          />
        </button>
        <button
          onClick={() => setActiveTab(activeTab === "color" ? null : "color")}
          className={`p-2 rounded-lg ${activeTab === "color" ? "" : ""}`}
        >
          <img 
            src={activeTab === "color" ? "/images/img_color_selection(s).svg" : "/images/img_color_selection.svg"} 
            alt="Color" 
            width={24} 
            height={24} 
          />
        </button>
        <button
          onClick={() => setActiveTab(activeTab === "align" ? null : "align")}
          className={`p-2 rounded-lg ${activeTab === "align" ? "" : ""}`}
        >
          <img 
            src={activeTab === "align" ? "/images/img_text_alignment(s).svg" : "/images/img_text_alignment.svg"} 
            alt="Alignment" 
            width={24} 
            height={24} 
          />
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
