import React from 'react';
import { Store, Eye, Edit, Package  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../../components/ui/UIComponents';

const StoreInfoCard = ({ store, storeId, handleViewStore }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Store className="h-5 w-5" />
          <span>Store Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {store?.name || 'Store Name Loading...'}
              </h3>
              <p className="text-slate-600">{store?.category || 'Category Loading...'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Description</h4>
              <p className="text-slate-600 text-sm">
                {store?.description || 'Store description loading...'}
              </p>
            </div>
            {store?.contactInfo && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Contact Information</h4>
                <p className="text-slate-600 text-sm">
                  Phone: {store.contactInfo.phone || 'N/A'}
                </p>
                <p className="text-slate-600 text-sm">
                  Email: {store.contactInfo.email || 'N/A'}
                </p>
              </div>
            )}
            <div className="flex space-x-2">
              <Link to={`/dashboard/store/${storeId}`}>
              <Button variant="outline" size="sm" onClick={handleViewStore}>
                <Eye className="h-4 w-4 mr-2" />
                View Store
              </Button>
              </Link>
               <Link to={`/orders/${storeId}`} state={{ storeId, store }}>
              <Button variant="outline" size="sm" >
                <Edit className="h-4 w-4 mr-2" />
                View Orders
              </Button>
              </Link>
            </div>
          </div>

          {/* Store Images */}
          <div className="space-y-4">
            {store?.logo && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Store Logo</h4>
                <img
                  src={store.logo}
                  alt="Store logo"
                  className="w-40 h-40 object-cover rounded-lg border"
                />
              </div>
            )}
            {store?.banner && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Store Banner</h4>
                <img
                  src={store.banner}
                  alt="Store banner"
                  className="w-full h-32 object-cover rounded-lg border"
                />
              </div>
            )}
            {(!store?.logo && !store?.banner) && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No store images uploaded</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreInfoCard;