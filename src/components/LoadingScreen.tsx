import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const LoadingScreen: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial animation
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    )
      .fromTo(
        logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" }
      )
      .fromTo(
        textRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      )
      .fromTo(
        dotsRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.3"
      );

    // Animate dots
    gsap.to(".loading-dot", {
      y: -10,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.2,
      yoyo: true,
      repeat: -1,
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 netflix-gradient flex items-center justify-center z-50"
      style={{
        background:
          "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)",
      }}
    >
      <div className="text-center">
        {/* Netflix-style Logo */}
        <div ref={logoRef} className="mb-8 flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center shadow-2xl">
            <span className="text-white font-black text-4xl">N</span>
          </div>
        </div>

        {/* Netflix-style Text */}
        <div
          ref={textRef}
          className="netflix-title text-4xl md:text-6xl text-white mb-4 tracking-tight"
        >
          MovieFlix
        </div>

        <div className="text-gray-400 text-lg md:text-xl mb-8">
          Unlimited movies, TV shows, and more
        </div>

        {/* Netflix-style Loading Animation */}
        <div
          ref={dotsRef}
          className="flex items-center justify-center space-x-2"
        >
          <div className="loading-dot w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="loading-dot w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="loading-dot w-3 h-3 bg-red-500 rounded-full"></div>
        </div>

        {/* Netflix-style Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-600 to-red-500 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
