import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import ToolMenu from "@/components/ui/ToolMenu";
import Canvas from "@/components/Canvas";
import FormCanvas from "@/components/FormCanvas";
import TextMenu from "@/components/TextMenu";
import FormMenu from "@/components/FormMenu";
import FormElement from "@/components/FormElement";
import TempFormElement from "@/components/TempFormElement";
import { useClickAway } from "@/hooks/useClickAway";
import * as ReactDOM from "react-dom/client";

// TODO take https://github.com/omarseyam1729/SeyPaint/tree/main as a reference
// TODO create a canvas component
// TODO copy brashes from there
// TODO make brashes dropdown menu controlled
// TODO make figures dropdown menu controlled find solution for this
// TODO try to split up text layer and canvas layer
// TODO limitate area with book only
// TODO don't allow moving text out of book edges
// TODO fix page scrolling, make it fixed

// TODO fix pagination

const Journal = () => {
  const location = useLocation();
  const book = location.state?.book;
  const flipBook = useRef(null);
  const buttonRefs = useRef({});

  // Canvas - separate refs for left and right pages
  const canvasLeftRef = useRef(null);
  const canvasRightRef = useRef(null);
  // Form Canvas - separate refs for left and right pages
  const formCanvasLeftRef = useRef(null);
  const formCanvasRightRef = useRef(null);
  const [brushSize] = useState(10); // Using state but not updating it for now
  const [brushType, setBrushType] = useState("default"); // State for brush type
  const [isDrawingActive, setIsDrawingActive] = useState(false); // State to control drawing
  const [isFormActive, setIsFormActive] = useState(false); // State to control form tools

  const _handleSave = () => {
    // Save both left and right canvases
    const canvasLeft = canvasLeftRef.current;
    const canvasRight = canvasRightRef.current;
    if (!canvasLeft && !canvasRight) return;

    // For now, save the left canvas if available
    const canvas = canvasLeft || canvasRight;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-image.png";
    link.click();
  };

  const [isOpened, setIsOpened] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [scale, setScale] = useState(1);
  const [activeTool, setActiveTool] = useState("move");
  const [selectedMoveTool, setSelectedMoveTool] = useState("move");
  const [activeToolMenu, setActiveToolMenu] = useState(null);
  const [recentColors, setRecentColors] = useState([
    "#F9F9F9",
    "#85544D",
    "#EFB8C8",
    "#84A285",
    "#782746",
    "#2A2A2A",
  ]);
  const [currentColor, setCurrentColor] = useState("#000000");

  // Form parameters
  const [formType, setFormType] = useState(null);
  const [fillTransparency, setFillTransparency] = useState(100); // 0-100%
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeTransparency, setStrokeTransparency] = useState(100); // 0-100%
  const [cornerRadius, setCornerRadius] = useState(0); // px
  const [rotation, setRotation] = useState(0); // degrees
  const [strokeWidth, setStrokeWidth] = useState(1); // px
  const [formElements, setFormElements] = useState([]);
  const [activeFormElement, setActiveFormElement] = useState(null);
  const [isFormMode, setIsFormMode] = useState(false);

  // Обробка подій миші
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });
  const editorLeftRef = useRef(null);
  const editorRightRef = useRef(null);

  // Додавання тексту
  const [textMode, setTextMode] = useState(false);
  const [textElements, setTextElements] = useState([]);
  const [activeTextElement, setActiveTextElement] = useState(null);
  const [showTextSettings, setShowTextSettings] = useState(false);

  // Form element handlers
  const [showFormSettings, setShowFormSettings] = useState(false);
  const [isDraggingForm, setIsDraggingForm] = useState(false);
  const [isResizingForm, setIsResizingForm] = useState(false);
  const [resizeFormStartSize, setResizeFormStartSize] = useState({ width: 0, height: 0, x: 0, y: 0, resizeHandle: null });

  // Переміщення і розтягування тексту
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const textSettingsRef = useClickAway(() => setShowTextSettings(false));
  const formSettingsRef = useClickAway(() => setShowFormSettings(false));
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
      {
        icon: "img_plus_tool.svg",
        text: "Eraser",
        onClick: () => {
          setBrushType("eraser");
          document.body.style.cursor = "url('/images/img_eraser_cursor.svg'), auto";
        }
      },
      {
        icon: "img_plus_tool.svg",
        text: "Pen",
        onClick: () => {
          setBrushType("default");
          document.body.style.cursor = "url('/images/img_pen_cursor.svg'), auto";
        }
      },
      {
        icon: "img_plus_tool.svg",
        text: "Pencil",
        onClick: () => {
          setBrushType("feather");
          document.body.style.cursor = "url('/images/img_pencil_cursor.svg'), auto";
        }
      },
      {
        icon: "img_plus_tool.svg",
        text: "Graphic pen",
        onClick: () => {
          setBrushType("drip");
          document.body.style.cursor = "url('/images/img_graphic_pen_cursor.svg'), auto";
        }
      },
      {
        icon: "img_plus_tool.svg",
        text: "Marker",
        onClick: () => {
          setBrushType("caligraphy");
          document.body.style.cursor = "url('/images/img_marker_cursor.svg'), auto";
        }
      },
      {
        icon: "img_plus_tool.svg",
        text: "Brush pen",
        onClick: () => {
          setBrushType("swirl");
          document.body.style.cursor = "url('/images/img_brush_pen_cursor.svg'), auto";
        }
      },
      {
        icon: "img_plus_tool.svg",
        text: "Air Brush",
        onClick: () => {
          setBrushType("foam");
          document.body.style.cursor = "url('/images/img_air_brush_cursor.svg'), auto";
        }
      },
      {
        icon: "img_plus_tool.svg",
        text: "Watercolor",
        onClick: () => {
          setBrushType("watercolor");
          document.body.style.cursor = "url('/images/img_watercolor_cursor.svg'), auto";
        }
      },
    ],
    form: [
      {
        icon: "img_rectangle.svg",
        text: "Rectangle",
        onClick: () => {
          setFormType("rectangle");
          setIsFormMode(true);
          setIsFormActive(true); // Activate form canvas
          document.body.style.cursor = "crosshair";
        }
      },
      {
        icon: "img_line.svg",
        text: "Line",
        onClick: () => {
          setFormType("line");
          setIsFormMode(true);
          setIsFormActive(true); // Activate form canvas
          document.body.style.cursor = "crosshair";
        }
      },
      {
        icon: "img_arrow.svg",
        text: "Arrow",
        onClick: () => {
          setFormType("arrow");
          setIsFormMode(true);
          setIsFormActive(true); // Activate form canvas
          document.body.style.cursor = "crosshair";
        }
      },
      {
        icon: "img_ellipse.svg",
        text: "Ellipse",
        onClick: () => {
          setFormType("ellipse");
          setIsFormMode(true);
          setIsFormActive(true); // Activate form canvas
          document.body.style.cursor = "crosshair";
        }
      },
      {
        icon: "img_polygon.svg",
        text: "Polygon",
        onClick: () => {
          setFormType("polygon");
          setIsFormMode(true);
          setIsFormActive(true); // Activate form canvas
          document.body.style.cursor = "crosshair";
        }
      },
      {
        icon: "img_star.svg",
        text: "Star",
        onClick: () => {
          setFormType("star");
          setIsFormMode(true);
          setIsFormActive(true); // Activate form canvas
          document.body.style.cursor = "crosshair";
        }
      },
      { icon: "img_image_video.svg", text: "Image / video" },
    ],
  };

  // Обробка подій миші
  useEffect(() => {
    const editorLeft = editorLeftRef.current;
    const editorRight = editorRightRef.current;
    if (!editorLeft && !editorRight) return;

    const handleMouseDown = (e) => {
      if (activeTool === "move" && selectedMoveTool === "hand" && e.button === 0) {
        setIsDragging(true);
        setStartPos({
          x: e.clientX,
          y: e.clientY,
        });
        // Use the editor that was clicked on
        const clickedEditor =
            e.target.closest(".w-screen.h-screen") === editorLeft ? editorLeft : editorRight;
        setScrollPos({
          left: clickedEditor.scrollLeft,
          top: clickedEditor.scrollTop,
        });
        document.body.style.cursor = "grabbing";
      }
    };
    const handleMouseMove = (e) => {
      if (isDragging) {
        if (activeTool === "move" && selectedMoveTool === "hand") {
          const dx = e.clientX - startPos.x;
          const dy = e.clientY - startPos.y;

          // Apply scroll to both editors to keep them in sync
          if (editorLeft) {
            editorLeft.scrollLeft = scrollPos.left - dx;
            editorLeft.scrollTop = scrollPos.top - dy;
          }
          if (editorRight) {
            editorRight.scrollLeft = scrollPos.left - dx;
            editorRight.scrollTop = scrollPos.top - dy;
          }
        }
      }
    };
    const handleMouseUp = () => {
      if (isDragging) {
        if (activeTool === "move" && selectedMoveTool === "hand") {
          setIsDragging(false);
          document.body.style.cursor = "grab";
        } else {
          setIsDragging(false);
        }
      }
    };

    // Add event listeners to both editors
    if (editorLeft) {
      editorLeft.addEventListener("mousedown", handleMouseDown);
    }
    if (editorRight) {
      editorRight.addEventListener("mousedown", handleMouseDown);
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      if (editorLeft) {
        editorLeft.removeEventListener("mousedown", handleMouseDown);
      }
      if (editorRight) {
        editorRight.removeEventListener("mousedown", handleMouseDown);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startPos, scrollPos, activeTool, selectedMoveTool]);

  // Set initial cursor and reset on component unmount
  useEffect(() => {
    // Set default cursor to move tool when component mounts
    document.body.style.cursor = "default";

    return () => {
      // Reset cursor when component unmounts
      document.body.style.cursor = "default";
    };
  }, []);

  // Update isDrawingActive and isFormActive when activeTool or brushType changes
  useEffect(() => {
    // Drawing is active only when draw tool is selected and a brush type is set
    setIsDrawingActive(activeTool === "draw" && brushType !== null);
    // Form is active only when form tool is selected and form mode is enabled
    setIsFormActive(activeTool === "form" && isFormMode);
  }, [activeTool, brushType, isFormMode]);

  // Handler functions for FormCanvas
  const handleFormStart = (pageIndex, x, y) => {
    // Set start position for drawing
    setStartPos({
      x: x,
      y: y,
      pageIndex: pageIndex
    });

    // Start drawing
    setIsDragging(true);
  };

  const handleFormMove = (pageIndex, startX, startY, currentX, currentY) => {
    if (!isDragging) return;

    // Find the page element
    const pageElement = document.querySelector(`.page[data-page-index="${pageIndex}"]`);
    if (!pageElement) return;

    // Calculate width, height, and position
    let width, height, left, top;

    // For line and arrow, we want to keep the start point fixed and extend to current point
    if (formType === "line" || formType === "arrow") {
      // For line and arrow, width and height are the distances from start to current
      width = currentX - startX;
      height = currentY - startY;
      // The position is always the starting point
      left = startX;
      top = startY;
    } else {
      // For other shapes, use the standard rectangle calculation
      width = Math.abs(currentX - startX);
      height = Math.abs(currentY - startY);
      left = Math.min(currentX, startX);
      top = Math.min(currentY, startY);
    }

    // Create a temporary form element for preview
    let tempFormElement = document.getElementById("temp-form-element-container");
    if (!tempFormElement) {
      // Create a new container for the temporary element
      tempFormElement = document.createElement("div");
      tempFormElement.id = "temp-form-element-container";
      pageElement.appendChild(tempFormElement);
    }

    // Render the TempFormElement component into the container
    const root = ReactDOM.createRoot(tempFormElement);
    root.render(
      <TempFormElement
        formType={formType}
        left={left}
        top={top}
        width={width}
        height={height}
        fillColor={currentColor}
        fillTransparency={fillTransparency}
        strokeColor={strokeColor}
        strokeTransparency={strokeTransparency}
        cornerRadius={cornerRadius}
        rotation={rotation}
        strokeWidth={strokeWidth}
      />
    );
  };

  const handleFormEnd = (pageIndex, startX, startY, endX, endY) => {
    if (!isDragging) return;

    // We're finishing drawing a form
    const tempFormElementContainer = document.getElementById("temp-form-element-container");
    if (tempFormElementContainer) {
      // Calculate width, height, and position
      let width, height, left, top;

      // For line and arrow, we want to keep the start point fixed and extend to end point
      if (formType === "line" || formType === "arrow") {
        // For line and arrow, width and height are the distances from start to end
        width = endX - startX;
        height = endY - startY;
        // The position is always the starting point
        left = startX;
        top = startY;

        // Skip if the line/arrow is too small (using length instead of width/height)
        const length = Math.sqrt(width * width + height * height);
        if (length < 5) {
          tempFormElementContainer.remove();
          setIsDragging(false);
          return;
        }
      } else {
        // For other shapes, use the standard rectangle calculation
        width = Math.abs(endX - startX);
        height = Math.abs(endY - startY);

        // Skip if the form is too small
        if (width < 5 || height < 5) {
          tempFormElementContainer.remove();
          setIsDragging(false);
          return;
        }

        // Calculate position
        left = Math.min(endX, startX);
        top = Math.min(endY, startY);
      }

      // Create a new form element
      const newFormElement = {
        id: Date.now(),
        type: formType,
        x: left,
        y: top,
        width: width,
        height: height,
        fillColor: currentColor,
        fillTransparency: fillTransparency,
        strokeColor: strokeColor,
        strokeTransparency: strokeTransparency,
        cornerRadius: cornerRadius,
        rotation: rotation,
        strokeWidth: strokeWidth,
        pageIndex: pageIndex,
      };

      // Add to form elements
      setFormElements([...formElements, newFormElement]);

      // Set as active form element
      setActiveFormElement(newFormElement.id);

      // Remove temporary element container
      const root = ReactDOM.createRoot(tempFormElementContainer);
      root.unmount();
      tempFormElementContainer.remove();

      // Reset form mode and set tool back to move
      setIsFormMode(false);
      setIsFormActive(false); // Deactivate form canvas
      setActiveTool("move");
      document.body.style.cursor = "default";
    }

    setIsDragging(false);
  };

  // Додавання тексту
  useEffect(() => {
    const handlePageClick = (e) => {
      const isEditorClick =
          e.target.closest(".flip-book-container") ||
          e.target.closest(".page-wrapper") ||
          e.target.closest(".page");

      // If adding text
      if (
          textMode &&
          isEditorClick &&
          !e.target.closest(".text-element") &&
          !e.target.closest(".text-settings")
      ) {
        // We'll calculate position relative to the page instead of using global coordinates

        // Determine which page was clicked based on position
        const bookElement = document.querySelector(".flip-book-container");
        const bookBounds = bookElement.getBoundingClientRect();
        const clickX = e.clientX;
        const isLeftPage = clickX < (bookBounds.left + bookBounds.right) / 2;

        // Calculate page index based on current spread and left/right page
        const pageIndex = currentSpread * 2 + (isLeftPage ? 0 : 1);

        // Get the page element to calculate position relative to the page
        // Use the data-page-index attribute to ensure we get the correct page
        const pageElement = document.querySelector(`.page[data-page-index="${pageIndex}"]`);

        if (!pageElement) return;

        const pageBounds = pageElement.getBoundingClientRect();

        // Calculate position relative to the page
        const relativeX = (e.clientX - pageBounds.left) / scale;
        const relativeY = (e.clientY - pageBounds.top) / scale;

        const newTextElement = {
          id: Date.now(),
          x: relativeX,
          y: relativeY,
          text: "Text",  // Default text
          fontSize: 16,
          fontFamily: "Montserrat",
          fontWeight: "400",
          fontStyle: "normal",
          letterSpacing: "0px",
          lineHeight: 1.2,
          textTransform: "none",
          color: currentColor,
          rotation: 0,
          width: 100,
          height: 30,
          pageIndex: pageIndex, // Track which page the text belongs to
        };

        setTextElements([...textElements, newTextElement]);
        setActiveTextElement(newTextElement.id);
        setShowTextSettings(true);
        setTextMode(false);
        setActiveTool("move");

        // Set editing mode to true to make the text element immediately editable
        setIsEditing(true);

        // Set cursor to text for editing
        document.body.style.cursor = "text";

        // After text insertion is complete, set cursor back to default for move tool
        setTimeout(() => {
          document.body.style.cursor = "default";
        }, 100);

        // Focus the text element to enable immediate editing
        setTimeout(() => {
          const textElement = document.querySelector(`.text-element[data-id='${newTextElement.id}']`);
          if (textElement) {
            textElement.focus();

            // Place cursor at the end of the text
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(textElement);
            range.collapse(false); // false means collapse to end
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }, 0);
      }
    };

    if (textMode) {
      document.addEventListener("click", handlePageClick);
    }

    return () => {
      document.removeEventListener("click", handlePageClick);
    };
  }, [textMode, textElements, currentColor, scale, currentSpread]);

  useEffect(() => {
    const handleClickPage = (e) => {
      if (!e.target.closest(".text-element") && !e.target.closest(".text-settings")) {
        setShowTextSettings(false);
        setActiveTextElement(null);
      }
    };

    document.addEventListener("click", handleClickPage);
    return () => document.removeEventListener("click", handleClickPage);
  }, [textMode]);

  // Переміщення і розтягування тексту
  const handleMouseDownOnText = (e, element) => {
    // Устанавливаем активный элемент
    setActiveTextElement(element.id);
    setShowTextSettings(true);

    // Если это начало перетаскивания
    if (e.target.classList.contains("resize-handle")) {
      setIsResizing(true);
      setResizeStartSize({
        width: element.width,
        height: element.height,
      });
      setDragStartPos({ x: e.clientX, y: e.clientY });
    } else {
      // Запоминаем позицию для возможного перетаскивания
      setIsDraggingText(true);
      setDragStartPos({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = "move";
    }
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Handle text element dragging
      if (isDraggingText && activeTextElement) {
        const dx = e.clientX - dragStartPos.x;
        const dy = e.clientY - dragStartPos.y;

        // Get current page boundaries based on active text element
        const activeElement = textElements.find((el) => el.id === activeTextElement);
        if (!activeElement) return;

        // Get the correct page element based on the text element's pageIndex
        const pageElement = document.querySelector(`.page[data-page-index="${activeElement.pageIndex}"]`);

        if (!pageElement) return;

        const pageBounds = pageElement.getBoundingClientRect();

        setTextElements(
            textElements.map((el) => {
              if (el.id === activeTextElement) {
                // Calculate new position relative to the page
                const newX = el.x + dx / scale;
                const newY = el.y + dy / scale;

                // Calculate page boundaries in page coordinates
                const pageWidth = pageBounds.width / scale;
                const pageHeight = pageBounds.height / scale;

                // Clamp the position within page boundaries
                // Leave a small margin (5px) to ensure text is always visible
                const margin = 5;
                const clampedX = Math.min(Math.max(newX, margin), pageWidth - el.width - margin);
                const clampedY = Math.min(Math.max(newY, margin), pageHeight - el.height - margin);

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
      }

      // Handle form element dragging
      if (isDraggingForm && activeFormElement) {
        const dx = e.clientX - dragStartPos.x;
        const dy = e.clientY - dragStartPos.y;

        // Get current page boundaries based on active form element
        const activeElement = formElements.find((el) => el.id === activeFormElement);
        if (!activeElement) return;

        // Get the correct page element based on the form element's pageIndex
        const pageElement = document.querySelector(`.page[data-page-index="${activeElement.pageIndex}"]`);

        if (!pageElement) return;

        const pageBounds = pageElement.getBoundingClientRect();

        setFormElements(
            formElements.map((el) => {
              if (el.id === activeFormElement) {
                // Calculate new position relative to the page
                const newX = el.x + dx / scale;
                const newY = el.y + dy / scale;

                // Calculate page boundaries in page coordinates
                const pageWidth = pageBounds.width / scale;
                const pageHeight = pageBounds.height / scale;

                // Clamp the position within page boundaries
                // Leave a small margin (5px) to ensure form is always visible
                const margin = 5;
                const clampedX = Math.min(Math.max(newX, margin), pageWidth - el.width - margin);
                const clampedY = Math.min(Math.max(newY, margin), pageHeight - el.height - margin);

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
      }

      // Handle text element resizing
      if (isResizing && activeTextElement) {
        const dx = e.clientX - dragStartPos.x;
        const dy = e.clientY - dragStartPos.y;

        // Get current page boundaries based on active text element
        const activeElement = textElements.find((el) => el.id === activeTextElement);
        if (!activeElement) return;

        // Get the correct page element based on the text element's pageIndex
        const pageElement = document.querySelector(`.page[data-page-index="${activeElement.pageIndex}"]`);

        if (!pageElement) return;

        const pageBounds = pageElement.getBoundingClientRect();

        // Calculate page boundaries in page coordinates
        const pageWidth = pageBounds.width / scale;
        const pageHeight = pageBounds.height / scale;

        setTextElements(
            textElements.map((el) => {
              if (el.id === activeTextElement) {
                // Calculate new width and height
                const newWidth = Math.max(50, resizeStartSize.width + dx / scale);
                const newHeight = Math.max(20, resizeStartSize.height + dy / scale);

                // Ensure the element doesn't resize beyond page boundaries
                const maxWidth = pageWidth - el.x - 5; // 5px margin
                const maxHeight = pageHeight - el.y - 5; // 5px margin

                return {
                  ...el,
                  width: Math.min(newWidth, maxWidth),
                  height: Math.min(newHeight, maxHeight),
                };
              }
              return el;
            })
        );
        setDragStartPos({ x: e.clientX, y: e.clientY });
      }

      // Handle form element resizing
      if (isResizingForm && activeFormElement) {
        // Calculate the delta from the original drag start position
        // This ensures smooth resizing without jerkiness
        const dx = e.clientX - dragStartPos.x;
        const dy = e.clientY - dragStartPos.y;

        // Get current page boundaries based on active form element
        const activeElement = formElements.find((el) => el.id === activeFormElement);
        if (!activeElement) return;

        // Get the correct page element based on the form element's pageIndex
        const pageElement = document.querySelector(`.page[data-page-index="${activeElement.pageIndex}"]`);

        if (!pageElement) return;

        const pageBounds = pageElement.getBoundingClientRect();

        // Calculate page boundaries in page coordinates
        const pageWidth = pageBounds.width / scale;
        const pageHeight = pageBounds.height / scale;

        // Get the resize handle being used
        const resizeHandle = resizeFormStartSize.resizeHandle;

        // Special handling for line and arrow forms
        const isLineOrArrow = activeElement.type === "line" || activeElement.type === "arrow";

        setFormElements(
            formElements.map((el) => {
              if (el.id === activeFormElement) {
                // Always start with the original position and size from resizeFormStartSize
                // This prevents cumulative errors that cause jerkiness
                let newX = resizeFormStartSize.x;
                let newY = resizeFormStartSize.y;
                let newWidth = resizeFormStartSize.width;
                let newHeight = resizeFormStartSize.height;

                // Handle resizing based on which handle is being used
                switch(resizeHandle) {
                  case "top-left":
                    // Resize from top-left corner
                    newX = Math.min(resizeFormStartSize.x + dx / scale, resizeFormStartSize.x + resizeFormStartSize.width - 20);
                    newY = Math.min(resizeFormStartSize.y + dy / scale, resizeFormStartSize.y + resizeFormStartSize.height - 20);
                    newWidth = resizeFormStartSize.width - (newX - resizeFormStartSize.x);
                    newHeight = resizeFormStartSize.height - (newY - resizeFormStartSize.y);
                    break;
                  case "top-right":
                    // Resize from top-right corner
                    newY = Math.min(resizeFormStartSize.y + dy / scale, resizeFormStartSize.y + resizeFormStartSize.height - 20);
                    newWidth = Math.max(20, resizeFormStartSize.width + dx / scale);
                    newHeight = resizeFormStartSize.height - (newY - resizeFormStartSize.y);
                    break;
                  case "bottom-left":
                    // Resize from bottom-left corner
                    newX = Math.min(resizeFormStartSize.x + dx / scale, resizeFormStartSize.x + resizeFormStartSize.width - 20);
                    newWidth = resizeFormStartSize.width - (newX - resizeFormStartSize.x);
                    newHeight = Math.max(20, resizeFormStartSize.height + dy / scale);
                    break;
                  case "bottom-right":
                    // Resize from bottom-right corner (default behavior)
                    newWidth = Math.max(20, resizeFormStartSize.width + dx / scale);
                    newHeight = Math.max(20, resizeFormStartSize.height + dy / scale);
                    break;
                  case "top":
                    // Resize from top edge
                    newY = Math.min(resizeFormStartSize.y + dy / scale, resizeFormStartSize.y + resizeFormStartSize.height - 20);
                    newHeight = resizeFormStartSize.height - (newY - resizeFormStartSize.y);
                    break;
                  case "bottom":
                    // Resize from bottom edge
                    newHeight = Math.max(20, resizeFormStartSize.height + dy / scale);
                    break;
                  case "left":
                    // Resize from left edge
                    newX = Math.min(resizeFormStartSize.x + dx / scale, resizeFormStartSize.x + resizeFormStartSize.width - 20);
                    newWidth = resizeFormStartSize.width - (newX - resizeFormStartSize.x);
                    break;
                  case "right":
                    // Resize from right edge
                    newWidth = Math.max(20, resizeFormStartSize.width + dx / scale);
                    break;
                  case "start":
                    if (isLineOrArrow) {
                      // For line/arrow, adjust the start point
                      // Use the original width and height from resizeFormStartSize
                      const originalWidth = resizeFormStartSize.width;
                      const originalHeight = resizeFormStartSize.height;
                      // Calculate the angle based on the original width and height
                      // This gives us the angle of the line/arrow without any rotation
                      const baseAngle = Math.atan2(originalHeight, originalWidth);
                      // Add the rotation to get the actual angle of the line/arrow
                      const angle = baseAngle + (activeElement.rotation * Math.PI / 180);
                      const length = Math.sqrt(originalWidth * originalWidth + originalHeight * originalHeight);
                      const dLength = dx / scale * Math.cos(angle) + dy / scale * Math.sin(angle);
                      const newLength = Math.max(20, length - dLength);
                      const ratio = newLength / length;

                      newWidth = originalWidth * ratio;
                      newHeight = originalHeight * ratio;

                      // Adjust position to keep the end point fixed
                      newX = resizeFormStartSize.x + originalWidth - newWidth;
                      newY = resizeFormStartSize.y + originalHeight - newHeight;
                    }
                    break;
                  case "end":
                    if (isLineOrArrow) {
                      // For line/arrow, adjust the end point
                      // Use the original width and height from resizeFormStartSize
                      const originalWidth = resizeFormStartSize.width;
                      const originalHeight = resizeFormStartSize.height;
                      // Calculate the angle based on the original width and height
                      // This gives us the angle of the line/arrow without any rotation
                      const baseAngle = Math.atan2(originalHeight, originalWidth);
                      // Add the rotation to get the actual angle of the line/arrow
                      const angle = baseAngle + (activeElement.rotation * Math.PI / 180);
                      const dLength = dx / scale * Math.cos(angle) + dy / scale * Math.sin(angle);
                      const length = Math.sqrt(originalWidth * originalWidth + originalHeight * originalHeight);
                      const newLength = Math.max(20, length + dLength);
                      const ratio = newLength / length;

                      newWidth = originalWidth * ratio;
                      newHeight = originalHeight * ratio;
                    }
                    break;
                }

                // Ensure the element doesn't resize beyond page boundaries
                const margin = 5;

                // Clamp position within page boundaries
                newX = Math.max(margin, Math.min(newX, pageWidth - newWidth - margin));
                newY = Math.max(margin, Math.min(newY, pageHeight - newHeight - margin));

                // Ensure minimum size
                newWidth = Math.max(20, newWidth);
                newHeight = Math.max(20, newHeight);

                // Ensure the element doesn't resize beyond page boundaries
                newWidth = Math.min(newWidth, pageWidth - newX - margin);
                newHeight = Math.min(newHeight, pageHeight - newY - margin);

                return {
                  ...el,
                  x: newX,
                  y: newY,
                  width: newWidth,
                  height: newHeight,
                };
              }
              return el;
            })
        );
        // Don't update dragStartPos here to maintain consistent resizing relative to the original position
      }
    };

    const handleMouseUp = () => {
      if (isDraggingText) {
        setIsDraggingText(false);
        // Reset cursor to default after dragging
        document.body.style.cursor = "default";
      }
      if (isDraggingForm) {
        setIsDraggingForm(false);
        // Reset cursor to default after dragging
        document.body.style.cursor = "default";
      }
      if (isResizingForm) {
        setIsResizingForm(false);
        // Reset cursor to default after resizing
        document.body.style.cursor = "default";
      }
      setIsResizing(false);
    };

    if (isDraggingText || isResizing || isDraggingForm || isResizingForm) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingText, isResizing, isDraggingForm, isResizingForm, dragStartPos, activeTextElement, activeFormElement, textElements, formElements, scale, resizeStartSize, resizeFormStartSize]);

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

  // Remove active text element on Delete key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && activeTextElement) {
        setTextElements((prev) => prev.filter((el) => el.id !== activeTextElement));
        setActiveTextElement(null);
        setShowTextSettings(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeTextElement]);

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
      const isLeftPage = i % 2 === 0;
      const pageClassName = isLeftPage ? "page-left" : "page-right";

      // Filter text elements for this specific page
      // Make sure we're using the correct pageIndex that doesn't change with pagination
      const pageTextElements = textElements.filter(element => element.pageIndex === i);

      // Filter form elements for this specific page
      const pageFormElements = formElements.filter(element => element.pageIndex === i);

      pages.push(
          <div key={`page-${i}`} className={`page h-full w-full bg-[#f9f9f9] ${pageClassName} `} data-page-index={i}>
            <div className="w-full h-full relative">
              {/* Drawing Canvas */}
              <Canvas
                  ref={isLeftPage ? canvasLeftRef : canvasRightRef}
                  color={brushType === "eraser" ? "#ffffff" : currentColor}
                  brushSize={brushSize}
                  width={640}
                  className={
                    isLeftPage
                        ? "shadow-[inset_-6px_0px_12px_rgba(0,0,0,0.25)]"
                        : "shadow-[inset_4px_0px_4px_rgba(0,0,0,0.25)]"
                  }
                  height={864}
                  brushType={brushType} // Pass brush type to Canvas
                  isDrawingActive={isDrawingActive} // Pass isDrawingActive prop
                  style={{
                    position: "absolute",
                    zIndex: 5,
                    cursor: isDrawingActive ? "crosshair" : "default" // Change cursor based on isDrawingActive
                  }} // Add position and zIndex to ensure it's positioned correctly
              />

              {/* Form Canvas - separate canvas for form tools */}
              <FormCanvas
                  ref={isLeftPage ? formCanvasLeftRef : formCanvasRightRef}
                  width={640}
                  className={
                    isLeftPage
                        ? "shadow-[inset_-6px_0px_12px_rgba(0,0,0,0.25)]"
                        : "shadow-[inset_4px_0px_4px_rgba(0,0,0,0.25)]"
                  }
                  height={864}
                  isFormActive={isFormActive} // Pass isFormActive prop
                  onFormStart={(x, y) => handleFormStart(i, x, y)}
                  onFormMove={(startX, startY, currentX, currentY) => handleFormMove(i, startX, startY, currentX, currentY)}
                  onFormEnd={(startX, startY, endX, endY) => handleFormEnd(i, startX, startY, endX, endY)}
                  style={{
                    position: "absolute",
                    zIndex: 6, // Higher than drawing canvas
                    cursor: isFormActive ? "crosshair" : "default" // Change cursor based on isFormActive
                  }}
              />
              <div
                  className="flex flex-col justify-center items-center w-full h-full page-wrapper"
                  style={{
                    boxShadow: isLeftPage
                        ? "inset -6px 0px 12px rgba(0, 0, 0, 0.25)"
                        : "inset 4px 0px 4px rgba(0, 0, 0, 0.25)",
                    pointerEvents: "none", // Allow mouse events to pass through to the Canvas component
                  }}
              >
                <div className="text-xl text-gray-600">
                  {`Розворот ${Math.floor(i / 2) + 1} — ${isLeftPage ? "Left" : "Right"}`}
                </div>
              </div>

              {/* Form elements for this page */}
              {pageFormElements.map((element) => (
                <FormElement
                  key={`form-${element.id}`}
                  element={element}
                  isActive={activeFormElement === element.id}
                  onClick={(e) => handleFormElementClick(e, element)}
                  onMouseDown={(e) => handleMouseDownOnForm(e, element)}
                />
              ))}

              {/* Text elements for this page */}
              {pageTextElements.map((element) => (
                  <div
                      key={element.id}
                      data-id={element.id}
                      className={`absolute outline-none text-element ${isEditing && activeTextElement === element.id ? 'cursor-text' : 'cursor-move'}`}
                      style={{
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        transform: `rotate(${element.rotation}deg)`,
                        color: element.color,
                        fontSize: `${element.fontSize}px`,
                        fontFamily: element.fontFamily,
                        fontWeight: element.fontWeight,
                        fontStyle: element.fontStyle,
                        letterSpacing: element.letterSpacing,
                        lineHeight: element.lineHeight,
                        textTransform: element.textTransform,
                        textDecoration: element.textDecoration,
                        textAlign: element.textAlign,
                        border: activeTextElement === element.id ? "1px dashed #2A2A2A" : "none",
                        minWidth: "50px",
                        minHeight: "20px",
                        width: `${element.width}px`,
                        height: `${element.height}px`,
                        position: "absolute",
                        zIndex: 10, // Ensure text is above other elements
                      }}
                      contentEditable={isEditing && activeTextElement === element.id}
                      suppressContentEditableWarning={true}
                      onClick={(e) => handleTextElementClick(e, element)}
                      onMouseDown={(e) => handleMouseDownOnText(e, element)}
                      onDoubleClick={(e) => handleTextElementDoubleClick(e, element)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && isEditing) {
                          e.preventDefault();
                          e.target.blur();
                        }
                      }}
                      onBlur={(e) => {
                        if (activeTextElement === element.id) {
                          const updatedText = e.target.innerText;
                          setTextElements(
                              textElements.map((el) =>
                                  el.id === element.id ? { ...el, text: updatedText } : el
                              )
                          );
                          setIsEditing(false);
                          // Set cursor back to default for move tool
                          document.body.style.cursor = "default";
                          // Ensure activeTool is set to move
                          setActiveTool("move");
                        }
                      }}
                  >
                    {element.text}
                    {activeTextElement === element.id && !isEditing && (
                        <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-[#2A2A2A] cursor-se-resize" />
                    )}
                  </div>
              ))}
            </div>
          </div>
      );
    }

    return pages;
  };

  // Handle text element click
  const handleTextElementClick = (e, element) => {
    // Если было движение мыши - это перетаскивание, не активируем редактирование
    if (isDraggingText) {
      setIsDraggingText(false);
      return;
    }

    e.stopPropagation();
    setActiveTextElement(element.id);
    setShowTextSettings(true);
    setIsEditing(true);
    document.body.style.cursor = "text";

    // Фокусируем элемент и устанавливаем курсор
    setTimeout(() => {
      const textElement = document.querySelector(`.text-element[data-id='${element.id}']`);
      if (textElement) {
        textElement.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(textElement);
        range.collapse(false); // Курсор в конец текста
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, 0);
  };

  // Handle text element double click
  const handleTextElementDoubleClick = (e, element) => {
    e.stopPropagation();
    setActiveTextElement(element.id);
    setShowTextSettings(true);
    setIsEditing(true);
    document.body.style.cursor = "text";

    setTimeout(() => {
      const textElement = document.querySelector(`.text-element[data-id='${element.id}']`);
      if (textElement) {
        textElement.focus();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(textElement);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, 0);
  };

  // Handle form element click
  const handleFormElementClick = (e, element) => {
    // If was dragging, don't activate settings
    if (isDraggingForm) {
      setIsDraggingForm(false);
      return;
    }

    e.stopPropagation();
    setActiveFormElement(element.id);
    setShowFormSettings(true);
    // Ensure activeTool is set to move
    setActiveTool("move");
  };

  // Handle mouse down on form element
  const handleMouseDownOnForm = (e, element) => {
    // Set active element
    setActiveFormElement(element.id);
    setShowFormSettings(true);

    // If this is the start of resizing
    if (e.target.classList.contains("resize-handle")) {
      setIsResizingForm(true);

      // Get the resize handle direction from the data attribute
      const resizeHandle = e.target.getAttribute("data-resize-handle");

      setResizeFormStartSize({
        width: element.width,
        height: element.height,
        x: element.x,
        y: element.y,
        resizeHandle: resizeHandle // Store which handle is being used
      });

      setDragStartPos({ x: e.clientX, y: e.clientY });

      // Set appropriate cursor based on resize handle
      switch(resizeHandle) {
        case "top-left":
          document.body.style.cursor = "nw-resize";
          break;
        case "top-right":
          document.body.style.cursor = "ne-resize";
          break;
        case "bottom-left":
          document.body.style.cursor = "sw-resize";
          break;
        case "bottom-right":
          document.body.style.cursor = "se-resize";
          break;
        case "top":
          document.body.style.cursor = "n-resize";
          break;
        case "bottom":
          document.body.style.cursor = "s-resize";
          break;
        case "left":
          document.body.style.cursor = "w-resize";
          break;
        case "right":
          document.body.style.cursor = "e-resize";
          break;
        case "start":
          document.body.style.cursor = "w-resize";
          break;
        case "end":
          document.body.style.cursor = "e-resize";
          break;
        default:
          document.body.style.cursor = "se-resize";
      }
    } else {
      // Remember position for possible dragging
      setIsDraggingForm(true);
      setDragStartPos({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = "move";
    }
    e.stopPropagation();
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
                      setIsOpened(true);
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
              <div className="fixed top-[calc(100dvh-800px)] right-[40px] z-50 flex flex-col items-center py-[28px] px-[8px] gap-[18px] bg-[#C3DEE1] rounded-[16px] shadow-[ -4px_4px_10px_rgba(0,0,0,0.25)]">
                {tools.map((tool) => {
                  // Для move tool використовуємо обрану іконку
                  const icon = tool.name === "move" ? `img_${selectedMoveTool}_tool.svg` : tool.icon;

                  return (
                      <div key={tool.name} className="relative">
                        <button
                            ref={(el) => (buttonRefs.current[tool.name] = el)}
                            onClick={() => {
                              setActiveTool(tool.name);

                              // Handle cursor changes based on tool
                              if (tool.name === "move") {
                                if (selectedMoveTool === "hand") {
                                  document.body.style.cursor = "grab";
                                } else {
                                  document.body.style.cursor = "default";
                                }
                              } else if (tool.name === "text") {
                                setTextMode(true);
                                document.body.style.cursor = "url('/images/img_plus_tool.svg'), text";
                              } else if (tool.name === "draw") {
                                // Set cursor based on current brush type
                                switch (brushType) {
                                  case "eraser":
                                    document.body.style.cursor = "url('/images/img_eraser_cursor.svg'), auto";
                                    break;
                                  case "default":
                                    document.body.style.cursor = "url('/images/img_pen_cursor.svg'), auto";
                                    break;
                                  case "feather":
                                    document.body.style.cursor = "url('/images/img_pencil_cursor.svg'), auto";
                                    break;
                                  case "drip":
                                    document.body.style.cursor = "url('/images/img_graphic_pen_cursor.svg'), auto";
                                    break;
                                  case "caligraphy":
                                    document.body.style.cursor = "url('/images/img_marker_cursor.svg'), auto";
                                    break;
                                  case "swirl":
                                    document.body.style.cursor = "url('/images/img_brush_pen_cursor.svg'), auto";
                                    break;
                                  case "foam":
                                    document.body.style.cursor = "url('/images/img_air_brush_cursor.svg'), auto";
                                    break;
                                  case "watercolor":
                                    document.body.style.cursor = "url('/images/img_watercolor_cursor.svg'), auto";
                                    break;
                                  default:
                                    document.body.style.cursor = "url('/images/img_pen_cursor.svg'), auto";
                                }
                              } else if (tool.name === "form") {
                                // Form tool selected, but no specific form type yet
                                // Cursor will be set when a specific form is selected
                                document.body.style.cursor = "default";
                              } else {
                                // Default cursor for other tools
                                document.body.style.cursor = "default";
                              }

                              // Handle text mode
                              if (tool.name !== "text") {
                                setTextMode(false);
                              }

                              // Handle tool menu
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
              <div className="w-screen h-screen overflow-hidden bg-[#ebdccb]" ref={editorLeftRef}>
                {/* Wrapper з padding */}
                <div
                    className="relative"
                    style={{
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
                      clickEventForward={true}
                      useMouseEvents={false}
                      onFlip={handlePageChange}
                      className="shadow-lg flip-book-container relative"
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
                </div>
                {/* TextMenu */}
                {showTextSettings && activeTextElement && (
                    <div
                        ref={textSettingsRef}
                        className="fixed z-50 right-[115px] top-[calc(100dvh-710px)] text-settings"
                    >
                      <TextMenu
                          textElement={textElements.find((el) => el.id === activeTextElement)}
                          onTextElementChange={(updatedElement) => {
                            setTextElements(
                                textElements.map((el) => (el.id === activeTextElement ? updatedElement : el))
                            );
                          }}
                      />
                    </div>
                )}

                {/* FormMenu */}
                {showFormSettings && activeFormElement && (
                    <div
                        ref={formSettingsRef}
                        className="fixed z-50 right-[115px] top-[calc(100dvh-710px)] form-settings"
                    >
                      <FormMenu
                          formElement={formElements.find((el) => el.id === activeFormElement)}
                          onFormElementChange={(updatedElement) => {
                            setFormElements(
                                formElements.map((el) => (el.id === activeFormElement ? updatedElement : el))
                            );

                            // Update the form parameters for new forms
                            setFillTransparency(updatedElement.fillTransparency);
                            setStrokeColor(updatedElement.strokeColor);
                            setStrokeTransparency(updatedElement.strokeTransparency);
                            setCornerRadius(updatedElement.cornerRadius);
                            setRotation(updatedElement.rotation);
                            setStrokeWidth(updatedElement.strokeWidth);
                          }}
                      />
                    </div>
                )}
              </div>
            </>
        )}
      </div>
  );
};

export default Journal;
