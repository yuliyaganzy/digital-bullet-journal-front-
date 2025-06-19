import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SelectionUpIn = () => {
  const navigate = useNavigate(); // <-- инициализация хука

  return (
    <div className="min-h-screen w-full bg-[#ebdccb] flex items-center justify-center p-4">
      <div className="w-full max-w-[1440px] max-h-[1024px] flex items-center justify-center rounded-[20px] overflow-visible">
        {/* Left Panel with Abstract Design */}
        <div
          className="relative w-[640px] h-[864px] flex rounded-l-[20px] overflow-hidden bg-[#f9f9f9]"
          style={{ boxShadow: "-1px 4px 12px 4px rgba(0, 0, 0, 0.3)" }}
        >
          <img
            src="/images/img_mask_group_hello.svg"
            alt="Abstract background"
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute w-[320px] h-[166px] top-[200px] left-[80px]">
            <h1 className="absolute text-[80px] font-normal font-['Americana_BT'] text-[#2a2a2a] leading-[93px] left-0 top-0">
              Hello,
            </h1>
            <h2 className="absolute text-[80px] font-normal font-['Americana_BT'] text-[#2a2a2a] leading-[93px] left-[90px] top-[92px]">
              Artist!
            </h2>
          </div>
        </div>

        {/* Right Panel */}
        <div
          className="relative w-[640px] h-[864px] p-10 flex flex-col items-center justify-center rounded-r-[20px] bg-[#f9f9f9]"
          style={{
            boxShadow:
              "-6px 0px 20px rgba(0, 0, 0, 0.25), 4px 4px 12px 4px rgba(0, 0, 0, 0.3), inset 4px 0px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="flex flex-col gap-y-[40px] w-[274px]">
            <button
              type="button"
              onClick={() => navigate("/signup")} // <-- переход по нажатию
              className="h-[63px] px-24 py-12 border-3 border-[#c3dee1] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#c3dee1] active:scale-95"
            >
              <span className="text-[32px] font-normal whitespace-nowrap font-montserrat text-[#2a2a2a]">
                Sign Up
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/signin")} // <-- переход по нажатию
              className="h-[63px] px-24 py-12 border-3 border-[#c3dee1] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#c3dee1] active:scale-95"
            >
              <span className="text-[32px] font-normal whitespace-nowrap font-montserrat text-[#2a2a2a]">
                Sign In
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionUpIn;
