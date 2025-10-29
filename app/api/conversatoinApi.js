//conversatoinApi.js
import axiosInstance from "./axiosInstance";

// ✅ Create or Get conversation between two users
export const getOrCreateConversation = async (senderId, receiverId) => {
  try {
    const res = await axiosInstance.post("/api/conversations/get-or-create", {
      senderId,
      receiverId,
    });
    return res.data;
  } catch (error) {
    console.error("Error creating conversation:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch all conversations for a user
export const getUserConversations = async (userId) => {
  try {
    const res = await axiosInstance.get(`/api/conversations/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching conversations:", error.response?.data || error.message);
    throw error;
  }
};