import React, { useState } from "react";
import { Stack, TextField, Button, Typography, Snackbar, Alert, Box, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from '../Routes/AuthContex'; // Adjust the path accordingly
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");
    const auth = useAuth();
    const navigate = useNavigate();

    const validateInputs = () => {
        if (newPassword.length < 6) {
            setSnackbarMessage("New password must be at least 6 characters.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return false;
        }
        if (newPassword !== confirmPassword) {
            setSnackbarMessage("New password and confirm password do not match.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateInputs()) return;

        const formData = {
            currentPassword,
            newPassword,
            email: auth.user.email,
        };

        try {
            const response = await axios.put(
                "http://localhost:5000/sign/changePassword/", // Your backend endpoint for changing the password
                formData
            );
            setSnackbarMessage("Password changed successfully!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            setTimeout(() => navigate("/profile"), 2000); // Redirect after delay
        } catch (error) {
            console.error("Error changing password:", error.response?.data || error.message);
            setSnackbarMessage("Failed to change password. Please try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    return (
        <Stack justifyContent="center" alignItems="center" height="100vh">
            <Box boxShadow={3} width={400} height={500} display="flex" flexDirection="column" sx={{ borderRadius: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} sx={{ width: '300px', margin: '0 auto', paddingTop: '50px' }}>
                        <Typography variant="h5" align="center">Change Password</Typography>
                        <TextField
                            label="Current Password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            edge="end"
                                        >
                                            {showCurrentPassword ? <Visibility />:<VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="New Password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <Visibility />:<VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Confirm New Password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <Visibility />:<VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Change Password
                        </Button>
                        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                            <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                    </Stack>
                </form>
            </Box>
        </Stack>
    );
}

export default ChangePassword;
