import {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import AuthContext from '../contexts/AuthContext'

import {
  getUserNotifications,
  markNotificationAsRead
} from '../services/notificationService'


function Navbar() {

  const {
    username,
    role,
    userId,
    isAuthenticated,
    logout
  } = useContext(AuthContext)


  const navigate = useNavigate()


  // =========================================================
  // NOTIFICATION STATE
  // =========================================================

  const [
    notifications,
    setNotifications
  ] = useState([])


  const [
    notificationLoading,
    setNotificationLoading
  ] = useState(false)


  const [
    notificationError,
    setNotificationError
  ] = useState(null)


  const [
    showNotifications,
    setShowNotifications
  ] = useState(false)


  const notificationRef =
    useRef(null)


  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================

  useEffect(() => {

    if (
      !isAuthenticated ||
      !userId
    ) {

      setNotifications([])

      return
    }


    const loadNotifications =
      async () => {

        try {

          setNotificationLoading(true)

          setNotificationError(null)


          const data =
            await getUserNotifications(
              userId
            )


          if (Array.isArray(data)) {

            /*
             * IMPORTANT:
             * Show newest notification first.
             *
             * createdAt is converted into Date
             * so we can compare timestamps.
             */

            const sortedNotifications =
              [...data].sort(
                (a, b) =>
                  new Date(b.createdAt) -
                  new Date(a.createdAt)
              )


            setNotifications(
              sortedNotifications
            )

          } else {

            setNotifications([])

          }

        } catch (error) {

          console.error(
            'Failed to load notifications:',
            error
          )


          setNotificationError(
            error.message
          )

        } finally {

          setNotificationLoading(false)

        }

      }


    loadNotifications()

  }, [
    isAuthenticated,
    userId
  ])


  // =========================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {

    const handleOutsideClick =
      (event) => {

        if (
          notificationRef.current &&
          !notificationRef.current.contains(
            event.target
          )
        ) {

          setShowNotifications(false)

        }

      }


    document.addEventListener(
      'mousedown',
      handleOutsideClick
    )


    return () => {

      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      )

    }

  }, [])


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    logout()

    navigate('/')

  }


  // =========================================================
  // MARK NOTIFICATION AS READ
  // =========================================================

  const handleNotificationClick =
    async (notification) => {

      /*
       * If already read, do nothing.
       *
       * This prevents unnecessary API calls
       * when the user clicks the same notification
       * multiple times.
       */

      if (notification.read) {

        return

      }


      try {

        /*
         * Call backend:
         *
         * PATCH
         * /api/notifications/{id}/read
         */

        await markNotificationAsRead(
          notification.id
        )


        /*
         * Update React state immediately.
         *
         * We do not need to reload all notifications.
         */

        setNotifications(
          previousNotifications =>
            previousNotifications.map(
              item =>
                item.id === notification.id
                  ? {
                      ...item,
                      read: true
                    }
                  : item
            )
        )

      } catch (error) {

        console.error(
          'Failed to mark notification as read:',
          error
        )

      }

    }


  // =========================================================
  // NOTIFICATION ICON
  // =========================================================

  const getNotificationIcon =
    (type) => {

      switch (type) {

        case 'ORDER_CONFIRMED':
          return '✓'

        case 'ORDER_PROCESSING':
          return '⚙'

        case 'ORDER_SHIPPED':
          return '📦'

        case 'ORDER_DELIVERED':
          return '✓'

        case 'ORDER_CANCELLED':
          return '✕'

        case 'PAYMENT_SUCCESS':
          return '₹'

        case 'PAYMENT_FAILED':
          return '⚠'

        default:
          return '🔔'

      }

    }


  // =========================================================
  // NOTIFICATION TITLE
  // =========================================================

  const getNotificationTitle =
    (type) => {

      switch (type) {

        case 'ORDER_CONFIRMED':
          return 'Order Confirmed'

        case 'ORDER_PROCESSING':
          return 'Order Processing'

        case 'ORDER_SHIPPED':
          return 'Order Shipped'

        case 'ORDER_DELIVERED':
          return 'Order Delivered'

        case 'ORDER_CANCELLED':
          return 'Order Cancelled'

        case 'PAYMENT_SUCCESS':
          return 'Payment Successful'

        case 'PAYMENT_FAILED':
          return 'Payment Failed'

        default:
          return 'Notification'

      }

    }


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatNotificationTime =
    (createdAt) => {

      if (!createdAt) {

        return ''

      }


      try {

        return new Date(
          createdAt
        ).toLocaleString()

      } catch (error) {

        return ''

      }

    }


  // =========================================================
  // UNREAD COUNT
  // =========================================================

  /*
   * IMPORTANT:
   *
   * Earlier we were using:
   *
   * notification.status === 'PENDING'
   *
   * But status means DELIVERY status.
   *
   * Now read controls whether the customer
   * has actually read the notification.
   *
   * read = false -> UNREAD
   * read = true  -> READ
   */

  const notificationCount =
    notifications.filter(
      notification =>
        !notification.read
    ).length


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <nav className="navbar">

      <div className="navbar-container">


        {/* ================================================= */}
        {/* BRAND                                             */}
        {/* ================================================= */}

        <div className="navbar-brand">

          <Link to="/">

            <span className="navbar-brand-orbit">
              O
            </span>

            <span className="navbar-brand-text">
              Project Orbit
            </span>

          </Link>

        </div>


        {/* ================================================= */}
        {/* NAVIGATION LINKS                                  */}
        {/* ================================================= */}

        <div className="navbar-links">


          <Link
            to="/"
            className="navbar-link"
          >
            Home
          </Link>


          <Link
            to="/products"
            className="navbar-link"
          >
            Products
          </Link>


          <Link
            to="/cart"
            className="navbar-link navbar-cart-link"
          >
            <span>
              Cart
            </span>
          </Link>


          {isAuthenticated && (

            <Link
              to="/orders"
              className="navbar-link"
            >
              My Orders
            </Link>

          )}


          {isAuthenticated &&
            role === 'ADMIN' && (

            <Link
              to="/admin"
              className="navbar-link navbar-admin-link"
            >
              Admin Dashboard
            </Link>

          )}


          {/* ================================================= */}
          {/* NOTIFICATION BELL                                 */}
          {/* ================================================= */}

          {isAuthenticated && (

            <div
              ref={notificationRef}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setShowNotifications(
                    previous =>
                      !previous
                  )
                }
                aria-label="Notifications"
                style={{
                  position: 'relative',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >

                🔔


                {/* ================================================= */}
                {/* UNREAD BADGE                                      */}
                {/* ================================================= */}

                {notificationCount > 0 && (

                  <span
                    style={{
                      position: 'absolute',
                      top: '0px',
                      right: '2px',
                      minWidth: '18px',
                      height: '18px',
                      padding: '0 4px',
                      borderRadius: '10px',
                      background: '#e53935',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '18px'
                    }}
                  >
                    {notificationCount}
                  </span>

                )}

              </button>


              {/* ================================================= */}
              {/* DROPDOWN                                          */}
              {/* ================================================= */}

              {showNotifications && (

                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: '0',
                    width: '380px',
                    maxHeight: '500px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow:
                      '0 10px 30px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}
                >


                  {/* ============================================= */}
                  {/* HEADER                                          */}
                  {/* ============================================= */}

                  <div
                    style={{
                      padding: '16px',
                      borderBottom:
                        '1px solid #eeeeee',
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center'
                    }}
                  >

                    <strong
                      style={{
                        fontSize: '17px',
                        color: '#111827'
                      }}
                    >
                      Notifications
                    </strong>


                    {notificationCount > 0 && (

                      <span
                        style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}
                      >
                        {notificationCount} unread
                      </span>

                    )}

                  </div>


                  {/* ============================================= */}
                  {/* LOADING                                         */}
                  {/* ============================================= */}

                  {notificationLoading && (

                    <div
                      style={{
                        padding: '30px',
                        textAlign: 'center',
                        color: '#6b7280'
                      }}
                    >
                      Loading notifications...
                    </div>

                  )}


                  {/* ============================================= */}
                  {/* ERROR                                           */}
                  {/* ============================================= */}

                  {!notificationLoading &&
                    notificationError && (

                    <div
                      style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#dc2626',
                        fontSize: '14px'
                      }}
                    >
                      {notificationError}
                    </div>

                  )}


                  {/* ============================================= */}
                  {/* EMPTY                                           */}
                  {/* ============================================= */}

                  {!notificationLoading &&
                    !notificationError &&
                    notifications.length === 0 && (

                    <div
                      style={{
                        padding: '35px 20px',
                        textAlign: 'center',
                        color: '#6b7280'
                      }}
                    >

                      <div
                        style={{
                          fontSize: '32px',
                          marginBottom: '10px'
                        }}
                      >
                        🔔
                      </div>

                      <div>
                        No notifications yet.
                      </div>

                    </div>

                  )}


                  {/* ============================================= */}
                  {/* NOTIFICATION LIST                               */}
                  {/* ============================================= */}

                  {!notificationLoading &&
                    !notificationError &&
                    notifications.length > 0 && (

                    <div
                      style={{
                        maxHeight: '430px',
                        overflowY: 'auto'
                      }}
                    >

                      {notifications.map(
                        notification => (

                        <div
                          key={
                            notification.id
                          }

                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }

                          style={{
                            padding: '14px 16px',
                            borderBottom:
                              '1px solid #f0f0f0',
                            display: 'flex',
                            gap: '12px',

                            /*
                             * UNREAD:
                             * light blue background
                             *
                             * READ:
                             * white background
                             */

                            background:
                              !notification.read
                                ? '#f8faff'
                                : '#ffffff',

                            cursor: 'pointer',

                            transition:
                              'background 0.2s ease'
                          }}
                        >


                          {/* ================================= */}
                          {/* ICON                               */}
                          {/* ================================= */}

                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              minWidth: '36px',
                              borderRadius: '50%',
                              background: '#eef2ff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent:
                                'center',
                              fontSize: '17px'
                            }}
                          >

                            {getNotificationIcon(
                              notification.type
                            )}

                          </div>


                          {/* ================================= */}
                          {/* CONTENT                            */}
                          {/* ================================= */}

                          <div
                            style={{
                              flex: 1,
                              minWidth: 0
                            }}
                          >

                            <div
                              style={{
                                display: 'flex',
                                justifyContent:
                                  'space-between',
                                gap: '8px',
                                marginBottom:
                                  '4px'
                              }}
                            >

                              <strong
                                style={{
                                  fontSize: '13px',
                                  color:
                                    notification.read
                                      ? '#6b7280'
                                      : '#111827',

                                  fontWeight:
                                    notification.read
                                      ? '500'
                                      : '700'
                                }}
                              >

                                {getNotificationTitle(
                                  notification.type
                                )}

                              </strong>


                              {/* ================================= */}
                              {/* UNREAD BLUE DOT                    */}
                              {/* ================================= */}

                              {!notification.read && (

                                <span
                                  style={{
                                    width: '7px',
                                    height: '7px',
                                    minWidth: '7px',
                                    borderRadius:
                                      '50%',
                                    background:
                                      '#2563eb',
                                    marginTop:
                                      '5px'
                                  }}
                                />

                              )}

                            </div>


                            <div
                              style={{
                                fontSize: '13px',
                                color:
                                  notification.read
                                    ? '#6b7280'
                                    : '#4b5563',
                                lineHeight: '1.45'
                              }}
                            >
                              {notification.message}
                            </div>


                            <div
                              style={{
                                marginTop: '6px',
                                fontSize: '11px',
                                color: '#9ca3af'
                              }}
                            >
                              {formatNotificationTime(
                                notification.createdAt
                              )}
                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              )}

            </div>

          )}


          {/* ================================================= */}
          {/* LOGIN / REGISTER                                  */}
          {/* ================================================= */}

          {!isAuthenticated && (

            <>

              <Link
                to="/login"
                className="navbar-link navbar-login-link"
              >
                Login
              </Link>


              <Link
                to="/register"
                className="navbar-register-button"
              >
                Register
              </Link>

            </>

          )}


          {/* ================================================= */}
          {/* USER                                             */}
          {/* ================================================= */}

          {isAuthenticated && (

            <>

              <div className="navbar-user-area">

                <div className="navbar-user-avatar">

                  {username
                    ? username
                        .charAt(0)
                        .toUpperCase()
                    : 'U'}

                </div>


                <div className="navbar-user-details">

                  <span className="navbar-user">
                    {username}
                  </span>

                  <span className="navbar-role">
                    {role}
                  </span>

                </div>

              </div>


              <button
                className="navbar-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>

          )}

        </div>

      </div>

    </nav>

  )

}


export default Navbar