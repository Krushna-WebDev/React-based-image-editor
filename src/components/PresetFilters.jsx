import React from "react";

const presets = {
  Warm: {
    brightness: 110,
    contrast: 105,
    saturation: 120,
    grayscale: 0,
    sepia: 30,
    invert: 0,
    hueRotate: 10,
    blur: 0,
  },
  BlackWhite: {
    brightness: 100,
    contrast: 100,
    saturation: 0,
    grayscale: 100,
    sepia: 0,
    invert: 0,
    hueRotate: 0,
    blur: 0,
  },
  Vintage: {
    brightness: 95,
    contrast: 90,
    saturation: 80,
    grayscale: 10,
    sepia: 40,
    invert: 0,
    hueRotate: 15,
    blur: 0.5,
  },
  CoolBlue: {
    brightness: 105,
    contrast: 110,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    hueRotate: 180,
    blur: 0,
  },
};

const PresetFilters = ({ onApply }) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2 text-[#ff4c4c]">Presets</h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(presets).map(([name, settings]) => (
          <button
            key={name}
            className="bg-[#00bcd4] hover:bg-[#ff4c4c] text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
            onClick={() => onApply(settings)}
          >
            {name.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetFilters;