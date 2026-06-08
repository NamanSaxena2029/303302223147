const axios = require("axios");
const getToken = require("./logging_middleware/auth");

async function getNotifications() {
  try {
    const token = await getToken();

    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log(response.data);

  } catch (error) {
    console.log(error.response?.data || error.message);
  }
}

getNotifications();