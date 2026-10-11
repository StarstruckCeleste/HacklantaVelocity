import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../index.scss";
import { useState } from "react";

const App: React.FC = () => {
  const montserrat = { fontFamily: "'Montserrat', sans-serif" };

  const styles = {
    bannerContainer: {
      margin: "40px",
    },
    banner: {
      position: "relative" as const,
      width: "100%",
      height: "253px",
      backgroundImage: `url("./banner.jpeg")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    navbarPosition: {
      position: "absolute" as const,
      top: "61px",
      left: 0,
      right: 0,
    },
    hsdaBrandStyle: {
      marginLeft: "40px",
    },
    header: {
      ...montserrat,
      fontSize: "35px",
      fontWeight: 700,
      color: "rgb(50, 113, 200)",
      marginTop: "2rem",
      marginBottom: "1rem",
      textAlign: "center" as const,
    },
    bodyText: {
      ...montserrat,
      fontSize: "14px",
      fontWeight: 400,
      color: "#000",
      textAlign: "center" as const,
    },
    shiftedPrimaryLink: {
      ...montserrat,
      fontSize: "11px",
      fontWeight: 700,
      marginRight: "0.5rem",
      transform: "translateX(-130px)",
      transition: "transform 0.3s ease",
    },
    shiftedSecondaryLink: {
      ...montserrat,
      fontSize: "11px",
      fontWeight: 700,
      marginRight: "0.5rem",
      transform: "translateX(-50px)",
      transition: "transform 0.3s ease",
    },
    shiftedSocialIconLink: {
      ...montserrat,
      fontSize: "11px",
      fontWeight: 700,
      marginRight: "0.2rem",
      transform: "translateX(-30px)",
      transition: "transform 0.3s ease",
      padding: 0,
    },
    shiftedNavbarCart: {
      ...montserrat,
      fontSize: "11px",
      fontWeight: 400,
      marginRight: "0.5rem",
      transform: "translateX(-30px)",
      transition: "transform 0.3s ease",
    },
    link: {
      ...montserrat,
      fontSize: "14px",
      fontWeight: 400,
      color: "rgb(50, 113, 200)",
      textDecoration: "underline",
    },
    bottomSection: {
      textAlign: "center" as const,
      marginTop: "3rem",
      marginBottom: "2rem",
    },
    iframe: {
      width: "100%",
      minHeight: "1000px",
      border: "none",
    },
    iconImage: {
      height: "14px",
      width: "auto",
    },
  };

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const toggleHamburgerMenu = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const handleMenuClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <>
      <div className="hamburger-container">
        <div className="hamburger-button" onClick={toggleHamburgerMenu}>
          <div className="hamburger-bar"></div>
          <div className="hamburger-bar"></div>
          <div className="hamburger-bar"></div>
        </div>
      </div>

      <div className={`mobile-menu ${isHamburgerOpen ? "open" : ""}`}>
        <a
          className="mobile-menu-item"
          onClick={() => handleMenuClick("https://hsdems.org/about-us")}
        >
          About Us
        </a>
        <a
          className="mobile-menu-item"
          onClick={() => handleMenuClick("https://hsdems.org/store")}
        >
          Store
        </a>
        <a
          className="mobile-menu-item"
          onClick={() => handleMenuClick("https://hsdems.org/resource-dropdown")}
        >
          Resources
        </a>
        <a
          className="mobile-menu-item"
          onClick={() => handleMenuClick("https://hsdems.org/the-progressive-teen")}
        >
          TPT
        </a>
        <a
          className="mobile-menu-item"
          onClick={() => handleMenuClick("https://hsdems.org/opportunities-database")}
        >
          Opportunities Database
        </a>
        <a
          className="mobile-menu-item"
          onClick={() => handleMenuClick("https://hsdems.org/summit-24")}
        >
          Summit 2024
        </a>
        <a
          className="mobile-menu-item"
          onClick={() => handleMenuClick("https://secure.actblue.com/donate/hsda")}
        >
          Donate
        </a>
        <a
          className="mobile-menu-item"
          onClick={() =>
            handleMenuClick(
              "https://actionnetwork.org/forms/join-the-high-school-democrats-of-america"
            )
          }
        >
          Join Us
        </a>
      </div>

      <div style={styles.bannerContainer}>
        <div style={styles.banner}>
          <Navbar
            expand="lg"
            variant="dark"
            bg="transparent"
            style={styles.navbarPosition}
          >
            <Container fluid>
              <Navbar.Brand
                href="https://hsdems.org/"
                style={styles.hsdaBrandStyle}
              >
                <img
                  src="./hsda.png"
                  alt="HSDA Logo"
                  style={{ height: "30px" }}
                />
              </Navbar.Brand>

              <Navbar.Collapse
                id="basic-navbar-nav"
                className="justify-content-end"
              >
                <Nav>
                  <Nav.Link
                    href="https://hsdems.org/about-us"
                    style={styles.shiftedPrimaryLink}
                    className="shifted-primary-link"
                  >
                    ABOUT US
                  </Nav.Link>
                  <Nav.Link
                    href="https://hsdems.org/store"
                    style={styles.shiftedPrimaryLink}
                    className="shifted-primary-link"
                  >
                    STORE
                  </Nav.Link>
                  <Nav.Link
                    href="https://hsdems.org/resource-dropdown"
                    style={styles.shiftedPrimaryLink}
                    className="shifted-primary-link"
                  >
                    RESOURCES
                  </Nav.Link>
                  <Nav.Link
                    href="https://hsdems.org/the-progressive-teen"
                    style={styles.shiftedPrimaryLink}
                    className="shifted-primary-link"
                  >
                    TPT
                  </Nav.Link>
                  <Nav.Link
                    href="https://hsdems.org/opportunities-database"
                    style={styles.shiftedPrimaryLink}
                    className="shifted-primary-link"
                  >
                    OPPORTUNITIES DATABASE
                  </Nav.Link>

                  <Nav.Link
                    href="https://hsdems.org/summit-24"
                    style={styles.shiftedSecondaryLink}
                    className="pill-link wide-pill-link"
                  >
                    SUMMIT 2024
                  </Nav.Link>
                  <Nav.Link
                    href="https://secure.actblue.com/donate/hsda"
                    style={styles.shiftedSecondaryLink}
                    className="pill-link"
                  >
                    DONATE
                  </Nav.Link>
                  <Nav.Link
                    href="https://actionnetwork.org/forms/join-the-high-school-democrats-of-america"
                    style={styles.shiftedSecondaryLink}
                    className="pill-link"
                  >
                    JOIN US
                  </Nav.Link>

                  <Nav.Link
                    href="https://instagram.com/hsdems"
                    style={styles.shiftedSocialIconLink}
                    className="shifted-social-icon-link"
                    aria-label="Instagram"
                  >
                    <img
                      src="./instagram.jpg"
                      alt="Instagram"
                      style={styles.iconImage}
                    />
                  </Nav.Link>
                  <Nav.Link
                    href="https://x.com/hsdems"
                    style={styles.shiftedSocialIconLink}
                    className="shifted-social-icon-link"
                    aria-label="Twitter"
                  >
                    <img
                      src="./twitter.png"
                      alt="Twitter"
                      style={styles.iconImage}
                    />
                  </Nav.Link>
                  <Nav.Link
                    href="https://www.facebook.com/hsdems/"
                    style={styles.shiftedSocialIconLink}
                    className="shifted-social-icon-link facebook-link"
                    aria-label="Facebook"
                  >
                    <img
                      src="./facebook.png"
                      alt="Facebook"
                      style={styles.iconImage}
                    />
                  </Nav.Link>
                  <Nav.Link
                    href="https://medium.com/the-progressive-teen"
                    style={styles.shiftedSocialIconLink}
                    className="shifted-social-icon-link"
                    aria-label="Medium"
                  >
                    <img
                      src="./medium.png"
                      alt="Medium"
                      style={styles.iconImage}
                    />
                  </Nav.Link>

                  <Nav.Link
                    href="https://hsdems.org/cart"
                    style={styles.shiftedNavbarCart}
                    className="shifted-navbar-cart"
                  >
                    CART (0)
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </div>

      <Container className="mt-4 mb-5">
        <h1 style={styles.header}>WHERE WE ARE</h1>
        <p style={styles.bodyText}>
          Find a local chapter near you! Don’t see your chapter? Register your
          chapter{" "}
          <a href="https://hsdems.org/register" style={styles.link}>
            here
          </a>
          !
        </p>
      </Container>

      <div style={styles.bottomSection}>
        <iframe
          title="EmbeddedLink"
          src="https://patelvedantp.github.io/HSDA-MAP/"
          style={styles.iframe}
        />
      </div>
    </>
  );
};

export default App;
