/*Challengespage.js*/

import React from 'react';
import './ChallengesPage.css';
import { FaRunning } from 'react-icons/fa';

const ChallengesPage = () => {
  const challenges = [
    {
      created: '05 May 2025',
      name: 'jithmi',
      period: '05 May 2025 - 01 Jun 2025',
      teams: 0,
      participants: 0,
      status: 'Ongoing',
    },
  ];

  return (
    <div className="challenges-container">
      <h2 className="title">Step Challenges</h2>
      <div className="table-container">
        <button className="add-btn">Add</button>
        <table className="challenges-table">
          <thead>
            <tr>
              <th>Created ⬍</th>
              <th>Name ⬍</th>
              <th>Period ⬍</th>
              <th># Teams ⬍</th>
              <th># Participants ⬍</th>
              <th>Status ⬍</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((c, index) => (
              <tr key={index}>
                <td>{c.created}</td>
                <td className="name-green">{c.name}</td>
                <td>{c.period}</td>
                <td>{c.teams}</td>
                <td>{c.participants}</td>
                <td className="status">
                  <FaRunning className="status-icon" />
                  {c.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChallengesPage;
