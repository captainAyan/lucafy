import Alea from "alea";
import { useRef } from "react";

export default function Avatar({ width, cell, color, seed = "", ...attr }) {
  const canvas = useRef(document.createElement("canvas"));
  canvas.current.width = width * cell;
  canvas.current.height = width * cell;
  const ctx = canvas.current.getContext("2d");

  const prng = new Alea(seed);

  for (var i = 0; i <= Math.floor(cell / 2); i++) {
    for (var j = 0; j <= cell; j++) {
      if (Math.floor(prng() * 9) > 4) {
        try {
          ctx.fillStyle = color;
        } catch (e) {
          ctx.fillStyle = "#000000";
        }
      } else {
        ctx.fillStyle = "#ffffff";
      }

      // from left
      ctx.fillRect(i * width, j * width, width, width);
      // from right
      ctx.fillRect(cell * width - width - i * width, j * width, width, width);
    }
  }

  const pngUrl = canvas.current.toDataURL();

  return <img src={pngUrl} {...attr} alt={"Avatar"} />;
}
