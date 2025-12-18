import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await adminAPI.getRestaurants();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    }
  };

  const toggleRestaurantStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      await adminAPI.updateRestaurantStatus(id, !currentStatus);
      loadRestaurants();
    } catch (error) {
      console.error('Failed to update restaurant status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Restaurants</h2>
        <div className="text-sm text-gray-600">
          Total: {restaurants.length} restaurants
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {restaurants.map((restaurant) => (
            <li key={restaurant._id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        restaurant.openingHours?.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.openingHours?.isOpen ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => toggleRestaurantStatus(restaurant._id, restaurant.openingHours?.isOpen)}
                        disabled={loading}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          restaurant.openingHours?.isOpen
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        } disabled:opacity-50`}
                      >
                        {restaurant.openingHours?.isOpen ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Cuisines:</span> {restaurant.cuisines?.join(', ') || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Rating:</span> {restaurant.rating}/5 ({restaurant.totalRatings} reviews)
                    </div>
                    <div>
                      <span className="font-medium">Contact:</span> {restaurant.contact?.phone || 'N/A'}
                    </div>
                  </div>
                  
                  {restaurant.address?.fullAddress && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Address:</span> {restaurant.address.fullAddress}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No restaurants found</div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;