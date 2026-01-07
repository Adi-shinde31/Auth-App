import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    // 🔥 ALLOW PREFLIGHT REQUESTS
    if (req.method === 'OPTIONS') {
        return next();
    }

    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

export default userAuth;