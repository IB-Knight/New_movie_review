import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  X,
  Star,
  MessageCircle,
  Heart,
  Play,
  Plus,
  Share2,
  Calendar,
  Users,
  Award,
} from "lucide-react";
import { Movie, Review } from "../types";
import ReviewFormModal from "./ReviewFormModal";
import ReviewList from "./ReviewList";

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pinterestImages, setPinterestImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Simulate Pinterest API call
  const fetchPinterestImages = async (movieTitle: string) => {
    setIsLoadingImages(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock Pinterest images (in real app, you'd call Pinterest API)
    const mockImages = [
      `https://picsum.photos/300/200?random=${Math.random()}`,
      `https://picsum.photos/300/200?random=${Math.random()}`,
      `https://picsum.photos/300/200?random=${Math.random()}`,
    ];

    setPinterestImages(mockImages);
    setIsLoadingImages(false);
  };

  useEffect(() => {
    fetchPinterestImages(movie.Title);

    // Modal entrance animation
    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(
      modalRef.current,
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
    );
  }, [movie.Title]);

  useEffect(() => {
    if (pinterestImages.length > 0) {
      // Animate Pinterest images entrance
      gsap.fromTo(
        ".pinterest-image",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
        }
      );
    }
  }, [pinterestImages]);

  const handleClose = () => {
    // Modal exit animation
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      onComplete: onClose,
    });
  };

  const handleAddReview = (review: Review) => {
    setReviews([...reviews, review]);
    setShowReviewForm(false);
  };

  return (
    <>
      <div
        ref={backdropRef}
        className="netflix-modal-backdrop fixed inset-0 z-50"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto netflix-shadow-lg">
          {/* Netflix-style Header */}
          <div className="relative h-96 overflow-hidden rounded-t-xl">
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "/placeholder-poster.jpg"
              }
              alt={movie.Title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>

            {/* Action Buttons */}
            <div className="absolute bottom-6 left-6 flex items-center space-x-4">
              <button className="btn-netflix flex items-center space-x-2 px-6 py-3">
                <Play className="w-5 h-5" />
                <span>Play</span>
              </button>
              <button className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80 transition-colors duration-200">
                <Plus className="w-6 h-6 text-white" />
              </button>
              <button className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80 transition-colors duration-200">
                <Share2 className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-8">
            {/* Movie Title and Rating */}
            <div className="mb-6">
              <h1 className="netflix-title text-4xl md:text-5xl text-white mb-4">
                {movie.Title}
              </h1>
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-current text-yellow-500" />
                  <span className="text-white font-semibold">
                    {movie.imdbRating !== "N/A" ? movie.imdbRating : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.Year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>{movie.Genre.split(",")[0]}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Movie Details */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="netflix-subtitle text-xl text-white mb-3">
                    Synopsis
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {movie.Plot}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="netflix-subtitle text-lg text-white mb-2 flex items-center space-x-2">
                      <Award className="w-5 h-5" />
                      <span>Genre</span>
                    </h3>
                    <p className="text-gray-300">{movie.Genre}</p>
                  </div>

                  <div>
                    <h3 className="netflix-subtitle text-lg text-white mb-2 flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Cast</span>
                    </h3>
                    <p className="text-gray-300">{movie.Actors}</p>
                  </div>

                  <div>
                    <h3 className="netflix-subtitle text-lg text-white mb-2 flex items-center space-x-2">
                      <Award className="w-5 h-5" />
                      <span>Director</span>
                    </h3>
                    <p className="text-gray-300">{movie.Director}</p>
                  </div>
                </div>
              </div>

              {/* Movie Poster */}
              <div className="lg:col-span-1">
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "/placeholder-poster.jpg"
                  }
                  alt={movie.Title}
                  className="w-full rounded-lg netflix-shadow"
                />
              </div>
            </div>

            {/* Pinterest Images */}
            <div className="mt-12">
              <h3 className="netflix-subtitle text-2xl text-white mb-6">
                Related Images
              </h3>
              {isLoadingImages ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-48 bg-gray-800 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pinterestImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Related ${movie.Title}`}
                      className="pinterest-image w-full h-48 object-cover rounded-lg netflix-shadow hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="netflix-subtitle text-2xl text-white flex items-center space-x-3">
                  <MessageCircle className="w-6 h-6" />
                  <span>Reviews ({reviews.length})</span>
                </h3>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn-netflix flex items-center space-x-2 px-6 py-3"
                >
                  <Heart className="w-5 h-5" />
                  <span>Write Review</span>
                </button>
              </div>

              <ReviewList reviews={reviews} movieId={movie.imdbID} />
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewFormModal
          movieId={movie.imdbID}
          movieTitle={movie.Title}
          isOpen={showReviewForm}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleAddReview}
        />
      )}
    </>
  );
};

export default MovieDetailModal;
