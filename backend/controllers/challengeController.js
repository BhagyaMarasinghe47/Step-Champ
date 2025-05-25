const { pool } = require('../utils/db');

// Get all challenges
exports.getChallenges = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.id, c.name, 
      DATE_FORMAT(c.start_date, '%d %b %Y') as start_date, 
      DATE_FORMAT(c.end_date, '%d %b %Y') as end_date,
      c.status,
      COUNT(DISTINCT t.id) as team_count,
      COUNT(DISTINCT tm.user_id) as participant_count,
      DATE_FORMAT(c.created_at, '%d %b %Y') as created_at,
      a.name as created_by
      FROM challenges c
      LEFT JOIN teams t ON c.id = t.challenge_id
      LEFT JOIN team_members tm ON t.id = tm.team_id
      JOIN admins a ON c.created_by = a.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    
    const formattedRows = rows.map(row => ({
      ...row,
      period: `${row.start_date} - ${row.end_date}`,
      teams: row.team_count,
      participants: row.participant_count
    }));
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: formattedRows
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single challenge
exports.getChallenge = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.id, c.name, 
      DATE_FORMAT(c.start_date, '%Y-%m-%d') as start_date, 
      DATE_FORMAT(c.end_date, '%Y-%m-%d') as end_date,
      c.status,
      a.name as created_by,
      DATE_FORMAT(c.created_at, '%d %b %Y') as created_at
      FROM challenges c
      JOIN admins a ON c.created_by = a.id
      WHERE c.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    // Get teams for this challenge
    const [teams] = await pool.execute(`
      SELECT t.id, t.name, t.total_steps, t.average_steps,
      COUNT(tm.user_id) as member_count
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      WHERE t.challenge_id = ?
      GROUP BY t.id
    `, [req.params.id]);
    
    res.status(200).json({
      success: true,
      data: {
        ...rows[0],
        teams
      }
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create challenge
exports.createChallenge = async (req, res) => {
  try {
    const { name, start_date, end_date, teams } = req.body;
    
    // Validate input
    if (!name || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, start_date, and end_date'
      });
    }
    
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Calculate status
      const today = new Date();
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      let status = 'Upcoming';
      if (today >= startDate && today <= endDate) {
        status = 'Ongoing';
      } else if (today > endDate) {
        status = 'Completed';
      }
      
      // Create challenge
      const [result] = await connection.execute(
        'INSERT INTO challenges (name, start_date, end_date, status, created_by) VALUES (?, ?, ?, ?, ?)',
        [name, start_date, end_date, status, req.user.id]
      );
      
      const challengeId = result.insertId;
      
      // Create teams if provided
      if (teams && Array.isArray(teams) && teams.length > 0) {
        for (const team of teams) {
          await connection.execute(
            'INSERT INTO teams (name, challenge_id) VALUES (?, ?)',
            [team.name, challengeId]
          );
        }
      }
      
      await connection.commit();
      
      // Log activity
      await connection.execute(
        'INSERT INTO activity_logs (admin_id, type, action, message, service) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'INFO', 'CreateNewChallenge', `New challenge ${name} added successfully.`, 'Challenge']
      );
      
      res.status(201).json({
        success: true,
        message: 'Challenge created successfully',
        data: {
          id: challengeId,
          name,
          start_date,
          end_date,
          status,
          created_by: req.user.name
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update challenge
exports.updateChallenge = async (req, res) => {
  try {
    const { name, start_date, end_date, status } = req.body;
    const challengeId = req.params.id;
    
    // Validate input
    if (!name && !start_date && !end_date && !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update'
      });
    }
    
    // Check if challenge exists
    const [existingChallenge] = await pool.execute('SELECT id FROM challenges WHERE id = ?', [challengeId]);
    
    if (existingChallenge.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    // Build query dynamically
    let updateQuery = 'UPDATE challenges SET ';
    const queryParams = [];
    
    if (name) {
      updateQuery += 'name = ?, ';
      queryParams.push(name);
    }
    
    if (start_date) {
      updateQuery += 'start_date = ?, ';
      queryParams.push(start_date);
    }
    
    if (end_date) {
      updateQuery += 'end_date = ?, ';
      queryParams.push(end_date);
    }
    
    if (status) {
      updateQuery += 'status = ?, ';
      queryParams.push(status);
    }
    
    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    
    // Add WHERE clause
    updateQuery += ' WHERE id = ?';
    queryParams.push(challengeId);
    
    // Execute update
    await pool.execute(updateQuery, queryParams);
    
    // Get updated challenge
    // Update challenge (continued)
    // Get updated challenge
    const [updatedChallenge] = await pool.execute(`
      SELECT c.id, c.name, 
      DATE_FORMAT(c.start_date, '%Y-%m-%d') as start_date, 
      DATE_FORMAT(c.end_date, '%Y-%m-%d') as end_date,
      c.status,
      a.name as created_by,
      DATE_FORMAT(c.created_at, '%d %b %Y') as created_at
      FROM challenges c
      JOIN admins a ON c.created_by = a.id
      WHERE c.id = ?
    `, [challengeId]);
    
    res.status(200).json({
      success: true,
      message: 'Challenge updated successfully',
      data: updatedChallenge[0]
    });
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete challenge
exports.deleteChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    
    // Check if challenge exists
    const [existingChallenge] = await pool.execute('SELECT id, name FROM challenges WHERE id = ?', [challengeId]);
    
    if (existingChallenge.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    const challengeName = existingChallenge[0].name;
    
    // Delete challenge (cascade will delete teams and team members)
    await pool.execute('DELETE FROM challenges WHERE id = ?', [challengeId]);
    
    // Log the action
    await pool.execute(
      'INSERT INTO activity_logs (admin_id, type, action, message, service) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'INFO', 'DeleteChallenge', `Challenge ${challengeName} deleted successfully.`, 'Challenge']
    );
    
    res.status(200).json({
      success: true,
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    console.error('Delete challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add team to challenge
exports.addTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const challengeId = req.params.id;
    
    // Validate input
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide team name'
      });
    }
    
    // Check if challenge exists
    const [existingChallenge] = await pool.execute('SELECT id FROM challenges WHERE id = ?', [challengeId]);
    
    if (existingChallenge.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    // Create team
    const [result] = await pool.execute(
      'INSERT INTO teams (name, challenge_id) VALUES (?, ?)',
      [name, challengeId]
    );
    
    const teamId = result.insertId;
    
    res.status(201).json({
      success: true,
      message: 'Team added successfully',
      data: {
        id: teamId,
        name,
        challenge_id: challengeId,
        total_steps: 0,
        average_steps: 0,
        member_count: 0
      }
    });
  } catch (error) {
    console.error('Add team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};