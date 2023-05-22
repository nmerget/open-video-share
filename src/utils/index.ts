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

  return "";
};

export const isMobileDevice = (): boolean => {
  return !!(
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  );
};
