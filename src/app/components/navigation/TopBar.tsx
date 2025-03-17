"use client";
import { useEffect, useRef } from "react";

const TopBar = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const text = textRef.current;
    if (text) {
      const animation = text.animate(
        [{ transform: "translateX(100%)" }, { transform: "translateX(-100%)" }],
        {
          duration: 40000,
          iterations: Infinity,
          easing: "linear",
        }
      );
      return () => animation.cancel();
    }
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 p-4 overflow-hidden whitespace-nowrap">
      <div className="relative w-full max-w-6xl h-7 flex items-center">
        <div
          ref={textRef}
          className="absolute whitespace-nowrap text-blue-600 text-[20px] font-bold"
        >
          The Mercy of Ramadhan is open for us, to ask, beseech, beg him for
          health and wellness and also to talk for mercy and guidance for all
          our loved ones. || May this Ramadhan enlighten you and clear your
          understanding and judgment between the truth and false. Wishing you a
          Ramadhan Mubarak!
        </div>
      </div>
    </div>
  );
};

export default TopBar;
