import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import ToolMenu from "@/components/ui/ToolMenu";
import { useClickAway } from "../../hooks/useClickAway";

// TODO take https://github.com/omarseyam1729/SeyPaint/tree/main as a reference
// TODO create a canvas component
// TODO copy brashes from there
// TODO make brashes dropdown menu controlled
// TODO make figures dropdown menu controlled find solution for this
// TODO try to split up text layer and canvas layer
// TODO limitate area with book only
// TODO don't allow moving text out of book edges

const Journal = () => {
  const { id } = useParams();
  const location = useLocation();
  const book = location.state?.book;
  const flipBook = useRef(null);
  const buttonRefs = useRef({});
  const bookRef = useRef(null); // To track book boundaries

  const textSettingsRef = useClickAway(() => setShowTextSettings(false));

  // Add new function for handling text settings position
  const updateTextSettingsPosition = (x, y) => {
    // Get book boundaries
    const bookElement = document.querySelector(".flip-book-container");
    if (!bookElement) return { x, y };
    const bookBounds = bookElement.getBoundingClientRect();

    // Get settings menu dimensions
    const settingsElement = document.querySelector(".text-settings");
    if (!settingsElement) return { x, y };
    const settingsBounds = settingsElement.getBoundingClientRect();

    // Clamp the position within book boundaries
    const clampedX = Math.min(Math.max(x, bookBounds.left), bookBounds.right - settingsBounds.width);
    const clampedY = Math.min(Math.max(y, bookBounds.top), bookBounds.bottom - settingsBounds.height);

    return { x: clampedX, y: clampedY };
  };

  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0); // Поточний розворот (індекс)
  const [scale, setScale] = useState(1);
  const [activeTool, setActiveTool] = useState("move");
  // Додамо стан для збереження обраного варіанту move tool
  const [selectedMoveTool, setSelectedMoveTool] = useState("move");
  const [activeToolMenu, setActiveToolMenu] = useState(null); // Відкрите меню
  const [recentColors, setRecentColors] = useState([
    "#F9F9F9",
    "#85544D",
    "#EFB8C8",
    "#84A285",
    "#782746",
    "#2A2A2A",
  ]);
  const [currentColor, setCurrentColor] = useState("#000000");

  // Обробка подій миші
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });
  const editorRef = useRef(null);

  // Додавання тексту
  const [textMode, setTextMode] = useState(false);
  const [textElements, setTextElements] = useState([]);
  const [activeTextElement, setActiveTextElement] = useState(null);
  const [showTextSettings, setShowTextSettings] = useState(false);
  const [textSettingsPosition, setTextSettingsPosition] = useState({ x: 0, y: 0 });

  // Переміщення і розтягування тексту
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });

  const tools = [
    { icon: "img_move_tool.svg", name: "move" },
    { icon: "img_text_tool.svg", name: "text" },
    { icon: "img_draw_tool.svg", name: "draw" },
    { icon: "img_form_tool.svg", name: "form" },
    { icon: "img_calendar_tool.svg", name: "calendar" },
    { icon: "img_bookmark_tool.svg", name: "bookmark" },
    { icon: "img_template_tool.svg", name: "template" },
  ];

  const toolMenus = {
    move: [
      {
        icon: "img_move_tool.svg",
        text: "Move",
        onClick: () => {
          setSelectedMoveTool("move");
          document.body.style.cursor = "default";
        },
      },
      {
        icon: "img_hand_tool.svg",
        text: "Hand tool",
        onClick: () => {
          setSelectedMoveTool("hand");
          document.body.style.cursor = "grab";
        },
      },
    ],
    calendar: [
      { icon: "img_plus_tool.svg", text: "Create calendar" },
      { icon: "img_key_tool.svg", text: "Add keys" },
      { icon: "img_event_tool.svg", text: "Create event" },
    ],
    bookmark: [{ icon: "img_plus_tool.svg", text: "Add bookmark" }],
    draw: [
      { icon: "img_plus_tool.svg", text: "Eraser" },
      { icon: "img_plus_tool.svg", text: "Pen" },
      { icon: "img_plus_tool.svg", text: "Pencil" },
      { icon: "img_plus_tool.svg", text: "Graphic pen" },
      { icon: "img_plus_tool.svg", text: "Marker" },
      { icon: "img_plus_tool.svg", text: "Brush pen" },
      { icon: "img_plus_tool.svg", text: "Air Brush" },
      { icon: "img_plus_tool.svg", text: "Watercolor" },
    ],
    form: [
      { icon: "img_rectangle.svg", text: "Rectangle" },
      { icon: "img_line.svg", text: "Line" },
      { icon: "img_arrow.svg", text: "Arrow" },
      { icon: "img_ellipse.svg", text: "Ellipse" },
      { icon: "img_polygon.svg", text: "Polygon" },
      { icon: "img_star.svg", text: "Star" },
      { icon: "img_image_video.svg", text: "Image / video" },
    ],
  };

  // Обробка подій миші
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const handleMouseDown = (e) => {
      if (activeTool === "move" && selectedMoveTool === "hand" && e.button === 0) {
        setIsDragging(true);
        setStartPos({
          x: e.clientX,
          y: e.clientY,
        });
        setScrollPos({
          left: editor.scrollLeft,
          top: editor.scrollTop,
        });
        document.body.style.cursor = "grabbing";
      }
    };
    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        editor.scrollLeft = scrollPos.left - dx;
        editor.scrollTop = scrollPos.top - dy;
      }
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = "grab";
      }
    };
    editor.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      editor.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startPos, scrollPos, activeTool, selectedMoveTool]);

  useEffect(() => {
    return () => {
      // Скидаємо курсор при виході з компоненту
      document.body.style.cursor = "default";
    };
  }, []);

  // Додавання тексту
  useEffect(() => {
    const handlePageClick = (e) => {
      const isEditorClick =
        e.target.closest(".flip-book-container") ||
        e.target.closest(".page-wrapper") ||
        e.target.closest(".page");

      if (
        textMode &&
        isEditorClick &&
        !e.target.closest(".text-element") &&
        !e.target.closest(".text-settings")
      ) {
        // Place top-left of text exactly at cursor position in book coordinates
        const x = e.clientX / scale;
        const y = e.clientY / scale;

        const newTextElement = {
          id: Date.now(),
          x,
          y,
          text: "Текст",
          fontSize: 16,
          color: currentColor,
          rotation: 0,
          width: 200,
          height: 50,
        };

        setTextElements([...textElements, newTextElement]);
        setActiveTextElement(newTextElement.id);
        setShowTextSettings(true);
        // Settings position will be set in a useEffect below
        setTextMode(false);
        setActiveTool("move");
        document.body.style.cursor = "default";
      } else if (!e.target.closest(".text-element") && !e.target.closest(".text-settings")) {
        setActiveTextElement(null);
        setShowTextSettings(false);
      }
    };

    const handleDoubleClick = (e) => {
      if (e.target.closest(".text-element")) {
        const textId = parseInt(e.target.closest(".text-element").dataset.id);
        setActiveTextElement(textId);
        setShowTextSettings(true);

        const element = textElements.find((el) => el.id === textId);
        if (element) {
          setTextSettingsPosition({
            x: element.x + element.width + 20,
            y: element.y,
          });
        }
      }
    };

    if (textMode) {
      document.addEventListener("click", handlePageClick);
      document.addEventListener("dblclick", handleDoubleClick);
    }

    return () => {
      document.removeEventListener("click", handlePageClick);
      document.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [textMode, textElements, currentColor]);

  // Place this after textElements, activeTextElement, showTextSettings are defined
  useEffect(() => {
    if (showTextSettings && activeTextElement) {
      // Wait for DOM update
      setTimeout(() => {
        const el = document.querySelector(`.text-element[data-id='${activeTextElement}']`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Try to place settings to the right, but if near right edge, place to the left
          const settingsWidth = 220; // Approximate width of settings panel
          const padding = 12;
          let x = rect.right + padding;
          let y = rect.top;
          if (x + settingsWidth > window.innerWidth) {
            x = rect.left - settingsWidth - padding;
          }
          // Clamp y if needed (optional)
          setTextSettingsPosition({ x, y });
        }
      }, 0);
    }
  }, [showTextSettings, activeTextElement, textElements]);

  // Переміщення і розтягування тексту
  const handleMouseDownOnText = (e, element) => {
    if (e.target.classList.contains("resize-handle")) {
      setIsResizing(true);
      setResizeStartSize({
        width: element.width,
        height: element.height,
      });
      setDragStartPos({ x: e.clientX, y: e.clientY });
    } else {
      setIsDraggingText(true);
      setDragStartPos({ x: e.clientX, y: e.clientY });
    }
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingText && activeTextElement) {
        const dx = e.clientX - dragStartPos.x;
        const dy = e.clientY - dragStartPos.y;

        // Get book boundaries - this is the key addition
        const bookElement = document.querySelector(".flip-book-container");
        const bookBounds = bookElement.getBoundingClientRect();

        setTextElements(
          textElements.map((el) => {
            if (el.id === activeTextElement) {
              // Calculate new position
              const newX = el.x + dx;
              const newY = el.y + dy;

              // Clamp the position within book boundaries
              const clampedX = Math.min(Math.max(newX, bookBounds.left), bookBounds.right - el.width);
              const clampedY = Math.min(Math.max(newY, bookBounds.top), bookBounds.bottom - el.height);

              return {
                ...el,
                x: clampedX,
                y: clampedY,
              };
            }
            return el;
          })
        );

        setDragStartPos({ x: e.clientX, y: e.clientY });
        // Update settings position
        setTextSettingsPosition((prev) => {
          const newPos = updateTextSettingsPosition(prev.x + dx, prev.y + dy);
          return newPos;
        });
      }
      if (isResizing && activeTextElement) {
        const dx = e.clientX - dragStartPos.x;
        const dy = e.clientY - dragStartPos.y;

        setTextElements(
          textElements.map((el) => {
            if (el.id === activeTextElement) {
              return {
                ...el,
                width: Math.max(50, resizeStartSize.width + dx),
                height: Math.max(20, resizeStartSize.height + dy),
              };
            }
            return el;
          })
        );
        setDragStartPos({ x: e.clientX, y: e.clientY });
      }
    };
    const handleMouseUp = () => {
      setIsDraggingText(false);
      setIsResizing(false);
    };
    if (isDraggingText || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingText, isResizing, dragStartPos, activeTextElement, textElements]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setScale((prev) => {
          let newScale = prev - e.deltaY * 0.001;
          newScale = Math.min(Math.max(newScale, 0.2), 3);
          return newScale;
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  if (!book) {
    return <div className="p-10 text-xl text-red-500">Book not found or no data passed.</div>;
  }

  const handlePageChange = (e) => {
    // Оновлюємо поточний розворот (ділимо на 2, тому що кожен розворот = 2 сторінки)
    setCurrentSpread(Math.floor(e.data / 2));
  };

  const goToPrevSpread = () => {
    if (flipBook.current && currentSpread > 0) {
      const targetPage = 1 + (currentSpread - 1) * 2;
      flipBook.current.pageFlip().flip(targetPage);
    }
  };

  const goToNextSpread = () => {
    if (flipBook.current && currentSpread < book.pageCount - 1) {
      const targetPage = 1 + (currentSpread + 1) * 2;
      flipBook.current.pageFlip().flip(targetPage);
    }
  };

  // Створюємо сторінки для щоденника (враховуючи, що кожен розворот = 2 сторінки)
  const renderPages = () => {
    const pages = [];

    for (let i = 0; i < book.pageCount; i++) {
      pages.push(
        <div key={`left-${i}`} className="page h-full w-full bg-[#f9f9f9]">
          <div
            className="flex flex-col justify-center items-center w-full h-full page-wrapper"
            style={{
              boxShadow: "inset -6px 0px 12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="text-xl text-gray-600">{`Розворот ${i + 1} — Left`}</div>
          </div>
        </div>
      );

      pages.push(
        <div key={`right-${i}`} className="page h-full w-full bg-[#f9f9f9]">
          <div
            className="flex flex-col justify-center items-center w-full h-full page-wrapper"
            style={{
              boxShadow: "inset 4px 0px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="text-xl text-gray-600">{`Розворот ${i + 1} — Right`}</div>
          </div>
        </div>
      );
    }

    return pages;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#EBDCCB] flex items-center">
      {/* Закрита обкладинка */}
      {!isOpened && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[864px]">
          {/* Лінія для об'єму */}
          <div
            className="absolute z-10"
            style={{
              width: "13px",
              height: "864px",
              left: "13px",
              background: "rgba(26, 21, 21, 0.05)",
              boxShadow: "inset -1px 0px 2px rgba(0, 0, 0, 0.25), inset 2px 0px 2px rgba(0, 0, 0, 0.25)",
            }}
          ></div>

          {/* Обкладинка */}
          <div
            className={`flex relative justify-center items-center w-full h-full text-center transition-transform duration-700 ease-in-out`}
            style={{
              backgroundColor: book.coverColor,
              boxShadow:
                "6px 0px 12px 4px rgba(0, 0, 0, 0.3), inset -4px 0px 4px rgba(0, 0, 0, 0.25), 0px 12px 12px rgba(0, 0, 0, 0.25), inset 4px 0px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: "0px 20px 20px 0px",
            }}
          >
            <span
              style={{
                fontFamily: "'Americana BT', serif",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "80px",
                lineHeight: "92px",
                color: book.textColor,
              }}
            >
              {book.title}
            </span>

            {/* Кнопка для відкриття */}
            <button
              onClick={() => {
                setIsOpening(true);
                setTimeout(() => {
                  setIsOpened(true);
                  setIsOpening(false);
                }, 1000);
              }}
              className="absolute flex right-[0px] bottom-[0px] w-[100px] h-[100px] z-10"
            >
              <div
                className="w-full h-full duration-300 opacity-0 hover:opacity-20 rounded-br-[38px] rounded-tl-[200px] cursor-pointer"
                style={{ backgroundColor: book.textColor }}
              ></div>
            </button>

            {/* Стрілка */}
            <svg
              width="158"
              height="228"
              viewBox="0 0 158 228"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute flex right-[60px] bottom-[90px] w-[80px] h-auto z-10 pointer-events-none animate-pulse-arrow"
            >
              <path
                d="M88.6917 204.434C89.0667 205.869 87.1356 206.537 85.0933 204.965C75.0784 197.247 69.5279 192.44 64.6219 181.532C60.5588 172.494 58.8751 160.859 62.416 150.699C64.5712 144.513 57.417 143.473 53.1622 117.854C47.9042 86.2136 58.8694 62.2858 60.607 45.3386C62.458 27.2836 56.1738 15.3178 54.8494 11.3503C53.2754 6.63031 50.6118 6.04964 50.2542 1.80983C50.1309 0.354555 51.3738 -0.115157 52.6886 0.644668C56.4057 2.7949 61.5179 11.3412 63.4156 16.7873C70.1041 36 68.806 46.6413 63.8513 67.42C57.2905 94.9394 58.6604 115.559 63.2947 132.375C64.0961 135.281 65.1986 138.132 66.1805 141.005C66.9141 143.148 69.1185 134.849 78.7617 132.093C92.3531 128.207 103.299 135.743 105.266 144.868C109.076 162.519 86.4327 171.801 70.6611 157.197C70.0008 156.587 69.3444 155.975 68.6848 155.363C67.6641 156.05 67.8806 157.175 67.7367 158.122C66.8909 163.654 67.4603 169.186 68.8828 174.722C72.839 190.059 88.2293 202.663 88.6917 204.434ZM93.0036 159.357C105.77 155.354 101 138.046 89.9086 136.884C80.8774 135.935 75.3968 140.789 71.2129 147.789C70.6592 148.714 70.8127 149.554 71.455 150.396C73.8625 153.563 76.5396 156.477 80.3735 158.35C84.5807 160.405 88.8159 161.061 93.0036 159.357Z"
                fill={book.textColor}
              />
              <path
                d="M102.845 196.103C104.185 200.854 103.139 195.485 108.058 220.32C109.34 226.787 103.341 227.558 96.5803 225.13C88.4107 222.195 79.5754 220.039 76.3254 216.343C75.6953 215.626 75.9102 214.652 76.7396 214.174C77.7422 213.599 78.7127 213.232 81.795 213.987C96.768 217.652 101.224 220.636 101.093 218.729C100.938 216.501 98.1118 203.382 97.9353 197.377C97.8132 193.274 100.505 193.298 101.813 194.623C102.225 195.039 102.485 195.575 102.845 196.103Z"
                fill={book.textColor}
              />
            </svg>
          </div>
        </div>
      )}

      {/* Відкритий щоденник + інструменти */}
      {isOpened && (
        <>
          {/* Панель інструментів */}
          <div className="fixed right-[40px] z-50 flex flex-col items-center py-[28px] px-[8px] gap-[18px] bg-[#C3DEE1] rounded-[16px] shadow-[ -4px_4px_10px_rgba(0,0,0,0.25)]">
            {tools.map((tool) => {
              // Для move tool використовуємо обрану іконку
              const icon = tool.name === "move" ? `img_${selectedMoveTool}_tool.svg` : tool.icon;

              return (
                <div key={tool.name} className="relative">
                  <button
                    ref={(el) => (buttonRefs.current[tool.name] = el)}
                    onClick={() => {
                      setActiveTool(tool.name);
                      // Додамо зміну курсора при активації hand tool
                      if (tool.name === "move" && selectedMoveTool === "hand") {
                        document.body.style.cursor = "grab";
                      } else {
                        document.body.style.cursor = "default";
                      }
                      if (tool.name === "text") {
                        setTextMode(true);
                        document.body.style.cursor = "url('/images/img_plus_tool.svg'), text";
                        setActiveToolMenu(null);
                      } else {
                        setTextMode(false);
                        document.body.style.cursor = "default";
                      }

                      if (toolMenus[tool.name]) {
                        setActiveToolMenu(activeToolMenu === tool.name ? null : tool.name);
                      } else {
                        setActiveToolMenu(null);
                      }
                    }}
                    className={`flex justify-center items-center rounded-[12px] transition-all duration-200 cursor-pointer        
                        ${activeTool === tool.name ? "bg-[#93C9CF]" : "hover:bg-[#AED0D4]"}`}
                    style={{ width: "46px", height: "46px", padding: "10px" }}
                  >
                    <img src={`/images/${icon}`} alt={tool.name} style={{ width: "100%", height: "100%" }} />
                  </button>
                  <ToolMenu
                    items={toolMenus[tool.name] || []}
                    isOpen={activeToolMenu === tool.name}
                    onClose={() => setActiveToolMenu(null)}
                    triggerRef={{ current: buttonRefs.current[tool.name] }}
                    isAdvanced={["draw", "form"].includes(tool.name)}
                    recentColors={recentColors}
                    currentColor={currentColor}
                    onColorChange={(color) => {
                      setCurrentColor(color);
                      setRecentColors((prev) => [color, ...prev.filter((c) => c !== color)].slice(0, 6));
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Підпис сторінки */}
          <div
            className="fixed left-[0px] bottom-[0px] z-50 flex justify-center items-center"
            style={{
              padding: "18px 24px",
              background: "#C3DEE1",
              borderRadius: "10px 10px 0px 0px",
              fontFamily: "Montserrat",
              fontSize: 20,
              lineHeight: "24px",
              color: "#2A2A2A",
            }}
          >
            {currentSpread + 1}/{book.pageCount}
          </div>

          {/* Пагінація з іконками */}
          <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50 flex gap-[32px]">
            <button
              onClick={goToPrevSpread}
              disabled={currentSpread === 0}
              className="w-[48px] h-[48px] flex items-center justify-center bg-[#C3DEE1] rounded-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <img src="/images/img_prev_shelf.svg" alt="Previous" className="w-[24px] h-[24px]" />
            </button>

            <button
              onClick={goToNextSpread}
              disabled={currentSpread === book.pageCount - 1}
              className="w-[48px] h-[48px] flex items-center justify-center bg-[#C3DEE1] rounded-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <img src="/images/img_next_shelf.svg" alt="Next" className="w-[24px] h-[24px]" />
            </button>
          </div>

          {/* Контейнер редактора */}
          <div className="w-full h-full overflow-auto bg-[#ebdccb]" ref={editorRef}>
            {/* Wrapper з padding */}
            <div
              style={{
                padding: "60px",
                overflow: "hidden",
                boxSizing: "border-box",
                minWidth: `${1280 * scale + 120}px`,
                minHeight: `${864 * scale + 120}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HTMLFlipBook
                ref={flipBook}
                width={640}
                height={864}
                size="stretch"
                minWidth={640}
                maxWidth={640}
                minHeight={864}
                maxHeight={864}
                maxShadowOpacity={0.5}
                showCover={false}
                mobileScrollSupport={false}
                clickEventForward={false}
                useMouseEvents={false}
                onFlip={handlePageChange}
                className="shadow-lg flip-book-container"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "-1px 4px 12px 4px rgba(0, 0, 0, 0.3), 4px 0px 12px 4px rgba(0, 0, 0, 0.3)", // Стіл / обʼєм
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                  transition: "transform 0.2s ease-out",
                }}
                startPage={0}
              >
                {renderPages()}
              </HTMLFlipBook>

              {/* Text element (label) */}
              {textElements.map((element) => (
                <div
                  key={element.id}
                  data-id={element.id}
                  className="absolute cursor-move outline-none text-element"
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    transform: `rotate(${element.rotation}deg)`,
                    color: element.color,
                    fontSize: `${element.fontSize}px`,
                    border: activeTextElement === element.id ? "1px dashed #2A2A2A" : "none",
                  }}
                  contentEditable={activeTextElement === element.id}
                  suppressContentEditableWarning={true}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTextElement(element.id);
                    setShowTextSettings((prev) => !prev);

                    const newPos = updateTextSettingsPosition(
                      element.x + e.target.offsetWidth + 20,
                      element.y
                    );
                    setTextSettingsPosition(newPos);
                  }}
                  onMouseDown={(e) => handleMouseDownOnText(e, element)}
                >
                  {element.text}
                  {activeTextElement === element.id && (
                    <div
                      className="resize-handle absolute bottom-0 right-0 w-3 h-3 bg-[#2A2A2A] cursor-se-resize"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDownOnText(e, element);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Label Settings */}
            {showTextSettings && activeTextElement && (
              <div
                ref={textSettingsRef}
                className="fixed z-50 text-settings"
                style={{
                  left: `${textSettingsPosition.x}px`,
                  top: `${textSettingsPosition.y}px`,
                }}
              >
                <div className="bg-[#C3DEE1] rounded-lg p-4 shadow-lg">
                  <div className="flex flex-col gap-2 mt-4">
                    <label>
                      Розмір шрифту:
                      <input
                        type="range"
                        min="8"
                        max="72"
                        value={textElements.find((el) => el.id === activeTextElement)?.fontSize || 16}
                        onChange={(e) => {
                          const newSize = parseInt(e.target.value);
                          setTextElements(
                            textElements.map((el) =>
                              el.id === activeTextElement ? { ...el, fontSize: newSize } : el
                            )
                          );
                        }}
                      />
                    </label>
                    <label>
                      Колір:
                      <input
                        type="color"
                        value={textElements.find((el) => el.id === activeTextElement)?.color || currentColor}
                        onChange={(e) => {
                          setTextElements(
                            textElements.map((el) =>
                              el.id === activeTextElement ? { ...el, color: e.target.value } : el
                            )
                          );
                        }}
                      />
                    </label>
                    <label>
                      Поворот:
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={textElements.find((el) => el.id === activeTextElement)?.rotation || 0}
                        onChange={(e) => {
                          const newRotation = parseInt(e.target.value);
                          setTextElements(
                            textElements.map((el) =>
                              el.id === activeTextElement ? { ...el, rotation: newRotation } : el
                            )
                          );
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Journal;
