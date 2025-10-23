import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calculator, ArrowLeft } from 'lucide-react';

const Costing: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const costingModules = [
    {
      id: 'pricing',
      title: 'Pricing Calculator',
      description: 'Calculate product pricing with margins and costs.',
      icon: Calculator,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  ];

  // If pricing module is active, show the pricing interface
  if (activeModule === 'pricing') {
    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveModule(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Costing
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Pricing Calculator
              </h1>
              <p className="text-muted-foreground">
                Upload product data, configure pricing parameters, and calculate
                landed costs.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Interface */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload & Map Data</CardTitle>
              <CardDescription>
                Upload Excel or CSV file with your product data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Excel or CSV File
                </h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <Button>Select File</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>
                  Set up pricing parameters and margins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Default Margin (%)
                    </label>
                    <input
                      type="number"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Currency</label>
                    <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  View calculated pricing and costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No data uploaded yet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Default costing module view
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Costing Module
            </h1>
            <p className="text-muted-foreground">
              Calculate costs, pricing, and financial analysis for your
              business.
            </p>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {costingModules.map((module) => {
          const isAvailable = true;

          return (
            <Card
              key={module.id}
              className={`relative transition-all duration-300 hover:shadow-lg border-gray-200 bg-white ${
                isAvailable
                  ? 'hover:scale-105 cursor-pointer hover:border-primary/30 hover:shadow-primary/10'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="text-6xl">💰</div>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {isAvailable ? (
                  <Link to="/app/pricing">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Open Tool
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full text-gray-400"
                  >
                    Coming Soon
                  </Button>
                )}
              </CardContent>

              {/* Coming Soon Badge */}
              {!isAvailable && (
                <div className="absolute top-2 right-2">
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Costing;
