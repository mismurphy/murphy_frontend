// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// export default api;




import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response, // Return response if successfu=
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error); // Reject other errors
  }
);

export default api;
