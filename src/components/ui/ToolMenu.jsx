import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const ToolMenu = ({
    items,
    isOpen,
    onClose,
    triggerRef,
    isAdvanced = false,
    recentColors = [],
    currentColor = "#000000",
    onColorChange = () => { },
}) => {
    const menuRef = useRef(null);

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
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, triggerRef]);

    if (!isOpen) return null;

    return (
        <div className="absolute right-[70px] top-[0px] z-[100]" ref={menuRef}>
            {/* Хвостик праворуч */}
            <div className="absolute right-[-14px] top-[20px] w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-[#C3DEE1] border-b-[10px] border-b-transparent" />

            <ul
                className="bg-[#c3dee1] text-[#2a2a2a] rounded-[10px] shadow-lg min-w-[300px] inline-block text-sm font-montserrat text-[20px] font-[300] overflow-hidden">
                {isAdvanced && (
                    <li className="pt-[24px]">
                        <div className="flex items-center px-[24px] mr-[24px] gap-[22px]">
                            <span>Color:</span>
                            <div className="flex gap-[8px]">
                                {recentColors.map((color, index) => (
                                    <div
                                        key={index}
                                        onClick={() => onColorChange(color)}
                                        className="w-[24px] h-[24px] rounded-full cursor-pointer"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <img
                                onClick={() => {
                                    const color = prompt("Введіть колір у форматі #rrggbb:");
                                    if (color?.startsWith("#")) onColorChange(color);
                                }}
                                src="/images/img_color_selection.svg"
                                alt="select color"
                                className="w-[24px] h-[24px] cursor-pointer"
                                style={{ filter: `drop-shadow(0 0 0 ${currentColor})` }}
                            />
                        </div>
                        <div className="mt-[12px] h-[1px] w-full bg-[#2a2a2a]" />
                    </li>
                )}

                <div
                    className={`overflow-y-auto ${items.length > 4 ? "max-h-[312px]" : ""} custom-scroll`}
                >
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
                                    <img
                                        src={`/images/${item.icon}`}
                                        alt={item.text}
                                        className="w-[24px] h-[24px]"
                                    />
                                )}
                            </div>

                            {index < items.length - 1 && (
                                <hr className="border-[#2a2a2a] w-full mx-auto" />
                            )}
                        </li>
                    ))}
                </div>
            </ul>
        </div >
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
};

export default ToolMenu;
