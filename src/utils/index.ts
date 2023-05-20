import pako from "pako";
import { Buffer } from "buffer";

export const uuid = () => {
  if (typeof window !== "undefined") {
    return window.crypto?.randomUUID();
  }

  return Math.random().toString();
};

export const compress = (compressString: string): string => {
  return Buffer.from(
    pako.deflate(new TextEncoder().encode(compressString))
  ).toString("base64");
};

export const decompress = (decompressString: string): string => {
  try {
    return new TextDecoder().decode(
      pako.inflate(Buffer.from(decompressString, "base64"))
    );
  } catch (e) {
    console.error(e);
  }
};
