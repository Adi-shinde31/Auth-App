import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/usermodel.js'
import transporter from '../config/nodemailer.js'

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    
    if(!name || !email || !password){
        return res.json({
            success : false,
            message : 'Missing Details'
        })
    }

    try{
        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.json({
                success : false,
                message : 'User Already Exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });

        await user.save();

        // generating web tokens
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'} );

        //sending cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // sending email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Congratulations! You just created your account.',
            text: `Welcome ${name} bhava!, Thank you register kelya baddal!`
        }

        try {
            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            console.log('Email error:', mailError.message);
        }  


        return res.json({
            success : true
        })

    } catch (error) {
        return res.json({
            success : false,
            message : error.message
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password){
        return res.json({
            success : false,
            message : 'Email/Password Required!'
        })
    }

    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({
                success : false,
                message : 'User Does Not Exists'
            })
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched){
            return res.json({
                success : false,
                message : 'Invalid Password'
            })
        }

        // generating web tokens
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'} );

        //sending cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({
            success : true
        })

    } catch (error) {
        return res.json({
            success : false,
            message : error.message 
        })
    }
}

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        
        return res.json({
            success : true,
            message : 'User Logged out'
        })

    } catch (error) {
        return res.json({
            success : false,
            message : error.message 
        })
    }
}

//send verification OTP
export const sendVerifyOTP = async (req, res) => {
    try{
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({
                success : false,
                message : "Account Already Verified!"
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOTP = otp;
        user.verifyOTPExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification Email.',
            text: `Hey ${user.name}. Please use the below code to verify your account.\n\n Your OTP is ${otp}.
            \n\nThis OTP expires in ${new Date(user.verifyOTPExpiresAt)}`
        }

        try {
            await transporter.sendMail(mailOptions);
            return res.json({
                success : true,
                message : 'Verification OTP Sent!'
            })
        } catch (mailError) {
            console.log('Email error:', mailError.message);
        } 

    } catch (error) {
        return res.json({
            success : false,
            message : error.message 
        })
    }
} 

// verify the email using otp
export const verifyEmail = async (req, res) => {
    const userId = req.userId; // from JWT
    const { otp } = req.body;

    if(!userId || !otp){
        return res.json({
            success : false,
            message : 'Missing OTP Details' 
        })
    }

    try{
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({
                success : false,
                message : 'No user found.' 
            })
        }

        if(user.verifyOTP === '' || user.verifyOTP !== otp){
            return res.json({
                success : false,
                message : 'Invalid OTP!' 
            })
        }

        if(user.verifyOTPExpiresAt < Date.now()){
            return res.json({
                success : false,
                message : 'OTP Expired' 
            })
        }
        
        user.isAccountVerified = true;

        user.verifyOTP = '';
        user.verifyOTPExpiresAt = 0;

        await user.save();

        return res.json({
            success : true,
            message : 'Email Verified Successfully!'
        })

    } catch (error) {
        return res.json({
            success : false,
            message : error.message 
        })
    }
}

// check if user is authenticated 
export const isAuthenticated = async (req, res) => {
    try{
        return res.json({
            success : true,
        })
    } catch (error) {
        return res.json({
            success : false,
            message : error.message 
        })
    }
}

// send password reset otp
export const sendResetOTP = async (req, res) => {
    const { email } = req.body;

    if(!email){
        return res.json({
            success : false,
            message : 'Email is required!' 
        })
    }

    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success : false,
                message : 'User Not found' 
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOTP = otp;
        user.resetOTPExpiresAt = Date.now() + 15 * 60 * 1000;

        await user.save();
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP.',
            text: `Hey ${user.name}. Here is your OTP to reset your password.\n\n Your OTP is ${otp}.
            \n\nThis OTP expires in ${new Date(user.resetOTPExpiresAt)}`
        }

        try {
            await transporter.sendMail(mailOptions);
            return res.json({
                success : true,
                message : 'Reset OTP Sent!'
            })
        } catch (mailError) {
            console.log('Email error:', mailError.message);
        } 

    } catch (error) {
        return res.json({
            success : false,
            message : error.message 
        })
    }
}

// reset user password 
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if(!email || !otp || !newPassword) {
        return res.json({
            success : false,
            message : 'Email/OTP/New Password Required.' 
        })
    }

    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({
                success : false,
                message : 'User Not found' 
            })
        }

        if(user.resetOTP === '' || user.resetOTP !== otp){
            return res.json({
                success : false,
                message : 'Invalid OTP.' 
            })
        }

        if(user.resetOTPExpiresAt < Date.now()){
            return res.json({
                success : false,
                message : 'OTP Expired.' 
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOTP = '';
        user.resetOTPExpiresAt = 0;

        await user.save();
        return res.json({
            success : true,
            message : 'Password has been reset succesffully!'
        })
    } catch (error) {
        return res.json({
            success : false,
            message : error.message 
        })
    } 
}