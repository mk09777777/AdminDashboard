import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ quote: '', description: '', image: '', logo: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    try {
      const response = await adminAPI.getHighlights();
      setHighlights(response.data);
    } catch (error) {
      console.error('Failed to load highlights:', error);
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
      await adminAPI.createHighlight(formData);
      setShowModal(false);
      setFormData({ quote: '', description: '', image: '', logo: '' });
      loadHighlights();
    } catch (error) {
      console.error('Failed to save highlight:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      try {
        await adminAPI.deleteHighlight(id);
        loadHighlights();
      } catch (error) {
        console.error('Failed to delete highlight:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Highlights</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
        >
          Add Highlight
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((highlight) => (
          <div key={highlight._id} className="bg-white rounded-lg shadow p-6">
            <img src={highlight.image} alt={highlight.title} className="w-full h-40 object-cover rounded mb-4" />
            <h3 className="font-semibold text-lg mb-2">{highlight.quote}</h3>
            {highlight.description && <p className="text-gray-600 mb-4">{highlight.description}</p>}
            <button
              onClick={() => handleDelete(highlight._id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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
            <h3 className="text-lg font-semibold mb-4">Add Highlight</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Quote"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.quote}
                onChange={(e) => setFormData({...formData, quote: e.target.value})}
              />
              
              <input
                type="text"
                placeholder="Description (optional)"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                disabled={loading || uploading || !formData.quote || !formData.image}
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

export default Highlights;