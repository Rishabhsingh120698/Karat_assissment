import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProducts } from '../services/productService'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllProducts()
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(error => {
        setError(error.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p>Loading products...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h1>Products</h1>

      {products.map(product => (
        <div key={product.id}>

          <h2>{product.name}</h2>

          <p>
            Category: {product.category}
          </p>

          <p>
            Price: ₹{product.price}
          </p>

          <p>
            Stock: {product.stockQuantity}
          </p>

          <Link to={`/products/${product.id}`}>
            View Product
          </Link>

          <hr />

        </div>
      ))}
    </div>
  )
}

export default Products