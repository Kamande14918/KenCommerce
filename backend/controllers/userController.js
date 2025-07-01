const User = require('../models/User');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = req.body;
    Object.assign(user, updates);

    await user.save();

    res.json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = req.body;
    Object.assign(user, updates);

    await user.save();

    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// @desc    Add address (stub)
// @route   POST /api/users/addresses
// @access  Private
const addAddress = (req, res) => {
  res.status(501).json({ message: 'addAddress not implemented' });
};

// @desc    Update address (stub)
// @route   PUT /api/users/addresses/:addressId
// @access  Private
const updateAddress = (req, res) => {
  res.status(501).json({ message: 'updateAddress not implemented' });
};

// @desc    Delete address (stub)
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = (req, res) => {
  res.status(501).json({ message: 'deleteAddress not implemented' });
};

// @desc    Get user dashboard (stub)
// @route   GET /api/users/dashboard
// @access  Private
const getUserDashboard = (req, res) => {
  res.status(501).json({ message: 'getUserDashboard not implemented' });
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserDashboard,
};
