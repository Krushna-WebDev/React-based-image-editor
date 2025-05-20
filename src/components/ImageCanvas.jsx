import React, { useState } from "react";

const ImageCanvas = ({ image, filters, imageRef, zoom, rotate, showBefore,canvasHeight = 440, theme = "dark"}) => {
  const [slider, setSlider] = useState(50);

  const {
    brightness,
    contrast,
    saturation,
    grayscale,
    sepia,
    invert,
    hueRotate,
    blur,
  } = filters;

  const baseStyle = {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    transform: `scale(${zoom}) rotate(${rotate}deg)`,
    transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
    boxShadow: "0 4px 24px 0 rgba(0,0,0,0.25)",
    display: "block",
    margin: "auto",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const filterStyle = {
    ...baseStyle,
    filter: `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      grayscale(${grayscale}%)
      sepia(${sepia}%)
      invert(${invert}%)
      hue-rotate(${hueRotate}deg)
      blur(${blur}px)
    `,
    clipPath: `inset(0 ${100 - slider}% 0 0)`,
    zIndex: 2,
  };

  const originalStyle = {
    ...baseStyle,
    filter: "none",
    zIndex: 1,
  };

  return (
     <div
      className="relative flex justify-center items-center w-full rounded-2xl overflow-hidden"
      style={{
        height: `${canvasHeight}px`,
        background: theme === "dark" ? "#232323" : "#f4f4f4",
        transition: "background 0.3s"
      }}
    >
      {image ? (
        showBefore ? (
          <img
            ref={imageRef}
            src={image}
            alt="Original"
            style={originalStyle}
            className="rounded-2xl pointer-events-none select-none"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Original Image */}
            <img
              src={image}
              alt="Original"
              style={originalStyle}
              className="rounded-2xl pointer-events-none select-none"
              crossOrigin="anonymous"
              draggable={false}
            />
            {/* Filtered Image */}
            <img
              ref={imageRef}
              src={image}
              alt="Filtered"
              style={filterStyle}
              className="rounded-2xl pointer-events-none select-none"
              crossOrigin="anonymous"
              draggable={false}
            />
            {/* Slider */}
            <input
              type="range"
              min={0}
              max={100}
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/2 accent-[#00bcd4] z-10"
              style={{ pointerEvents: "auto" }}
              aria-label="Before/After Slider"
            />
          </div>
        )
      ) : (
        <div className="text-[#cccccc] text-lg opacity-60">
          Upload an image to start editing
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;