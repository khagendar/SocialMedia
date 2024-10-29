// import React from 'react';
// import Navbar from './navbar';
// import { Card, CardContent, CardMedia, Typography, IconButton, Divider ,Avatar} from '@mui/material';
// import { Favorite, ChatBubbleOutline, Share } from '@mui/icons-material';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const userPost = {
//     username: 'user1',
//     imageUrl: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
//     altText: 'Image 1',
//     caption: 'This is the first post',
//     likes: 10,
// };

// const Post = ({ post }) => {
//     return (
//         <div className="container" style={{
//             borderBottom :  '1px solid grey',
//             borderTop : '1px solid grey',
//             marginBottom : '3px',
//             padding : '0px',
//         }}> 
//             <Card variant="outlined">
//                 <CardMedia
//                     component="img"
//                     height="500"
//                     width="465"
//                     image={post.imageUrl}
//                     alt={post.altText}
//                 />
//                 <Divider color="black" />
//                 <CardContent sx={{
//                     height : "64px",
//                     padding : "4px",
//                     display : 'flex',
//                 }}>
//                     <Avatar alt="User Image" src="https://i.pravatar.cc/?img=3" sx={{ width: 52, height: 52, marginLeft : "4px" , marginRight : "8px"}} />
//                     <div>
//                         <Typography variant="h6">
//                             {post.username}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                             {post.caption}
//                         </Typography>    
//                     </div>
//                 </CardContent>
//                 <Divider color="black" />
//                 <div className="d-flex justify-content-between align-items-center p-2 ">
//                         <div>
//                             <IconButton>
//                                 <Favorite />
//                             </IconButton>
//                             <IconButton>
//                                 <ChatBubbleOutline />
//                             </IconButton>
//                         </div>
//                         <Typography variant="body2" sx={{ textAlign: 'center',marginLeft :'8px' }}>
//                             {post.likes} likes
//                         </Typography>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// const Home = () => {
//     return (
//         <>
//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 width: '100%',
//                 height: '100vh',
//                 padding: '0',
//                 margin: '0',
//             }}>
//                 <Navbar />
//                 <div style={{
//                     flexGrow: 2,
//                     display: 'flex',
//                     justifyContent: 'center',
//                     overflowY: 'scroll', 
//                     // alignItems: 'center',
//                     // backgroundColor : 'black',
//                 }} className="bg-secondary">
//                     <div style={{
//                         height : '100vh',
//                         borderLeft : '1px solid rgba(0,0,60,0.6)',
//                         borderRight : '1px solid rgba(0,0,60,0.6)',
//                     }}>
//                         <div style={{
//                             // backgroundColor: 'rgba(0,0,0,0.5)',
//                             width: '500px',
//                             // overflowY: 'auto',
//                             // scrollbarWidth : '0px',
//                             // borderLeft : '1px solid rgba(0,0,0,0.7)',
//                             // borderRight : '1px solid rgba(0,0,0,0.7)',

//                             padding: '0px',
//                             margin : '0px'
//                             // boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
//                         }} className='bg-secondary'>
//                             <Post post={userPost} />
//                             <Post post={userPost} />
//                             <Post post={userPost} />
//                             <Post post={userPost} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Home;
import React from 'react';
import Navbar from './navbar';
import { Card, CardContent, CardMedia, Typography, IconButton, Divider, Avatar } from '@mui/material';
import { Favorite, ChatBubbleOutline } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';

const userPost = {
    username: 'user1',
    imageUrl: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
    altText: 'Image 1',
    caption: 'This is the first post',
    likes: 10,
};

const Post = ({ post }) => {
    return (
        <div style={{
            marginBottom: '20px',
            padding: '0',
        }}>
            <Card variant="outlined" sx={{
                // backgroundColor: '#1E1E1E', // Dark card background
                border: 'none',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', // Soft shadow
            }}>
                <CardMedia
                    component="img"
                    height="500"
                    image={post.imageUrl}
                    alt={post.altText}
                />
                <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.8)' }} />
                <CardContent sx={{
                    padding: "16px",
                    display: 'flex',
                    alignItems: 'center',
                    color : '#1E1E1E',
                    // color: '#FFFFFF', // Light text color
                }}>
                    <Avatar alt="User Image" src="https://i.pravatar.cc/?img=3" sx={{ width: 52, height: 52, marginRight: 2 }} />
                    <div>
                        <Typography variant="h6" color="rgba(0,0,0)">
                            {post.username}
                        </Typography>
                        <Typography variant="body2" color="rgba(0,0,0,0.7)">
                            {post.caption}
                        </Typography>
                    </div>
                </CardContent>
                <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.8)' }} />
                <div className="d-flex justify-content-between align-items-center p-2">
                    <div>
                        <IconButton sx={{ color: '#48494B' }}>
                            <Favorite />
                        </IconButton>
                        <IconButton sx={{ color: '#48494B' }}>
                            <ChatBubbleOutline />
                        </IconButton>
                    </div>
                    <Typography variant="body2" sx={{ color: '#1E1E1E' }}>
                        {post.likes} likes
                    </Typography>
                </div>
            </Card>
        </div>
    );
};

const Home = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100vh',
            padding: '0',
            margin: '0',
            backgroundColor: '#121212', // Dark background for the whole page
            color: '#FFFFFF', // Light text color for the whole page
        }}>
            <Navbar />
            <div style={{
                flexGrow: 2,
                display: 'flex',
                justifyContent: 'center',
                overflowY: 'scroll',
            }} className="bg-secondary">
                <div style={{
                    height: '100vh',
                    // borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                    // borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '20px',
                }}>
                    <div style={{
                        width: '500px',
                        padding: '0px',
                        margin: '0px',
                    }}>
                        <Post post={userPost} />
                        <Post post={userPost} />
                        <Post post={userPost} />
                        <Post post={userPost} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;