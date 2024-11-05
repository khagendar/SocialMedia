    import React, { useEffect, useState } from 'react';
    import Navbar from './navbar';
    import {
        Card,
        CardContent,
        CardMedia,
        Typography,
        IconButton,
        Divider,
        Avatar,
        Box,
        Modal,
        TextField,
        List, ListItem, ListItemText, ListItemAvatar,
        Button
    } from '@mui/material';
    import { useNavigate } from 'react-router-dom';
    import { Favorite, ChatBubbleOutline,FavoriteBorder } from '@mui/icons-material';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import axios from 'axios';
    import { useAuth } from '../Routes/AuthContex';
    import { PaperPlaneTilt} from '@phosphor-icons/react';
import socket from '../socket';
    const CommentModal = ({ open, handleClose, post, userProfile, comments}) => {
        const auth = useAuth();
        const navigate = useNavigate();
        const [newComment, setNewComment] = useState('');
        const [isLiked, setIsLiked] = useState(post.likes.includes(auth?.user?._id));
        const [likeCount, setLikeCount] = useState(post.likes.length || 0);
        const [comment, setComment] = useState([]); // Initialize as an empty array
        const [date,setDate]=useState("Now");
        useEffect(() => {
            const fetchPost = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/post/getHomePost/${post._id}`);
                    console.log(res);
                    setComment(res.data.comments);
                    setIsLiked(res.data.likes.includes(auth?.user?._id));
                    setLikeCount(res.data.likes.length);
                } catch (error) {
                    console.error("Error fetching post data:", error);
                }
            };
        
            fetchPost();
        }, [post._id]); // Dependency array includes `post._id` to refetch if it changes
        
        const fetchPost = async (data) => {
            console.log(data);
            try {
                const res = await axios.get(`http://localhost:5000/post/getHomePost/${post._id}`);
                // console.log(res);
                setComment(res.data.comments);
                setIsLiked(res.data.likes.includes(auth?.user?._id));
                setLikeCount(res.data.likes.length);
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };
    
        
        const handleLike = async() => {
            try {
                const res=await axios.put(`http://localhost:5000/post/like/${post._id}`, {
                    userId: auth?.user?._id
                });
                console.log(res.data.likeCount);
                
                // setLikeCount(res.data.likeCount);
                const likecnt=res.data.likeCount
                socket.emit("Likes",likecnt);
                // setIsLiked(!isLiked); 
                // setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
            } catch (error) {
                console.error("Error liking post:", error);
            }
        };
        
        

        const handleAddComment = async () => {
            if (newComment.trim()) {
                try {
                    
                const res= await axios.put(`http://localhost:5000/post/addComment/${post?._id}`, {
                        userId: auth.user._id,
                        text: newComment,
                        name:auth?.user?.name
                    });
                    socket.emit("comment",post?._id);
                    fetchPost();
                    setNewComment(''); // Clear the comment input after successful addition
                    
                } catch (error) {
                    console.error("Error adding comment:", error);
                }
            }
        };
        useEffect(() => {
            socket.on("getComment", fetchPost);
            return () => socket.off("getComment", fetchPost);
        }, []);
    
        useEffect(() => {
            socket.on("getLikes", fetchPost);
            return () => socket.off("getLikes", fetchPost);
        }, []);
    
        const handleUserName=(userid)=>{
            navigate(`/Profile/${userid}`);
        }
        useEffect(() => {
            if (post) {
                setDate(new Date(post.createdAt).toDateString());
            }
        }, [post]);
        return (
            <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 850,  // Set a fixed width for consistency
                    height: 600, // Set a fixed height for consistency
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    boxSizing: 'border-box',
                }}
            >
                {/* Left Side: Image */}
                <Box sx={{ flex: 1, mr: 2 }}>
                    <img
                        src={`data:image/png;base64,${post.post.data}`}
                        alt="Selected Post"
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '4px',
                            objectFit: 'cover',
                        }}
                    />
                </Box>
        
                {/* Right Side: Comments and Like Section */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '100%',
                        overflowY: 'auto', // Enable scrolling for only the comments section
                        p: 2,
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <Typography variant="h6" gutterBottom onClick={()=>{handleUserName(userProfile._id)}} sx={{cursor:"pointer"}}>
                        {userProfile?.name || 'Unknown User'}
                    </Typography>
                    <Typography variant="body2" color="rgba(0,0,0,0.7)" gutterBottom>
                        {post.caption}
                    </Typography>
        
                    {/* Like Button */}
                
        
                    {/* Comments Section */}
                    <Typography variant="h6" gutterBottom>
                        Comments
                    </Typography>
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto', // Enable scrolling within the comments section itself
                            mb: 2,
                            maxHeight: '300px', // Limit the height to prevent the entire modal from scrolling
                            paddingRight: 1,
                        }}
                    >
                        {comment?.length > 0 ? (
        comment.map((commentItem, index) => (
            <Box key={index} sx={{ mb: 1.5 }}>
                {/* Check if commentItem is defined and has a name */}
                {commentItem && (
                    <>
                        <Typography variant="subtitle2" >{commentItem.name}</Typography>
                        <Typography
                            variant="body2"
                            color="black"
                            sx={{
                                maxWidth: '500px',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                            }}
                        >
                            {commentItem.text}
                        </Typography>
                    </>
                )}
            </Box>
        ))
    ) : (
        <Typography variant="body2" color="gray">
            No comments yet.
        </Typography>
    )}
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={handleLike} sx={{ color: isLiked ? 'red' : '#48494B' }}>
                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            {likeCount} likes
                        </Typography>
                        
                    </Box>
                    <Box>
                    <Typography>
                    {date}
                    </Typography>
                    </Box>
                    </Box>
                    {/* Add New Comment */}
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    color="primary"
                                    disabled={!newComment.trim()}
                                    onClick={handleAddComment}
                                >
                                    <PaperPlaneTilt style={{ color: newComment.trim() ? 'blue' : 'gray' }} />
                                </IconButton>
                            ),
                        }}
                    />
                </Box>
            </Box>
        </Modal>
        )}    
    const Post = ({ post, userProfile,onCommentClick }) => {
        const navigate = useNavigate();
        const imageSrc = `data:image/png;base64,${post.post.data}`;
        const auth=useAuth();
        const [isLiked, setIsLiked] = useState(post.likes.includes(auth?.user?._id));
        const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    
        const handleLike = async() => {
            try {
                const res=await axios.put(`http://localhost:5000/post/like/${post._id}`, {
                    userId: auth?.user?._id
                });
                console.log(res.data.likeCount);
                const likecnt=res.data.likeCount;
                socket.emit("Likes",likecnt);
                setIsLiked(prevIsLiked => !prevIsLiked);
                setLikeCount(res.data.likeCount);
            } catch (error) {
                console.error("Error liking post:", error);
            }
        };
        const fetchPost = async (data) => {
            console.log(data)
            try {
                const res = await axios.get(`http://localhost:5000/post/getHomePost/${post._id}`);
                // console.log(res);
                setIsLiked(res.data.likes.includes(auth?.user?._id));
                setLikeCount(res.data.likes.length);
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        useEffect(() => {
            socket.on("getLikes", fetchPost);
            return () => socket.off("getLikes", fetchPost);
        }, [fetchPost]);
    
        
     
        const byteArrayToBase64 = (byteArray) => {
            if (!Array.isArray(byteArray)) {
                console.error('Provided data is not an array');
                return null;
            }
            const binaryString = byteArray.map(byte => String.fromCharCode(byte)).join('');
            return btoa(binaryString);
        };

        const base64String = userProfile?.image?.data?.data ? byteArrayToBase64(userProfile.image.data.data) : '';
        const imageUrl = base64String ? `data:image/jpeg;base64,${base64String}` : '';

        const handleUserName=(userid)=>{
            navigate(`/Profile/${userid}`);
        }
        return (
            <Box sx={{ marginBottom: 0.5 ,border:"3px solid black",borderRadius:2}}>
                <Card variant="outlined" sx={{ boxShadow:5,borderRadius:2}}>
                    <CardMedia component="img" height="500" image={imageSrc} alt={post.caption} />
                    <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.8)' }} />
                    <CardContent sx={{ display: 'flex', alignItems: 'center', color: '#1E1E1E' }}>
                        <Avatar alt="User Image" src={imageUrl || ''} sx={{ width: 52, height: 52, marginRight: 2 }} />
                        <Box>
                            <Typography variant="h6" color="rgba(0,0,0)" onClick={()=>{handleUserName(userProfile._id)}} sx={{cursor:"pointer"}}>
                                {userProfile ? userProfile.name : 'Unknown User'}
                            </Typography>
                            <Typography variant="body2" color="rgba(0,0,0,0.7)">
                                {post.caption}
                            </Typography>
                        </Box>
                    </CardContent>
                    <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.8)' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                        <Box>
                        <IconButton onClick={handleLike} sx={{ color: isLiked ? 'red' : '#48494B' }}>
                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                            <IconButton sx={{ color: '#48494B' }} onClick={() => onCommentClick(post)}>
                            <ChatBubbleOutline />
                        </IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#1E1E1E' }}>
                            {likeCount} likes
                        </Typography>
                    </Box>
                </Card>
            </Box>
        );
    };

    const FriendSuggestions = ({ suggestions}) => {
        const auth=useAuth();
        const [followStatuses, setFollowStatuses] = useState({})
        const navigate = useNavigate();
        console.log(suggestions);
        const byteArrayToBase64 = (byteArray) => {
            if (!Array.isArray(byteArray)) {
                console.error('Provided data is not an array');
                return null;
            }
            const binaryString = byteArray.map(byte => String.fromCharCode(byte)).join('');
            return btoa(binaryString);
        };
        const handleSuggestion=(user)=>{
            // console.log(user?._id);
            navigate(`/Profile/${user?._id}`);
            
        }
        // const toggleFollow = async (user) => {
        //     try {
        //         const action = followStatuses[user._id] ? 'unfollow' : 'follow';
        //         const res = await axios.put(`http://localhost:5000/sign/follow/${user._id}`, {
        //             action,
        //             currentUserId: auth?.user?._id
        //         });
    
        //         if (res.status === 200) {
        //             // friendSuggestion();
                   
        //             setFollowStatuses(prevStatuses => ({
        //                 ...prevStatuses,
        //                 [user._id]: !prevStatuses[user._id] // Toggle follow status for this user
        //             }));
        //             refreshPosts();
        //         } else {
        //             console.error('Error updating follow status');
        //         }
        //     } catch (error) {
        //         console.error('Failed to toggle follow status:', error);
        //     }
        // };
        return (
            <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, p: 2, borderRadius: 2, mb: 2, maxWidth: '500px', width: "300px" }}>
                <Typography variant="body" color={'black'}>Friend Suggestions</Typography>
                <List>
                    {suggestions.length > 0 ? (
                        <List>
                            {/* Limit to maximum of 10 suggestions */}
                            {suggestions.slice(0, 10).map(user => {
                                const imageUrl = user?.image ? `data:image/jpeg;base64,${user?.image?.data}` : '';
        
                                return (
                                    <ListItem key={user._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: "pointer" }} onClick={() => { handleSuggestion(user) }}>
                                            <ListItemAvatar>
                                                <Avatar src={imageUrl} alt={user.name} />
                                            </ListItemAvatar>
                                            <Typography variant='body2' color="black" marginRight={2}>
                                                {user.name}
                                            </Typography>
                                        </Box>
                                        {/* Uncomment to enable follow/unfollow button */}
                                        {/* <Button variant="contained" size="small" color="primary" onClick={() => { toggleFollow(user) }}>
                                            {!followStatuses[user._id] ? "Follow" : "Unfollow"}
                                        </Button> */}
                                    </ListItem>
                                );
                            })}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            No suggestions available
                        </Typography>
                    )}
                </List>
            </Box>
        );
    }        

    const Home = () => {
        const [userProfiles, setUserProfiles] = useState([]);
        const [posts, setPosts] = useState([]);
        const auth = useAuth();
        const [selectedPost, setSelectedPost] = useState(null);
        const [isModalOpen, setModalOpen] = useState(false);
        const [comments,setComments]=useState(null);
        const [friendsuggestion,setFriendSuggestion]=useState([]);
        useEffect(() => {
            if (auth?.user?._id) {
                console.log('User ID:', auth.user._id); // Debugging log
                socket.emit("addUser", auth.user._id);
        
            } else {
                console.log('No user found or user ID is undefined'); // Debugging log
            }
        }, [auth?.user?._id]);
        const refreshPosts = async () => {
            try {
                const userIds = [auth?.user?._id, ...userProfiles.map(profile => profile._id)].join(',');
                const allPostsRes = await axios.get(`http://localhost:5000/post/getPost`, {
                    params: { userIds }
                });
                setPosts(allPostsRes.data);
            } catch (error) {
                console.error('Error refreshing posts:', error);
            }
        };
    
        useEffect(() => {
            const fetchFollowing = async () => {
                try {
                    // Fetch current user's details
                    const currentUserRes = await axios.get(`http://localhost:5000/sign/user/${auth?.user?._id}`);
                    const currentUser = currentUserRes.data;

                    // Fetch following user details
                    const { following } = currentUser; // Extract following IDs

                    // Create an array to hold the profiles of current user and their following users
                    const profiles = [currentUser]; // Start with the current user

                    // Fetch details for each following user
                    const followingProfilesPromises = following.map(async (userId) => {
                        const res = await axios.get(`http://localhost:5000/sign/user/${userId}`);
                        return res.data; // Return the user profile
                    });

                    // Wait for all profiles to be fetched
                    const followingProfiles = await Promise.all(followingProfilesPromises);
                    profiles.push(...followingProfiles); // Add following profiles to the array

                    // Set all profiles to state
                    setUserProfiles(profiles);

                    // Fetch posts
                    const userIds = [auth?.user?._id, ...following].join(',');
                    const allPostsRes = await axios.get(`http://localhost:5000/post/getPost`, {
                        params: { userIds }
                    });
                    setPosts(allPostsRes.data);
                } catch (error) {
                    console.error('Error fetching following details:', error);
                }
            };

            if (auth?.user?._id) {
                fetchFollowing();
            }
        }, [auth?.user?._id]);
        const openCommentModal = (post) => {
            setSelectedPost(post);
            setComments(post.comments || []);
            setModalOpen(true);
        };

        const closeModal = () => {
            setModalOpen(false);
            setSelectedPost(null);
        };
        // console.log(selectedPost);
        useEffect(() => {
            console.log('Posts updated:', posts);
            console.log('Selected post updated:', selectedPost);
        }, [posts, selectedPost]);

        useEffect(()=>{
            const friendSuggestion=async()=>{
                const res=await axios.get(`http://localhost:5000/sign/friendSuggestion/${auth?.user?._id}`);
              setFriendSuggestion(res.data);

            }
            if(auth?.user?._id)
            {
                friendSuggestion();
            }
        },[])
        useEffect(()=>{
            socket.on("postDeleted",()=>{
                refreshPosts();
            })
        })
        useEffect(()=>{
            socket.on("postCreated",(data)=>{
                console.log(data);
                refreshPosts();
            })
        })
        useEffect(()=>{
            socket.on("AccountDeleted",()=>{
                refreshPosts();
            });
        });
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '100vh',
                    padding: 0,
                    margin: 0,
                    // backgroundColor: '#121212',
                    color: '#FFFFFF',
                }}
            >
                <Navbar />
                {/* <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', p: 2, }}> */}
                
     
                <Box sx={{ flexGrow: 2, display: 'flex', overflowY: 'scroll',justifyContent:"space-evenly" }}>
                    <Box sx={{ height: '100vh', padding: 2, width: '100%', maxWidth: '500px' }}>
                        {posts.map(post => {
                            // Find the corresponding user profile for the post
                            const userProfile = userProfiles.find(profile => profile._id === post.userId);
                            return (
                                <Post key={post._id} post={post} userProfile={userProfile} onCommentClick={openCommentModal} />
                            );
                        })}
                    </Box>
                    <Box marginTop={5} position={'relative'} left={100}>
                    <FriendSuggestions suggestions={friendsuggestion} />
                    </Box>
                </Box>
                {/* <Box sx={{ alignSelf: 'flex-start', position: 'sticky', top: 0, mt: 2 }}> */}
               
                              
                {/* </Box>  */}
                {/* </Box> */}
                {selectedPost && (
                    <CommentModal
                    key={`${selectedPost._id}-${selectedPost?.comments?.length}`} // Unique key for re-rendering
                    open={isModalOpen}
                    handleClose={closeModal}
                    post={selectedPost}
                    userProfile={userProfiles.find(profile => profile._id === selectedPost.userId)}
                    comments={comments||[]}
                />
                )}
            </Box>
        );
    };

    export default Home;
