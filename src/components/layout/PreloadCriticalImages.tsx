"use client";

import { useEffect } from "react";
import { preload } from "react-dom";
import { SITE_IMAGES } from "@/data/site-images";

export function PreloadCriticalImages() {
  useEffect(() => {
    preload(SITE_IMAGES.heroMain, { as: "image" });
    preload(SITE_IMAGES.producerPortrait, { as: "image" });
    console.log("[PreloadCriticalImages] hero + portrait");
  }, []);
  return null;
}
