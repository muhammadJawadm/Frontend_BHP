import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import DashboardHeader from './Dashboard/DashboardHeader';
import StoreInfoCard from './Dashboard/StoreInfoCard';
import StatsCards from './Dashboard/StatsCards';
import ProductsSection from './Dashboard/ProductsSection';
import QuickActions from './Dashboard/QuickActions';
import LoadingSpinner from './Dashboard/LoadingSpinner';

const Dashboard = () => {
  const {
    store,
    products,
    sortedProducts,
    seller,
    loading,
    error,
    stats,
    sortBy,
    setSortBy,
    storeId,
    handleDeleteProduct,
    handleViewStore,
    handleEditProduct
  } = useDashboard();

  if (loading) {
    return <LoadingSpinner />;
  }
  console.log('Seller data is', seller);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          seller={seller} 
          store={store} 
          error={error} 
          storeId={storeId} 
        />
        
        <StoreInfoCard 
          store={store} 
          handleViewStore={handleViewStore} 
        />
        
        <StatsCards stats={stats} />
        
        <ProductsSection
          products={products}
          sortedProducts={sortedProducts}
          sortBy={sortBy}
          setSortBy={setSortBy}
          storeId={storeId}
          store={store}
          error={error}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
        
        <QuickActions 
          storeId={storeId} 
          store={store} 
          handleViewStore={handleViewStore} 
        />
      </div>
    </div>
  );
};

export default Dashboard;