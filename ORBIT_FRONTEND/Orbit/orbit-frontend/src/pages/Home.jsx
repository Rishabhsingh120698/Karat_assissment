import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getAllProducts } from '../services/productService'


function Home() {

  const [products, setProducts] =
    useState([])

  const [loading, setLoading] =
    useState(true)


  useEffect(() => {

    const loadFeaturedProducts =
      async () => {

        try {

          const data =
            await getAllProducts()

          const featured =
            data
              .filter(product =>
                product.active !== false
              )
              .slice(0, 4)

          setProducts(featured)

        } catch (error) {

          console.error(
            'Failed to load featured products:',
            error
          )

        } finally {

          setLoading(false)

        }
      }


    loadFeaturedProducts()

  }, [])


  const formatPrice = (price) => {

    return Number(price).toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )
  }


  return (

    <main className="home-page">


      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="home-hero-modern">

        <div className="home-hero-modern-content">

          <span className="home-modern-eyebrow">
            PROJECT ORBIT • NEW COLLECTION
          </span>


          <h1>

            Shop smarter.
            <br />

            <span>
              Live better.
            </span>

          </h1>


          <p>

            Discover the latest technology,
            everyday essentials and products
            designed to fit your lifestyle.

          </p>


          <div className="home-modern-buttons">

            <Link
              to="/products"
              className="home-modern-primary-button"
            >
              Shop Now
              <span>→</span>
            </Link>


            <Link
              to="/products"
              className="home-modern-secondary-button"
            >
              Explore Collection
            </Link>

          </div>


          <div className="home-modern-trust">

            <div>

              <span className="home-trust-check">
                ✓
              </span>

              <div>
                <strong>
                  Secure
                </strong>

                <small>
                  Shopping
                </small>
              </div>

            </div>


            <div>

              <span className="home-trust-check">
                ✓
              </span>

              <div>
                <strong>
                  Fast
                </strong>

                <small>
                  Checkout
                </small>
              </div>

            </div>


            <div>

              <span className="home-trust-check">
                ✓
              </span>

              <div>
                <strong>
                  Live
                </strong>

                <small>
                  Inventory
                </small>
              </div>

            </div>

          </div>

        </div>


        {/* HERO PRODUCT VISUAL */}

        <div className="home-hero-modern-visual">

          <div className="home-hero-circle circle-one"></div>
          <div className="home-hero-circle circle-two"></div>


          <div className="home-hero-image-card">

            {products[0]?.imageUrl ? (

              <img
                src={products[0].imageUrl}
                alt={products[0].name}
              />

            ) : (

              <div className="home-image-placeholder">

                <span>
                  PROJECT
                </span>

                <strong>
                  ORBIT
                </strong>

              </div>

            )}


            <div className="home-hero-image-info">

              <span>
                FEATURED
              </span>

              <strong>
                {products[0]?.name ||
                  'Featured Product'}
              </strong>

              {products[0]?.price && (

                <small>
                  ₹{formatPrice(products[0].price)}
                </small>

              )}

            </div>

          </div>


          <div className="home-floating-product-card">

            <span className="home-floating-product-icon">
              ✦
            </span>

            <div>

              <strong>
                New arrivals
              </strong>

              <small>
                Explore the collection
              </small>

            </div>

          </div>


          <div className="home-floating-delivery-card">

            <span>
              ✓
            </span>

            <div>

              <strong>
                Easy shopping
              </strong>

              <small>
                From cart to checkout
              </small>

            </div>

          </div>

        </div>

      </section>



      {/* =====================================================
          CATEGORY SECTION
      ====================================================== */}

      <section className="home-category-section">

        <div className="home-section-heading">

          <div>

            <span>
              SHOP BY CATEGORY
            </span>

            <h2>
              Find what you're looking for.
            </h2>

          </div>

          <Link to="/products">
            View all →
          </Link>

        </div>


        <div className="home-category-grid">


          <Link
            to="/products"
            className="home-category-card category-mobile"
          >

            <div className="home-category-icon">
              📱
            </div>

            <div>

              <span>
                TECHNOLOGY
              </span>

              <h3>
                Mobile
              </h3>

              <p>
                Smartphones & accessories
              </p>

            </div>

            <strong>
              →
            </strong>

          </Link>


          <Link
            to="/products"
            className="home-category-card category-laptop"
          >

            <div className="home-category-icon">
              💻
            </div>

            <div>

              <span>
                WORK & PLAY
              </span>

              <h3>
                Laptops
              </h3>

              <p>
                Powerful devices for every day
              </p>

            </div>

            <strong>
              →
            </strong>

          </Link>


          <Link
            to="/products"
            className="home-category-card category-audio"
          >

            <div className="home-category-icon">
              🎧
            </div>

            <div>

              <span>
                SOUND
              </span>

              <h3>
                Audio
              </h3>

              <p>
                Headphones & entertainment
              </p>

            </div>

            <strong>
              →
            </strong>

          </Link>


          <Link
            to="/products"
            className="home-category-card category-monitor"
          >

            <div className="home-category-icon">
              🖥️
            </div>

            <div>

              <span>
                DESKTOP
              </span>

              <h3>
                Monitors
              </h3>

              <p>
                Upgrade your workspace
              </p>

            </div>

            <strong>
              →
            </strong>

          </Link>

        </div>

      </section>



      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}

      <section className="home-featured-section">

        <div className="home-section-heading">

          <div>

            <span>
              FEATURED PRODUCTS
            </span>

            <h2>
              Popular right now.
            </h2>

          </div>


          <Link to="/products">
            Shop all products →
          </Link>

        </div>


        {loading ? (

          <div className="home-products-loading">

            <div className="home-loading-spinner"></div>

            <p>
              Loading products...
            </p>

          </div>

        ) : (

          <div className="home-featured-grid">

            {products.map(product => (

              <article
                className="home-featured-card"
                key={product.id}
              >


                <Link
                  to={`/products/${product.id}`}
                  className="home-featured-image"
                >

                  {product.imageUrl ? (

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                    />

                  ) : (

                    <div className="home-featured-placeholder">

                      <span>
                        ORBIT
                      </span>

                      <strong>
                        PRODUCT
                      </strong>

                    </div>

                  )}


                  <span className="home-featured-category">

                    {product.category}

                  </span>

                </Link>


                <div className="home-featured-content">

                  <span className="home-featured-label">
                    PROJECT ORBIT
                  </span>


                  <Link
                    to={`/products/${product.id}`}
                  >

                    <h3>
                      {product.name}
                    </h3>

                  </Link>


                  <p>
                    {product.description ||
                      'Premium quality product.'}
                  </p>


                  <div className="home-featured-bottom">

                    <strong>
                      ₹{formatPrice(product.price)}
                    </strong>


                    <Link
                      to={`/products/${product.id}`}
                      className="home-featured-arrow"
                    >
                      →
                    </Link>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>



      {/* =====================================================
          PROMOTIONAL BANNER
      ====================================================== */}

      <section className="home-promo-section">

        <div className="home-promo-content">

          <span>
            THE ORBIT EXPERIENCE
          </span>

          <h2>
            Everything you need.
            <br />
            One place to shop.
          </h2>

          <p>
            Browse products, manage your cart,
            and track your orders with a simple
            modern shopping experience.
          </p>


          <Link
            to="/products"
            className="home-promo-button"
          >
            Start Shopping
            <span>→</span>
          </Link>

        </div>


        <div className="home-promo-orbit">

          <div className="promo-ring promo-ring-one"></div>

          <div className="promo-ring promo-ring-two"></div>

          <div className="promo-ring promo-ring-three"></div>

          <div className="promo-orbit-logo">
            O
          </div>

        </div>

      </section>



      {/* =====================================================
          BENEFITS
      ====================================================== */}

      <section className="home-benefits-section">


        <div className="home-benefit">

          <div className="home-benefit-icon">
            🔒
          </div>

          <div>

            <h3>
              Secure Shopping
            </h3>

            <p>
              Protected authentication and
              secure order processing.
            </p>

          </div>

        </div>


        <div className="home-benefit">

          <div className="home-benefit-icon">
            📦
          </div>

          <div>

            <h3>
              Live Inventory
            </h3>

            <p>
              See product availability connected
              to real-time inventory.
            </p>

          </div>

        </div>


        <div className="home-benefit">

          <div className="home-benefit-icon">
            🚀
          </div>

          <div>

            <h3>
              Easy Ordering
            </h3>

            <p>
              Add products to your cart and
              checkout with ease.
            </p>

          </div>

        </div>


        <div className="home-benefit">

          <div className="home-benefit-icon">
            ↻
          </div>

          <div>

            <h3>
              Order Tracking
            </h3>

            <p>
              Keep track of your orders from
              creation to delivery.
            </p>

          </div>

        </div>

      </section>


    </main>
  )
}


export default Home