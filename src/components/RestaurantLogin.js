import React, { useState } from 'react';
import axios from 'axios';

const RestaurantLogin = ({ onRestaurantLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://foodorderbackend-fhmg.onrender.com/api/restaurant-dashboard/login', credentials);
      localStorage.setItem('restaurantToken', response.data.token);
      localStorage.setItem('restaurantData', JSON.stringify(response.data.restaurant));
      onRestaurantLogin(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Restaurant Login</h2>
      
      <div className="mb-4 p-4 bg-orange-50 rounded-lg">
        <h3 className="font-semibold text-orange-800 mb-2">Demo Restaurant Owner:</h3>
        <p className="text-sm text-orange-700">
          <strong>Email:</strong> owner@spicevilla.com<br/>
          <strong>Password:</strong> restaurant123
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login as Restaurant Owner'}
        </button>
      </form>
    </div>
  );
};

export default RestaurantLogin;