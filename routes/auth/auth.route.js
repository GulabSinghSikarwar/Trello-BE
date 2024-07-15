const express = require('express');
const { login ,register, verify2FA } = require('../../controllers/auth/auth.controller');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify-totp', verify2FA);
module.exports = router;
