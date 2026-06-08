const axios = require("axios");
const getToken = require("./auth");

async function Log(stack, level, pkg, message) {
  try {
    const token = await getToken();

    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Success:", response.data);
  } catch (error) {
    console.log(
      "Logger Error:",
      error.response?.data || error.message
    );
  }
}

module.exports = Log;