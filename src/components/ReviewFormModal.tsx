import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { X, Star, User, Send } from "lucide-react";
import { Review } from "../types";

interface ReviewFormModalProps {
  movieId: string;
  movieTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: Review) => void;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  movieId,
  movieTitle,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
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
    } else {
      // Modal exit animation
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        onComplete: onClose,
      });
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rating === 0 || !comment.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      movieId,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      avatar: "",
      date: new Date().toLocaleDateString(),
    };

    onSubmit(newReview);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setRating(0);
    setComment("");
    setHoveredRating(0);
    onClose();
  };

  if (!isOpen) return null;

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
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl max-w-2xl w-full netflix-shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="netflix-title text-2xl text-white">
                Write a Review
              </h2>
              <p className="text-gray-400 mt-1">{movieTitle}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center hover:bg-gray-700/50 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name Input */}
            <div>
              <label className="netflix-subtitle text-white text-lg mb-2 block">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="netflix-input w-full pl-10"
                  required
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="netflix-subtitle text-white text-lg mb-3 block">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-current text-yellow-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-gray-400 ml-3">
                  {rating > 0 ? `${rating}/5` : "Select rating"}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="netflix-subtitle text-white text-lg mb-2 block">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                className="netflix-input w-full h-32 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim() || rating === 0 || !comment.trim()}
                className="btn-netflix flex items-center space-x-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span>Submit Review</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReviewFormModal;
