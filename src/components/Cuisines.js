import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const Cuisines = () => {
  const [cuisines, setCuisines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCuisines();
  }, []);

  const loadCuisines = async () => {
    try {
      const response = await adminAPI.getCuisines();
      setCuisines(response.data);
    } catch (error) {
      console.error('Failed to load cuisines:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      
      const response = await adminAPI.uploadImage(uploadData);
      setFormData({...formData, image: `https://foodorderbackend-fhmg.onrender.com${response.data.url}`});
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await adminAPI.createCuisine(formData);
      setShowModal(false);
      setFormData({ name: '', image: '' });
      loadCuisines();
    } catch (error) {
      console.error('Failed to save cuisine:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cuisine?')) {
      try {
        await adminAPI.deleteCuisine(id);
        loadCuisines();
      } catch (error) {
        console.error('Failed to delete cuisine:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cuisines</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
        >
          Add Cuisine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cuisines.map((cuisine) => (
          <div key={cuisine._id} className="bg-white rounded-lg shadow p-4">
            <img src={cuisine.image} alt={cuisine.name} className="w-full h-24 object-cover rounded mb-3" />
            <h3 className="font-semibold text-center mb-3">{cuisine.name}</h3>
            <button
              onClick={() => handleDelete(cuisine._id)}
              className="w-full bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Cuisine</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Cuisine Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || uploading || !formData.name || !formData.image}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cuisines;