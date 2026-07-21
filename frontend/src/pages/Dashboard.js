// Dashboard.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../components/dashboard/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default Dashboard;
