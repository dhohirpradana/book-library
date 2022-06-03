import axios from "axios";

export const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://dev-libraryzyhwf.microgen.id/graphql",
});

export const graphRequest = function (query, variables) {
  return new Promise(function (resolve, reject) {
    const config = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    };

    const graphqlQuery = {
      query: query,
      variables: variables,
    };

    API.post("", graphqlQuery, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const graphRequestHistory = function (userId) {
  console.log("history: ", userId);
  return new Promise(function (resolve, reject) {
    const config = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    };

    axios
      .create({
        baseURL: "https://dev-libraryzyhwf.microgen.id/api/history",
      })
      .get("/" + userId, config)
      .then((response) => {
        // console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.commin["Authorization"];
  }
};
