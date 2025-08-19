import React from 'react';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import Breadcrumb from "./components/Breadcrumpb"; // Make sure the path is correct

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* Breadcrumb placed here */}
        <Breadcrumb />

        {/* This will render the current page */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
