import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
    <div style={{ height:'100vh', }} className="text-center d-flex align-items-center justify-content-center w-100">
        <Col>
          <h1 style={{ fontSize: '10rem', fontWeight: 'bold', color: '#ccc' }}>404</h1>
          <h2>Uh-oh!</h2>
          <p>We can't find that page.</p>
          <Button variant="primary" onClick={handleGoHome}>Go Back Home</Button>
        </Col>
    </div>
    </>

  );
};

export default NotFound;