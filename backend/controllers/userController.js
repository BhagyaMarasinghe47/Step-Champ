const bcrypt = require('bcryptjs');
const { pool } = require('../utils/db');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, name, email, role, account_status, 
      DATE_FORMAT(last_login, '%d %b %Y %h:%i %p') as last_login, 
      DATE_FORMAT(created_at, '%d %b %Y') as created_at
      FROM users
      ORDER BY created_at DESC
    `);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, name, email, role, account_status, 
      DATE_FORMAT(last_login, '%d %b %Y %h:%i %p') as last_login,
      DATE_FORMAT(created_at, '%d %b %Y') as created_at
      FROM users
      WHERE id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }
    
    // Check if user already exists
    const [existingUser] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'Participant']
    );
    
    // Get created user
    const [newUser] = await pool.execute(`
      SELECT id, name, email, role, account_status, 
      DATE_FORMAT(created_at, '%d %b %Y') as created_at
      FROM users
      WHERE id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, account_status } = req.body;
    const userId = req.params.id;
    
    // Validate input
    if (!name && !email && !role && !account_status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update'
      });
    }
    
    // Check if user exists
    const [existingUser] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Build query dynamically
    let updateQuery = 'UPDATE users SET ';
    const queryParams = [];
    
    if (name) {
      updateQuery += 'name = ?, ';
      queryParams.push(name);
    }
    
    if (email) {
      updateQuery += 'email = ?, ';
      queryParams.push(email);
    }
    
    if (role) {
      updateQuery += 'role = ?, ';
      queryParams.push(role);
    }
    
    if (account_status) {
      updateQuery += 'account_status = ?, ';
      queryParams.push(account_status);
    }
    
    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    
    // Add WHERE clause
    updateQuery += ' WHERE id = ?';
    queryParams.push(userId);
    
    // Execute update
    await pool.execute(updateQuery, queryParams);
    
    // Get updated user
    const [updatedUser] = await pool.execute(`
      SELECT id, name, email, role, account_status, 
      DATE_FORMAT(last_login, '%d %b %Y %h:%i %p') as last_login,
      DATE_FORMAT(created_at, '%d %b %Y') as created_at
      FROM users
      WHERE id = ?
    `, [userId]);
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const [existingUser] = await pool.execute('SELECT id, name FROM users WHERE id = ?', [userId]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user details for activity log
    const userName = existingUser[0].name;
    
    // Delete user
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    
    // Log the action
    await pool.execute(
      'INSERT INTO activity_logs (admin_id, type, action, message, service) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'INFO', 'DeleteUser', `User ${userName} deleted successfully.`, 'User']
    );
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};