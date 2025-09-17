"use client";

export default function AddCalenderButton() {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        alert("Hook this up to an .ics download or Google Calendar link.");
      }}
      className="inline-flex items-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 text-[#6B725E] font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
    >
      Add to Calendar
    </a>
  );
}
