import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

// Custom styles for range inputs
const rangeInputStyles = {
    // Container styles to ensure consistent positioning
    container: {
        display: "flex",
        alignItems: "center",
        gap: "22px",
        width: "100%",
    },
    // Slider container to ensure consistent width
    sliderContainer: {
        position: "relative",
        width: "150px",
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
        minWidth: "40px",
        textAlign: "right",
    },
    // Input for manual value entry
    valueInput: {
        width: "40px",
        textAlign: "right",
        padding: "2px 4px",
        fontSize: "20px",
        fontWeight: "300",
        backgroundColor: "transparent",
    },
};

// Custom Range Slider component
const CustomRangeSlider = ({ value, onChange, onFinalChange, min, max, unit }) => {
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
        const newValue = parseInt(e.target.value);
        onChange(newValue);
    };

    // Handle input change
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Handle input blur - validate and update value
    const handleInputBlur = () => {
        setIsEditing(false);
        let newValue = parseInt(inputValue);

        // Validate input
        if (isNaN(newValue)) {
            newValue = value; // Revert to previous value if invalid
        } else {
            // Clamp value between min and max
            newValue = Math.max(min, Math.min(max, newValue));
        }

        setInputValue(newValue.toString());
        onChange(newValue);
        onFinalChange(newValue);
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
            margin-top: -1px;
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
                    value={value}
                    onChange={handleSliderChange}
                    onMouseUp={() => onFinalChange(value)}
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
                    <span>{unit}</span>
                </div>
            </div>
        </div>
    );
};

CustomRangeSlider.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onFinalChange: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    unit: PropTypes.string,
};

export default CustomRangeSlider;