const { pool } = require('../utils/db');

// Get all activity logs
exports.getActivityLogs = async (req, res) => {
  try {
    const { user, type, from_date, to_date } = req.query;
    
    // Build query dynamically
    let query = `
      SELECT 
        l.id, 
        DATE_FORMAT(l.timestamp, '%d %b %Y %h:%i %p') as created,
        l.type,
        COALESCE(u.name, a.name) as user_name,
        COALESCE(u.email, a.email) as user_email,
        COALESCE(u.role, a.role) as user_role,
        l.action,
        l.message,
        l.service
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN admins a ON l.admin_id = a.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    // Add filters if provided
    if (user) {
      query += ` AND (u.name LIKE ? OR u.email LIKE ? OR a.name LIKE ? OR a.email LIKE ?)`;
      const userPattern = `%${user}%`;
      queryParams.push(userPattern, userPattern, userPattern, userPattern);
    }
    
    if (type && type !== 'ALL') {
      query += ` AND l.type = ?`;
      queryParams.push(type);
    }
    
    if (from_date) {
      query += ` AND DATE(l.timestamp) >= ?`;
      queryParams.push(from_date);
    }
    
    if (to_date) {
      query += ` AND DATE(l.timestamp) <= ?`;
      queryParams.push(to_date);
    }
    
    // Order by timestamp (newest first)
    query += ` ORDER BY l.timestamp DESC`;
    
    // Execute query
    const [rows] = await pool.execute(query, queryParams);
    
    // Format the results
    const formattedRows = rows.map(row => ({
      ...row,
      created: row.created,
      type: row.type,
      user: `${row.user_name} (${row.user_email}) (${row.user_role})`,
      message: row.message,
      service: row.service,
      action: row.action
    }));
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: formattedRows
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get log types for dropdown
exports.getLogTypes = async (req, res) => {
  try {
    // Return predefined log types
    const logTypes = ['ALL', 'INFO', 'ERROR', 'WARNING', 'AUDIT'];
    
    res.status(200).json({
      success: true,
      data: logTypes
    });
  } catch (error) {
    console.error('Get log types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};