// import { verifyToken } from "./protectedRoute.middleware.js";
// // hotel management middleware

// export const hotelManagerOnly = async (req, res, next) => {
//   try {
//     await verifyToken(req, res, async () => {
//       if (req.user.role !== "hotelManager" && req.user.role !== "admin") {
//         const error = new Error("Accès refusé. Rôle insuffisant.");
//         error.statusCode = 403;
//         return next(error);
//       }
//       next();
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // protectRoute for admin

// export const adminOnly = async (req, res, next) => {
//   try {
//     await verifyToken(req, res, async () => {
//       if (req.user.role !== "admin") {
//         const error = new Error("Accès refusé. Rôle insuffisant.");
//         error.statusCode = 403;
//         return next(error);
//       }
//       next();
//     });
//   } catch (err) {
//     next(err);
//   }
// };
