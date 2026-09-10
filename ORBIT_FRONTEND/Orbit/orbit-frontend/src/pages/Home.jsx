import { Link } from 'react-router-dom'

function Home() {

  return (
    <main>

      <section className="hero-section">

        <div className="hero-content">

          <h1>
            Welcome to
            <br />
            <span>Project Orbit</span>
          </h1>

          <p>
            Your modern e-commerce portal
            for discovering products,
            managing your cart, and placing
            orders with ease.
          </p>

          <div className="hero-buttons">

            <Link
              to="/products"
              className="primary-button"
            >
              Explore Products
            </Link>

            <Link
              to="/cart"
              className="secondary-button"
            >
              View Cart
            </Link>

          </div>

        </div>

        <div className="hero-card">

          <h2>
            Shop. Order. Enjoy.
          </h2>

          <p>
            Project Orbit demonstrates a
            complete modern e-commerce
            architecture powered by React,
            Spring Boot microservices,
            API Gateway, JWT security,
            inventory, payment and
            notification services.
          </p>

        </div>

      </section>

    </main>
  )
}

export default Home