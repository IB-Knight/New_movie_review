import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Twitter, Instagram } from "lucide-react";

const Home: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Page entrance animation
    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.inOut" }
    );
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.8 }
    );
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen w-full bg-black text-white overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=2574&auto=format&fit=crop')",
        }}
      ></div>
      {/* Grainy Overlay */}
      <div className="absolute inset-0 w-full h-full bg-grain opacity-50"></div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-between min-h-screen p-6 md:p-12"
      >
        {/* Top Spacer to push content down, accounting for fixed header */}
        <div className="h-24"></div>

        {/* Middle Content */}
        <div className="flex-grow flex items-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Text */}
            <div className="text-left">
              <h1
                className="text-6xl md:text-8xl font-black uppercase"
                style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
              >
                Watch
                <br />
                Mini
                <br />
                Doc
              </h1>
            </div>

            {/* Right Text */}
            <div className="text-left md:text-right self-end md:self-center">
              <div className="max-w-sm ml-auto">
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  Go inside the "Sing Sing" screening at Sing Sing Correctional
                  Facility. Shot and directed by Anthony P. Leslie
                </p>
                <p className="text-xs uppercase tracking-widest text-gray-400 mt-4">
                  Now Playing Everywhere
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full flex justify-between items-end">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-black">A24</span>
            <div className="text-xs text-gray-500 leading-tight">
              <span>OPEN LEGALS</span>
              <br />
              <span>202B A24, LLC © ALL RIGHTS RESERVED</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:opacity-70 transition-opacity">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="hover:opacity-70 transition-opacity">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
