import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, TrendingUp } from 'lucide-react';
import { Card, CardContent, Button } from '../../../components/ui/UIComponents';

const QuickActions = ({ storeId, store, handleViewStore }) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 text-center">
          <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Add New Product</h3>
          <p className="text-slate-600 mb-4">List a new product in your store</p>
          <Link to={`/addproduct/${storeId}`} state={{ storeId, store }}>
            <Button className="bg-slate-800 hover:bg-slate-900">
              Get Started
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 text-center">
          <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">View Your Orders</h3>
          <p className="text-slate-600 mb-4">See Your Store Orders</p>
          <Link to={`/orders/${storeId}`} state={{ storeId, store }}>
            <Button variant="outline">
              View Orders
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 text-center">
          <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics</h3>
          <p className="text-slate-600 mb-4">View detailed store analytics</p>
          <Button variant="outline" disabled>
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;