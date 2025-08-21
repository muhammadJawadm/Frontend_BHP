import React from 'react';
import { Package, DollarSign, Star, Eye, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/UIComponents';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Products</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
            </div>
            <div className="bg-slate-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-slate-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {stats.productsOnSale} on sale
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Revenue (Mock)</p>
              <p className="text-3xl font-bold text-slate-900">Rs.{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            +12% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Average Rating</p>
              <p className="text-3xl font-bold text-slate-900">{stats.averageRating}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Based on {stats.totalProducts} products
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Store Views</p>
              <p className="text-3xl font-bold text-slate-900">2,845</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            +8% this week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;