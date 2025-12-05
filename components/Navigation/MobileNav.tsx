"use client";
import { useEffect, useState } from "react";
import { NavLinks } from "./NavLinks";

export const MobileNavButton = ({
  edit,
  showAdmin,
}: {
  edit: boolean;
  showAdmin: boolean;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [open]);

  return (
    <>
      <div className="bg-hannah-pink rounded-full">
        <button
          className={`bg-pink-500/40 w-14 h-14 rounded-full flex flex-col gap-1 items-center justify-center shadow-2xl border border-gray-600
          transition-all duration-300 z-70`}
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
      </div>

      <div
        className={`
          fixed inset-0 z-40 md:hidden 
          bg-pink-500/40 backdrop-blur-xl w-screen
          transition-[clip-path] duration-500 ease-out
          ${
            open
              ? "[clip-path:circle(150%_at_calc(100%_-_2.75rem)_2.75rem)]"
              : "[clip-path:circle(0%_at_calc(100%_-_2.75rem)_2.75rem)]"
          }
        `}
      >
        <div
          className={`
            fixed inset-0 z-50 h-screen overflow-y-auto 
            transition-opacity duration-300 delay-150
            ${open ? "opacity-100" : "opacity-0"}
            sm:hidden 
          `}
        >
          <div className="font-heading font-bold text-xl sm:text-2xl text-white px-4 pt-7">
            Hannah & Hayden&apos;s Wedding
          </div>
          <nav className="mt-20 flex flex-col items-center gap-6 text-xl">
            <NavLinks
              edit={edit}
              onNav={() => setOpen(!open)}
              showAdmin={showAdmin}
            />
          </nav>
        </div>
      </div>
    </>
  );
};
