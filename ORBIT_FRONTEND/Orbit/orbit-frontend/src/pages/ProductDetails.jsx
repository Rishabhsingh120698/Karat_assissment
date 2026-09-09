import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById } from '../services/productService'

function ProductDetails() {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProductById(id)
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(error => {
        setError(error.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <p>Loading product...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!product) {
    return <p>Product not found.</p>
  }

  return (
    <div>
      <h1>Product Details</h1>

      <h2>{product.name}</h2>

      <p>
        Description: {product.description}
      </p>

      <p>
        Category: {product.category}
      </p>

      <p>
        Price: ₹{product.price}
      </p>

      <p>
        Available Stock: {product.stockQuantity}
      </p>

      <p>
        Status: {product.active ? 'Active' : 'Inactive'}
      </p>

      <br />

      <Link to="/products">
        Back to Products
      </Link>
    </div>
  )
}

export default ProductDetails