import { CodeSimple, Gear } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom'; // Correct import
import { cilHome, cilPlus, cilSearch, cilUser, cilChatBubble,cilLocationPin } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Divider, Stack, IconButton, Avatar, Menu, MenuItem, Typography, Modal } from '@mui/material';
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
import './navbar.css'
import { useAuth } from '../Routes/AuthContex';
import '@coreui/coreui/dist/css/coreui.min.css';
import menuIcon from '../chatApplication/images/menu.png';
import socket from '../socket';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const Navbar = () => {
  const auth =useAuth();
  const navigate = useNavigate(); // Correctly use useNavigate
  const [anchorEl, setAnchorEl] = useState(null);
  // const [openModal, setOpenModal] = useState(false);
    const Logout = () => {
      console.log("Logging out...");
      socket.emit("logout");
      auth.logout();
      navigate("/signin");
  };
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for token
    if (!token) {
      navigate('/signin'); // Redirect to sign-in if no token is found
    }
  }, [navigate]);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
 const handleSettings =()=>{
  navigate('/settings');
 }
  return  (
    
      <CSidebar className="border-end border-secondary" > {/* No custom class here */}
        <CSidebarNav>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexDirection: 'column',
              height: '100%', // Ensure the sidebar takes the full height
            }}
          >
            <Box display={'flex'} justifyContent={"flex-start"}>
              <Typography 
                fontSize={'20px'}
                sx={{ fontFamily: 'Pacifico, cursive'}} 
                margin={4}
                className='heading'
              >
                TalkThread 
              </Typography>
            </Box>
            <div
              style={{
                flexGrow: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px', // Make sure items stack vertically
              }}
            >
              <CNavItem href="/home">
              <CIcon customClassName="nav-icon" icon={cilHome} style={{ color: 'black' }} /> <strong>Home</strong>
              </CNavItem>
              <CNavItem href="/Search">
                <CIcon customClassName="nav-icon" icon={cilSearch} style={{ color: 'black' }}/> <strong>Search</strong>
              </CNavItem>
              <CNavItem href="/chat">
                <CIcon customClassName="nav-icon" icon={cilChatBubble} style={{ color: 'black' }}/><strong> Chat</strong>
              </CNavItem>
              <CNavItem href="/Createpost">
                <CIcon customClassName="nav-icon" icon={cilPlus} style={{ color: 'black' }}/> <strong>Create</strong>
              </CNavItem>
              <CNavItem href="/Profile">
                <CIcon customClassName="nav-icon" icon={cilUser} style={{ color: 'black' }}/> <strong>Profile</strong>
              </CNavItem>
              
            </div>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} >
              <IconButton onClick={handleMenuOpen} display={"flex"} sx={{alignItems:'flex-start', justifyContent:'flex-start'}}>
                <img src={menuIcon} alt="menu" style={{ width: 30, height: 30, objectFit: 'contain' }} />
              </IconButton>
              <Typography>
                More
              </Typography>
            </Box>
            {/* Menu component */}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              {/* Menu item for Settings */}
              <MenuItem onClick={handleMenuClose}>
                <Stack direction="row" spacing={2} alignItems="center" onClick={() => { handleSettings(); }}>
                  <Gear size={25} />
                  <Typography variant="body2" fontSize="15px">
                    Settings
                  </Typography>
                </Stack>
              </MenuItem>

              {/* Menu item for Logout */}
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  Logout();
                }}
              >
                <Typography variant="body2" fontSize="15px">
                  Log out
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        </CSidebarNav>
      </CSidebar>
    
  );
};

export default Navbar;