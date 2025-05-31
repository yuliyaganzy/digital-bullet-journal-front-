import React, { useState, useEffect } from 'react';

function getShadowColor(hex) {
  const lighten = (value) => Math.max(0, Math.min(255, Math.round(value * 0.75)));
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = lighten((bigint >> 16) & 255);
  const g = lighten((bigint >> 8) & 255);
  const b = lighten(bigint & 255);
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}`;
}
const booksPerShelf = 19;
const shelvesPerPage = 3;
const shelfTops = [371, 72, 670];
const emptyShelf = () => [];
const emptyPage = () => [emptyShelf(), emptyShelf(), emptyShelf()];

export const HomePage = () => {
  const [pages, setPages] = useState([emptyPage()]);
  const [currentPage, setCurrentPage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showCreatePageConfirm, setShowCreatePageConfirm] = useState(false);
  const [showNoBooksAlert, setShowNoBooksAlert] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [showGoToAvailablePageModal, setShowGoToAvailablePageModal] = useState(false);
  const [availablePageIndex, setAvailablePageIndex] = useState(null);

  // Налаштування параметрів щоденника
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [coverColor, setCoverColor] = useState("#FAF1B8");
  const [textColor, setTextColor] = useState("#d3a243");
  const [pageCount, setPageCount] = useState("");
  const [layoutType, setLayoutType] = useState("");
  const [pendingBook, setPendingBook] = useState(null);

  const resetForm = () => {
    setNewBookTitle("");
    setCoverColor("#FAF1B8");
    setTextColor("#d3a243");
    setPageCount("");
    setLayoutType("");
    setError("");
    setEditBook(null);
    setEditMode(false);
  };

  const Cover = ({ fill = "#C5BF94", className = "" }) => (
    <svg width="45" height="197" viewBox="0 0 45 197" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M0.190826 196.993L45 163.5V0L0.190826 32.6357V196.993Z" fill={fill} />
    </svg>
  );

  const Spine = ({ fill = "#FAF1B8", className = "" }) => (
    <svg width="41" height="166" viewBox="0 0 41 166" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20.0954 1.64274C13.1129 1.64274 6.37775 1.29209 0 0.635742V164.993C6.37775 165.64 13.1129 166 20.0954 166C27.0779 166 33.8131 165.649 40.1908 164.993V0.635742C33.8131 1.2831 27.0779 1.64274 20.0954 1.64274Z" fill={fill} />
    </svg>
  );

  const Shadow = ({ fill = "rgba(42, 42, 42, 0.25)", className = "" }) => (
    <svg width="6" height="165" viewBox="0 0 6 165" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M0 -4.26015e-05L3 0.365713L6 0.728297V165L0 164.307V-4.26015e-05Z" fill={fill} />
    </svg>
  );

  const BookVisual = ({ title = "Hello", titleColor = "#FFFFFF", spineColor = "#FAF1B8" }) => {
    const coverColor = getShadowColor(spineColor); // або інше значення для затемнення

    return (
      <div className="relative h-[198px]">
        {/* Cover1 */}
        <Cover fill={coverColor} className="absolute top-0 left-0 w-[45px] h-[197px]" />
        {/* Pages */}
        <img
          className="absolute top-[2px] left-[5px] w-[76px] h-[196px]"
          src="/images/img_pages.svg"
          alt="Pages"
        />
        {/* Spine */}
        <Spine fill={spineColor} className="absolute top-[33px] left-[0px] w-[41px] h-[166px]" />
        {/* Cover2 */}
        <Cover fill={coverColor} className="absolute top-0 left-[39.5px] w-[45px] h-[197px]" />
        {/* Shadow */}
        <Shadow className="absolute top-[33px] left-0 w-[6px] h-[165px]" />
        {/* Title */}
        <div className="absolute w-[42px] h-[122px] top-[54px] left-0">
          <div
            className="absolute w-[122px] top-[41px] left-[-41px] -rotate-90 font-['Playfair_Display'] font-[900] text-[28px] text-center"
            style={{ color: titleColor }}
          >
            {title}
          </div>
        </div>
      </div>
    );
  };
  // Налаштування параметрів щоденника

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const menuItems = [
    "New Journal",
    "New Shelf",
    //"Decorate Shelf",
    "Edit Object",
    "Select Object",
    "Delete Object"
  ];

  const handleAddBook = () => {
    const book = {
      id: Date.now(),
      title: newBookTitle || `Book ${Date.now()}`,
      coverColor,
      textColor,
      shadowColor: getShadowColor(coverColor),
      pageCount: parseInt(pageCount, 10) || 0,
      layoutType,
    };

    const updatedPages = [...pages];
    const current = updatedPages[currentPage];
    const shelfIndex = current.findIndex(shelf => shelf.length < booksPerShelf);

    if (shelfIndex !== -1) {
      current[shelfIndex].push(book);
      setPages(updatedPages);
    } else {
      setPendingBook(book);
      setShowCreatePageConfirm(true);
    }
  };

  const handleConfirmDelete = () => {
    const updatedPages = pages.map(page =>
      page.map(shelf =>
        confirmDeleteId === "multiple"
          ? shelf.filter(book => !selectedBooks.includes(book.id))
          : shelf.filter(book => book.id !== confirmDeleteId)
      )
    );

    setPages(updatedPages);
    setSelectedBooks([]);
    setConfirmDeleteId(null);
    setDeleteMode(false);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleConfirmCreatePage = () => {
    const newPage = emptyPage();
    newPage[0].push(pendingBook);
    setPages(prev => [...prev, newPage]);
    setCurrentPage(pages.length);
    setPendingBook(null);
    setShowCreatePageConfirm(false);
  };

  const handleCancelCreatePage = () => {
    setShowCreatePageConfirm(false);
  };

  const handleMenuAction = (action) => {
    const hasBooks = pages.some(page => page.some(shelf => shelf.length > 0));

    switch (action) {
      case "New Journal":
        setShowCreateModal(true);
        break;
      case "New Shelf":
        setPages(prev => [...prev, emptyPage()]);
        setCurrentPage(pages.length);
        break;
      case "Edit Object":
        if (!hasBooks) {
          setShowNoBooksAlert(true);
          break;
        }
        setEditMode(true);
        setDeleteMode(false);
        setSelectMode(false);
        break;
      case "Select Object":
        if (!hasBooks) {
          setShowNoBooksAlert(true);
          break;
        }
        setSelectMode(true);
        setDeleteMode(false);
        break;
      case "Delete Object":
        if (!hasBooks) {
          setShowNoBooksAlert(true);
          break;
        }
        setDeleteMode(true);
        setSelectMode(false);
        break;
      default:
        console.log(`${action} не реалізовано`);
    }

    setMenuOpen(false);
  };

  const currentShelves = pages[currentPage] || [];
  const totalPages = pages.length;

  const shelvesToRender = [...Array(shelvesPerPage)].map((_, index) => {
    const shelfGlobalIndex = index;
    const top = `${225 + shelfGlobalIndex * 299}px`;
    return (
      <img
        key={shelfGlobalIndex}
        src="/images/img_shelf.svg"
        alt="Shelf"
        className="absolute w-[1321px] h-[115px]"
        style={{ top, left: "59px" }}
      />
    );
  });

  const handleBookClick = (bookId) => {
    let bookToEdit = null;
    let shelfIndex = null;
    let pageIndex = currentPage;
    // Знаходимо книгу по id на поточній сторінці
    pages[pageIndex].forEach((shelf, sIndex) => {
      shelf.forEach(book => {
        if (book.id === bookId) {
          bookToEdit = book;
          shelfIndex = sIndex;
        }
      });
    });
    if (!bookToEdit) return; // не знайшли
    if (deleteMode) {
      setConfirmDeleteId(bookId);
      return;
    }
    if (!selectMode && !editMode) {
      setSelectMode(true);
    }
    setSelectedBooks(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
    if (editMode) {
      setEditBook(bookToEdit);
      setNewBookTitle(bookToEdit.title);
      setCoverColor(bookToEdit.coverColor);
      setTextColor(bookToEdit.textColor);
      setPageCount(bookToEdit.pageCount.toString());
      setLayoutType(bookToEdit.layoutType);
      setShowCreateModal(true);
    }
  };

  const [animateIn, setAnimateIn] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (deleteMode || editMode) {
      setVisible(true);

      timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimateIn(true);
          });
        });
      }, 0);
    } else {
      setAnimateIn(false);

      timeoutId = setTimeout(() => {
        setVisible(false);
      }, 700);
    }

    return () => clearTimeout(timeoutId);
  }, [deleteMode, editMode]);

  useEffect(() => {
    const hasBooks = pages.some(page => page.some(shelf => shelf.length > 0));
    if (selectMode && !hasBooks) {
      setSelectMode(false);
    }
  }, [pages, selectMode]);


  const [animateDoneIn, setAnimateDoneIn] = useState(false);
  const [doneVisible, setDoneVisible] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (selectMode || deleteMode || editMode) {
      setDoneVisible(true);
      timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimateDoneIn(true);
          });
        });
      }, 0);
    } else {
      setAnimateDoneIn(false);
      timeoutId = setTimeout(() => {
        setDoneVisible(false);
      }, 700);
    }

    return () => clearTimeout(timeoutId);
  }, [selectMode, deleteMode, editMode]);

  return (
    <main className="relative bg-[#EBDCCB] flex flex-row justify-center w-full h-full">
      {/* Вікно-модалка налаштування параметрів щоденника */}
      {showCreateModal && (
        <div className="absolute w-full h-full flex justify-center items-center z-[200]">
          <div className="absolute top-0 left-0 w-full h-full bg-[#2a2a2a] opacity-40 pointer-events-none z-[190] mix-blend-normal"></div>
          <div className="relative flex flex-col gap-y-[40px] bg-[#f9f9f9] rounded-[10px] z-[200] px-[32px] py-[20px] max-w-[90%]"
            style={{ boxShadow: "-10px 10px 30px 4px rgba(0, 0, 0, 0.4)" }}
          >
            <h2 className="text-[32px] font-normal font-['Americana_BT'] text-black mb-10 text-center">
              {editBook ? "Edit Selected Journal" : "Create New Journal"}
            </h2>
            <div className="flex flex-col gap-y-[60px]">
              <div className="flex flex-col gap-y-[20px]">
                <div className="flex flex-row items-center gap-x-[12px]">
                  <label className="text-[20px] font-[300] font-montserrat text-[#2a2a2a] whitespace-nowrap">Title:</label>
                  <div className="flex-1 border-b border-[#2a2a2a] pb-1 text-[#2a2a2a] text-[20px] font-[300] font-montserrat">
                    <input
                      type="text"
                      placeholder="Title"
                      value={newBookTitle}
                      onChange={e => setNewBookTitle(e.target.value)}
                      className="w-full pl-[4px] bg-transparent focus:outline-none placeholder:text-[#2a2a2a] placeholder:text-[16px] placeholder:font-[200] placeholder:font-montserrat placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
                    />
                  </div>
                </div>

                <div className="flex flex-row items-center gap-x-[20px]">
                  <div className="flex flex-row items-center gap-x-[12px]">
                    <label className="text-[20px] font-[300] font-montserrat text-[#2a2a2a] whitespace-nowrap">Cover Color:</label>
                    <input
                      type="color"
                      value={coverColor}
                      onChange={e => setCoverColor(e.target.value)}
                      className="w-[30px] h-[30px] rounded-full border-none p-0 cursor-pointer appearance-none mb-4" />
                  </div>

                  <div className="flex flex-row items-center gap-x-[12px]">
                    <label className="text-[20px] font-[300] font-montserrat text-[#2a2a2a] whitespace-nowrap">Title Color:</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={e => setTextColor(e.target.value)}
                      className="w-[30px] h-[30px] rounded-full border-none p-0 cursor-pointer appearance-none mb-4" />
                  </div>
                </div>

                <div className="flex flex-row items-center gap-x-[12px]">
                  <label className="text-[20px] font-[300] font-montserrat text-[#2a2a2a] whitespace-nowrap">Page Count:</label>
                  <div className="flex-1 border-b border-[#2a2a2a] pb-1 text-[#2a2a2a] font-[300] font-montserrat">
                    <input
                      type="number"
                      min={1}
                      placeholder="Enter quantity"
                      value={pageCount}
                      onChange={e => setPageCount(e.target.value)}
                      className="w-full pl-[4px] bg-transparent focus:outline-none placeholder:text-[#2a2a2a] placeholder:text-[16px] placeholder:font-[200] placeholder:font-montserrat placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
                    />
                  </div>
                </div>

                <div className="flex flex-row items-center gap-x-[12px]">
                  <label className="text-[20px] font-[300] font-montserrat text-[#2a2a2a] whitespace-nowrap">Page Layout:</label>
                  <div className="flex-1 border-b border-[#2a2a2a] pb-1 text-[#2a2a2a] font-[300] font-montserrat">
                    <select value={layoutType} onChange={e => setLayoutType(e.target.value)} className="w-full p-2 mb-4 focus:outline-none focus:ring-0 cursor-pointer">
                      <option value="" disabled hidden>Choose layout</option>
                      <option value="grid">Grid</option>
                      <option value="lines">Lines</option>
                      <option value="dots">Dots</option>
                      <option value="blank">Blank</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="text-[#F15050] font-montserrat text-sm text-center">
                    {error}
                  </div>
                )}
              </div>

              <div className="flex flex-row justify-center gap-x-[20px]">
                <button
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(false)
                  }}
                  className="px-[24px] py-[8px] border-3 border-[#c3dee1] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#c3dee1] active:scale-95">
                  <span className="text-[20px] font-normal font-montserrat text-[#2a2a2a]">Cancel</span>
                </button>

                <button
                  onClick={() => {
                    if (!newBookTitle.trim() || !pageCount || !layoutType) {
                      setError("Please fill in all fields.");
                      return;
                    }
                    setError("");

                    if (editBook) {
                      const updatedPages = pages.map((page, pIndex) =>
                        page.map(shelf =>
                          shelf.map(book =>
                            book.id === editBook.id
                              ? {
                                ...book,
                                title: newBookTitle,
                                coverColor,
                                textColor,
                                shadowColor: getShadowColor(coverColor),
                                pageCount: parseInt(pageCount, 10),
                                layoutType
                              }
                              : book
                          )
                        )
                      );
                      setPages(updatedPages);
                      setSelectedBooks([]); // очищаємо виділення
                      setEditBook(null);     // очищаємо об'єкт редагування
                      setEditMode(false);    // виходимо з режиму редагування
                    } else {
                      handleAddBook(); // додавання нової
                    }

                    resetForm();
                    setShowCreateModal(false);
                  }}
                  className="px-[24px] py-[8px] border-3 border-[#c3dee1] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#c3dee1] active:scale-95"
                >
                  <span className="text-[20px] font-normal font-montserrat text-[#2a2a2a]">
                    {editBook ? "Save Changes" : "Create"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Вікно відмови у включенні режимів, через відсутність об'єктів */}
      {showNoBooksAlert && (
        <div className="absolute w-full h-full flex justify-center items-center z-[200]">
          <div className="absolute top-0 left-0 w-full h-full bg-[#2a2a2a] opacity-40 pointer-events-none z-[190] mix-blend-normal"></div>

          <div
            className="relative flex justify-center bg-[#c3dee1] rounded-[10px] z-[200] p-4 max-w-[90%] shadow-xl"
            style={{ boxShadow: "-10px 10px 30px 4px rgba(0, 0, 0, 0.4)" }}
          >
            <div className="text-center text-[#2a2a2a] font-montserrat">
              <p className="text-[20px] font-[600] px-[12px] py-[12px] break-words max-w-[300px] mx-auto">
                Unable to enter this mode. Shelves are empty.
              </p>
              <hr className="border-[#2a2a2a] w-full mx-auto my-2" />
              <div className="flex w-full text-[#2a2a2a] text-[20px] font-[300]">
                <button
                  onClick={() => setShowNoBooksAlert(false)}
                  className="w-full py-[12px] hover:bg-[#a9d1d4] hover:rounded-[10px] cursor-pointer"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blur overlay when in select mode */}
      {selectMode && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#EBDCCB] opacity-40 z-[150] pointer-events-none mix-blend-normal"></div>
      )}

      {/* Вікно підтверження видалення */}
      {confirmDeleteId !== null && (
        <div className="absolute w-full h-full flex justify-center items-center z-[200]">
          {/* Напівпрозорий фон */}
          <div className="absolute top-0 left-0 w-full h-full bg-[#2a2a2a] opacity-40 pointer-events-none z-[190] mix-blend-normal"></div>

          {/* Модальне вікно */}
          <div
            className="relative flex justify-center bg-[#c3dee1] rounded-[10px] z-[200] p-4 max-w-[90%] shadow-xl"
            style={{ boxShadow: "-10px 10px 30px 4px rgba(0, 0, 0, 0.4)" }}
          >
            <div className="text-center text-[#2a2a2a] font-montserrat">
              <p className="text-[20px] font-[600] px-[12px] py-[12px] break-words max-w-[300px] mx-auto">
                Do you confirm the deletion?
              </p>
              <hr className="border-[#2a2a2a] w-full mx-auto my-2" />
              <div className="flex w-full text-[#2a2a2a] text-[20px] font-[300]">
                <button
                  onClick={handleConfirmDelete}
                  className="w-1/2 py-[12px] hover:bg-[#a9d1d4] hover:rounded-bl-[10px] cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="w-1/2 py-[12px] hover:bg-[#a9d1d4] hover:rounded-br-[10px] cursor-pointer"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Вікно підтверження створення нової полиці */}
      {showCreatePageConfirm && (
        <div className="absolute w-full h-full flex justify-center items-center z-[200]">
          {/* Напівпрозорий фон */}
          <div className="absolute top-0 left-0 w-full h-full bg-[#2a2a2a] opacity-40 pointer-events-none z-[190] mix-blend-normal"></div>

          {/* Модальне вікно */}
          <div
            className="relative flex justify-center bg-[#c3dee1] rounded-[10px] z-[200] p-4 max-w-[90%] shadow-xl"
            style={{ boxShadow: "-10px 10px 30px 4px rgba(0, 0, 0, 0.4)" }}
          >
            <div className="text-center text-[#2a2a2a] font-montserrat">
              <p className="text-[20px] font-[600] px-[12px] py-[4px] break-words max-w-[300px] mx-auto">
                This shelf is completely full. Would you like to create a new one?
              </p>
              <hr className="border-[#2a2a2a] w-full mx-auto my-2" />
              <div className="flex w-full text-[#2a2a2a] text-[20px] font-[300]">
                <button
                  onClick={handleConfirmCreatePage}
                  className="w-1/2 py-[12px] hover:bg-[#a9d1d4] hover:rounded-bl-[10px] cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelCreatePage}
                  className="w-1/2 py-[12px] hover:bg-[#a9d1d4] hover:rounded-br-[10px] cursor-pointer"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGoToAvailablePageModal && (
        <div className="absolute w-full h-full flex justify-center items-center z-[200]">
          <div className="absolute top-0 left-0 w-full h-full bg-[#2a2a2a] opacity-40 pointer-events-none z-[190]" />
          <div className="relative flex justify-center bg-[#c3dee1] rounded-[10px] z-[200] p-4 max-w-[90%] shadow-xl">
            <div className="text-center text-[#2a2a2a] font-montserrat">
              <p className="text-[20px] font-[600] px-[12px] py-[4px] max-w-[300px] mx-auto">
                There is free space on another shelf. Would you like to go there?
              </p>
              <hr className="border-[#2a2a2a] w-full mx-auto my-2" />
              <div className="flex w-full text-[#2a2a2a] text-[20px] font-[300]">
                <button
                  className="w-1/2 py-[12px] hover:bg-[#a9d1d4] hover:rounded-bl-[10px] cursor-pointer"
                  onClick={() => {
                    setCurrentPage(availablePageIndex);
                    setShowGoToAvailablePageModal(false);
                    setAvailablePageIndex(null);
                  }}
                >
                  Yes
                </button>
                <button
                  className="w-1/2 py-[12px] hover:bg-[#a9d1d4] hover:rounded-br-[10px] cursor-pointer"
                  onClick={() => {
                    setShowGoToAvailablePageModal(false);
                    setAvailablePageIndex(null);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-[1440px] h-[1024px]">
        <div className="absolute w-[1440px] h-[1024px] flex flex-row items-center">
          <div className="absolute w-full h-full top-0 left-0">
            <header className="absolute flex items-center justify-center w-full h-[72px] top-0 left-0 bg-transparent z-[160]">
              <h1 className="font-['Americana_BT'] font-[400] text-[#2a2a2a] text-[36px]">My Shelf</h1>

              <div className="absolute right-[48px] flex flex-row items-center gap-x-[32px]">
                {visible && (
                  <div
                    className={`top-0 flex transform transition-transform duration-700 ease-out ${animateIn ? 'translate-y-0' : '-translate-y-full'}`}
                  >
                    <div className="px-[24px] py-[18px] rounded-b-[10px] bg-[#c3dee1] text-[20px] font-[400] font-normal font-montserrat text-[#2a2a2a]">
                      {deleteMode ? 'Select an object to delete' : 'Select an object to edit'}
                    </div>
                  </div>
                )}

                {/* Done button */}
                {doneVisible && (
                  <div
                    className={`top-0 flex transform transition-transform duration-700 ease-out ${animateDoneIn ? 'translate-y-0' : '-translate-y-full'}`}
                  >
                    <button
                      className="px-[24px] py-[8px] border-3 border-[#c3dee1] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#c3dee1] active:scale-95"
                      onClick={() => {
                        if (selectMode) {
                          setSelectMode(false);
                          setSelectedBooks([]);
                        }
                        if (deleteMode) {
                          setDeleteMode(false);
                          setSelectedBooks([]); // або setBooksToDelete([])
                        }
                        if (editMode) {
                          setEditMode(false);
                          setEditingItemId(null); // якщо є
                          setEditedData(null);    // якщо є
                        }
                      }}
                    >
                      <span className="text-[20px] font-[400] font-normal font-montserrat text-[#2a2a2a]">Done</span>
                    </button>
                  </div>
                )}

                {/* Add/Delete Icon */}
                <div
                  className="relative flex w-[18px] h-[18px] cursor-pointer group"
                  onClick={() => {
                    if ((selectMode && selectedBooks.length === 0) || deleteMode || editMode) return;
                    if (selectMode) {
                      setConfirmDeleteId("multiple");
                      return;
                    }
                    const currentShelves = pages[currentPage];
                    const hasFreeSlot = currentShelves.some(shelf => shelf.length < booksPerShelf);
                    if (hasFreeSlot) {
                      setShowCreateModal(true);
                    } else {
                      // шукаємо іншу сторінку з вільним місцем
                      const otherPageIndex = pages.findIndex((page, idx) =>
                        idx !== currentPage && page.some(shelf => shelf.length < booksPerShelf)
                      );
                      if (otherPageIndex !== -1) {
                        // Є інша сторінка з вільним місцем
                        setAvailablePageIndex(otherPageIndex);
                        setShowGoToAvailablePageModal(true);
                      } else {
                        // Немає вільного місця — пропонуємо створити нову
                        setShowCreatePageConfirm(true);
                      }
                    }
                  }}
                >
                  <img
                    src={selectMode ? "/images/img_delete_book.svg" : "/images/img_add_book.svg"}
                    alt="Action"
                    className={`w-[18px] h-[18px] transition-transform duration-100 ${(selectMode && selectedBooks.length === 0) || deleteMode || editMode ? 'opacity-30 cursor-not-allowed' : 'active:scale-90'}`}
                  />
                  {((selectMode && selectedBooks.length === 0) || deleteMode || editMode) && (
                    <div className="absolute bottom-full mb-[4px] w-max px-[4px] bg-[#c3dee1] text-[#2a2a2a] text-[16px] font-[200] font-montserrat rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {selectMode && selectedBooks.length === 0
                        ? 'Select an object'
                        : deleteMode
                          ? 'Complete the deletion'
                          : editMode
                            ? 'Finish editing'
                            : ''}
                    </div>
                  )}
                </div>

                {/* Menu Icon */}
                <div
                  className="relative flex w-[20px] h-[18px] cursor-pointer group"
                  onClick={() => {
                    if (selectMode || deleteMode || editMode) return;
                    toggleMenu();
                  }}
                >
                  <img
                    src="/images/img_menu.svg"
                    alt="Menu"
                    className={`w-[18px] h-[18px] ${selectMode || deleteMode || editMode
                      ? 'opacity-30 cursor-not-allowed'
                      : 'cursor-pointer active:scale-90'
                      }`}
                  />
                  {(selectMode || deleteMode || editMode) && (
                    <div className="absolute bottom-full mb-[4px] w-max px-[4px] bg-[#c3dee1] text-[#2a2a2a] text-[16px] font-[200] font-montserrat rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {selectMode
                        ? 'Exit Selection mode'
                        : deleteMode
                          ? 'Complete the deletion'
                          : editMode
                            ? 'Finish editing'
                            : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* Menu List (outside of buttons block) */}
              {menuOpen && (
                <div className="absolute right-[48px] top-[72px] z-[100]" onMouseLeave={() => setMenuOpen(false)}>
                  <div className="absolute top-[-20px] right-[12px] triangle" />
                  <ul className="bg-[#c3dee1] text-[#2a2a2a] rounded-[10px] shadow-lg w-[300px] text-sm font-montserrat text-[20px] font-[300]">
                    {menuItems.map((item, index) => (
                      <React.Fragment key={index}>
                        <li
                          className={`px-[24px] py-[24px] hover:bg-[#a9d1d4] cursor-pointer ${index === 0 ? 'hover:rounded-t-[10px]' : ''} ${index === menuItems.length - 1 ? 'hover:rounded-b-[10px]' : ''}`}
                          onClick={() => handleMenuAction(item)}
                        >
                          {item}
                        </li>
                        {index < menuItems.length - 1 && <hr className="border-[#2a2a2a] w-[252px] mx-auto" />}
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              )}
            </header>

          </div>
          {shelvesToRender}

          {currentShelves.map((shelf, shelfIndex) => {
            const top = `${shelfTops[shelfIndex]}px`; // top для кожної полиці

            return shelf.map((book, bookIndex) => {
              const left = `${196 + bookIndex * 52}px`; // позиція книжки на полиці

              return (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book.id)}
                  className={`absolute w-[85px] h-[199px] overflow-hidden cursor-pointer ${selectMode && selectedBooks.includes(book.id)
                    ? 'filter saturate-[1] brightness-[0.8] contrast-[1.8]'
                    : ''
                    }`}
                  style={{ top, left }}
                >
                  <BookVisual
                    title={book.title}
                    titleColor={book.textColor}
                    spineColor={book.coverColor}
                  />
                </div>
              );
            });
          })}


          {currentPage > 0 && (
            <div
              className="absolute ml-[20px]"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <img
                src="/images/img_prev_shelf.svg"
                alt="Prev Shelf"
                className="w-[18px] h-[33px] cursor-pointer hover:translate-x-[2px] transition-transform duration-300 hover:scale-110 active:scale-90"
              />
            </div>
          )}

          {currentPage < totalPages - 1 && (
            <div
              className="absolute ml-[1420px]"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <img
                src="/images/img_next_shelf.svg"
                alt="Next Shelf"
                className="w-[18px] h-[33px] cursor-pointer hover:translate-x-[2px] transition-transform duration-300 hover:scale-110 active:scale-90"
              />
            </div>
          )}
        </div>
      </div>
    </main >
  );
};

export default HomePage;

