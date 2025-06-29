export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  Genre: string;
  imdbRating: string;
  Director: string;
  Actors: string;
}

export interface Review {
  id: string;
  movieId: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
}

export interface RecommendedMovie {
  id: string;
  title: string;
  reason: string;
  date: string;
}
