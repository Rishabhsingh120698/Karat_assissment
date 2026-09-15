import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/AdminLayout'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'

import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminInventory from './pages/admin/AdminInventory'
import AdminOrders from './pages/admin/AdminOrders'

import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'


function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <CartProvider>

          <Navbar />


          <Routes>


            {/* =================================================
                CUSTOMER / PUBLIC ROUTES
            ================================================= */}

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


            {/* =================================================
                PROTECTED CUSTOMER ROUTES
            ================================================= */}

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


            {/* =================================================
                ADMIN SECTION
            ================================================= */}

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >


              {/* /admin */}

              <Route
                index
                element={
                  <AdminDashboard />
                }
              />


              {/* /admin/products */}

              <Route
                path="products"
                element={
                  <AdminProducts />
                }
              />


              {/* /admin/inventory */}

              <Route
                path="inventory"
                element={
                  <AdminInventory />
                }
              />


              {/* /admin/orders */}

              <Route
                path="orders"
                element={
                  <AdminOrders />
                }
              />

            </Route>


          </Routes>


          <Footer />

        </CartProvider>

      </AuthProvider>

    </BrowserRouter>

  )
}


export default App