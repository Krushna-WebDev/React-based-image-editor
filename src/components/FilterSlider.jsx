import React from "react";

const FilterSlider = ({ label, min, max, value, onChange, step = 1, theme = "dark" }) => {
  return (
    <div>
      <label className={`block mb-1 font-medium ${theme === "dark" ? "text-[#cccccc]" : "text-[#222]"}`}>
        {label}:{" "}
        <span
          className={theme === "dark" ? "text-[#00bcd4]" : "text-[#222]"}
        >
          {value}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${theme === "dark" ? "accent-[#00bcd4]" : "accent-[#ff4c4c]"}`}
      />
    </div>
  );
};

export default FilterSlider;