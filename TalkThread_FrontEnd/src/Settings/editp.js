import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Stack, TextField, Button, Avatar, Typography, Snackbar, Alert, Box } from '@mui/material';
import defaultImage from '../CreateUser/defaultImage.png';
import axios from 'axios';
import { useAuth } from '../Routes/AuthContex';

const Editp = () => {
    const [avatar, setAvatar] = useState(null);
    const [bio, setBio] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const auth = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState('');

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSnackbarMessage('Please upload a valid image file.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const byteArrayToBase64 = (byteArray) => {
        const binaryString = byteArray.map(byte => String.fromCharCode(byte)).join('');
        return btoa(binaryString);
    };

    const base64String = userData?.image?.data?.data ? byteArrayToBase64(userData.image.data.data) : '';
    const imageUrl = avatar || (base64String ? `data:image/jpeg;base64,${base64String}` : defaultImage);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`http://localhost:5000/sign/user/${auth?.user?._id}`);
            setUserData(res.data);
            // setUsername(res.data.username || '');  // Set initial username
            // setBio(res.data.bio || '');  // Set initial bio
        };
        if (auth?.user?._id) {
            fetchData();
        }
    }, [auth?.user?._id]);

    const validateInputs = () => {
        if (bio.length > 160) {
            setSnackbarMessage('Bio should not exceed 160 characters.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateInputs()) return;

        const formData = {
            username: username || userData.username,  // Use existing username if new one is empty
            bio: bio || userData.bio,  // Use existing bio if new one is empty
            email: auth.user.email,
            profileImage: avatar
        };

        try {
            await axios.put('http://localhost:5000/CreateProfile/CreateUserProfile', formData);
            setSnackbarMessage('Profile updated successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => navigate("/profile"), 800); // Redirect after delay
            setUsername('');  // Set initial username
            setBio('');

        } catch (error) {
            console.error('Error creating profile:', error.response?.data || error.message);
            setSnackbarMessage('Failed to update profile. Please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Stack justifyContent="center" alignItems="center" height="100vh">
            <Box boxShadow={3} width={400} height={500} display="flex" flexDirection="column" sx={{ borderRadius: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} sx={{ width: '300px', margin: '0 auto', paddingTop: '50px' }}>
                        <Typography variant="h5" align="center">Edit Profile</Typography>
                        <label htmlFor="avatar-upload">
                            <Avatar
                                alt="User Avatar"
                                src={imageUrl}
                                sx={{ width: 100, height: 100, cursor: 'pointer', margin: '0 auto' }}
                            />
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            label="Bio"
                            multiline
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Save Profile
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

export default Editp;
