import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import CustomRangeSlider from "./CustomRangeSlider";

const ToolMenu = ({
                      items,
                      isOpen,
                      onClose,
                      triggerRef,
                      isAdvanced = false,
                      recentColors = [],
                      currentColor = "#000000",
                      onColorChange = () => {},
                      opacity = 100,
                      onOpacityChange = () => {},
                      // eslint-disable-next-line no-unused-vars
                      rotation = 0,
                      // eslint-disable-next-line no-unused-vars
                      onRotationChange = () => {},
                      thickness = 10,
                      onThicknessChange = () => {},
                  }) => {
    const menuRef = useRef(null);
    const [tempColor, setTempColor] = useState(currentColor);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const draftColorRef = useRef(currentColor);
    const [tempOpacity, setTempOpacity] = useState(opacity);
    const [tempThickness, setTempThickness] = useState(thickness);
    const colorInputRef = useRef(null);

    const handleColorIconClick = () => {
        setIsColorPickerOpen(!isColorPickerOpen);
        if (!isColorPickerOpen && colorInputRef.current) {
            colorInputRef.current.click();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                (!triggerRef || !triggerRef.current.contains(event.target))
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            setTempColor(currentColor);
            setTempOpacity(opacity);
            setTempThickness(thickness);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, triggerRef, currentColor, opacity, thickness]);

    if (!isOpen) return null;

    return (
        <div className="absolute right-[70px] top-[0px] z-[100]" ref={menuRef}>
            {/* Хвостик праворуч */}
            <div className="absolute right-[-14px] top-[20px] w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-[#C3DEE1] border-b-[10px] border-b-transparent" />

            <ul className="bg-[#c3dee1] text-[#2a2a2a] rounded-[10px] shadow-lg min-w-[300px] inline-block text-sm font-montserrat text-[20px] font-[300] overflow-hidden">
                {isAdvanced && (
                    <li className="pt-[24px]">
                        <div className="flex items-center px-[24px] mr-[24px] gap-[22px]">
                            <span>Color:</span>

                            {/* Кольори історії */}
                            <div className="flex gap-[8px]">
                                {recentColors.map((color, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setTempColor(color);
                                            onColorChange(color);
                                        }}
                                        className="w-[24px] h-[24px] rounded-full cursor-pointer border-[0.2px] border-[#2a2a2a]"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>

                            {/* Блок з кнопкою вибору кольору */}
                            <div className="relative">
                                {/* Input для кольору - абсолютно позиціонований над SVG */}
                                <input
                                    type="color"
                                    ref={colorInputRef}
                                    value={tempColor}
                                    onChange={(e) => {
                                        const newColor = e.target.value;
                                        setTempColor(newColor);
                                        draftColorRef.current = newColor;
                                        setIsColorPickerOpen(true);
                                    }}
                                    className="absolute top-0 left-0 w-[24px] h-[24px] opacity-0 cursor-pointer"
                                />

                                {/* SVG-іконка */}
                                <div
                                    className="w-[24px] h-[24px] cursor-pointer relative"
                                    onClick={handleColorIconClick}
                                >
                                    <svg width="24" height="24" viewBox="0 0 18 18" fill={tempColor} xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.99469 1C12.8133 4.16444 18.9626 7.75733 16.3888 12.9084C15.16 15.3671 12.1915 17 9.00002 17C5.80858 17 2.84008 15.3671 1.61129 12.9084C-0.961485 7.76178 5.18139 4.16533 8.99469 1Z" stroke="#2A2A2A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Кнопки Apply/Cancel */}
                        {isColorPickerOpen && (
                            <div className="px-[24px] py-[4px]">
                                <div className="flex justify-end gap-2 mt-3">
                                    <button
                                        className="bg-[#e0e0e0] text-[#2a2a2a] px-3 py-1 rounded-md text-sm"
                                        onClick={() => {
                                            setTempColor(currentColor);
                                            setIsColorPickerOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-[#93C9CF] text-[#2a2a2a] px-3 py-1 rounded-md text-sm"
                                        onClick={() => {
                                            const selected = draftColorRef.current;
                                            onColorChange(selected);
                                            // Add to recent colors if not already included
                                            if (!recentColors.includes(selected)) {
                                                // Note: This would typically update recentColors, but that's handled by the parent component
                                            }
                                            setIsColorPickerOpen(false);
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Parameters section */}
                        <div className="px-[24px] py-[12px]">
                            <div className="flex flex-col gap-[12px]">
                                <div className="flex items-center">
                                    <span className="w-[70px] text-left mr-8">Opacity:</span>
                                    <div className="flex-1">
                                        <CustomRangeSlider 
                                            value={tempOpacity}
                                            onChange={setTempOpacity}
                                            onFinalChange={onOpacityChange}
                                            min={0}
                                            max={100}

                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <span className="w-[70px] text-left mr-8">Thickness:</span>
                                    <div className="flex-1">
                                        <CustomRangeSlider 
                                            value={tempThickness}
                                            onChange={setTempThickness}
                                            onFinalChange={onThicknessChange}
                                            min={1}
                                            max={50}

                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-[12px] h-[1px] w-full bg-[#2a2a2a]" />
                    </li>
                )}

                <div className={`overflow-y-auto ${items.length > 4 ? "max-h-[312px]" : ""} custom-scroll`}>
                    {items.map((item, index) => (
                        <li key={index}>
                            <div
                                className="px-[24px] py-[24px] hover:bg-[#a9d1d4] cursor-pointer flex items-center justify-between"
                                onClick={() => {
                                    item.onClick?.();
                                    onClose();
                                }}
                            >
                                <span>{item.text}</span>
                                {item.icon && (
                                    <div className={item.icon.startsWith('http') || item.icon.startsWith('data:') ? "w-[60px] h-[24px] overflow-hidden flex items-center justify-center" : "w-[24px] h-[24px] overflow-hidden flex items-center justify-center"}>
                                        <img
                                            src={item.icon.startsWith('http') || item.icon.startsWith('data:') ? item.icon : `/images/${item.icon}`}
                                            alt={item.text}
                                            className={item.icon.startsWith('http') || item.icon.startsWith('data:') ? "w-[20px] h-[20px] transform scale-[3]" : "w-[24px] h-[24px]"}
                                            style={item.icon.startsWith('http') || item.icon.startsWith('data:') ? { transformOrigin: 'center' } : {}}
                                        />
                                    </div>
                                )}
                            </div>

                            {index < items.length - 1 && (
                                <hr className="border-[#2a2a2a] w-[calc(100%-48px)] mx-auto" />
                            )}
                        </li>
                    ))}
                </div>
            </ul>
        </div>
    );
};

ToolMenu.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string,
            text: PropTypes.string,
            onClick: PropTypes.func,
        })
    ).isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    triggerRef: PropTypes.object,
    isAdvanced: PropTypes.bool,
    recentColors: PropTypes.array,
    currentColor: PropTypes.string,
    onColorChange: PropTypes.func,
    opacity: PropTypes.number,
    onOpacityChange: PropTypes.func,
    rotation: PropTypes.number,
    onRotationChange: PropTypes.func,
    thickness: PropTypes.number,
    onThicknessChange: PropTypes.func,
};

export default ToolMenu;
