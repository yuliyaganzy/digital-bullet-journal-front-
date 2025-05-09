import React, { useState } from 'react';

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

  return (
    <main className="bg-[#EBDCCB] flex flex-row justify-center w-full h-full">
      {/* Blur overlay when in select mode */}
      {selectMode && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#EBDCCB] opacity-40 z-[150] pointer-events-none mix-blend-normal"></div>
      )}
      <div className="bg-[#EBDCCB] overflow-hidden w-[1440px] h-[1024px]">
        <div className="relative w-[1440px] h-[1024px] flex flex-row justify-center items-center">
          <div className="relative w-full h-full top-0 left-0 bg-diaryauthcover-2">
            <header className="absolute flex items-center w-full h-[72px] top-0 left-0 bg-transparent z-[160]">
              <h1 className="absolute left-[644px] font-['Americana_BT'] font-[400] text-[#2a2a2a] text-[36px]">My Shelf</h1>
              <div
                className="absolute w-[18px] h-[18px] left-[1340px] cursor-pointer"
                onClick={() => {
                  if (selectMode) {
                    if (selectedBooks.length > 0) {
                      setConfirmDeleteId("multiple"); // Показати діалог
                    }
                  } else {
                    handleAddBook();
                  }
                }}
              >
                <img
                  src={selectMode ? "/images/img_delete_book.svg" : "/images/img_add_book.svg"}
                  alt="Action"
                  className="relative w-[18px] h-[18px] -left-px active:scale-90 transition-transform duration-100"
                />
              </div>

              {selectMode && (
                <button
                  className="absolute left-[1200px] px-[24px] py-[8px] border-3 border-[#c3dee1] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#c3dee1] active:scale-95"
                  onClick={() => {
                    setSelectMode(false);
                    setSelectedBooks([]);
                  }}
                >
                  <span className="text-[20px] font-[400] font-normal font-montserrat text-[#2a2a2a]">Done</span>
                </button>
              )}

              <div
                className="absolute w-[20px] h-[18px] left-[1390px] cursor-pointer"
                onClick={toggleMenu}
              >
                <img src="/images/img_menu.svg" alt="Menu" className="relative w-[20px] h-[18px] -left-px active:scale-90 transition-transform duration-100" />
              </div>

              {menuOpen && (
                <div className="absolute right-[12px] top-[72px] z-[100]" onMouseLeave={() => setMenuOpen(false)}>
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

          {confirmDeleteId !== null && (
            <div className="absolute w-[300px] h-[150px] flex justify-center bg-[#c3dee1] rounded-[10px] shadow-lg bg-opacity-50 z-[200]"
                 style={{ boxShadow: "-8px 8px 30px 4px rgba(0, 0, 0, 0.4)" }}>
              <div className="text-center text-[#2a2a2a]">
                <p className="text-[20px] font-[600] py-[12px] font-montserrat">Are you sure?</p>
                <hr className="border-[#2a2a2a] w-[252px] mx-auto" />
                <div className="flex justify-center gap-x-20px">
                  <button onClick={handleConfirmDelete} className="left-[20px] text-[20px] font-[400] font-montserrat hover:bg-red-600 cursor-pointer">Yes</button>
                  <button onClick={handleCancelDelete} className="text-[20px] font-[400] font-montserrat hover:bg-gray-400 cursor-pointer">No</button>
                </div>
              </div>
            </div>
          )}

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

