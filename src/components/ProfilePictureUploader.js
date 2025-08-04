import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePictureUploader = () => {
  const { user, login } = useAuth();
  const [image, setImage] = useState(user?.profilePicture || "");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile/picture', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profilePicture: image })
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user, token); // update context
        alert('Profile picture updated!');
      } else {
        alert(data.message || 'Failed to update profile picture');
      }
    } catch (err) {
      alert('Error uploading profile picture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <img src={image || `https://ui-avatars.com/api/?name=${user?.name || 'U'}`} alt="Profile" className="h-20 w-20 rounded-full object-cover border" />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading} className="bg-slate-800 text-white px-4 py-2 rounded">
        {loading ? 'Uploading...' : 'Update Picture'}
      </button>
    </div>
  );
};

export default ProfilePictureUploader;
