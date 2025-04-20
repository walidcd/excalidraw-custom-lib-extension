import clsx from "clsx";

import { randomId } from "@excalidraw/common";

import svgToEx from "svg-to-excalidraw";

import { fileOpen } from "../data/filesystem";

import { parseAndConvertSVGToElements } from "../utils/svg-import";

import { restoreElements } from "../data/restore";

import LibraryMenuBrowseButton from "./LibraryMenuBrowseButton";
import { ToolButton } from "./ToolButton";
import { PlusImageIcon } from "./icons";

import { useApp } from "./App";
import { useExcalidrawSetAppState } from "./App";

import type { ExcalidrawProps, UIAppState } from "../types";

export const LibraryMenuControlButtons = ({
  libraryReturnUrl,
  theme,
  id,
  style,
  children,
  className,
}: {
  libraryReturnUrl: ExcalidrawProps["libraryReturnUrl"];
  theme: UIAppState["theme"];
  id: string;
  style: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}) => {
  //deploy push
  const setAppState = useExcalidrawSetAppState();

  const app = useApp();
  const library = app.library;

  const handleImportSvg = async () => {
    try {
      const file = await fileOpen({
        description: "SVG files",
        extensions: ["svg"],
        multiple: false,
      });

      const svgText = await file.text();
      const result = svgToEx.convert(svgText);

      if (result.hasErrors) {
        console.error("SVG parse errors:", result.errors);
        setAppState({
          errorMessage: "Invalid SVG. Check console for details.",
        });
        return;
      }

      const content = result.content;

      // Convert elements to internal Excalidraw format
      const elements = restoreElements(content.elements, null);

      if (elements.length === 0) {
        setAppState({ errorMessage: "No elements found in SVG." });
        return;
      }

      await library.setLibrary([
        {
          id: randomId(),
          created: Date.now(),
          status: "unpublished",
          elements,
        },
      ]);

      console.log("SVG added to library!");

    } catch (error: unknown) {
      console.error("Failed to import SVG:", error);
      setAppState({
        errorMessage:
          error instanceof Error
            ? `Failed to import SVG: ${error.message}`
            : "Failed to import SVG due to an unknown error.",
      });
    }
  };

  return (
    <div
      className={clsx("library-menu-control-buttons", className)}
      style={style}
    >
      <ToolButton
        type="button"
        icon={PlusImageIcon}
        title="Import SVG"
        aria-label="Import SVG"
        onClick={handleImportSvg}
      />
      <LibraryMenuBrowseButton
        id={id}
        libraryReturnUrl={libraryReturnUrl}
        theme={theme}
      />
      {children}
    </div>
  );
};
