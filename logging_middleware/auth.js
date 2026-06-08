const axios = require("axios");

async function getToken() {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/auth",
      {
        email: "naman.saxena2023@ssipnt.com",
        name: "naman saxena",
        rollNo: "303302223147",
        accessCode: "aGBTJZ",
        clientID: "3c1aace1-eca0-4dab-b9fb-04dc1d5aa9fb",
        clientSecret: "MaJXHWTFDtmjdbNM",
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
}

module.exports = getToken;