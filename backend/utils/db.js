const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create admin table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('SysAdmin', 'Admin') DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Participant', 'Moderator') DEFAULT 'Participant',
        account_status ENUM('Active', 'Inactive') DEFAULT 'Active',
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create challenges table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status ENUM('Ongoing', 'Completed', 'Upcoming') DEFAULT 'Upcoming',
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES admins(id)
      )
    `);
    
    // Create teams table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS teams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        challenge_id INT NOT NULL,
        total_steps INT DEFAULT 0,
        average_steps FLOAT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
      )
    `);
    
    // Create team_members table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        team_id INT NOT NULL,
        user_id INT NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_team_member (team_id, user_id)
      )
    `);
    
    // Create activity_logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        admin_id INT,
        type ENUM('INFO', 'ERROR', 'WARNING', 'AUDIT') NOT NULL,
        action VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        service VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
      )
    `);
    
    // Create steps table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS steps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        challenge_id INT NOT NULL,
        date DATE NOT NULL,
        step_count INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_day_challenge (user_id, date, challenge_id)
      )
    `);
    
    // Insert default admin user if not exists
    const [adminRows] = await connection.execute('SELECT * FROM admins WHERE email = ?', ['admin@stepchamp.com']);
    
    if (adminRows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.execute(
        'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@stepchamp.com', hashedPassword, 'SysAdmin']
      );
      console.log('Default admin user created');
    }
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Export pool and initialize function
module.exports = {
  pool,
  initializeDatabase
};