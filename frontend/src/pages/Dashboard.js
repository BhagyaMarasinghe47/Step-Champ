import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { FaUsers, FaTrophy, FaRunning, FaUserFriends } from 'react-icons/fa';
import DashboardService from '../services/dashboard.service';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`rounded-full p-3 ${color} text-white mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ activity }) => (
  <div className="border-b border-gray-100 py-3">
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full mr-3 ${
        activity.type === 'INFO' ? 'bg-blue-500' : 
        activity.type === 'WARNING' ? 'bg-yellow-500' : 
        activity.type === 'ERROR' ? 'bg-red-500' : 
        'bg-green-500'
      }`}></div>
      <div className="flex-1">
        <p className="text-sm">{activity.message}</p>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{activity.user_name}</span>
          <span className="text-xs text-gray-500">{activity.created}</span>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    challengeCount: 0,
    ongoingChallenges: 0,
    teamCount: 0,
    recentActivity: [],
    upcomingChallenges: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await DashboardService.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Users',
        data: [65, 75, 70, 80, 75, 88],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Activity Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Users" 
          value={stats.userCount} 
          icon={<FaUsers size={20} />} 
          color="bg-primary"
        />
        <StatCard 
          title="Total Challenges" 
          value={stats.challengeCount} 
          icon={<FaTrophy size={20} />} 
          color="bg-yellow-500"
        />
        <StatCard 
          title="Ongoing Challenges" 
          value={stats.ongoingChallenges} 
          icon={<FaRunning size={20} />} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Teams" 
          value={stats.teamCount} 
          icon={<FaUserFriends size={20} />} 
          color="bg-purple-500"
        />
      </div>
      
      {/* Chart and Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">User Activity</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-0">
              {stats.recentActivity.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
          <div className="mt-4 text-center">
            <a href="/activity-logs" className="text-primary hover:underline text-sm">
              View All Activity
            </a>
          </div>
        </div>
      </div>
      
      {/* Upcoming Challenges */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Upcoming Challenges</h2>
        {stats.upcomingChallenges && stats.upcomingChallenges.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Challenge Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.upcomingChallenges.map((challenge) => (
                  <tr key={challenge.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {challenge.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {challenge.start_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a 
                        href={`/challenges`} 
                        className="text-primary hover:underline"
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No upcoming challenges</p>
        )}
        <div className="mt-4 text-center">
          <a href="/challenges" className="text-primary hover:underline text-sm">
            View All Challenges
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;