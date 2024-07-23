const express = require('express');
const { login, register, verify2FA } = require('../../controllers/auth/auth.controller');
const passport = require('passport');
const { credentials } = require('../../constants');
const { logger } = require('../../services/logger');
const authService = require('../../services/auth.service');
const User = require('../../models/User')
const router = express.Router();
const {updateUser} =require('../../utils/auth.helper')
const passwordGenerator = require('generate-password');

router.post('/login', login);
router.post('/login', (req, resp, next) => {
	resp.status(401).json(
		{
			error: true,
			message: 'Login Failure'
		}
	)
});
router.get("/login/success", (req, res) => {
	logger.debug("Req : ", req);
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});


router.post('/register', register);
router.post('/verify-totp', verify2FA);



router.get('/google/callback', passport.authenticate('google', {
	failureRedirect: '/login/failed'
}), async (req, res) => {
	logger.debug('Google callback route hit'); // Log route access

	if (!req.user) {
		logger.error('User not found after Google authentication');
		return res.redirect('/login/failed');
	}

	logger.debug(`User authenticated successfully: ${(req.user)}`);

	try {
		// Check if the user exists in the database
		let user = await User.findOne({ username: req.user.displayName });
		const username=req.user.displayName
		if (!user) {
			const password=passwordGenerator.generate({
				length: 10,
				numbers: true,
			});
			const newUser = await authService.register(username, password);
			console.log(" user ", newUser);
			const { secret, imageUrl } = await authService.enable2FA(newUser._id)
			// update th user with and set these values 
			const updatedUser = await updateUser(newUser._id, { totpSecret: secret, qrCodeUri: imageUrl })
			user = updatedUser;
			logger.debug(`response : ${JSON.stringify(updatedUser)}`)

			logger.debug('User registered successfully:', user);
		} else {
			logger.debug('User already exists:', user);
		}

		// Generate a token for the user
		const token = authService.generateToken(user._id);

		// Construct the redirect URL with the token and user data
		const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000/'}?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;

		logger.debug('Redirecting to:', redirectUrl);

		// Redirect to the constructed URL
		res.redirect(redirectUrl);

	} catch (error) {
		logger.error('Error during user registration or token generation:', error);
		res.redirect('/login/failed');
	}
});


router.get('/google', passport.authenticate('google', ['profile', 'email']))

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL || 'http://localhost:3000/');
});
module.exports = router;
