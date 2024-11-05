import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h1>Access Denied</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/home">Go back to Home</Link>
    </div>
  );
};

export default ErrorPage;
