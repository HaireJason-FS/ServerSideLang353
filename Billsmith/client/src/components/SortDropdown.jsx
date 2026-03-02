import React, { useEffect, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function SortDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getIcon(val) {
    return val?.startsWith("-") ? (
      <FaArrowDown className="sortIcon down" />
    ) : (
      <FaArrowUp className="sortIcon up" />
    );
  }

  return (
    <div className="dropdown" ref={wrapperRef}>
      <div
        className="dropdown__trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selected?.label}</span>
        {getIcon(value)}
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
              <span>{opt.label}</span>
              {getIcon(opt.value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}