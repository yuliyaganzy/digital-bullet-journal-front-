import React, { useState, useEffect } from 'react';

export const HomePage = () => {
  const booksPerShelf = 19;
  const shelvesPerPage = 3;
  const booksPerPage = booksPerShelf * shelvesPerPage;
  const shelfTops = [371, 72, 670]; // средняя, верхняя, нижняя

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const menuItems = [
    "New Journal",
    "New Shelf",
    "Decorate Shelf",
    "Select Object",
    "Delete Object"
  ];

  const [books, setBooks] = useState([
    { id: 1, title: "Medicine" },
  ]);

  const [currentPage, setCurrentPage] = useState(0);
  const [shelfCount, setShelfCount] = useState(1);

  const currentBooks = books.slice(
    currentPage * booksPerPage,
    (currentPage + 1) * booksPerPage
  );

  const handleAddBook = () => {
    const newBook = {
      id: books.length + 1,
      title: `Book ${books.length + 1}`,
    };
    setBooks([...books, newBook]);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId === "multiple") {
      setBooks(books.filter(book => !selectedBooks.includes(book.id)));
      setSelectedBooks([]);
    } else if (confirmDeleteId !== null) {
      setBooks(books.filter(book => book.id !== confirmDeleteId));
    }
    setConfirmDeleteId(null);
    setDeleteMode(false); // ⬅ вимикаємо режим видалення
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case "New Journal":
        handleAddBook();
        console.log("Створення нового журналу");
        break;
      case "New Shelf":
        console.log("Створення нової полки");
        break;
      case "Decorate Shelf":
        console.log("Оформлення полки");
        break;
      case "Select Object":
        setSelectMode(true);
        setDeleteMode(false);
        console.log("Вибір об'єкту");
        break;
      case "Delete Object":
        setDeleteMode(true);
        setSelectMode(false);
        console.log("Видалення об'єкту");
        break;
      default:
        console.log(`${action} не реалізовано`);
    }
    setMenuOpen(false); // скриваємо меню післе дії
  };

  const totalPages = Math.ceil(books.length / booksPerPage);
  const shelvesToRender = [...Array(shelfCount * shelvesPerPage)].map((_, index) => (
    <img
      key={index}
      src="/images/img_shelf.svg"
      alt="Shelf"
      className="absolute w-[1321px] h-[115px]"
      style={{ top: `${225 + index * 299}px`, left: "59px" }}
    />
  ));

  const handleBookClick = (bookId) => {
    if (selectMode) {
      setSelectedBooks(prev =>
        prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
      );
    } else if (deleteMode) {
      setConfirmDeleteId(bookId);
    }
  };

  const [animateIn, setAnimateIn] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (deleteMode) {
      setVisible(true); // Элемент появляется в DOM
      setAnimateIn(false); // Начинаем с невидимого состояния

      // Для анимации появления даем время на рендеринг, затем запускаем анимацию
      const timeout = setTimeout(() => {
        setAnimateIn(true); // Плавно показываем элемент
      }, 10); // Маленькая задержка для того, чтобы успел произойти рендер

      return () => clearTimeout(timeout);
    } else {
      setAnimateIn(false); // Начинаем анимацию исчезновения

      // Убираем элемент из DOM после окончания анимации
      const timeout = setTimeout(() => {
        setVisible(false); // Убираем элемент из DOM после исчезновения
      }, 700); // Задержка, равная времени анимации исчезновения

      return () => clearTimeout(timeout);
    }
  }, [deleteMode]);

  return (
    <main className="relative bg-[#EBDCCB] flex flex-row justify-center w-full h-full">
      {/* Blur overlay when in select mode */}
      {selectMode && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#EBDCCB] opacity-40 z-[150] pointer-events-none mix-blend-normal"></div>
      )}
      {confirmDeleteId !== null && (
        <div className="absolute w-full h-full flex justify-center items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[#2a2a2a] opacity-40 z-[200] pointer-events-none mix-blend-normal"></div>
          <div className="absolute w-[252px] h-[101px] flex justify-center bg-[#c3dee1] rounded-[10px] z-[200]"
            style={{ boxShadow: "-10px 10px 30px 4px rgba(0, 0, 0, 0.4)" }}>
            <div className="text-center text-[#2a2a2a]">
              <p className="text-[20px] font-[600] py-[8px] font-montserrat">Are you sure?</p>
              <hr className="border-[#2a2a2a] w-[252px] mx-auto" />
              <div className="flex w-full text-[#2a2a2a] text-sm font-montserrat text-[20px] font-[300]">
                <button
                  onClick={handleConfirmDelete}
                  className="w-1/2 py-[12px] hover:bg-[#a9d1d4] hover:rounded-bl-[10px] cursor-pointer text-center"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="w-1/2 py-[12px] hover:bg-[#a9d1d4] hover:rounded-br-[10px] cursor-pointer text-center"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-[1440px] h-[1024px]">
        <div className="absolute w-[1440px] h-[1024px] flex flex-row justify-center items-center">
          <div className="absolute w-full h-full top-0 left-0">

            {visible && (
              <div
                className={`fixed top-0 left-[1250px] w-full flex transform transition-transform duration-700 ease-out ${animateIn ? 'translate-y-0' : '-translate-y-full'}`}
              >
                <div className="px-[24px] py-[18px] rounded-b-[10px] bg-[#c3dee1] text-[20px] font-[400] font-normal font-montserrat text-[#2a2a2a] shadow-md">
                  Select an object to delete
                </div>
              </div>
            )}

            <header className="absolute flex items-center justify-center w-full h-[72px] top-0 left-0 bg-transparent z-[160]">
              <h1 className="font-['Americana_BT'] font-[400] text-[#2a2a2a] text-[36px]">My Shelf</h1>

              <div className="absolute right-[48px] flex items-center gap-[32px]">
                {/* Done button */}
                {selectMode && (
                  <button
                    className="px-[24px] py-[8px] border-3 border-[#c3dee1] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#c3dee1] active:scale-95"
                    onClick={() => {
                      setSelectMode(false);
                      setSelectedBooks([]);
                    }}
                  >
                    <span className="text-[20px] font-[400] font-normal font-montserrat text-[#2a2a2a]">Done</span>
                  </button>
                )}

                {/* Add/Delete Icon */}
                <div
                  className="relative flex w-[18px] h-[18px] cursor-pointer group"
                  onClick={() => {
                    if (selectMode && selectedBooks.length === 0) return;
                    if (selectMode) {
                      setConfirmDeleteId("multiple");
                    } else {
                      handleAddBook();
                    }
                  }}
                >
                  <img
                    src={selectMode ? "/images/img_delete_book.svg" : "/images/img_add_book.svg"}
                    alt="Action"
                    className={`w-[18px] h-[18px] transition-transform duration-100 ${selectMode && selectedBooks.length === 0 ? 'opacity-30 cursor-not-allowed' : 'active:scale-90'}`}
                  />
                  {selectMode && selectedBooks.length === 0 && (
                    <div className="absolute bottom-full mb-[4px] w-max px-[4px] bg-[#c3dee1] text-[#2a2a2a] text-[16px] font-[200] font-montserrat rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Select an object
                    </div>
                  )}
                </div>

                {/* Menu Icon */}
                <div
                  className="relative flex w-[20px] h-[18px] cursor-pointer group"
                  onClick={() => {
                    if (selectMode) return;
                    toggleMenu();
                  }}
                >
                  <img
                    src="/images/img_menu.svg"
                    alt="Menu"
                    className={`w-[18px] h-[18px] ${selectMode ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-90'}`}
                  />
                  {selectMode && (
                    <div className="absolute bottom-full mb-[4px] w-max px-[4px] bg-[#c3dee1] text-[#2a2a2a] text-[16px] font-[200] font-montserrat rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Exit Selection mode
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

          {currentBooks.map((book, index) => {
            const shelfIndex = Math.floor(index / booksPerShelf);
            const positionInShelf = index % booksPerShelf;
            const top = `${shelfTops[shelfIndex]}px`;
            const left = `${196 + positionInShelf * 52}px`;

            return (
              <div
                key={book.id}
                onClick={() => handleBookClick(book.id)}
                className={`absolute w-[85px] h-[199px] overflow-hidden cursor-pointer ${selectedBooks.includes(book.id) ? 'filter saturate-[1] brightness-[0.8] contrast-[1.8]' : ''
                  }`}
                style={{ top, left }}
              >
                <div className="relative h-[198px] top-px">
                  <img className="absolute w-[45px] h-[197px] top-0 left-0" alt="Cover1" src="/images/img_cover.svg" />
                  <img className="absolute w-[76px] h-[196px] top-0.5 left-[5px]" alt="Pages" src="/images/img_pages.svg" />
                  <img className="absolute w-10 h-[165px] top-[33px] left-0" alt="Spine" src="/images/img_spine.svg" />
                  <img className="absolute w-[45px] h-[197px] top-0 left-[39.5px]" alt="Cover2" src="/images/img_cover.svg" />
                  <img className="absolute w-1.5 h-[165px] top-[33px] left-0" alt="Shadow" src="/images/img_shadow.svg" />
                  <div className="absolute w-[42px] h-[122px] top-[54px] left-0">
                    <div className="absolute w-[122px] top-[41px] left-[-41px] -rotate-90 font-['Playfair_Display'] font-[900] text-[#d3a243] text-[28px] text-center">
                      {book.title}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {currentPage > 0 && (
            <button
              className="absolute top-[950px] left-[50px] text-3xl font-bold"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {"<"}
            </button>
          )}

          {currentPage < totalPages - 1 && (
            <button
              className="absolute top-[950px] left-[1350px] text-3xl font-bold"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {">"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;

