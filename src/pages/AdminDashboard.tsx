import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Film,
  Trash2,
  Plus,
  Search,
  LogOut,
  LayoutDashboard,
  Star,
  Users,
  Settings,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Badge,
  Modal,
  Alert,
  Spinner,
  Nav,
  Navbar,
} from "react-bootstrap";
import toast from "react-hot-toast";
import MovieManager from "../components/admin/MovieManager";

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

interface Review {
  id: string;
  movieId: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
  recommend: string;
}

type AdminSection = "dashboard" | "movies" | "reviews" | "categories";

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Action",
    "Drama",
    "Comedy",
    "Horror",
    "Sci-Fi",
    "Thriller",
    "Romance",
    "Documentary",
  ]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: string;
    id: string;
    title: string;
  } | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkDeleteType, setBulkDeleteType] = useState<
    null | "all-movies" | "category-movies" | "all-reviews"
  >(null);
  const [bulkDeleteCategory, setBulkDeleteCategory] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/admin/login");
      return;
    }

    // Load data from localStorage
    loadData();
  }, [navigate]);

  const loadData = () => {
    const savedMovies = localStorage.getItem("movies");
    const savedReviews = localStorage.getItem("reviews");

    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    }
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleDeleteReview = (reviewId: string) => {
    const updatedReviews = reviews.filter((r) => r.id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    toast.success("Review deleted successfully!");
  };

  const getStats = () => {
    return {
      totalMovies: movies.length,
      totalReviews: reviews.length,
      categories: categories.length,
      avgRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
          : "0.0",
      recentMovies: movies.slice(-5).reverse(),
      recentReviews: reviews.slice(-5).reverse(),
    };
  };

  const stats = getStats();

  const handleBulkDelete = () => {
    if (bulkDeleteType === "all-movies") {
      setMovies([]);
      localStorage.setItem("movies", JSON.stringify([]));
      toast.success("All movies deleted.");
    } else if (bulkDeleteType === "category-movies") {
      const filtered = movies.filter((m) => m.category !== bulkDeleteCategory);
      setMovies(filtered);
      localStorage.setItem("movies", JSON.stringify(filtered));
      toast.success(`All movies in '${bulkDeleteCategory}' deleted.`);
    } else if (bulkDeleteType === "all-reviews") {
      setReviews([]);
      localStorage.setItem("reviews", JSON.stringify([]));
      toast.success("All reviewed movies deleted.");
    }
    setShowBulkDeleteModal(false);
    setBulkDeleteType(null);
    setBulkDeleteCategory("");
  };

  const renderDashboard = () => (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="bg-dark border-secondary text-center">
            <Card.Body>
              <Film size={32} className="text-danger mb-2" />
              <h3 className="text-white">{stats.totalMovies}</h3>
              <p className="text-white-50 mb-0">Total Movies</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark border-secondary text-center">
            <Card.Body>
              <MessageSquare size={32} className="text-warning mb-2" />
              <h3 className="text-white">{stats.totalReviews}</h3>
              <p className="text-white-50 mb-0">Total Reviews</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark border-secondary text-center">
            <Card.Body>
              <Settings size={32} className="text-info mb-2" />
              <h3 className="text-white">{stats.categories}</h3>
              <p className="text-white-50 mb-0">Categories</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark border-secondary text-center">
            <Card.Body>
              <Star size={32} className="text-success mb-2" />
              <h3 className="text-white">{stats.avgRating}</h3>
              <p className="text-white-50 mb-0">Avg Rating</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="bg-dark border-secondary">
            <Card.Header className="bg-secondary bg-opacity-25">
              <h5 className="mb-0">Recent Movies</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentMovies.length > 0 ? (
                stats.recentMovies.map((movie) => (
                  <div
                    key={movie.imdbID}
                    className="d-flex align-items-center mb-3"
                  >
                    <img
                      src={
                        movie.Poster !== "N/A"
                          ? movie.Poster
                          : "https://via.placeholder.com/50x75"
                      }
                      alt={movie.Title}
                      style={{
                        width: 50,
                        height: 75,
                        objectFit: "cover",
                      }}
                      className="me-3 rounded"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{movie.Title}</h6>
                      <small className="text-white-50">{movie.Year}</small>
                    </div>
                    <Badge bg="secondary">
                      {movie.category || "Uncategorized"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-white-50 text-center mb-0">
                  No movies added yet
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="bg-dark border-secondary">
            <Card.Header className="bg-secondary bg-opacity-25">
              <h5 className="mb-0">Recent Reviews</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentReviews.length > 0 ? (
                stats.recentReviews.map((review) => (
                  <div key={review.id} className="mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{review.name}</h6>
                        <div className="text-warning mb-1">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                      </div>
                      <Badge
                        bg={review.recommend === "yes" ? "success" : "danger"}
                      >
                        {review.recommend === "yes"
                          ? "Recommended"
                          : "Not Recommended"}
                      </Badge>
                    </div>
                    <p className="text-white-50 small mb-0">
                      {review.comment.substring(0, 100)}...
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-white-50 text-center mb-0">No reviews yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderMovies = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Movie Management</h2>
        <div className="d-flex gap-2">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => {
              setBulkDeleteType("all-movies");
              setShowBulkDeleteModal(true);
            }}
          >
            Delete All Movies
          </Button>
          <Form.Select
            size="sm"
            style={{ width: 180 }}
            value={bulkDeleteCategory}
            onChange={(e) => setBulkDeleteCategory(e.target.value)}
          >
            <option value="">Delete Movies by Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
          <Button
            variant="outline-danger"
            size="sm"
            disabled={!bulkDeleteCategory}
            onClick={() => {
              if (bulkDeleteCategory) {
                setBulkDeleteType("category-movies");
                setShowBulkDeleteModal(true);
              }
            }}
          >
            Delete Category
          </Button>
        </div>
      </div>
      <MovieManager
        movies={movies}
        onMoviesChange={setMovies}
        categories={categories}
      />
    </div>
  );

  const renderReviews = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Review Management</h2>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => {
            setBulkDeleteType("all-reviews");
            setShowBulkDeleteModal(true);
          }}
        >
          Delete All Reviewed Movies
        </Button>
      </div>
      <Card className="bg-dark border-secondary">
        <Card.Body className="p-0">
          <Table variant="dark" className="mb-0">
            <thead className="bg-secondary bg-opacity-25">
              <tr>
                <th>Reviewer</th>
                <th>Movie</th>
                <th>Rating</th>
                <th>Recommendation</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.name}</td>
                    <td>{review.movieId}</td>
                    <td>
                      <div className="text-warning">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </td>
                    <td>
                      <Badge
                        bg={review.recommend === "yes" ? "success" : "danger"}
                      >
                        {review.recommend === "yes" ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ maxWidth: 200 }}>
                        {review.comment.substring(0, 100)}
                        {review.comment.length > 100 && "..."}
                      </div>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-white-50 py-4">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );

  const renderCategories = () => (
    <div>
      <h2 className="mb-4">Category Management</h2>
      <Row className="g-4">
        {categories.map((category, index) => (
          <Col md={4} key={index}>
            <Card className="bg-dark border-secondary text-center">
              <Card.Body>
                <h5 className="text-white">{category}</h5>
                <p className="text-white-50">
                  {movies.filter((m) => m.category === category).length} movies
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Top Navigation */}
      <Navbar
        bg="dark"
        variant="dark"
        className="border-bottom border-secondary"
      >
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center">
            <LayoutDashboard size={24} className="me-2 text-danger" />
            <span className="fw-bold">Admin Panel</span>
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Link to="/" className="nav-link d-flex align-items-center">
              <ArrowLeft size={16} className="me-1" />
              Back to Site
            </Link>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="me-1" />
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="py-4">
        <Row>
          {/* Sidebar */}
          <Col md={3} lg={2}>
            <Card className="bg-dark border-secondary mb-4">
              <Card.Body className="p-0">
                <Nav className="flex-column">
                  <Nav.Item>
                    <Button
                      variant={
                        activeSection === "dashboard" ? "danger" : "link"
                      }
                      className={`w-100 text-start border-0 rounded-0 ${
                        activeSection === "dashboard"
                          ? "text-white"
                          : "text-white-50"
                      }`}
                      onClick={() => setActiveSection("dashboard")}
                    >
                      <LayoutDashboard size={16} className="me-2" />
                      Dashboard
                    </Button>
                  </Nav.Item>
                  <Nav.Item>
                    <Button
                      variant={activeSection === "movies" ? "danger" : "link"}
                      className={`w-100 text-start border-0 rounded-0 ${
                        activeSection === "movies"
                          ? "text-white"
                          : "text-white-50"
                      }`}
                      onClick={() => setActiveSection("movies")}
                    >
                      <Film size={16} className="me-2" />
                      Movies
                    </Button>
                  </Nav.Item>
                  <Nav.Item>
                    <Button
                      variant={activeSection === "reviews" ? "danger" : "link"}
                      className={`w-100 text-start border-0 rounded-0 ${
                        activeSection === "reviews"
                          ? "text-white"
                          : "text-white-50"
                      }`}
                      onClick={() => setActiveSection("reviews")}
                    >
                      <MessageSquare size={16} className="me-2" />
                      Reviews
                    </Button>
                  </Nav.Item>
                  <Nav.Item>
                    <Button
                      variant={
                        activeSection === "categories" ? "danger" : "link"
                      }
                      className={`w-100 text-start border-0 rounded-0 ${
                        activeSection === "categories"
                          ? "text-white"
                          : "text-white-50"
                      }`}
                      onClick={() => setActiveSection("categories")}
                    >
                      <Settings size={16} className="me-2" />
                      Categories
                    </Button>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10}>
            {activeSection === "dashboard" && renderDashboard()}
            {activeSection === "movies" && renderMovies()}
            {activeSection === "reviews" && renderReviews()}
            {activeSection === "categories" && renderCategories()}
          </Col>
        </Row>
      </Container>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        show={showBulkDeleteModal}
        onHide={() => setShowBulkDeleteModal(false)}
      >
        <Modal.Header
          closeButton
          className="bg-dark text-white border-secondary"
        >
          <Modal.Title>Confirm Bulk Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {bulkDeleteType === "all-movies" && (
            <p>
              Are you sure you want to delete <b>ALL movies</b>? This cannot be
              undone.
            </p>
          )}
          {bulkDeleteType === "category-movies" && (
            <p>
              Are you sure you want to delete{" "}
              <b>all movies in '{bulkDeleteCategory}'</b>? This cannot be
              undone.
            </p>
          )}
          {bulkDeleteType === "all-reviews" && (
            <p>
              Are you sure you want to delete <b>ALL reviewed movies</b>? This
              cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button
            variant="secondary"
            onClick={() => setShowBulkDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleBulkDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
