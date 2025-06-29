import React, { useState, useEffect } from "react";
import { Film, Trash2, Plus, Edit, Search, Filter, Star } from "lucide-react";
import {
  Card,
  Button,
  Form,
  Table,
  Badge,
  Modal,
  Spinner,
  Row,
  Col,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  Genre: string;
  imdbRating: string;
  Director: string;
  Actors: string;
  category?: string;
}

interface SearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

interface MovieManagerProps {
  movies: Movie[];
  onMoviesChange: (movies: Movie[]) => void;
  categories: string[];
}

const MovieManager: React.FC<MovieManagerProps> = ({
  movies,
  onMoviesChange,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieCategory, setNewMovieCategory] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchMovies = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovieTitle.trim()) {
      toast.error("Please enter a movie title");
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      // Search for movies using the search endpoint
      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          newMovieTitle
        )}&type=movie&apikey=81386a7e`
      );
      const data = await response.json();

      if (data.Response === "True" && data.Search) {
        // Take up to 3 results
        const results = data.Search.slice(0, 3);
        setSearchResults(results);
        
        if (results.length === 0) {
          toast.error("No movies found. Please try a different search term.");
        }
      } else {
        toast.error("No movies found. Please check the title.");
      }
    } catch (error) {
      toast.error("Error searching for movies. Please try again.");
    }
    setIsSearching(false);
  };

  const handleSelectMovie = async (searchResult: SearchResult) => {
    setIsLoading(true);
    try {
      // Get full movie details using the title endpoint
      const response = await fetch(
        `https://www.omdbapi.com/?i=${searchResult.imdbID}&apikey=81386a7e`
      );
      const data = await response.json();

      if (data.Response === "True") {
        const newMovie: Movie = {
          ...data,
          category: newMovieCategory || "Uncategorized",
        };

        const updatedMovies = [...movies, newMovie];
        onMoviesChange(updatedMovies);
        localStorage.setItem("movies", JSON.stringify(updatedMovies));

        toast.success(`"${data.Title}" added successfully!`);
        setShowAddModal(false);
        setNewMovieTitle("");
        setNewMovieCategory("");
        setSearchResults([]);
      } else {
        toast.error("Error fetching movie details. Please try again.");
      }
    } catch (error) {
      toast.error("Error adding movie. Please try again.");
    }
    setIsLoading(false);
  };

  const handleEditMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setNewMovieCategory(movie.category || "");
    setShowEditModal(true);
  };

  const handleUpdateMovie = () => {
    if (!selectedMovie) return;

    const updatedMovies = movies.map((movie) =>
      movie.imdbID === selectedMovie.imdbID
        ? { ...movie, category: newMovieCategory }
        : movie
    );

    onMoviesChange(updatedMovies);
    localStorage.setItem("movies", JSON.stringify(updatedMovies));
    toast.success(`"${selectedMovie.Title}" updated successfully!`);
    setShowEditModal(false);
    setSelectedMovie(null);
    setNewMovieCategory("");
  };

  const handleDeleteMovie = () => {
    if (!selectedMovie) return;

    const updatedMovies = movies.filter(
      (movie) => movie.imdbID !== selectedMovie.imdbID
    );
    onMoviesChange(updatedMovies);
    localStorage.setItem("movies", JSON.stringify(updatedMovies));
    toast.success(`"${selectedMovie.Title}" deleted successfully!`);
    setShowDeleteModal(false);
    setSelectedMovie(null);
  };

  const confirmDelete = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowDeleteModal(true);
  };

  const getFilteredMovies = () => {
    return movies.filter(
      (movie) =>
        movie.Title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "" || movie.category === selectedCategory)
    );
  };

  const filteredMovies = getFilteredMovies();

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Movie Management</h2>
          <p className="text-white-50 mb-0">
            Manage your movie collection and categories
          </p>
        </div>
        <Button variant="danger" onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="me-2" />
          Add Movie
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-dark border-secondary mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-dark border-secondary">
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-dark text-white border-secondary"
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-dark border-secondary">
                  <Filter size={16} />
                </InputGroup.Text>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-dark text-white border-secondary"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Movies Grid */}
      <Row className="g-4">
        {filteredMovies.map((movie) => (
          <Col md={6} lg={4} key={movie.imdbID}>
            <Card className="bg-dark border-secondary h-100">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://via.placeholder.com/300x450"
                  }
                  style={{ height: 300, objectFit: "cover" }}
                />
                <Badge
                  bg="secondary"
                  className="position-absolute top-0 start-0 m-2"
                >
                  {movie.category || "Uncategorized"}
                </Badge>
                <div className="position-absolute top-0 end-0 m-2">
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="me-1"
                    onClick={() => handleEditMovie(movie)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => confirmDelete(movie)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <Card.Body>
                <Card.Title className="text-white">{movie.Title}</Card.Title>
                <Card.Text className="text-white-50">
                  {movie.Year} • {movie.Genre?.split(",")[0]}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-warning">
                    {movie.imdbRating !== "N/A" && (
                      <>
                        <Star size={16} className="me-1" />
                        {movie.imdbRating}
                      </>
                    )}
                  </div>
                  <small className="text-white-50">
                    {movie.Director?.split(",")[0]}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Movie Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>Add New Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form onSubmit={handleSearchMovies}>
            <Form.Group className="mb-3">
              <Form.Label>Search Movie Title</Form.Label>
              <Form.Control
                type="text"
                value={newMovieTitle}
                onChange={(e) => setNewMovieTitle(e.target.value)}
                placeholder="Enter movie title to search..."
                className="bg-dark text-white border-secondary"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Default Category (optional)</Form.Label>
              <Form.Select
                value={newMovieCategory}
                onChange={(e) => setNewMovieCategory(e.target.value)}
                className="bg-dark text-white border-secondary"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2 mb-3">
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" type="submit" disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} className="me-2" />
                    Search Movies
                  </>
                )}
              </Button>
            </div>
          </Form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h6 className="mb-3">Select a movie to add:</h6>
              <ListGroup>
                {searchResults.map((result) => (
                  <ListGroup.Item
                    key={result.imdbID}
                    className="bg-dark border-secondary text-white d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelectMovie(result)}
                  >
                    <img
                      src={
                        result.Poster !== "N/A"
                          ? result.Poster
                          : "https://via.placeholder.com/60x90"
                      }
                      alt={result.Title}
                      style={{
                        width: 60,
                        height: 90,
                        objectFit: "cover",
                        marginRight: "15px",
                      }}
                      className="rounded"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{result.Title}</h6>
                      <small className="text-white-50">{result.Year}</small>
                    </div>
                    <Button
                      variant="outline-success"
                      size="sm"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <Plus size={16} />
                      )}
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {searchResults.length === 0 && !isSearching && newMovieTitle && (
            <div className="text-center py-4">
              <Search size={48} className="text-white-50 mb-3" />
              <p className="text-white-50">
                Search for movies to see results here
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Movie Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>Edit Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {selectedMovie && (
            <div>
              <div className="text-center mb-3">
                <img
                  src={
                    selectedMovie.Poster !== "N/A"
                      ? selectedMovie.Poster
                      : "https://via.placeholder.com/200x300"
                  }
                  alt={selectedMovie.Title}
                  style={{ width: 200, height: 300, objectFit: "cover" }}
                  className="rounded"
                />
              </div>
              <h5 className="text-center mb-3">{selectedMovie.Title}</h5>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={newMovieCategory}
                  onChange={(e) => setNewMovieCategory(e.target.value)}
                  className="bg-dark text-white border-secondary"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleUpdateMovie}>
                  <Edit size={16} className="me-2" />
                  Update Movie
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <p>
            Are you sure you want to delete "{selectedMovie?.Title}"?
          </p>
          <p className="text-warning">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMovie}>
            <Trash2 size={16} className="me-2" />
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MovieManager;
