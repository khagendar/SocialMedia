import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Routes/AuthContex';
import socket from '../socket';
import { useNavigate } from 'react-router-dom';
const DeleteAccount = () => {
    const auth=useAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const navigate=useNavigate();
    const handleDeleteAccount = async() => {
        // Implement the delete account functionality here
        const res= await axios.delete(`http://localhost:5000/sign/deleteAccount/${auth?.user?._id}`);
        console.log(res);
        const userId=auth?.user?._id;
        socket.emit("deleteAccount",userId);
        
        setSnackbarMessage("Account deleted successfully.");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenDialog(false);
        
        socket.emit("logout");
        auth.logout();
        navigate("/signin");
    };

    return (
        <Box 
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "93vh",   
                width: "50vw",    
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center",flexDirection:"column",width:"650px",height:"300px" }}>
            <Typography>
                    Deleting your account is permanent. When you delete your TalkThread account, your profile, photos, comments, likes and followers will be permanently removed. If you’d just like to take a break, you can temporarily deactivate your account.
                    </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center",marginTop:3 }}>
                   
                <Button variant="contained" color="error" onClick={() => setOpenDialog(true)}>
                    Delete Account
                </Button>
                </Box>
            </Box>
                {/* Confirmation Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Confirm Account Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete your account? This action is permanent and cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteAccount} color="error" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for Feedback */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default DeleteAccount;
