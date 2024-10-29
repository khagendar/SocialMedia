import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Correct import
import { cilHome, cilPlus, cilSearch, cilUser, cilChatBubble } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import {
  CNavItem,
  CSidebar,
  CSidebarNav,
  CNavTitle,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CButton,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

const Navbar = () => {
  const navigate = useNavigate(); // Correctly use useNavigate

  const Logout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate('/signin'); // Use navigate to redirect
  };
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for token
    if (!token) {
      navigate('/signin'); // Redirect to sign-in if no token is found
    }
  }, [navigate]);

  return (
    <CSidebar className="border-end" colorScheme="dark">
      <CSidebarNav>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexDirection: 'column',
            height: '100%', // Ensure the sidebar takes the full height
          }}
        >
          <CNavTitle>Talk Thread</CNavTitle>
          <div
            style={{
              flexGrow: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px', // Make sure items stack vertically
            }}
          >
            <CNavItem href="/home">
              <CIcon customClassName="nav-icon" icon={cilHome} /> Home
            </CNavItem>
            <CNavItem href="/Search">
              <CIcon customClassName="nav-icon" icon={cilSearch} /> Search
            </CNavItem>
            <CNavItem href="/chat">
              <CIcon customClassName="nav-icon" icon={cilChatBubble} /> Chat
            </CNavItem>
            <CNavItem href="/Createpost">
              <CIcon customClassName="nav-icon" icon={cilPlus} /> Create
            </CNavItem>
            <CNavItem href="/Profile">
              <CIcon customClassName="nav-icon" icon={cilUser} /> Profile
            </CNavItem>
          </div>
          <CDropdown>
            <CDropdownToggle href="#" style={{ display: 'flex', flexDirection: 'row' }} color="dark">
              Options
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">Settings</CDropdownItem>
              <CDropdownItem>
                <CButton color="secondary" variant="ghost" onClick={Logout}>
                  LogOut
                </CButton>
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CSidebarNav>
    </CSidebar>
  );
};

export default Navbar;