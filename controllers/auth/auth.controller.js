const authService = require('../../services/auth.service');
const { logger } = require('../../services/logger');
const { updateUser } = require('../../utils/auth.helper');

const register = async (req, res) => {
    const { username, password } = req.body;
    console.log(" req body : ", req.body);
    try {
        const user = await authService.register(username, password);
        // genrate a secret and qr code uri 
        const { secret, imageUrl } = await authService.enable2FA(user._id)

        // update th user with and set these values 
        const updatedUser = await updateUser(user._id, { totpSecret: secret, qrCodeUri: imageUrl })
        
        res.status(201).json({ message: 'User registered successfully', userdetails: updatedUser });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Server Error' });
    }
}

const login = async (req, res) => {
    console.log("req: ", req.body);
    const { username, password } = req.body;
    try {
        const {user ,token}= await authService.login(username, password);
        logger.info(`logged in user info  : ${JSON.stringify(user)}`)
        res.json({ token, user }); 
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(401).json({ message: 'Invalid credentials' });
    }
}

const enable2FA = async (req, res) => {
    const { userId } = req.user;


    try {
        const { secret, imageUrl } = await authService.enable2FA(userId);
        res.json({ secret, imageUrl });
    } catch (err) {
        console.error('Error enabling 2FA:', err);
        res.status(500).json({ message: 'Server Error' });
    }
}


const verify2FA = async (req, res) => {
    const { userId } = req.body;
    // token is also known as OTP 
    const { token } = req.body;
    console.log(" token : ",token);

    console.log(" userId: ",userId);
    try {
        const isValid = await authService.verify2FA(userId, token);
        if (isValid) {
            res.json({ message: '2FA successfully verified' });
        } else {
            res.status(401).json({ message: 'Invalid 2FA token' });
        }
    } catch (err) {
        console.error('Error verifying 2FA:', err);
        res.status(500).json({ message: 'Server Error' });
    }
}


const getProtectedResource = async (req, res) => {
    res.json({ message: 'Protected resource' });
}

module.exports = { register, login, enable2FA, verify2FA }