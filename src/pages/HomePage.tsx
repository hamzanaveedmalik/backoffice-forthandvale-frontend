import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, User, LogOut, ChevronDown } from 'lucide-react';

const HomePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const modules = [
    {
      id: 'sales-crm',
      title: 'Sales & CRM',
      description: 'Manage leads, quotes, and customer interactions.',
      emoji: '👥',
      href: '/app/dashboard',
      isAvailable: true,
    },
    {
      id: 'orders-fulfillment',
      title: 'Orders & Fulfilment',
      description: 'Track customer orders, shipments, and delivery progress.',
      emoji: '📦',
      href: '/app/orders',
      isAvailable: true,
    },
    {
      id: 'costing',
      title: 'Costing',
      description: 'Calculate costs, pricing, and financial analysis.',
      emoji: '💰',
      href: '/app/costing',
      isAvailable: true,
    },
    // {
    //   id: 'manufacturing-analytics',
    //   title: 'Manufacturing Analytics',
    //   description: 'Monitor production, efficiency, and yield metrics.',
    //   emoji: '🏭',
    //   href: '#',
    //   isAvailable: false,
    // },
    // {
    //   id: 'quality-assurance',
    //   title: 'Quality Assurance',
    //   description: 'Review inspections, defects, and CAPA actions.',
    //   emoji: '🛡️',
    //   href: '#',
    //   isAvailable: false,
    // },
    // {
    //   id: 'supply-chain',
    //   title: 'Supply Chain',
    //   description: 'Manage suppliers, purchase orders, and stock levels.',
    //   emoji: '🚚',
    //   href: '#',
    //   isAvailable: false,
    // },
    // {
    //   id: 'reports-analytics',
    //   title: 'Reports & Analytics',
    //   description: 'View company performance and operational dashboards.',
    //   emoji: '📊',
    //   href: '#',
    //   isAvailable: false,
    // },
    {
      id: 'billing-invoices',
      title: 'Billing & Invoices',
      description: 'Manage invoices, payments, and account summaries.',
      emoji: '💳',
      href: '/app/billing',
      isAvailable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/fandv-logo.png"
                alt="FORTH & VALE Logo"
                className="h-10 w-auto"
              />
            </div>

            {/* User Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-gray-50 px-3 py-2"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                  {currentUser?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {currentUser?.fullName || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentUser?.email || 'user@example.com'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">
                      {currentUser?.fullName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentUser?.email || 'user@example.com'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Navigate to profile page (you can implement this later)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 mr-3" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-left mb-16">
            <h1 className="text-4xl text-gray-900 mb-4">
              <span
                style={{
                  fontFamily: 'Bodoni Moda, serif',
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                Welcome,
              </span>{' '}
              <span
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontWeight: 600,
                }}
              >
                {currentUser?.fullName || 'User'}
              </span>
              ! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Please choose the module you'd like to work in today.
            </p>
          </div>

          {/* Module Grid */}
          <div className="flex justify-start">
            <div className="grid grid-cols-2 gap-6 max-w-2xl">
              {modules.map((module) => {
                const isAvailable = module.isAvailable;

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
                        <div className="text-6xl">{module.emoji}</div>
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
                        <Link to={module.href}>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                            Enter Module
                            <ArrowRight className="h-4 w-4 ml-2" />
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
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>Need help? Contact at hamza@forthandvale.com</p>
            <p className="mt-2">Last Login: Now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
