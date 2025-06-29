import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Star, Play, Plus, Info } from "lucide-react";
import { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const poster = posterRef.current;
    const overlay = overlayRef.current;

    if (!card || !poster || !overlay) return;

    // Initial animation
    gsap.fromTo(
      card,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(poster, {
        filter: "brightness(1.1) contrast(1.05)",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(card, {
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(poster, {
        filter: "brightness(1) contrast(1)",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(card, {
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="netflix-card bg-gray-900 rounded-lg overflow-hidden cursor-pointer netflix-shadow relative group"
      style={{ aspectRatio: "2/3" }}
    >
      {/* Poster */}
      <div className="relative w-full h-full">
        <img
          ref={posterRef}
          src={
            movie.Poster !== "N/A" ? movie.Poster : "/placeholder-poster.jpg"
          }
          alt={movie.Title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%231a1a1a'/%3E%3Ctext x='150' y='225' text-anchor='middle' fill='%236b7280' font-family='Inter' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />

        {/* Netflix-style Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 flex flex-col justify-end p-4"
        >
          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
              <Play className="w-5 h-5 text-black ml-1" />
            </button>
            <button className="w-10 h-10 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80 transition-colors duration-200">
              <Plus className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onClick}
              className="w-10 h-10 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80 transition-colors duration-200"
            >
              <Info className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Movie Info */}
          <div className="text-white">
            <h3 className="netflix-subtitle text-lg mb-2 line-clamp-2">
              {movie.Title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>{movie.Year}</span>
              <span>•</span>
              <span>{movie.Genre.split(",")[0]}</span>
              {movie.imdbRating !== "N/A" && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                    <span>{movie.imdbRating}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md flex items-center space-x-1 text-xs font-semibold">
          <Star className="w-3 h-3 fill-current" />
          <span>{movie.imdbRating !== "N/A" ? movie.imdbRating : "N/A"}</span>
        </div>

        {/* Year Badge */}
        <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded-md text-xs font-semibold">
          {movie.Year}
        </div>
      </div>

      {/* Default Movie Info (visible when not hovering) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent group-hover:hidden">
        <h3 className="netflix-subtitle text-white text-sm line-clamp-2 mb-1">
          {movie.Title}
        </h3>
        <p className="text-gray-300 text-xs line-clamp-1">
          {movie.Genre.split(",")[0]}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
