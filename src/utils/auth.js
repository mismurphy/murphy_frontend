// utils/auth.js
// export function getToken() {
//   return localStorage.getItem("token"); // or from cookies
// }

// export function isTokenValid(token) {
//   if (!token) return false;

//   try {
//     const { exp } = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
//     if (Date.now() >= exp * 1000) {
//       return false; // expired
//     }
//     return true;
//   } catch (e) {
//     return false; // malformed token
//   }
// }
