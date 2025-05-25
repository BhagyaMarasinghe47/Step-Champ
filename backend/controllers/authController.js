const bcrypt = require('bcryptjs');
const { pool } = require('../utils/db');
const { generateToken } = require('../utils/jwtHelper');

// Admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Find admin by email
    const [rows] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const admin = rows[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Log login activity
    await pool.execute(
      'INSERT INTO activity_logs (admin_id, type, action, message, service) VALUES (?, ?, ?, ?, ?)',
      [admin.id, 'AUDIT', 'LoginUser', 'Logged into the system.', 'User']
    );
    
    // Generate token
    const token = generateToken(admin.id, admin.role);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get current admin
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user.id;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }
    
    // Find admin
    const [rows] = await pool.execute('SELECT * FROM admins WHERE id = ?', [adminId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    const admin = rows[0];
    
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await pool.execute(
      'UPDATE admins SET password = ? WHERE id = ?',
      [hashedPassword, adminId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};