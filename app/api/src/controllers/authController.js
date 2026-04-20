const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const authController = {};

authController.login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});

    if (!user) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    if (!user.isActivated) {
      return res.status(403).json({message: 'Account is not activated'});
    }

    const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, 'your_jwt_secret', {expiresIn: '1h'});

    res.json({token});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

authController.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({message: 'Token not provided or is wrong'});
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({message: 'Invalid token'});
      } else {
        return res.json({message: 'Valid token'});
      }
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

module.exports = authController;
