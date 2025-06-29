import React, { createContext, useContext, useState, useEffect } from "react";
import { Movie, Review, RecommendedMovie } from "../types";
import toast from "react-hot-toast";

interface MovieContextType {
  movies: Movie[];
  reviews: Review[];
  recommendedMovies: RecommendedMovie[];
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  addMovie: (movie: Movie) => void;
  addReview: (review: Review) => void;
  addRecommendedMovie: (movie: RecommendedMovie) => void;
  deleteReview: (reviewId: string) => void;
  deleteRecommendedMovie: (movieId: string) => void;
  searchMovie: (title: string) => Promise<Movie | null>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovie must be used within a MovieProvider");
  }
  return context;
};

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem("movies");
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("reviews");
    return saved ? JSON.parse(saved) : [];
  });

  const [recommendedMovies, setRecommendedMovies] = useState<
    RecommendedMovie[]
  >(() => {
    const saved = localStorage.getItem("recommendedMovies");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(
      "recommendedMovies",
      JSON.stringify(recommendedMovies)
    );
  }, [recommendedMovies]);

  const searchMovie = async (title: string): Promise<Movie | null> => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=81386a7e`
      );
      const data = await response.json();

      if (data.Response === "True") {
        return {
          imdbID: data.imdbID,
          Title: data.Title,
          Year: data.Year,
          Poster: data.Poster,
          Plot: data.Plot,
          Genre: data.Genre,
          imdbRating: data.imdbRating,
          Director: data.Director,
          Actors: data.Actors,
        };
      } else {
        toast.error("Movie not found");
        return null;
      }
    } catch (error) {
      toast.error("Error searching for movie");
      return null;
    }
  };

  const addMovie = (movie: Movie) => {
    if (!movies.find((m) => m.imdbID === movie.imdbID)) {
      setMovies([...movies, movie]);
      toast.success("Movie added successfully!");
    } else {
      toast.error("Movie already exists");
    }
  };

  const addReview = (review: Review) => {
    setReviews([...reviews, review]);
    toast.success("Review added successfully!");
  };

  const addRecommendedMovie = (movie: RecommendedMovie) => {
    setRecommendedMovies([...recommendedMovies, movie]);
    toast.success("Movie recommendation added!");
  };

  const deleteReview = (reviewId: string) => {
    setReviews(reviews.filter((review) => review.id !== reviewId));
    toast.success("Review deleted");
  };

  const deleteRecommendedMovie = (movieId: string) => {
    setRecommendedMovies(
      recommendedMovies.filter((movie) => movie.id !== movieId)
    );
    toast.success("Recommendation deleted");
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        reviews,
        recommendedMovies,
        selectedMovie,
        setSelectedMovie,
        addMovie,
        addReview,
        addRecommendedMovie,
        deleteReview,
        deleteRecommendedMovie,
        searchMovie,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
