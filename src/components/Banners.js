import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [formData, setFormData] = useState({ title: '', image: '', link: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await adminAPI.getBanners();
      setBanners(response.data);
    } catch (error) {
      console.error('Failed to load banners:', error);
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
      if (editBanner) {
        await adminAPI.updateBanner(editBanner._id, formData);
      } else {
        await adminAPI.createBanner(formData);
      }
      setShowModal(false);
      setEditBanner(null);
      setFormData({ title: '', image: '', link: '' });
      loadBanners();
    } catch (error) {
      console.error('Failed to save banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await adminAPI.deleteBanner(id);
        loadBanners();
      } catch (error) {
        console.error('Failed to delete banner:', error);
      }
    }
  };

  const openModal = (banner = null) => {
    setEditBanner(banner);
    setFormData(banner ? { title: banner.title, image: banner.image, link: banner.link } : { title: '', image: '', link: '' });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Home Banners</h2>
        <button
          onClick={() => openModal()}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
        >
          Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-lg shadow p-6">
            <img src={banner.image} alt={banner.title} className="w-full h-40 object-cover rounded mb-4" />
            <h3 className="font-semibold text-lg mb-2">{banner.title}</h3>
            <p className="text-gray-600 mb-4">{banner.link}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => openModal(banner)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(banner._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editBanner ? 'Edit Banner' : 'Add Banner'}
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Banner Title"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
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
              
              <input
                type="text"
                placeholder="Link URL (optional)"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
              />
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
                disabled={loading || uploading || !formData.title || !formData.image}
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

export default Banners;