import jwt from 'jsonwebtoken';

const validateToken = async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } else {
        res.status(401).json({ message: "User is unauthorized or token missing" });
    }
};

export { validateToken };