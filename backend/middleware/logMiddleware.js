const { pool } = require('../utils/db');

// Activity logging middleware
const logActivity = (type, action, service) => {
  return async (req, res, next) => {
    // Store original response.json function
    const originalJson = res.json;
    
    // Override response.json function
    res.json = async function(data) {
      try {
        // Check if response is successful
        if (data.success !== false) {
          const userId = req.user?.id || null;
          const isAdmin = req.user?.role?.includes('Admin') || false;
          const adminId = isAdmin ? userId : null;
          const regularUserId = !isAdmin ? userId : null;
          
          // Create message from data or use default
          const message = data.message || `${action} completed successfully`;
          
          // Log activity to database
          await pool.execute(
            'INSERT INTO activity_logs (user_id, admin_id, type, action, message, service) VALUES (?, ?, ?, ?, ?, ?)',
            [regularUserId, adminId, type, action, message, service]
          );
        }
      } catch (error) {
        console.error('Error logging activity:', error);
      }
      
      // Call original json function
      return originalJson.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  logActivity
};