const mongoose = require('mongoose');
const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

const userController = {};
const allowedContractTypes = ['Employment', 'Mandate', 'B2B'];
const allowedContractPositions = ['Storekeeper', 'Accountant', 'IT'];

userController.getAllUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({message: 'Unauthorized: Only administrators can perform this action'});
    }

    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

userController.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({message: 'Invalid user ID format'});
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({message: `User with id = ${userId} not found`});
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

userController.createUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({message: 'Unauthorized: Only administrators can perform this action'});
    }

    const {name, surname, email, phoneNumber, password, birthDate, contract, notes, isAdmin, isActivated} = req.body;
    const existingUser = await UserModel.findOne({email});

    if (existingUser) {
      return res.status(400).json({message: 'User with this email already exists'});
    }

    if (phoneNumber && (phoneNumber.length > 14 || phoneNumber.length < 9)) {
      return res.status(400).json({message: 'Phone number cannot be shorter than 9 digits or longer than 14'});
    }

    if (!password || password.length < 9) {
      return res.status(400).json({message: 'Password must be at least 9 characters long'});
    }

    if (birthDate && isNaN(Date.parse(birthDate))) {
      return res.status(400).json({message: 'Invalid date format'});
    }

    if (contract) {
      if (contract.type && !allowedContractTypes.includes(contract.type)) {
        return res.status(400).json({message: 'Invalid contract type. Allowed values: Employment, Mandate, B2B'});
      }

      if (contract.position && !allowedContractPositions.includes(contract.position)) {
        return res
          .status(400)
          .json({message: 'Invalid contract position. Allowed values: Storekeeper, Accountant, IT'});
      }

      if (
        (contract.startTime && isNaN(Date.parse(contract.startTime))) ||
        (contract.endTime && isNaN(Date.parse(contract.endTime)))
      ) {
        return res.status(400).json({message: 'Invalid date format'});
      }

      if (contract.endTime && contract.startTime && contract.endTime < contract.startTime) {
        return res.status(400).json({message: 'End time cannot be earlier than start time'});
      }
    }

    const userData = {name, surname, email, phoneNumber, password, birthDate, contract, notes, isAdmin, isActivated};
    userData.lastUpdated = Date.now();

    const user = await UserModel.create(userData);

    res.json({
      message: `User has been created with id = ${user._id}`,
      id: user._id,
    });
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

userController.updateUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({message: 'Unauthorized: Only administrators can perform this action'});
    }

    const {name, surname, email, phoneNumber, password, birthDate, contract, notes, isAdmin, isActivated} = req.body;
    const userId = req.params.id;

    const existingUser = await UserModel.findOne({email});
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({message: 'User with this email already exists'});
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({message: 'Invalid user ID format'});
    }

    if (phoneNumber && (phoneNumber.length > 14 || phoneNumber.length < 9)) {
      return res.status(400).json({message: 'Phone number cannot be shorter than 9 digits or longer than 14'});
    }

    if (birthDate && isNaN(Date.parse(birthDate))) {
      return res.status(400).json({message: 'Invalid date format'});
    }

    if (contract) {
      if (contract.type && !allowedContractTypes.includes(contract.type)) {
        return res.status(400).json({message: 'Invalid contract type. Allowed values: Employment, Mandate, B2B'});
      }

      if (contract.position && !allowedContractPositions.includes(contract.position)) {
        return res
          .status(400)
          .json({message: 'Invalid contract position. Allowed values: Storekeeper, Accountant, IT'});
      }

      if (
        (contract.startTime && isNaN(Date.parse(contract.startTime))) ||
        (contract.endTime && isNaN(Date.parse(contract.endTime)))
      ) {
        return res.status(400).json({message: 'Invalid date format'});
      }

      if (contract.endTime && contract.startTime && contract.endTime < contract.startTime) {
        return res.status(400).json({message: 'End time cannot be earlier than start time'});
      }
    }

    const userData = {name, surname, email, phoneNumber, birthDate, contract, notes, isAdmin, isActivated};
    userData.lastUpdated = Date.now();

    if (password) {
      if (password.length < 9) {
        return res.status(400).json({message: 'Password must be at least 9 characters long'});
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      userData.password = hash;
    }

    const user = await UserModel.findByIdAndUpdate(userId, userData, {new: true});

    if (!user) {
      return res.status(404).json({message: `User with id = ${userId} not found`});
    }

    res.json({message: `User with id = ${userId} has been updated`});
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

userController.deleteUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({message: 'Unauthorized: Only administrators can perform this action'});
    }

    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({message: 'Invalid user ID format'});
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({message: `User with id = ${userId} not found`});
    }

    res.json({message: `User with id = ${userId} has been deleted`});
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

module.exports = userController;
