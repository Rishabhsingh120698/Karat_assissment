import { apiRequest } from "./api"

const getUserNotifications = async (userId) => {

  return apiRequest(
    `/api/notifications/user/${userId}`,
    {
      method: "GET"
    }
  )
}

const markNotificationAsRead = async (notificationId) => {

  return apiRequest(
    `/api/notifications/${notificationId}/read`,
    {
      method: "PATCH"
    }
  )
}

export {
  getUserNotifications,
  markNotificationAsRead
}