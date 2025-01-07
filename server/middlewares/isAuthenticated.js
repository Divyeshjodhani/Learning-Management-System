import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    console.log("Headers:", req.headers); // Log request headers
    console.log("Cookies:", req.cookies); // Log cookies parsed by cookie-parser
    const token =
      req.cookies?.token || // Token from cookies
      req.headers.authorization?.split(" ")[1]; // Token from Authorization header
    console.log("Cookies:", req.cookies); // Debug cookies
    console.log("Token:", token); // Debug token

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded Token:", decode); // Debug decoded token
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decode.userId; // Attach userId to request
    next();
  } catch (error) {
    console.error("Authentication Error:", error); // Use a descriptive log
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export default isAuthenticated;
