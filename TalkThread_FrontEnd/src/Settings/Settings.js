import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from '../Home/navbar';
import { Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import Editp from './editp';
import Changepass from './changepass';
import DeleteAccount from './deleteAccount';
const Settings = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100vh',
                padding: 0,
                margin: 0,
                backgroundColor: '#f5f5f5', // Light background for a softer look
            }}
        >
            <Navbar />

            {/* Sidebar for navigation */}
            <Box sx={{ width: '250px', padding: 2,borderRight:"0.2px solid black" }}>
                <Typography
                    variant="h6"
                    fontFamily="Pacifico, cursive"
                    sx={{ marginBottom: 2, display:"flex",alignItems:'center',justifyContent:"center" }}
                    color={'#000'}
                    marginTop={2.5}
                    
                   
                >
                    Settings
                </Typography>
                <Divider />
                <List>
                    <ListItem button component={Link} to="/settings/editProfile">
                        <ListItemText  primary="Edit Profile" sx={{ color: 'black' }} />
                    </ListItem>
                    <ListItem button component={Link} to="/settings/changePassword">
                        <ListItemText primary="Change Password" sx={{ color: 'black' }} />
                    </ListItem>
                    <ListItem button component={Link} to="/settings/DeleteAccount">
                        <ListItemText primary="Delete Account" sx={{ color: 'black' }} />
                    </ListItem>
                </List>

            </Box>

            {/* Main content area */}
            <Box
                sx={{
                    flexGrow: 1,
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#ffffff', // White background for main content
                }}
            >
                <Routes>
                    {/* Redirect to Edit Profile by default */}
                    <Route path="/" element={<Navigate to="/settings/editProfile" replace />} />
                    <Route path="/editProfile" element={<Editp />} />
                    <Route path="/changePassword" element={<Changepass />} />
                    <Route path='/DeleteAccount' element={<DeleteAccount/>} />
                </Routes>
            </Box>
        </Box>
    );
};

export default Settings;
