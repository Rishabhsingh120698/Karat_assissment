import { Link } from 'react-router-dom'

function Home() {

  return (
    <main className="home-page">

      {/* =====================================================
          HERO SECTION
          ===================================================== */}

      <section className="home-hero">

        <div className="home-hero-content">

          <span className="home-eyebrow">
            PROJECT ORBIT • MODERN SHOPPING
          </span>

          <h1>
            Everything you need.
            <br />
            <span>All in one orbit.</span>
          </h1>

          <p>
            Discover quality products, manage your cart,
            and place orders through a smooth modern
            shopping experience.
          </p>

          <div className="home-hero-buttons">

            <Link
              to="/products"
              className="home-primary-button"
            >
              Shop Now
              <span>→</span>
            </Link>

            <Link
              to="/cart"
              className="home-secondary-button"
            >
              View Cart
            </Link>

          </div>

          <div className="home-trust-row">

            <div className="home-trust-item">
              <span>✓</span>
              Secure shopping
            </div>

            <div className="home-trust-item">
              <span>✓</span>
              Easy ordering
            </div>

            <div className="home-trust-item">
              <span>✓</span>
              Live inventory
            </div>

          </div>

        </div>


        {/* =================================================
            HERO VISUAL
            ================================================= */}

        <div className="home-hero-visual">

          <div className="home-orbit-ring home-orbit-ring-one" />
          <div className="home-orbit-ring home-orbit-ring-two" />

          <div className="home-glow home-glow-one" />
          <div className="home-glow home-glow-two" />

          <div className="home-product-showcase">

            <div className="home-showcase-badge">
              NEW COLLECTION
            </div>

            <div className="home-device">

              <div className="home-device-top">
                <span />
                <span />
                <span />
              </div>

              <div className="home-device-screen">

                <span className="home-screen-label">
                  PROJECT
                </span>

                <strong>
                  ORBIT
                </strong>

                <small>
                  SHOP SMARTER
                </small>

              </div>

            </div>


            <div className="home-floating-card home-floating-card-one">

              <span className="home-floating-icon">
                ⚡
              </span>

              <div>
                <strong>
                  Fast & Easy
                </strong>

                <small>
                  Simple checkout
                </small>
              </div>

            </div>


            <div className="home-floating-card home-floating-card-two">

              <span className="home-floating-icon">
                🛒
              </span>

              <div>
                <strong>
                  Shop with ease
                </strong>

                <small>
                  Everything in one place
                </small>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
          ===================================================== */}

      <section className="home-features">

        <div className="home-feature">

          <div className="home-feature-number">
            01
          </div>

          <div className="home-feature-icon">
            🔒
          </div>

          <div>

            <h3>
              Secure Shopping
            </h3>

            <p>
              Protected authentication and secure
              order processing.
            </p>

          </div>

        </div>


        <div className="home-feature">

          <div className="home-feature-number">
            02
          </div>

          <div className="home-feature-icon">
            📦
          </div>

          <div>

            <h3>
              Real-Time Inventory
            </h3>

            <p>
              Product availability is connected
              to the inventory service.
            </p>

          </div>

        </div>


        <div className="home-feature">

          <div className="home-feature-number">
            03
          </div>

          <div className="home-feature-icon">
            🚀
          </div>

          <div>

            <h3>
              Modern Architecture
            </h3>

            <p>
              A React frontend powered by Spring Boot
              microservices.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          DISCOVER SECTION
          ===================================================== */}

      <section className="home-discover">

        <div className="home-discover-content">

          <span className="home-section-label">
            DISCOVER ORBIT
          </span>

          <h2>
            Your next favorite product
            <br />
            <span>is waiting.</span>
          </h2>

          <p>
            Browse the catalog and find products that
            fit your everyday needs.
          </p>

        </div>


        <Link
          to="/products"
          className="home-discover-button"
        >
          Explore Products
          <span>→</span>
        </Link>

      </section>


      {/* =====================================================
          BOTTOM BRAND STRIP
          ===================================================== */}

      <section className="home-brand-strip">

        <div className="home-brand-strip-item">
          <strong>
            PROJECT ORBIT
          </strong>

          <span>
            MODERN E-COMMERCE
          </span>
        </div>

        <div className="home-brand-strip-line" />

        <div className="home-brand-strip-item home-brand-strip-right">

          <span>
            EXPLORE
          </span>

          <strong>
            SHOP • ORDER • DISCOVER
          </strong>

        </div>

      </section>

    </main>
  )
}

export default Home