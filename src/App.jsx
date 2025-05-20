import React, { useState, useEffect, useRef, useCallback } from "react";
import ImageCanvas from "./components/ImageCanvas";
import FilterSlider from "./components/FilterSlider";
import PresetFilters from "./components/PresetFilters";

const DEFAULT_FILTERS = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  hueRotate: 0,
  blur: 0,
};

const FILTER_STEPS = {
  brightness: 5,
  contrast: 5,
  saturation: 5,
  grayscale: 5,
  sepia: 5,
  invert: 5,
  hueRotate: 5,
  blur: 0.2,
  zoom: 0.1,
  rotate: 5,
};

const App = () => {
  // Theme state
  const [theme, setTheme] = useState("dark");
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imageRef = useRef(null);
  const [showBefore, setShowBefore] = useState(false);

  const [image, setImage] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // URL upload states
  const [imageUrl, setImageUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  // History states
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Drag & Drop states
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Download format state
  const [downloadFormat, setDownloadFormat] = useState("png");

  // Theme effect
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.background = "#1e1e1e";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.background = "#f4f4f4";
    }
  }, [theme]);

  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
    setZoom(1);
    setRotate(0);
    setHistory([DEFAULT_FILTERS]);
    setHistoryStep(0);
  }, [image]);

  const updateFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    if (JSON.stringify(updated) !== JSON.stringify(filters)) {
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(updated);
      setHistory(newHistory);
      setHistoryStep(historyStep + 1);
      setFilters(updated);
    }
  };

  // Download filtered image only
  const handleDownload = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    const scale = 2;
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;
    const ctx = canvas.getContext("2d");

    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      invert(${filters.invert}%)
      hue-rotate(${filters.hueRotate}deg)
      blur(${filters.blur}px)
    `;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2,
      img.naturalWidth,
      img.naturalHeight
    );
    ctx.restore();

    const link = document.createElement("a");
    link.download = `edited-image.${downloadFormat}`;
    if (downloadFormat === "jpg" || downloadFormat === "jpeg") {
      link.href = canvas.toDataURL("image/jpeg", 0.95);
    } else {
      link.href = canvas.toDataURL("image/png");
    }
    link.click();
  };

  // Handle file input (from button or drop)
  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file.");
      return;
    }
    setImage(URL.createObjectURL(file));
    setUploadError("");
  };

  // Button select
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  // Upload from URL
  const handleUrlUpload = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setUrlError("Please enter an image URL.");
      return;
    }
    // Basic image URL validation
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(imageUrl.trim())) {
      setUrlError("Please enter a valid image URL (jpg, png, webp, gif).");
      return;
    }
    setImage(imageUrl.trim());
    setUrlError("");
  };

  // Drag & Drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      e.type === "dragenter" ||
      e.type === "dragleave" ||
      e.type === "dragover"
    )
      setDragActive(e.type !== "dragleave");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setFilters(history[newStep]);
      setHistoryStep(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setFilters(history[newStep]);
      setHistoryStep(newStep);
    }
  };

  // Upload area ref for keyboard accessibility
  const uploadRef = useRef();

  // Reset all
  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setZoom(1);
    setRotate(0);
    setHistory([DEFAULT_FILTERS]);
    setHistoryStep(0);
  };

  // Filter increment/decrement handlers
  const handleFilterStep = (filter, dir) => {
    if (filter === "zoom") {
      setZoom((z) => {
        let next = +(z + FILTER_STEPS.zoom * dir).toFixed(2);
        if (next < 0.5) next = 0.5;
        if (next > 3) next = 3;
        return next;
      });
    } else if (filter === "rotate") {
      setRotate((r) => {
        let next = r + FILTER_STEPS.rotate * dir;
        if (next < -180) next = -180;
        if (next > 180) next = 180;
        return next;
      });
    } else {
      let min = 0,
        max = 200;
      if (filter === "grayscale" || filter === "sepia" || filter === "invert")
        max = 100;
      if (filter === "hueRotate") max = 360;
      if (filter === "blur") max = 10;
      let next = filters[filter] + FILTER_STEPS[filter] * dir;
      if (next < min) next = min;
      if (next > max) next = max;
      updateFilters({ [filter]: +next.toFixed(2) });
    }
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-[#1e1e1e] text-white"
          : "bg-[#f4f4f4] text-[#222]"
      } min-h-screen flex flex-col md:flex-row gap-8 font-sans transition-all duration-300`}
    >
      {/* Control Panel */}
      <div
        className={`p-8 rounded-3xl shadow-lg w-full md:w-1/3 flex flex-col gap-6 ${
          theme === "dark" ? "bg-[#2a2a2a] text-white" : "bg-white text-[#222]"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h1
            className={`text-2xl font-bold tracking-tight ${
              theme === "dark" ? "text-[#ff4c4c]" : "text-[#ff4c4c]"
            }`}
          >
            Image Editor
          </h1>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`px-4 py-2 rounded-lg font-semibold border transition ${
              theme === "dark"
                ? "bg-[#232323] text-[#00bcd4] border-[#00bcd4] hover:bg-[#00bcd4] hover:text-white"
                : "bg-[#e0e0e0] text-[#ff4c4c] border-[#ff4c4c] hover:bg-[#ff4c4c] hover:text-white"
            }`}
            aria-label="Toggle dark/light mode"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        {/* Upload from URL */}
        <form onSubmit={handleUrlUpload} className="mb-2 flex gap-2">
          <input
            type="text"
            placeholder="Paste image URL (jpg, png, webp, gif)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none ${
              theme === "dark"
                ? "bg-[#232323] text-[#cccccc] border-[#444] focus:border-[#00bcd4]"
                : "bg-[#f4f4f4] text-[#222] border-[#bbb] focus:border-[#ff4c4c]"
            }`}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              theme === "dark"
                ? "bg-[#00bcd4] text-white hover:bg-[#ff4c4c]"
                : "bg-[#ff4c4c] text-white hover:bg-[#00bcd4]"
            }`}
          >
            Load URL
          </button>
        </form>
        {urlError && (
          <div
            className={`text-xs mb-2 ${
              theme === "dark" ? "text-[#ff4c4c]" : "text-[#ff4c4c]"
            }`}
          >
            {urlError}
          </div>
        )}
        {/* Upload Area */}
        <form
          className={`relative mb-4 w-full`}
          onDragEnter={handleDrag}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={uploadRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="upload-input"
          />
          <label
            htmlFor="upload-input"
            className={`flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed rounded-xl px-6 py-6 transition
    ${
      dragActive
        ? theme === "dark"
          ? "border-[#00bcd4] bg-[#23272b]"
          : "border-[#ff4c4c] bg-[#f9eaea]"
        : theme === "dark"
        ? "border-[#444] bg-[#232323]"
        : "border-[#bbb] bg-[#f4f4f4]"
    }
    ${
      theme === "dark"
        ? "hover:border-[#00bcd4] hover:bg-[#23272b]"
        : "hover:border-[#ff4c4c] hover:bg-[#f9eaea]"
    }
  `}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") uploadRef.current.click();
            }}
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
          >
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
              <path
                fill={dragActive ? "#00bcd4" : "#ff4c4c"}
                d="M12 16v-8m0 0-3.5 3.5M12 8l3.5 3.5M20 16.5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-.5a4.5 4.5 0 0 1 2.5-4.04M16 16.5a4.5 4.5 0 0 0-8 0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className={`${
                theme === "dark" ? "text-[#cccccc]" : "text-[#222]"
              } text-base font-medium`}
            >
              {dragActive
                ? "Drop your image here..."
                : "Drag & drop an image here"}
            </span>
            <span
              className={`${
                theme === "dark" ? "text-[#00bcd4]" : "text-[#ff4c4c]"
              } text-sm font-semibold`}
            >
              or
            </span>
            <span>
              <span
                className={`inline-block px-5 py-2 rounded-lg font-semibold shadow transition ${
                  theme === "dark"
                    ? "bg-[#ff4c4c] hover:bg-[#00bcd4] text-white"
                    : "bg-[#00bcd4] hover:bg-[#ff4c4c] text-white"
                }`}
              >
                Choose Image
              </span>
            </span>
            {uploadError && (
              <span
                className={`text-xs mt-2 ${
                  theme === "dark" ? "text-[#ff4c4c]" : "text-[#ff4c4c]"
                }`}
              >
                {uploadError}
              </span>
            )}
          </label>
        </form>
        <div className="flex flex-col gap-2">
          {[
            { label: "Brightness", key: "brightness", min: 0, max: 200 },
            { label: "Contrast", key: "contrast", min: 0, max: 200 },
            { label: "Saturation", key: "saturation", min: 0, max: 200 },
            { label: "Grayscale", key: "grayscale", min: 0, max: 100 },
            { label: "Sepia", key: "sepia", min: 0, max: 100 },
            { label: "Invert", key: "invert", min: 0, max: 100 },
            { label: "Hue Rotate", key: "hueRotate", min: 0, max: 360 },
            { label: "Blur", key: "blur", min: 0, max: 10 },
            {
              label: "Zoom",
              key: "zoom",
              min: 0.5,
              max: 3,
              step: 0.1,
              isZoom: true,
            },
            {
              label: "Rotate",
              key: "rotate",
              min: -180,
              max: 180,
              isRotate: true,
            },
          ].map((f) => (
            <div key={f.key} className="flex items-center gap-2">
              <button
                type="button"
                className={`border rounded px-2 py-0.5 font-bold text-lg transition ${
                  theme === "dark"
                    ? "bg-[#232323] border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-white"
                    : "bg-[#f4f4f4] border-[#ff4c4c] text-[#ff4c4c] hover:bg-[#ff4c4c] hover:text-white"
                }`}
                onClick={() => handleFilterStep(f.key, -1)}
                tabIndex={-1}
              >
                -
              </button>
              <div className="flex-1">
                <FilterSlider
                  label={f.label}
                  min={f.min}
                  max={f.max}
                  value={f.isZoom ? zoom : f.isRotate ? rotate : filters[f.key]}
                  onChange={
                    f.isZoom
                      ? setZoom
                      : f.isRotate
                      ? setRotate
                      : (val) => updateFilters({ [f.key]: val })
                  }
                  step={f.step || (f.isZoom ? 0.1 : 1)}
                  theme={theme}
                />
              </div>
              <button
                type="button"
                className={`border rounded px-2 py-0.5 font-bold text-lg transition ${
                  theme === "dark"
                    ? "bg-[#232323] border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-white"
                    : "bg-[#f4f4f4] border-[#ff4c4c] text-[#ff4c4c] hover:bg-[#ff4c4c] hover:text-white"
                }`}
                onClick={() => handleFilterStep(f.key, 1)}
                tabIndex={-1}
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Image Display + Controls */}

      <div
        className={`flex-1 flex flex-col items-center rounded-3xl shadow-lg p-8 min-h-[600px] ${
          theme === "dark" ? "bg-[#2a2a2a] text-white" : "bg-white text-[#222]"
        }`}
      >
        <div className="w-full flex mt-10 flex-col items-center gap-2">
          <ImageCanvas
            image={image}
            filters={filters}
            imageRef={imageRef}
            zoom={zoom}
            rotate={rotate}
            showBefore={showBefore}
            canvasHeight={560}
            theme={theme}
          />
          {/* Controls under image */}
          <div className="w-full max-w-xl mt-8 flex flex-col gap-3">
            <PresetFilters onApply={updateFilters} />
            <div className="flex gap-4 flex-wrap justify-center items-center">
              <button
                disabled={historyStep <= 0}
                onClick={undo}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                  historyStep <= 0
                    ? theme === "dark"
                      ? "bg-[#333] text-[#666] cursor-not-allowed"
                      : "bg-[#eee] text-[#bbb] cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-[#ff4c4c] hover:bg-[#00bcd4] text-white"
                    : "bg-[#00bcd4] hover:bg-[#ff4c4c] text-white"
                }`}
              >
                Undo
              </button>
              <button
                disabled={historyStep >= history.length - 1}
                onClick={redo}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                  historyStep >= history.length - 1
                    ? theme === "dark"
                      ? "bg-[#333] text-[#666] cursor-not-allowed"
                      : "bg-[#eee] text-[#bbb] cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-[#00bcd4] hover:bg-[#ff4c4c] text-white"
                    : "bg-[#ff4c4c] hover:bg-[#00bcd4] text-white"
                }`}
              >
                Redo
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  theme === "dark"
                    ? "bg-[#00bcd4] text-white hover:bg-[#ff4c4c]"
                    : "bg-[#ff4c4c] text-white hover:bg-[#00bcd4]"
                }`}
                onClick={handleReset}
              >
                Reset
              </button>
              {/* Download format select */}
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className={`rounded px-3 py-2 font-semibold focus:outline-none border transition ${
                  theme === "dark"
                    ? "bg-[#232323] border-[#00bcd4] text-[#00bcd4]"
                    : "bg-[#f4f4f4] border-[#ff4c4c] text-[#ff4c4c]"
                }`}
                style={{ minWidth: 90 }}
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  theme === "dark"
                    ? "bg-[#ff4c4c] text-white hover:bg-[#00bcd4]"
                    : "bg-[#00bcd4] text-white hover:bg-[#ff4c4c]"
                }`}
                onClick={handleDownload}
              >
                Download
              </button>
              <button
                className={`border px-4 py-2 rounded-lg font-semibold transition ${
                  theme === "dark"
                    ? "bg-[#2a2a2a] border-[#ff4c4c] text-[#ff4c4c] hover:bg-[#ff4c4c] hover:text-white"
                    : "bg-white border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-white"
                }`}
                onClick={() => setShowBefore((prev) => !prev)}
              >
                {showBefore ? "Show After" : "Show Before"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
