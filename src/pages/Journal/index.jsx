import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Journal = () => {
    const { id } = useParams();
    const location = useLocation();
    const book = location.state?.book;

    const [isOpened, setIsOpened] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const [page, setPage] = useState(1);
    const [scale, setScale] = useState(1);
    const [activeTool, setActiveTool] = useState("move");

    const tools = [
        { icon: "img_move_tool.svg", name: "move" },
        { icon: "img_text_tool.svg", name: "text" },
        { icon: "img_draw_tool.svg", name: "draw" },
        { icon: "img_form_tool.svg", name: "form" },
        { icon: "img_calendar_tool.svg", name: "calendar" },
        { icon: "img_bookmark_tool.svg", name: "tracker" },
        { icon: "img_template_tool.svg", name: "template" },
    ];

    if (!book) {
        return <div className="p-10 text-red-500 text-xl">Book not found or no data passed.</div>;
    }

    useEffect(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                setScale((prev) => {
                    let newScale = prev - e.deltaY * 0.001;
                    newScale = Math.min(Math.max(newScale, 0.2), 3); // Межі масштабу
                    return newScale;
                });
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => window.removeEventListener("wheel", handleWheel);
    }, []);

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
                            boxShadow:
                                "inset -1px 0px 2px rgba(0, 0, 0, 0.25), inset 2px 0px 2px rgba(0, 0, 0, 0.25)",
                        }}
                    ></div>

                    {/* Обкладинка */}
                    <div
                        className={`relative w-full h-full flex items-center justify-center text-center transition-transform duration-700 ease-in-out
                                  ${isOpening ? 'rotate-y-90 -translate-x-[300px] opacity-0' : ''}
                                  `}
                        style={{
                            backgroundColor: book.coverColor,
                            boxShadow:
                                "6px 0px 12px 4px rgba(0, 0, 0, 0.3), inset -4px 0px 4px rgba(0, 0, 0, 0.25), 0px 12px 12px rgba(0, 0, 0, 0.25), inset 4px 0px 4px rgba(0, 0, 0, 0.25)",
                            borderRadius: "0px 20px 20px 0px",
                            transform: isOpening
                                ? "perspective(1000px) rotateY(-90deg) translateX(-300px)"
                                : "none",
                            opacity: isOpening ? 0 : 1,
                            transition: "transform 0.7s ease-in-out, opacity 0.5s ease-in-out",
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
                                setIsOpening(true); // запустити анімацію
                                setTimeout(() => {
                                    setIsOpened(true); // після анімації — відкрити щоденник
                                    setIsOpening(false); // (не обов’язково, тільки якщо залишаємо обкладинку для іншого переходу)
                                }, 1000); // тривалість має відповідати CSS transition
                            }}
                            className="absolute flex right-[0px] bottom-[0px] w-[100px] h-[100px] z-10"
                        >
                            <div
                                className="w-full h-full duration-300 opacity-0 hover:opacity-20 rounded-br-[38px] rounded-tl-[200px] cursor-pointer"
                                style={{ backgroundColor: book.textColor }}
                            ></div>
                        </button>

                        {/* Стрілка */}
                        <svg width="158" height="228" viewBox="0 0 158 228" fill="none" xmlns="http://www.w3.org/2000/svg"
                            className="absolute flex right-[60px] bottom-[90px] w-[80px] h-auto z-10 pointer-events-none animate-pulse-arrow">
                            <path d="M88.6917 204.434C89.0667 205.869 87.1356 206.537 85.0933 204.965C75.0784 197.247 69.5279 192.44 64.6219 181.532C60.5588 172.494 58.8751 160.859 62.416 150.699C64.5712 144.513 57.417 143.473 53.1622 117.854C47.9042 86.2136 58.8694 62.2858 60.607 45.3386C62.458 27.2836 56.1738 15.3178 54.8494 11.3503C53.2754 6.63031 50.6118 6.04964 50.2542 1.80983C50.1309 0.354555 51.3738 -0.115157 52.6886 0.644668C56.4057 2.7949 61.5179 11.3412 63.4156 16.7873C70.1041 36 68.806 46.6413 63.8513 67.42C57.2905 94.9394 58.6604 115.559 63.2947 132.375C64.0961 135.281 65.1986 138.132 66.1805 141.005C66.9141 143.148 69.1185 134.849 78.7617 132.093C92.3531 128.207 103.299 135.743 105.266 144.868C109.076 162.519 86.4327 171.801 70.6611 157.197C70.0008 156.587 69.3444 155.975 68.6848 155.363C67.6641 156.05 67.8806 157.175 67.7367 158.122C66.8909 163.654 67.4603 169.186 68.8828 174.722C72.839 190.059 88.2293 202.663 88.6917 204.434ZM93.0036 159.357C105.77 155.354 101 138.046 89.9086 136.884C80.8774 135.935 75.3968 140.789 71.2129 147.789C70.6592 148.714 70.8127 149.554 71.455 150.396C73.8625 153.563 76.5396 156.477 80.3735 158.35C84.5807 160.405 88.8159 161.061 93.0036 159.357Z" fill={book.textColor} />
                            <path d="M102.845 196.103C104.185 200.854 103.139 195.485 108.058 220.32C109.34 226.787 103.341 227.558 96.5803 225.13C88.4107 222.195 79.5754 220.039 76.3254 216.343C75.6953 215.626 75.9102 214.652 76.7396 214.174C77.7422 213.599 78.7127 213.232 81.795 213.987C96.768 217.652 101.224 220.636 101.093 218.729C100.938 216.501 98.1118 203.382 97.9353 197.377C97.8132 193.274 100.505 193.298 101.813 194.623C102.225 195.039 102.485 195.575 102.845 196.103Z" fill={book.textColor} />
                        </svg>
                    </div>
                </div>
            )}

            {/* Відкритий щоденник + інструменти */}
            {isOpened && (
                <>
                    {/* Панель інструментів */}
                    <div className="fixed right-[40px] z-50 flex flex-col items-center py-[28px] px-[8px] gap-[18px] bg-[#C3DEE1] rounded-[16px] shadow-[ -4px_4px_10px_rgba(0,0,0,0.25)]">
                        {tools.map((tool) => (
                            <button
                                key={tool.name}
                                onClick={() => setActiveTool(tool.name)}
                                className={`flex justify-center items-center rounded-[12px] transition-all duration-200 cursor-pointer        
                                    ${activeTool === tool.name
                                        ? "bg-[#93C9CF]"
                                        : "hover:bg-[#AED0D4]"
                                    }`}
                                style={{
                                    width: "46px",
                                    height: "46px",
                                    padding: "10px",
                                }}
                            >
                                <img
                                    src={`/images/${tool.icon}`}
                                    alt={tool.name}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Підпис сторінки */}
                    <div className="fixed left-[0px] bottom-[0px] z-50 flex justify-center items-center"
                        style={{
                            padding: "18px 24px",
                            background: "#C3DEE1",
                            borderRadius: "10px 10px 0px 0px",
                            fontFamily: 'Montserrat',
                            fontSize: 20,
                            lineHeight: '24px',
                            color: '#2A2A2A'
                        }}>
                        {page}/{book.pageCount}
                    </div>

                    {/* Пагінація з іконками */}
                    <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50 flex gap-[32px]">
                        <button
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="w-[48px] h-[48px] flex items-center justify-center bg-[#C3DEE1] rounded-full disabled:opacity-40"
                        >
                            <img
                                src="/images/img_prev_shelf.svg"
                                alt="Previous"
                                className="w-[24px] h-[24px]"
                            />
                        </button>

                        <button
                            onClick={() => setPage((prev) => Math.min(book.pageCount, prev + 1))}
                            disabled={page === book.pageCount}
                            className="w-[48px] h-[48px] flex items-center justify-center bg-[#C3DEE1] rounded-full disabled:opacity-40"
                        >
                            <img
                                src="/images/img_next_shelf.svg"
                                alt="Next"
                                className="w-[24px] h-[24px]"
                            />
                        </button>
                    </div>


                    {/* Контейнер редактора */}
                    <div className="w-full h-full overflow-auto bg-[#ebdccb]">
                        {/* Wrapper з padding — створює простір з усіх боків */}
                        <div
                            style={{
                                padding: "60px", // рівномірний padding з усіх боків
                                boxSizing: "border-box",
                                minWidth: `${1280 * scale + 120}px`, // + padding left + right
                                minHeight: `${864 * scale + 120}px`, // + padding top + bottom
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "1280px",
                                    height: "864px",
                                    transform: `scale(${scale})`,
                                    transformOrigin: "center center",
                                    transition: "transform 0.2s ease-out",
                                    display: "flex",
                                }}
                            >
                                {/* Left Page */}
                                <div className="relative w-[640px] h-[864px] flex flex-col items-center justify-center rounded-l-[20px] overflow-hidden bg-[#f9f9f9]"
                                    style={{
                                        boxShadow: "-1px 4px 12px 4px rgba(0, 0, 0, 0.3)",
                                    }}>
                                    <div className="p-4">{`Розворот ${page} — Left`}</div>
                                </div>

                                {/* Right Page */}
                                <div className="relative w-[640px] h-[864px] flex flex-col items-center justify-center rounded-r-[20px] bg-[#f9f9f9]"
                                    style={{
                                        boxShadow:
                                            "-6px 0px 20px rgba(0, 0, 0, 0.25), 4px 4px 12px 4px rgba(0, 0, 0, 0.3), inset 4px 0px 4px rgba(0, 0, 0, 0.25)",
                                    }}>
                                    <div className="p-4 text-xl text-gray-600">{`Розворот ${page} — Right`}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            )}
        </div>
    );
};

export default Journal;
