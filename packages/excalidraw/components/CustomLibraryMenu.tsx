import React, { useState, useRef } from "react";
import { Svg2Roughjs, OutputType } from "svg2roughjs";

export const CustomLibraryMenu = () => {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  //render both images in the same div and in small size
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/svg+xml") {
      setError("Please upload a valid SVG file.");
      return;
    }

    setError(null);
    const text = await file.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    if (!svgElement || !(svgElement instanceof SVGSVGElement)) {
      setError("Invalid SVG content.");
      return;
    }

    // Clear any previous SVGs from input container
    if (inputRef.current) {
      inputRef.current.innerHTML = "";
      inputRef.current.appendChild(svgElement);
    }

    const svg2roughjs = new Svg2Roughjs(outputRef.current!, OutputType.SVG);
    svg2roughjs.svg = svgElement;
    svg2roughjs.backgroundColor = "white";

    try {
      await svg2roughjs.sketch();
    } catch (e) {
      console.error("Sketching failed:", e);
      setError("Failed to sketch SVG.");
    }
  };

  return (
    <div>
      <input type="file" accept=".svg" onChange={handleFileChange} />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div
        ref={inputRef}
        id="input-div"
        style={{
          border: "1px solid black",
          margin: "10px",
          padding: "10px",
          width: "100px",
          height: "100px",
        }}
      ></div>
      <div
        ref={outputRef}
        id="output-div"
        style={{ border: "1px solid green", margin: "10px", padding: "10px" }}
      ></div>
    </div>
  );
};
