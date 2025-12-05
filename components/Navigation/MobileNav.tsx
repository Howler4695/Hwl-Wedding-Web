"use client";
import { useState } from "react";
import { NavLinks } from "./NavLinks";

export const MobileNavButton = ({ edit }: { edit: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="bg-hannah-pink w-14 h-14 rounded-full flex flex-col gap-1 items-center justify-center shadow-2xl border border-pink-200"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`hamburger-bar ${
            open ? "rotate-45 translate-y-[6px]" : ""
          }`}
        />
        <span
          className={`hamburger-bar ${open ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`hamburger-bar ${
            open ? "-rotate-45 -translate-y-[6px]" : ""
          }`}
        />
      </button>

      <div
        className={`
    fixed inset-0 z-50 h-screen overflow-y-auto bg-pink-400/50 backdrop-blur-xl
    transform transition-transform duration-300 ease-in-out
    ${open ? "translate-y-0" : "-translate-y-full"}
    sm:hidden 
  `}
      >
        <div className="font-heading font-bold text-xl sm:text-2xl text-white px-4 pt-7">
          Hannah & Hayden&apos;s Wedding
        </div>
        <nav className="mt-20 flex flex-col items-center gap-6 text-xl">
          <NavLinks edit={edit} onNav={() => setOpen(!open)} />
        </nav>
      </div>
    </>
  );
};
