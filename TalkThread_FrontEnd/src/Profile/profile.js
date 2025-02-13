import React, { useState, useEffect,useRef } from 'react';
import { Avatar, Box, Typography, Grid, Card, CardMedia, Divider, Modal, IconButton, Icon ,Menu,MenuItem} from '@mui/material';
import Navbar from '../Home/navbar';
import axios from 'axios';
import { useAuth } from '../Routes/AuthContex';
import { useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import {Favorite,FavoriteBorder} from '@mui/icons-material';
import { PaperPlaneTilt} from '@phosphor-icons/react';
import socket from '../socket'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
const UserProfile = () => {
    const timeoutRef = useRef(null);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [listType, setListType] = useState(''); // 'followers' or 'following'
    const [listData, setListData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const auth = useAuth();
    const navigate=useNavigate();
    const [userData, setUserData] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // State for modal image
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const { userId } = useParams();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0); // Starting count; replace as needed
    const [commentText, setCommentText] = useState("");
    const[selectedPostId,setSelectedPostId]=useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const[fetchData,setFetchedData]=useState([]);
    const [postIdData,setPostData]=useState(null);
    const [date,setDate]=useState("Now");
    const fetchUserData = async () => {
        try {
            const userRes = await axios.get(`http://localhost:5000/sign/user/${auth?.user?._id}`);
            const followedStatus = Array.isArray(userRes.data.following) && userRes.data.following.includes(userId);
            setIsFollowing(followedStatus);

            const profileRes = await axios.get(`http://localhost:5000/sign/user/${userId || auth?.user?._id}`);
            setUserData(profileRes.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
       
        if (auth?.user?._id) {
            fetchUserData();
        }
    }, [auth?.user?._id, userId]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/post/getPost/${userId || auth?.user?._id}`);
                setPosts(res.data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        if (auth?.user?._id) {
            fetchUserPosts();
        }
    }, [auth?.user?._id, userId]);

    const byteArrayToBase64 = (byteArray) => {
        const binaryString = byteArray.map(byte => String.fromCharCode(byte)).join('');
        return btoa(binaryString);
    };

    const base64String = userData?.image?.data?.data ? byteArrayToBase64(userData.image.data.data) : '';
    const imageUrl = base64String ? `data:image/jpeg;base64,${base64String}` : '';

    const toggleFollow = async () => {
        try {
            const action = isFollowing ? 'unfollow' : 'follow';
            const res = await axios.put(`http://localhost:5000/sign/follow/${userId}`, {
                action,
                currentUserId: auth?.user?._id
            });
            

            if (res.status === 200) {
                setIsFollowing(prev => !prev);
                socket.emit("followClick",res);
                console.log(res);
            } else {
                console.error('Error updating follow status');
            }
        } catch (error) {
            console.error('Failed to toggle follow status:', error);
        }
    };
    useEffect(()=>{
        socket.on("followData",fetchUserData);
    },[fetchUserData]);

    useEffect(()=>{
        socket.on("AccountDeleted",fetchUserData);
    },[fetchUserData]);
    const fetchUserPosts = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/post/getPost/${userId || auth?.user?._id}`);
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    // if (auth?.user?._id) {
    //     fetchUserPosts();
    // }
    const openModal = async (imageData,postId,post) => {
        setSelectedImage(imageData);
       setSelectedPostId(postId);
       setSelectedPost(post);
       try {
        console.log(postId);
        const res = await axios.get(`http://localhost:5000/post/getHomePost/${postId}`); // Ensure the endpoint returns like status
        const postData = res.data;
        console.log(postData);
        setPostData(postData);
        // Set the liked state and like count based on the fetched data
        setIsLiked(postData.likes.includes(auth?.user?._id)); 
        console.log(isLiked);
        setLikeCount(postData.likes.length || 0); 
    } catch (error) {
        console.error('Error fetching post data for modal:', error);
    }
    

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
      
    };
    useEffect(() => {
        if (selectedPostId) {
            fetchPost(selectedPostId); // Fetch when selectedPostId changes
        }
    }, [selectedPostId]);

    const handleLike = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/post/like/${selectedPostId}`, {
                userId: auth?.user?._id
            });
            console.log(res.data);
    
            // Emit updated like count to the server
            socket.emit("Likes", res.data.likeCount);
    
            // Toggle like state and update like count
            setIsLiked((prevIsLiked) => !prevIsLiked);
            setLikeCount(res.data.likeCount);
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };
    

    const handleAddComment = async()=>{
        if (commentText){
            try {
                await axios.put(`http://localhost:5000/post/addComment/${selectedPostId}`, {
                    userId: auth.user._id,
                    text: commentText,
                    name:auth?.user?.name
                });
                socket.emit("comment",selectedPostId);
                setCommentText(''); 
                fetchPost(selectedPostId);
            } catch (error) {
                console.error("Error adding comment:", error);
            }
            console.log();
        }
    };
    
    
    const fetchPost = async (postId) => {
        try {
            const res = await axios.get(`http://localhost:5000/post/getHomePost/${postId}`);
            console.log(res);
            setComments(res.data.comments);
            setSelectedPost(res.data);
        } catch (error) {
            console.error("Error fetching post data:", error);
        }
    };
    useEffect(() => {
        if (selectedPostId) {
            fetchPost(selectedPostId); // Fetch when selectedPostId is valid
        }
    }, []);
    useEffect(()=>{
        socket.on("getComment",(selectedPostId)=>{
            console.log(selectedPostId);
            fetchPost(selectedPostId);
        })
     })
     useEffect(() => {
        const handleGetLikes = (data) => {
            setLikeCount(data);
        };
    
        // Listen for "getLikes" event
        socket.on("getLikes", handleGetLikes);
    
        // Cleanup function to remove listener on component unmount or re-render
        return () => {
            socket.off("getLikes", handleGetLikes);
        };
    }, []);
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleDeletePost = async(selectedPostId) => {
        console.log("Post deleted",selectedPostId); 
        const res= await axios.delete(`http://localhost:5000/post/deletePost/${selectedPostId}`);
        socket.emit("deletePost",selectedPostId);
        fetchUserPosts();
        closeModal();
        console.log(res);
    };
    const openListModal = (type) => {

          const isEmptyList = (type === 'followers' ? userData.follwers : userData.following)?.length === 0;

    if (isEmptyList) {
        console.log(`${type} list is empty`); // Optional log
        return; // Prevent opening modal if the list is empty
    }
        setListType(type);
        setListData(type === 'followers' ? userData.follwers : userData.following); // Use fetched data if available
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    
        // Set a timeout to open the modal after 1 second
        timeoutRef.current = setTimeout(() => {
            setIsListModalOpen(true);
        }, 100);
    };
    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);
    const byteArray = (byteArray) => {
        const binaryString = byteArray.map(byte => String.fromCharCode(byte)).join('');
        return btoa(binaryString);
    };

    const base64 = userData?.image?.data?.data ? byteArray(userData.image.data.data) : '';
    const image = base64 ? `data:image/jpeg;base64,${base64}` : '';

    useEffect(() => {
        const fetchDataForList = async () => {
            try {
                const responses = await Promise.all(
                    listData.map(async (data) => {
                        const response = await axios.get(`http://localhost:5000/sign/user/${data}`);
                        return response.data;
                    })
                );

                // Process images for each user
                const responsesWithImages = responses.map(user => {
                    const base64 = user?.image?.data?.data
                        ? byteArrayToBase64(user.image.data.data)
                        : '';
                    const image = base64 ? `data:image/jpeg;base64,${base64}` : '';
                    return { ...user, image };
                });

                setFetchedData(responsesWithImages); 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (listData && listData.length > 0) {
            fetchDataForList();
        }
    }, [listData]);
    // Function to close list modal
    const closeListModal = () => {
        setIsListModalOpen(false);
        // setFetchedData([]);
    };
    const hadleFollowers=(userid)=>{
        navigate(`/Profile/${userid}`);
        closeListModal();
    }
    useEffect(() => {
        if (postIdData) {
            setDate(new Date(postIdData.createdAt).toDateString());
        }
    }, [postIdData]);
   
    return (
        <Box sx={{ overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh' }}>
                <Navbar />
                <Box
                    sx={{
                        flexGrow: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        overflowY: 'hidden',
                        padding: 2,
                        bgcolor: 'background.default',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '1200px',
                            backgroundColor: 'white',
                            borderRadius: 2,
                            boxShadow: 2,
                            padding: 3,
                            height: 'auto',
                            overflowY: 'auto',
                        }}
                    >
                        <Box display={'flex'} sx={{alignItems:"center"}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                            <Avatar
                                src={imageUrl}
                                alt={userData?.username || "Profile"}
                                sx={{ width: 100, height: 100 }}
                                style={{ display: imageUrl ? 'block' : 'none' }}
                            />
                            <Box sx={{ marginLeft: 2 }}>
                                <Typography variant="h5">{userData?.name}</Typography>
                                <Typography variant="subtitle1" color="text.secondary">@{userData?.username}</Typography>
                                <Typography variant="body2" color="text.secondary">{userData?.bio}</Typography>
                            </Box>
                        </Box>
                        <Box marginLeft={10} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 5 }}>
                                <Typography sx={{ cursor: "pointer" }} onClick={() => openListModal('followers')}>
                                    <strong>{userData?.follwers?.length}</strong> Followers
                                </Typography>
                                <Typography sx={{ cursor: "pointer" }} onClick={() => openListModal('following')}>
                                    <strong>{userData?.following?.length}</strong> Following
                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ marginBottom: 2 }} color="gray" />

                        {userId && userId !== auth?.user?._id && (
                            <button
                                onClick={toggleFollow}
                                style={{
                                    padding: '10px 50px',
                                    fontSize: '16px',
                                    backgroundColor: isFollowing ? '#f44336' : '#3f51b5',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                    marginBottom: '5px'
                                }}
                            >
                                {!isFollowing ? "Follow" : "Unfollow"}
                            </button>
                        )}

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                            paddingBottom: 1,
                            marginBottom:4
                        }}>
                            <Typography variant="h6">Posts</Typography>
                            <Typography variant="body2" color="text.secondary">{posts?.length || 0} Posts</Typography>
                        </Box>

                        {/* <Divider sx={{ marginY: 2 }} /> */}

                        <Grid container spacing={2}>
                            {posts?.map((post) => (
                                <Grid item xs={12} sm={4} md={3} key={post._id}>
                                    <Card
                                        onClick={() => openModal(`data:${post.post.contentType};base64,${post.post.data}`,post._id,post)}
                                        sx={{
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                            '&:hover': { boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' },
                                            height: '300px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={`data:${post.post.contentType};base64,${post.post.data}`}
                                            alt={`Post`}
                                            sx={{ objectFit: 'cover', height: '200px' }}
                                        />
                                        <Box sx={{ padding: 2, height: '100%' }}>
                                            <Typography variant="body1" noWrap>{post.caption}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {`Posted by ${post.name} on ${new Date(post.createdAt).toLocaleDateString()}`}
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>


<Modal open={isModalOpen} onClose={closeModal}>
    <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 850,
            height:600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            display: 'flex', // Flex container to hold image and sidebar
        }}
    >
        <IconButton
            onClick={closeModal}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.600' }}
        >
            <CloseIcon />
        </IconButton>
        
        {(!userId ||userId === auth?.user?._id )&& (
    <>
        <IconButton
            onClick={handleMenuOpen} // Attach menu open handler here
            sx={{ position: 'absolute', top: 8, right: 40, color: 'grey.600' }}
        >
            <MoreVertIcon />
        </IconButton>

        <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <MenuItem
                onClick={() => {
                    handleDeletePost(selectedPostId); // Make sure selectedPostId is defined
                    handleMenuClose();
                }}
            >
                Delete Post
            </MenuItem>
        </Menu>
    </>
)}

        {/* Left side: Image */}
        <Box sx={{ flex: 1, mr: 2 }}>
            <img
                src={selectedImage}
                alt="Selected Post"
                style={{ width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' }}
            />
        </Box>

        {/* Right side: Comments and Likes Section */}
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 850,
            overflowY: 'auto', // Enable scrolling for the comments section
            p: 2,
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
        }}>
            {/* Likes Section */}
            <Typography variant="h6" gutterBottom>
                {userData?.name || 'Unknown User'}
            </Typography>
            <Typography variant="body2" color="rgba(0,0,0,0.7)" gutterBottom>
                hello
            </Typography>

            {/* Comments Section */}
            <Typography variant="h6" gutterBottom>
                Comments
            </Typography>
            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                mb: 2,
                paddingRight: 1, // Space for scrollbar
            }}>
               {comments?comments.map((comment, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2">{comment.name}</Typography>
                    <Typography variant="body2" color="black">
                        {comment.text}
                    </Typography>
                </Box>
            )) : <Typography>No comments yet</Typography>}
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconButton onClick={handleLike} sx={{ color: isLiked ? 'red' : '#48494B' }}>
                                {isLiked ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                <Typography variant="body2" sx={{ ml: 1 }}>
                    {likeCount} {/* Dynamic like count */}
                </Typography>
            </Box>
            <Typography>
            {date}
            </Typography>
            </Box>
            {/* Add New Comment */}
            <Box sx={{ mt: 2, position: 'relative' }}>
    <input
        type="text"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        style={{
            width: '100%',
            padding: '8px 50px 8px 8px', // Extra padding on the right for the button
            borderRadius: '4px',
            border: '1px solid #ddd',
            color: 'black',
        }}
    />
    {commentText && (
        <IconButton
            onClick={handleAddComment}
            sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
            }}
            disabled={!commentText.trim}
        >
            <PaperPlaneTilt style={{ color: commentText ? 'blue' : 'gray' }} />
        </IconButton>
            )}
        </Box>

        </Box>
    </Box>
</Modal>
<Modal open={isListModalOpen} onClose={closeListModal}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '400px',
                    maxHeight: '80vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 2,
                    overflowY: 'auto',
                }}
            >
                <IconButton
                    onClick={closeListModal}
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.600' }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {listType === 'followers' ? 'Followers' : 'Following'}
                </Typography>
                {fetchData.map((user) => (
                <Box key={user?._id} sx={{ display: 'flex', alignItems: 'center', mb: 2,cursor:"pointer" }} onClick={()=>{hadleFollowers(user?._id)}}>
                    <Avatar src={user?.image} alt={user?.username} sx={{ mr: 2 }} />
                    <Box>
                        <Typography variant="body1">{user?.name}</Typography>
                        <Typography variant="body2" color="black">@{user?.username}</Typography>
                    </Box>
                </Box>
            ))}
            </Box>
        </Modal>

        </Box>
    );
};

export default UserProfile;
