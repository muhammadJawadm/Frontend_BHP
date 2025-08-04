import React from 'react';
import { useAuth } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full p-8 bg-white rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
        <p className="mb-2">Welcome, <span className="font-semibold">{user?.name}</span>!</p>
        <p className="mb-2">Email: <span className="font-semibold">{user?.email}</span></p>
        {/* Add order history, profile update, etc. here */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Your Orders</h2>
          <p className="text-slate-500">Order history will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
