import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const TrendyItems = () => {
  const [items, setItems] = useState([]);
  const [restaurantItems, setRestaurantItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
    loadRestaurantItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await adminAPI.getTrendyItems();
      setItems(response.data);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  const loadRestaurantItems = async () => {
    try {
      const response = await adminAPI.getRestaurantItems();
      setRestaurantItems(response.data);
    } catch (error) {
      console.error('Failed to load restaurant items:', error);
    }
  };

  const handleSave = async () => {
    if (selectedItems.length === 0) return;
    setLoading(true);
    try {
      for (const item of selectedItems) {
        await adminAPI.createTrendyItem({
          itemId: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          category: item.category,
          restaurant: item.restaurant.name,
          isActive: true
        });
      }
      setShowModal(false);
      setSelectedItems([]);
      loadItems();
    } catch (error) {
      console.error('Failed to save items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this trendy item?')) {
      try {
        await adminAPI.deleteTrendyItem(id);
        loadItems();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trendy Items</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
        >
          Add Trendy Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow p-6">
            <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded mb-4" />
            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-2">{item.category}</p>
            <p className="text-sm text-gray-500 mb-4">From: {item.restaurant}</p>
            <button
              onClick={() => handleDelete(item._id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Select Item from Restaurants</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurantItems.map((item) => (
                <div 
                  key={item._id} 
                  className={`border rounded-lg p-4 cursor-pointer ${selectedItems.some(selected => selected._id === item._id) ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                  onClick={() => {
                    const isSelected = selectedItems.some(selected => selected._id === item._id);
                    if (isSelected) {
                      setSelectedItems(selectedItems.filter(selected => selected._id !== item._id));
                    } else {
                      setSelectedItems([...selectedItems, item]);
                    }
                  }}
                >
                  <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded mb-2" />
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-sm text-gray-500">From: {item.restaurant.name}</p>
                  <p className="text-sm font-semibold">₹{item.price}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {setShowModal(false); setSelectedItems([]);}}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={selectedItems.length === 0 || loading}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : `Add ${selectedItems.length} Item${selectedItems.length > 1 ? 's' : ''} to Trendy`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendyItems;