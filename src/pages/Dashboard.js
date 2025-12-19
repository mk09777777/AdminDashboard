import React, { useState, useEffect } from 'react';
import TrendyItems from '../components/TrendyItems';
import Banners from '../components/Banners';
import Restaurants from '../components/Restaurants';
import Cuisines from '../components/Cuisines';
import Highlights from '../components/Highlights';
import RestaurantLogin from '../components/RestaurantLogin';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('trendy');
  const [isRestaurantMode, setIsRestaurantMode] = useState(false);
  const [restaurantLoggedIn, setRestaurantLoggedIn] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

  useEffect(() => {
    setActiveTab(isRestaurantMode ? 'menu' : 'trendy');
    if (!isRestaurantMode) {
      setRestaurantLoggedIn(false);
      setRestaurantData(null);
      localStorage.removeItem('restaurantToken');
      localStorage.removeItem('restaurantData');
    }
  }, [isRestaurantMode]);

  useEffect(() => {
    const token = localStorage.getItem('restaurantToken');
    const data = localStorage.getItem('restaurantData');
    if (token && data) {
      setRestaurantLoggedIn(true);
      setRestaurantData(JSON.parse(data));
    }
  }, []);

  const handleRestaurantLogin = (loginData) => {
    setRestaurantLoggedIn(true);
    setRestaurantData(loginData.restaurant);
  };

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
              <h1 className="text-3xl font-bold text-white">
                {isRestaurantMode ? (restaurantData ? `${restaurantData.name} Dashboard` : 'Restaurant Dashboard') : 'Admin Dashboard'}
              </h1>
              <p className="text-orange-100">
                Welcome, {isRestaurantMode && restaurantData ? restaurantData.name : adminData.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm">Restaurant Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRestaurantMode}
                    onChange={(e) => setIsRestaurantMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
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
      </div>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(isRestaurantMode 
              ? ['menu', 'orders', 'profile', 'analytics'] 
              : ['trendy', 'banners', 'restaurants', 'cuisines', 'highlights']
            ).map((tab) => (
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
        {isRestaurantMode ? (
          // Restaurant Dashboard Content
          restaurantLoggedIn ? (
            <>
              {activeTab === 'menu' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Menu Management</h2>
                  <p className="text-gray-600">Manage your restaurant menu items, categories, and pricing.</p>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">✅ Connected to {restaurantData?.name} - You can now manage menu items, view orders, and update restaurant information.</p>
                  </div>
                </div>
              )}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Order Management</h2>
                  <p className="text-gray-600">View and manage incoming orders from customers.</p>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">✅ Ready to receive and manage orders for {restaurantData?.name}</p>
                  </div>
                </div>
              )}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Restaurant Profile</h2>
                  <p className="text-gray-600">Update restaurant information, hours, and contact details.</p>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">✅ Manage {restaurantData?.name} profile and settings</p>
                  </div>
                </div>
              )}
              {activeTab === 'analytics' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Analytics</h2>
                  <p className="text-gray-600">View sales reports, popular items, and performance metrics.</p>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">✅ View analytics and reports for {restaurantData?.name}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <RestaurantLogin onRestaurantLogin={handleRestaurantLogin} />
          )
        ) : (
          // Admin Dashboard Content
          <>
            {activeTab === 'trendy' && <TrendyItems />}
            {activeTab === 'banners' && <Banners />}
            {activeTab === 'restaurants' && <Restaurants />}
            {activeTab === 'cuisines' && <Cuisines />}
            {activeTab === 'highlights' && <Highlights />}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;