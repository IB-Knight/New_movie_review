import React, { useState, useRef, useEffect } from "react";
import "./Landing.css";
import { Twitter, Instagram, ArrowUpRight } from "lucide-react";
import {
  Form,
  FormControl,
  Button,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Container,
} from "react-bootstrap";
import toast from "react-hot-toast";

// --- INSTRUCTIONS FOR LOCAL ASSETS ---
// 1. Place your 'hero.jpg' in 'src/assets/images/'.
// 2. Uncomment the line below to import it.
// import background from '../assets/images/hero.jpg';

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: "",
    recommend: "yes",
    review: "",
  });
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const modalRef = useRef();

  // Load reviewedMovies from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("reviewedMovies");
    if (saved) {
      setReviewedMovies(JSON.parse(saved));
    }
  }, []);

  // Save reviewedMovies to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("reviewedMovies", JSON.stringify(reviewedMovies));
  }, [reviewedMovies]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setMovies([]);
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_OMDB_API_KEY || "81386a7e"; // Fallback to current key
      // Search for up to 3 movies by title
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          searchTerm
        )}&apikey=${apiKey}&type=movie`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.Response === "True" && data.Search) {
        // Fetch full details for up to 3 movies
        const details = await Promise.all(
          data.Search.slice(0, 3).map(async (m) => {
            const detailRes = await fetch(
              `https://www.omdbapi.com/?i=${m.imdbID}&apikey=${apiKey}`
            );
            if (!detailRes.ok) {
              throw new Error(`HTTP error! status: ${detailRes.status}`);
            }
            return await detailRes.json();
          })
        );
        setMovies(details);
      } else {
        setError(data.Error || "No movies found.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Error fetching movie data. Please try again.");
    }
    setLoading(false);
  };

  const openReviewModal = (movie) => {
    setSelectedMovie(movie);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewForm({ name: "", rating: "", recommend: "yes", review: "" });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Add reviewed movie to reviewedMovies
    setReviewedMovies((prev) => [
      ...prev,
      {
        ...selectedMovie,
        review: reviewForm.review,
        reviewer: reviewForm.name,
        rating: reviewForm.rating,
        recommend: reviewForm.recommend,
      },
    ]);
    closeReviewModal();
    toast.success("Review submitted successfully!");
  };

  const clearAllReviews = () => {
    if (window.confirm("Are you sure you want to clear all reviews?")) {
      setReviewedMovies([]);
      localStorage.removeItem("reviewedMovies");
      toast.success("All reviews cleared!");
    }
  };

  // Add scroll handler for 'REVIEW MOVIE' button
  const handleScrollToReview = (e) => {
    e.preventDefault();
    const section = document.getElementById("next-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* HERO SECTION WITH RESPONSIVE BACKGROUND */}
      <div className="hero-section">
        <div className="container-fluid landing-content hero-content">
          <div className="row flex-column flex-md-row h-100">
            {/* Left Column */}
            <div className="col-12 col-md-2 d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-start text-white py-3 py-md-4 mb-3 mb-md-0">
              <div
                className="hero-title animate-slide-in-top mb-2 mb-md-0"
                style={{ animationDelay: "0.2s" }}
              >
                MOVIE REVIEW
              </div>
              <div className="text-center d-none d-md-block">
                <a href="#next-section" className="hero-button" tabIndex={0}>
                  <span className="hero-underline-group">
                    <span className="hero-underline">Movie</span>
                    <br />
                    <span className="hero-underline">Review</span>
                    <br />
                    <span className="hero-underline">App</span>
                  </span>
                </a>
              </div>
              <div
                className="small-caps animate-slide-in-bottom d-none d-md-block"
                style={{ animationDelay: "0.2s" }}
              >
                © A24 LEGALS
              </div>
            </div>

            {/* Center Column */}
            <div className="col-12 col-md-8 d-flex flex-column justify-content-end align-items-end text-white text-end pb-4 px-3 px-md-0">
              <div
                className="w-100 w-md-50 animate-slide-in-bottom"
                style={{ animationDelay: "0.6s" }}
              >
                <p className="fs-5 fs-md-4">
                  "Movies touch our hearts and awaken our vision."
                </p>
                <p className="small-caps mt-3">Now Playing Everywhere</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-12 col-md-2 d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-end text-white py-3 py-md-4 mt-3 mt-md-0">
              <div
                className="text-end animate-slide-in-top mb-2 mb-md-0"
                style={{ animationDelay: "0.2s" }}
              >
                <a
                  href="#next-section"
                  onClick={handleScrollToReview}
                  className="d-flex align-items-center text-decoration-none small-caps hover-underline"
                >
                  REVIEW MOVIE <ArrowUpRight size={16} className="ms-1" />
                </a>
                <a
                  href="/admin/login"
                  className="d-block mt-2 text-decoration-none small-caps hover-underline"
                >
                  ADMIN LOGIN
                </a>
              </div>
              <div
                className="social-icons d-flex flex-row gap-3 animate-slide-in-bottom mt-2 mt-md-0"
                style={{ animationDelay: "0.2s" }}
              >
                <a href="#">
                  <Twitter size={20} />
                </a>
                <a href="#">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section id="next-section" className="review-fade-in">
        <h2 className="review-section-title">Movie Review</h2>
        <Container>
          <h2 className="text-center mb-4 display-5 fw-bold">
            Search for a Movie
          </h2>
          <Form
            className="d-flex justify-content-center my-4"
            onSubmit={handleSearch}
            role="search"
            aria-label="Movie search form"
          >
            <FormControl
              type="text"
              placeholder="Search for a movie..."
              className="me-2 w-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Movie title to search for"
              aria-describedby="search-help"
            />
            <Button
              type="submit"
              variant="outline-dark"
              disabled={loading}
              aria-label={loading ? "Searching for movies..." : "Search movies"}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Search"}
            </Button>
          </Form>
          <div id="search-help" className="text-muted text-center small mb-3">
            Enter a movie title to find and review it
          </div>
          {error && (
            <Alert variant="danger" className="text-center w-50 mx-auto">
              {error}
            </Alert>
          )}
          <Row className="g-4 justify-content-center">
            {movies.map((movie, idx) => (
              <Col xs={12} md={6} lg={4} key={movie.imdbID || idx}>
                <div
                  className="movie-card position-relative overflow-hidden d-flex flex-column justify-content-end shadow-lg h-100"
                  style={{
                    borderRadius: "1rem",
                    minHeight: 420,
                    background: `url(${
                      movie.Poster !== "N/A"
                        ? movie.Poster
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }) center/cover no-repeat`,
                  }}
                >
                  {/* Genre/Type Badge */}
                  <span
                    className="badge bg-light text-dark position-absolute top-0 start-0 m-2"
                    style={{ zIndex: 2 }}
                  >
                    {movie.Genre
                      ? movie.Genre.split(",")[0].charAt(0).toUpperCase() +
                        movie.Genre.split(",")[0].slice(1).toLowerCase()
                      : movie.Type
                      ? movie.Type.charAt(0).toUpperCase() +
                        movie.Type.slice(1).toLowerCase()
                      : "Movie"}
                  </span>
                  {/* Gradient Overlay */}
                  <div className="card-overlay"></div>
                  {/* Bottom Text Overlay */}
                  <div
                    className="position-relative text-center pb-4"
                    style={{ zIndex: 2 }}
                  >
                    <div className="fw-bold text-white fs-3 mb-1">
                      {movie.Title}
                    </div>
                    <div className="text-white-50 mb-3">{movie.Year}</div>
                    <button
                      className="movie-card-btn d-flex align-items-center justify-content-center mx-auto"
                      onClick={() => openReviewModal(movie)}
                      aria-label={`Review ${movie.Title} (${movie.Year})`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openReviewModal(movie);
                        }
                      }}
                    >
                      <span className="visually-hidden">Review Movie</span>
                      <span style={{ fontSize: 24, color: "#fff" }}>
                        &rarr;
                      </span>
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {showReviewModal && (
        <>
          <div
            className="review-modal-backdrop"
            onClick={closeReviewModal}
          ></div>
          <form
            className="review-modal"
            ref={modalRef}
            onSubmit={handleReviewSubmit}
            tabIndex={-1}
            role="dialog"
            aria-labelledby="review-modal-title"
            aria-describedby="review-modal-description"
          >
            <h3 id="review-modal-title">Review {selectedMovie?.Title}</h3>
            <p id="review-modal-description" className="text-muted mb-3">
              Share your thoughts about this movie
            </p>
            <label htmlFor="reviewer-name">Your Name</label>
            <input
              id="reviewer-name"
              name="name"
              type="text"
              value={reviewForm.name}
              onChange={handleReviewChange}
              required
              placeholder="Enter your name"
              aria-required="true"
            />
            <label htmlFor="review-rating">Rate this movie</label>
            <select
              id="review-rating"
              name="rating"
              value={reviewForm.rating}
              onChange={handleReviewChange}
              required
              aria-required="true"
            >
              <option value="" disabled>
                Select rating
              </option>
              <option value="5">★★★★★ (5 stars)</option>
              <option value="4">★★★★☆ (4 stars)</option>
              <option value="3">★★★☆☆ (3 stars)</option>
              <option value="2">★★☆☆☆ (2 stars)</option>
              <option value="1">★☆☆☆☆ (1 star)</option>
            </select>
            <label htmlFor="review-text">Your Review</label>
            <textarea
              id="review-text"
              name="review"
              rows={4}
              value={reviewForm.review || ""}
              onChange={handleReviewChange}
              required
              placeholder="Share your thoughts..."
              style={{ resize: "vertical", marginBottom: "1.2em" }}
              aria-required="true"
            />
            <fieldset className="mb-3">
              <legend className="mb-2">Would you recommend this movie?</legend>
              <div className="d-flex gap-4 align-items-center justify-content-center review-recommend-group">
                <label className="recommend-label">
                  <input
                    type="radio"
                    name="recommend"
                    value="yes"
                    checked={reviewForm.recommend === "yes"}
                    onChange={handleReviewChange}
                  />
                  <span className="recommend-text">Yes</span>
                </label>
                <label className="recommend-label">
                  <input
                    type="radio"
                    name="recommend"
                    value="no"
                    checked={reviewForm.recommend === "no"}
                    onChange={handleReviewChange}
                  />
                  <span className="recommend-text">No</span>
                </label>
              </div>
            </fieldset>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={closeReviewModal}>
                Cancel
              </button>
              <button type="submit" className="btn">
                Submit Review
              </button>
            </div>
          </form>
        </>
      )}
      {/* Reviewed Movies Section */}
      {reviewedMovies.length > 0 && (
        <section className="bg-light text-dark py-5 border-top">
          <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="display-6 fw-bold mb-0">Reviewed Movies</h2>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={clearAllReviews}
                aria-label="Clear all reviews"
              >
                Clear All
              </Button>
            </div>
            <Row className="g-4 justify-content-center">
              {reviewedMovies.map((movie, idx) => (
                <Col xs={12} md={6} lg={4} key={movie.imdbID + idx}>
                  <div
                    className="movie-card position-relative overflow-hidden d-flex flex-column justify-content-end shadow-lg h-100"
                    style={{
                      borderRadius: "1rem",
                      minHeight: 420,
                      background: `url(${
                        movie.Poster !== "N/A"
                          ? movie.Poster
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }) center/cover no-repeat`,
                    }}
                  >
                    <span
                      className="badge bg-light text-dark position-absolute top-0 start-0 m-2"
                      style={{ zIndex: 2 }}
                    >
                      {movie.Genre
                        ? movie.Genre.split(",")[0].charAt(0).toUpperCase() +
                          movie.Genre.split(",")[0].slice(1).toLowerCase()
                        : movie.Type
                        ? movie.Type.charAt(0).toUpperCase() +
                          movie.Type.slice(1).toLowerCase()
                        : "Movie"}
                    </span>
                    <div className="card-overlay"></div>
                    <div
                      className="position-relative text-center pb-4"
                      style={{ zIndex: 2 }}
                    >
                      <div className="fw-bold text-white fs-3 mb-1">
                        {movie.Title}
                      </div>
                      <div className="text-white-50 mb-2">{movie.Year}</div>
                      <div className="text-white-50 mb-2">
                        Reviewed by{" "}
                        <span className="fw-bold text-white">
                          {movie.reviewer}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="badge bg-primary fs-6 me-2">
                          {"★".repeat(parseInt(movie.rating))}
                          {"☆".repeat(5 - parseInt(movie.rating))}
                        </span>
                        <span
                          className={`badge fs-6 ${
                            movie.recommend === "yes"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {movie.recommend === "yes"
                            ? "Recommended"
                            : "Not Recommended"}
                        </span>
                      </div>
                      <div
                        className="text-white mb-3"
                        style={{
                          fontSize: "1.05em",
                          fontWeight: 500,
                          fontStyle: "italic",
                        }}
                      >
                        "{movie.review}"
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
    </>
  );
};

export default Landing;
