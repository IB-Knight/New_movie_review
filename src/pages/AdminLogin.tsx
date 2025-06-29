import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { Lock, LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Container, Form, Button, Alert } from "react-bootstrap";

// Admin Login Component
const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Hardcoded password for simplicity (in production, use proper authentication)
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/admin/dashboard");
      return;
    }

    // Entrance animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    // Simulate API call delay
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        toast.success("Login successful! Welcome to Admin Panel.");
        localStorage.setItem("isAdminAuthenticated", "true");
        navigate("/admin/dashboard");
      } else {
        toast.error("Incorrect password. Please try again.");
        gsap.fromTo(
          formRef.current,
          { x: -10 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
        );
      }
      setIsLoggingIn(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center bg-dark">
      <Container className="d-flex justify-content-center">
        <div ref={containerRef} className="w-100" style={{ maxWidth: "400px" }}>
          {/* Back to Home Link */}
          <div className="text-center mb-4">
            <Link
              to="/"
              className="d-inline-flex align-items-center text-decoration-none text-white-50 hover-underline"
              style={{ fontSize: "0.9rem" }}
            >
              <ArrowLeft size={16} className="me-2" />
              Back to Home
            </Link>
          </div>

          {/* Login Card */}
          <div className="bg-dark border border-secondary rounded-3 p-4 shadow-lg">
            <div className="text-center mb-4">
              <div className="mb-3">
                <Lock size={48} className="text-danger" />
              </div>
              <h2 className="text-white fw-bold mb-2">Admin Access</h2>
              <p className="text-white-50 mb-0">
                Enter the password to manage content
              </p>
            </div>

            <Form ref={formRef} onSubmit={handleLogin} className="space-y-3">
              <Form.Group className="mb-3">
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="bg-dark text-white border-secondary"
                    style={{
                      paddingLeft: "3rem",
                      paddingRight: "3rem",
                      height: "3rem",
                    }}
                    required
                  />
                  <Lock
                    size={20}
                    className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50"
                  />
                  <button
                    type="button"
                    className="position-absolute top-50 end-0 translate-middle-y me-3 btn btn-link p-0 text-white-50"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </Form.Group>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-100 bg-danger border-danger"
                style={{ height: "3rem" }}
              >
                {isLoggingIn ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="spinner-border spinner-border-sm me-2" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center">
                    <LogIn size={20} className="me-2" />
                    <span>Login to Admin Panel</span>
                  </div>
                )}
              </Button>
            </Form>

            {/* Demo Info */}
            <div className="mt-4 p-3 bg-secondary bg-opacity-25 rounded">
              <small className="text-white-50">
                <strong>Demo Password:</strong> admin123
              </small>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminLogin;
