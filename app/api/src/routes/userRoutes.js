const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/auth', authController.login);
router.get('/auth', authController.verifyToken);

router.get('/users', passport.authenticate('jwt', {session: false}), userController.getAllUsers);
router.get('/users/:id', passport.authenticate('jwt', {session: false}), userController.getUserById);
router.post('/users', passport.authenticate('jwt', {session: false}), userController.createUser);
router.put('/users/:id', passport.authenticate('jwt', {session: false}), userController.updateUser);
router.delete('/users/:id', passport.authenticate('jwt', {session: false}), userController.deleteUser);

module.exports = router;
