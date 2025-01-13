import React, { useEffect, useState } from 'react';
import { Stack, Typography, Avatar, IconButton,Modal,Box,Button} from '@mui/material';
import axios from 'axios';
import socket from '../../socket';
import Location from '../../Location/Location';
import { useNavigate } from 'react-router-dom';
const Profile = ({ isBlocked, setIsBlocked, receiverDetails, CurrentUser, refreshConversation, conversation, userData, IsUserOnline }) => {
    const currentUserId = CurrentUser._id;
    const [remove, setRemove] = useState(false); // Tracks if the block button should be removed
    const [isReceiver, setIsReceiver] = useState(false); // Tracks if current user is the receiver
    const [openModal, setOpenModal] = useState(false);
    console.log("User data:", userData);
    const [dest, setDest] = useState(null);
    const navigate = useNavigate();

    const handleBlockUser = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/block/${receiverDetails._id}`, {
                currentUserId,
            });
            console.log(response.data.message); // Log response message
            setIsBlocked(true);
            refreshConversation();
            console.log("Blocked user:", receiverDetails._id);
            socket.emit('blockuser', { receiverId: receiverDetails?._id, CurrentUser: CurrentUser?._id });
        } catch (error) {
            console.error('Error blocking user:', error.response ? error.response.data.message : error.message);
        }
    };

    const handleUnblockUser = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/unblock/${receiverDetails._id}`, {
                currentUserId,
            });
            console.log(response.data.message); // Log response message
            setIsBlocked(false);
            refreshConversation();
            socket.emit('Unblockuser', { receiverId: receiverDetails?._id, CurrentUser: CurrentUser?._id });
        } catch (error) {
            console.error('Error unblocking user:', error.response ? error.response.data.message : error.message);
        }
    };

    // useEffect(() => {
    //     console.log("isBlocked state changed:", isBlocked);
    // }, [isBlocked]);

    // useEffect(() => {
    //     // Listen to socket events for blocking and unblocking
    //     socket.on('blockeUser', ({ CurrentUser }) => {
    //         setRemove(true);  // Remove the block button
    //         setIsBlocked(true);  // Set the blocked state
    //         refreshConversation();
    //     });

    //     socket.on('UnblockUser', ({ CurrentUser }) => {
    //         setIsBlocked(false);
    //         setRemove(false); // Show the block button
    //         refreshConversation();
    //     });

    //     return () => {
    //         socket.off('blockeUser');
    //         socket.off('UnblockUser');
    //     };
    // }, [CurrentUser._id]);

    useEffect(() => {
        // Check if the current user is the receiver of a block
        const checkIfBlocked = async () => {
            const res = await axios.get(`http://localhost:5000/sign/user/${receiverDetails._id}`);
            const isSenderBlocked = res.data.blockedUsers.includes(CurrentUser._id);
            setIsReceiver(isSenderBlocked); // Only the receiver should set this to true
            setRemove(isSenderBlocked); // Hide block button if this user is the receiver
        };
        if (receiverDetails._id) checkIfBlocked();
    }, [receiverDetails._id, CurrentUser._id]);
    const handleTrackLocation =async () => {
        if (IsUserOnline) {
            const res = await axios.get(`http://localhost:5000/sign/user/${receiverDetails._id}`);
            console.log("details", res.data);
           
            const destination = [res.data.location.latitude, res.data.location.longitude];
            setDest(destination);
            navigate("/Location", { state: { fridestination: destination } });
            
        } else {
            setOpenModal(true); // Open modal if user is offline
        }
    }

    return (
        <>
        <Stack display={"flex"} flexDirection={'column'} justifyContent={'space-between'}>
        <Stack alignItems="center" spacing={2} padding={7}>
          <Avatar alt="" src={userData?.userProfile?.profile || ''} sx={{ width: 100, height: 100 }} />
          <Stack alignItems={"center"}>
            <Typography component="div" sx={{ fontWeight: "500", fontSize: "20px" }}>
              {receiverDetails?.name}
            </Typography>
            <Typography variant='body2' color="textSecondary">
              {userData.userProfile?.username}
            </Typography>
          </Stack>
        </Stack>
        
        <Button
            onClick={handleTrackLocation}
            variant="outlined"
            sx={{
                margin: 2,
                border: "2px solid black",
                color: 'black',
                '&:hover': {
                    backgroundColor: 'skyblue',
                    color: 'white',
                },
            }}
        >
            <Typography variant="body2">
                Track Location
            </Typography>
        </Button>

            {/* Modal for offline user */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="offline-modal-title"
                aria-describedby="offline-modal-description"
            >
                <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: 300, 
                    bgcolor: 'background.paper', 
                    border: '2px solid #000', 
                    boxShadow: 24, 
                    p: 4 
                }}>
                    <Typography id="offline-modal-title" variant="h6" component="h2">
                        User Offline
                    </Typography>
                    <Typography id="offline-modal-description" sx={{ mt: 2 }}>
                        The user is currently offline. Location tracking is unavailable.
                    </Typography>
                </Box>
            </Modal>
      </Stack>
      
      </>
    );
};

export default Profile;
