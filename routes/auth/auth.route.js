const express = require('express');
const { login, register, verify2FA } = require('../../controllers/auth/auth.controller');
const passport = require('passport');
const { credentials } = require('../../constants');

const router = express.Router();

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

router.get('/google/callback/', passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL || 'http://localhost:3000/',
    failureRedirect: '/login/failed/',
}))


router.get('/google',passport.authenticate('google',['profile','email']))

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL|| 'http://localhost:3000/');
});
module.exports = router;
