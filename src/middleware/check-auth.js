import jwt from "jsonwebtoken";

const CheckAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "secret_code_needs_to_be_sent");
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch (err) {
        res.status(401).json({ message: "No Auth Token Found" });
    }
};

module.exports = CheckAuth;