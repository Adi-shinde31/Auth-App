import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    console.log('req', req.method);
    // 🔥 ALLOW PREFLIGHT REQUESTS
    if (req.method === 'OPTIONS') {
        return next();
    }

    const token = req.cookies?.token;
    console.log('token', token);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoded', decoded);
        req.userId = decoded.id;
        console.log(req.userId);
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

export default userAuth;