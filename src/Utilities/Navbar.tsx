import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function NavScrollExample() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  /* 🔍 CHECK LOGIN STATUS */
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/user/check-Login",
          { withCredentials: true }
        );

        if (res.data.loggedIn) {
          setIsLoggedIn(true);
          setUsername(res.data.username);
        } else {
          setIsLoggedIn(false);
          setUsername("");
        }
      } catch {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    checkLogin();
  }, []);

  /* 🚪 LOGOUT */
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/user/logout",
        {},
        { withCredentials: true }
      );

      setIsLoggedIn(false);
      setUsername("");
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <Navbar expand="lg" bg="white" sticky="top" className="shadow-sm py-3">
      <Container fluid className="px-4">
        {/* BRAND */}
        <Navbar.Brand className="fw-bold d-flex align-items-center gap-2">
          <span style={{ fontSize: "1.5rem" }}>🎓</span>
          <span>DMV</span>
          <span className="text-muted fw-normal">Learning</span>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          {/* NAV LINKS */}
          <Nav className="ms-auto fw-semibold">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
            <Nav.Link as={Link} to="/classes">Enrolled Courses</Nav.Link>
            <Nav.Link as={Link} to="/watch-live">Live</Nav.Link>
            <Nav.Link as={Link} to="/quiz">Quiz</Nav.Link>
            <Nav.Link as={Link} to="/notes">Notes</Nav.Link>
            <Nav.Link as={Link} to="/instructors">Instructors</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
          </Nav>

          {/* AUTH BUTTONS */}
          <div className="d-flex gap-2 ms-3">
            {!isLoggedIn ? (
              <>
                <Link to="/signin">
                  <Button variant="dark">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="dark">Sign Up</Button>
                </Link>
              </>
            ) : (
              <Button
                variant="outline-danger"
                onClick={handleLogout}
                className="d-flex align-items-center gap-2"
              >
                <span className="fw-semibold">{username}</span>
                <img
                  src="/box-arrow-right.svg"
                  alt="logout"
                  width={18}
                  height={18}
                />
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
