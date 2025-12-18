import React, { useState } from 'react';
import TrendyItems from '../components/TrendyItems';
import Banners from '../components/Banners';
import Restaurants from '../components/Restaurants';
import Cuisines from '../components/Cuisines';
import Highlights from '../components/Highlights';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('trendy');
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-orange-100">Welcome, {adminData.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-orange-600 px-4 py-2 rounded-md hover:bg-orange-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['trendy', 'banners', 'restaurants', 'cuisines', 'highlights'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'trendy' ? 'Trendy Items' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'trendy' && <TrendyItems />}
        {activeTab === 'banners' && <Banners />}
        {activeTab === 'restaurants' && <Restaurants />}
        {activeTab === 'cuisines' && <Cuisines />}
        {activeTab === 'highlights' && <Highlights />}
      </div>
    </div>
  );
};

export default Dashboard;