const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { logger } = require('./logger');
const { use } = require('../routes/auth/auth.route');


const generateToken = (userId) => {
    return jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });
};


const generateQRCode = async (secret) => {
    try {
        const otpauthUrl = `otpauth://totp/MyApp?secret=${secret}&issuer=MyApp `;
        const url =otpauthUrl
        logger.debug(`OTP URL : ${url} `)
        logger.debug(`Secret Recived  : ${secret} `)

        return await otpauthUrl;
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw new Error('Failed to generate QR code');
    }
};

const authService = {
    register: async (username, password) => {
        try {
            const user = new User({ username, password });
            const userdetails = await user.save();
            return userdetails
        } catch (err) {
            console.error('Error registering user:', err.message);
            throw new Error('Failed to register user');
        }
    },


    login: async (username, password) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                logger.warn('User not found')
                throw new Error('User not found')
            };

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                logger.warn('Invalid credentials');
                throw new Error('Invalid credentials');
            }
            const token = generateToken(user._id)
            const data = {
                user, token
            }

            return data;

        } catch (err) {
            logger.error(`'Error logging in: ${err}`)
            throw new Error('Failed to log in');
        }
    },

    enable2FA: async (userId) => {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            const secret = speakeasy.generateSecret({ length: 20 });
            user.secret = secret.base32;
            
            const resp   = await user.save();
            const imageUrl = await generateQRCode(secret.base32);
            logger.debug(` User Totp Secret and imageURL ${JSON.stringify({secret, base32:secret.base32, imageUrl})}`)
            return { secret: secret.base32, imageUrl };
        } catch (err) {
            console.error('Error enabling 2FA:', err);
            throw new Error('Failed to enable 2FA');
        }
    },


    verify2FA: async (userId, token) => {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            console.log(" user : ",user);
            console.log(" sec : ",user.totpSecret);
            const verified = speakeasy.totp.verify({
                secret: user.totpSecret,
                encoding: 'base32',
                token,
                window: 1,
            });

            if (verified) {
                return true;
            } else {
                throw new Error('Invalid 2FA token');
            }
        } catch (err) {
            console.error('Error verifying 2FA:', err);
            throw new Error('Failed to verify 2FA');
        }
    },
};

module.exports = authService;