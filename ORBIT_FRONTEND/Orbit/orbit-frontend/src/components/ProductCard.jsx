import { useState } from 'react'

function ProductCard(props) {
  const [quantity, setQuantity] = useState(1)

  const increaseQuantity = () => {
    if (quantity < props.product.stockQuantity) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const stockMessage =
    props.product.stockQuantity > 0
      ? 'In Stock'
      : 'Out of Stock'

  return (
    <div>
      <h2>{props.product.name}</h2>

      <p>Category: {props.product.category}</p>

      <p>Price: ₹{props.product.price}</p>

      <p>
        Available Stock: {props.product.stockQuantity}
      </p>

      <p>{stockMessage}</p>

      {props.product.stockQuantity > 0 && (
        <>
          <p>Selected Quantity: {quantity}</p>

          <button onClick={increaseQuantity}>
            +
          </button>

          <button onClick={decreaseQuantity}>
            -
          </button>

          <br />
          <br />

          <button>Add to Cart</button>
        </>
      )}
    </div>
  )
}

export default ProductCard