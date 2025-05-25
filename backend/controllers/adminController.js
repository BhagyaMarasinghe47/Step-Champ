const bcrypt = require('bcryptjs');
const { pool } = require('../utils/db');

// Get all admins
exports.getAdmins = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, name, email, role, 
      DATE_FORMAT(created_at, '%d %b %Y') as created_at
      FROM admins
      ORDER BY created_at DESC
    `);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get dashboard stats for admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Get user count
    const [userCountResult] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const userCount = userCountResult[0].count;
    
    // Get challenge count
    const [challengeCountResult] = await pool.execute('SELECT COUNT(*) as count FROM challenges');
    const challengeCount = challengeCountResult[0].count;
    
    // Get ongoing challenges count
    const [ongoingChallengesResult] = await pool.execute("SELECT COUNT(*) as count FROM challenges WHERE status = 'Ongoing'");
    const ongoingChallenges = ongoingChallengesResult[0].count;
    
    // Get teams count
    const [teamCountResult] = await pool.execute('SELECT COUNT(*) as count FROM teams');
    const teamCount = teamCountResult[0].count;
    
    // Get recent activity logs
    const [recentLogs] = await pool.execute(`
      SELECT 
        DATE_FORMAT(l.timestamp, '%d %b %Y %h:%i %p') as created,
        l.type,
        COALESCE(u.name, a.name) as user_name,
        l.action,
        l.message
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN admins a ON l.admin_id = a.id
      ORDER BY l.timestamp DESC
      LIMIT 5
    `);
    
    // Get upcoming challenges
    const [upcomingChallenges] = await pool.execute(`
      SELECT id, name, DATE_FORMAT(start_date, '%d %b %Y') as start_date
      FROM challenges
      WHERE start_date > CURDATE()
      ORDER BY start_date ASC
      LIMIT 5
    `);
    
    res.status(200).json({
      success: true,
      data: {
        userCount,
        challengeCount,
        ongoingChallenges,
        teamCount,
        recentActivity: recentLogs,
        upcomingChallenges
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }
    
    // Check if admin already exists
    const [existingAdmin] = await pool.execute('SELECT id FROM admins WHERE email = ?', [email]);
    
    if (existingAdmin.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create admin
    const [result] = await pool.execute(
      'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'Admin']
    );
    
    // Get created admin
    const [newAdmin] = await pool.execute(`
      SELECT id, name, email, role,
      DATE_FORMAT(created_at, '%d %b %Y') as created_at
      FROM admins
      WHERE id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: newAdmin[0]
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update admin profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const adminId = req.user.id;
    
    // Validate input
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update'
      });
    }
    
    // Build query dynamically
    let updateQuery = 'UPDATE admins SET ';
    const queryParams = [];
    
    if (name) {
      updateQuery += 'name = ?, ';
      queryParams.push(name);
    }
    
    if (email) {
      // Check if email already exists for another admin
      if (email !== req.user.email) {
        const [existingAdmin] = await pool.execute('SELECT id FROM admins WHERE email = ? AND id != ?', [email, adminId]);
        
        if (existingAdmin.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use by another admin'
          });
        }
      }
      
      updateQuery += 'email = ?, ';
      queryParams.push(email);
    }
    
    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    
    // Add WHERE clause
    updateQuery += ' WHERE id = ?';
    queryParams.push(adminId);
    
    // Execute update
    await pool.execute(updateQuery, queryParams);
    
    // Get updated admin
    const [updatedAdmin] = await pool.execute(`
      SELECT id, name, email, role
      FROM admins
      WHERE id = ?
    `, [adminId]);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedAdmin[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};