import { parse } from "svg-parser"
import type {
  ExcalidrawElement,
  ExcalidrawRectangleElement,
} from "@excalidraw/element/types";
import { randomId } from "@excalidraw/common";
import { Radians } from "@excalidraw/math";

export const parseAndConvertSVGToElements = (
  svgString: string,
): ExcalidrawElement[] => {
  const parsed = parse(svgString);
  const elements: ExcalidrawElement[] = [];

  const walk = (node: any) => {
    if (!node || !node.tagName) return;

    if (node.tagName === "rect") {
      const props = node.properties || {};
      const x = parseFloat(props.x || "0");
      const y = parseFloat(props.y || "0");
      const width = parseFloat(props.width || "0");
      const height = parseFloat(props.height || "0");

      const rect: ExcalidrawRectangleElement = {
        id: randomId(),
        type: "rectangle",
        x,
        y,
        width,
        height,
        angle: 0 as Radians,
        strokeColor: "#000000",
        backgroundColor: "#ffffff",
        fillStyle: "hachure",
        strokeStyle: "solid",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
        seed: Math.floor(Math.random() * 100000),
        version: 1,
        versionNonce: Math.floor(Math.random() * 100000),
        index: null,
        isDeleted: false,
        groupIds: [],
        frameId: null,
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
        roundness: null,
      };

      elements.push(rect);
    }

    // TODO: Add support for other shapes like circle, path, line, etc.

    if (node.children?.length) {
      node.children.forEach(walk);
    }
  };

  walk(parsed);
  return elements;
};
