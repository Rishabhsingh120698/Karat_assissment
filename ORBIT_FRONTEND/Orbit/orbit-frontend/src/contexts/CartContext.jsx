import { createContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

function CartProvider({ children }) {

  // -----------------------------------------
  // LOAD CART FROM LOCAL STORAGE
  // -----------------------------------------

  const [cartItems, setCartItems] = useState(() => {

    const savedCart =
      localStorage.getItem('orbitCart')

    if (savedCart) {
      return JSON.parse(savedCart)
    }

    return []
  })

  // -----------------------------------------
  // SAVE CART TO LOCAL STORAGE
  // -----------------------------------------

  useEffect(() => {

    localStorage.setItem(
      'orbitCart',
      JSON.stringify(cartItems)
    )

  }, [cartItems])


  // -----------------------------------------
  // ADD PRODUCT TO CART
  // -----------------------------------------

  const addToCart = (product, quantity) => {

    setCartItems(currentItems => {

      const existingItem = currentItems.find(
        item => item.productId === product.id
      )

      if (existingItem) {

        return currentItems.map(item => {

          if (item.productId === product.id) {

            return {
              ...item,
              quantity: item.quantity + quantity,
              imageUrl: product.imageUrl
            }
          }

          return item
        })
      }

      const newCartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      }

      return [
        ...currentItems,
        newCartItem
      ]
    })
  }


  // -----------------------------------------
  // INCREASE QUANTITY
  // -----------------------------------------

  const increaseQuantity = (productId) => {

    setCartItems(currentItems => {

      return currentItems.map(item => {

        if (item.productId === productId) {

          return {
            ...item,
            quantity: item.quantity + 1
          }
        }

        return item
      })
    })
  }


  // -----------------------------------------
  // DECREASE QUANTITY
  // -----------------------------------------

  const decreaseQuantity = (productId) => {

    setCartItems(currentItems => {

      return currentItems.map(item => {

        if (
          item.productId === productId &&
          item.quantity > 1
        ) {

          return {
            ...item,
            quantity: item.quantity - 1
          }
        }

        return item
      })
    })
  }


  // -----------------------------------------
  // REMOVE ITEM
  // -----------------------------------------

  const removeFromCart = (productId) => {

    setCartItems(currentItems => {

      return currentItems.filter(
        item => item.productId !== productId
      )
    })
  }


  // -----------------------------------------
  // CONTEXT VALUE
  // -----------------------------------------

  return (
    <CartContext
      value={{
        cartItems,
        setCartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart
      }}
    >
      {children}
    </CartContext>
  )
}

export { CartProvider }

export default CartContext