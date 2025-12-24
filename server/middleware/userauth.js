import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    console.log("🟢 Auth Middleware HIT");
    console.log("🟢 Token:", token);
    if(!token){
        return res.status(401).json({
            success: false,
            message: 'Not Authorized! Login Again.'
        })
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(decodedToken.id){
            req.userId = decodedToken.id;
            next();
        }
        else{
            return res.status(401).json({
                success: false,
                message: 'Not Authorized! Login Again.'
            })
        }

    } catch (error) {
        res.json({
            success : false,
            message : error.message 
        })
        
    }
}

export default userAuth;