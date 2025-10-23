import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { CostingSidebar } from './CostingSidebar';
import { BillingSidebar } from './BillingSidebar';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Define Sales & CRM routes that should show the main sidebar
  const salesCrmRoutes = [
    '/app/dashboard',
    '/app/leads',
    '/app/samples',
    '/app/quotes',
  ];

  // Define Costing routes that should show the costing sidebar
  const costingRoutes = ['/app/costing', '/app/pricing'];

  // Define Billing routes that should show the billing sidebar
  const billingRoutes = ['/app/billing'];

  // Check which sidebar to show
  const shouldShowMainSidebar = salesCrmRoutes.includes(location.pathname);
  const shouldShowCostingSidebar = costingRoutes.includes(location.pathname);
  const shouldShowBillingSidebar = billingRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen bg-background">
      {shouldShowMainSidebar && (
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      )}
      {shouldShowCostingSidebar && (
        <CostingSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      )}
      {shouldShowBillingSidebar && (
        <BillingSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      )}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
