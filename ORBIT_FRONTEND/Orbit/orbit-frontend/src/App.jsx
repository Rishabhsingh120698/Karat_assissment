import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'

import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {

  return (
    <BrowserRouter>

      <AuthProvider>

        <CartProvider>

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={
                <Home />
              }
            />

            <Route
              path="/products"
              element={
                <Products />
              }
            />

            <Route
              path="/products/:id"
              element={
                <ProductDetails />
              }
            />

            <Route
              path="/login"
              element={
                <Login />
              }
            />

            <Route
              path="/register"
              element={
                <Register />
              }
            />

            <Route
              path="/cart"
              element={
                <Cart />
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

          </Routes>

          <Footer />

        </CartProvider>

      </AuthProvider>

    </BrowserRouter>
  )
}

export default App