import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserNav = ({ user }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">
            <img src="/logo/logo-fitsmash.png" alt="Logo SantéApp" style={{ height: 40, verticalAlign: 'middle' }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            </Nav>
            {user && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="success" id="dropdown-user">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.name)}&size=128`}
                    alt="avatar"
                    style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }}
                  />
                  {user.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">Profil</Dropdown.Item>
                  <Dropdown.Item disabled>Email: {user.email}</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Déconnexion</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default UserNav;
