import React, { useEffect, useRef, useState } from "react";

export default function SimpleDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="dropdown" ref={wrapperRef}>
      <div
        className="dropdown__trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selected?.label}</span>
      </div>

      {open && (
        <div className="dropdown__menu">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`dropdown__item ${
                value === opt.value ? "active" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}