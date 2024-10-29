// // import React,{useState} from 'react';
// import Navbar from '../Home/navbar';
// // const UserProfile=()=>{
// //     return(
// //         <>
// //             <div style={{
// //                 display: 'flex',
// //                 flexDirection: 'row',
// //                 width: '100%',
// //                 height: '100vh',
// //                 padding: '0',
// //                 margin: '0',
// //             }}>
// //                 <Navbar/>
// //                 <div style={{
// //                     flexGrow: 2,
// //                     display: 'flex',
// //                     justifyContent: 'center', // Center horizontally
// //                     alignItems: 'center',      // Center vertically
// //                 }}>
// //                     <div style={{
// //                         backgroundColor: 'red',
// //                         height: '585px', // Fixed height for the scrollable area
// //                         width: '465px',  // Fixed width for the scrollable div
// //                         overflowY: 'auto', // Enable vertical scrolling
// //                         padding: '1px',
// //                         boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
// //                     }}>
// //                         <div>

// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </>
// //     );
// // }
// // export default UserProfile;

// import React from 'react';
// import { Avatar, Box, Typography, Grid, Card, CardMedia, Divider } from '@mui/material';

// const userProfile = {
//   username: 'john_doe',
//   fullName: 'John Doe',
//   bio: 'Lover of nature, photography, and coffee.',
//   profilePicture: 'https://i.pravatar.cc/150?img=1',
//   posts: [
//     'https://picsum.photos/200/200?random=1',
//     'https://picsum.photos/200/200?random=2',
//     'https://picsum.photos/200/200?random=3',
//     'https://picsum.photos/200/200?random=4',
//     'https://picsum.photos/200/200?random=5',
//     'https://picsum.photos/200/200?random=6',
//   ],
// };

// const UserProfile = () => {
//   return (
//     <div style={{
//         display: 'flex',
//         flexDirection: 'row',
//         width: '100%',
//         height: '100vh',
//         padding: '0',
//         margin: '0',
//     }}>
//         <Navbar />
//         <div 
//             style={{
//                     flexGrow: 2,
//                     display: 'flex',
//                     justifyContent: 'center',
//                     overflowY: 'scroll', 
//                     // alignItems: 'center',
//                     // backgroundColor : 'black',
//             }} className="bg-secondary">
                
//             <Box sx={{ height : '100vh', maxWidth: 600, margin: 'auto',backgroundColor : 'rgb(0,0,0,0.5)' }}>
//             {/* Profile Header */}
//                 <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3, padding : 3}}>
//                     <Avatar src={userProfile.profilePicture} sx={{ width: 100, height: 100 }} />
//                     <Box sx={{ marginLeft: 2 }}>
//                     <Typography variant="h5">{userProfile.fullName}</Typography>
//                     <Typography variant="subtitle1">@{userProfile.username}</Typography>
//                     <Typography variant="body2" color="textSecondary">{userProfile.bio}</Typography>
//                     </Box>
//                 </Box>
//                 <Divider></Divider>
//                 <Box 
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',   // Center vertically
//                     justifyContent: 'center', // Center horizontally
//                     border: '1px solid rgba(0,0,0,0.5)',
//                     height: '50px', // Set a height to visualize vertical centering
//                   }}
//                 >
//                   <Typography variant="h5">Posts</Typography>
//                 </Box>

//                 <Divider></Divider>
//                 {/* Posts Grid */}
//                 <Grid container spacing={2} sx={{padding : 3}}>
//                     {userProfile.posts.map((post, index) => (
//                     <Grid item xs={4} key={index}>
//                         <Card>
//                         <CardMedia
//                             component="img"
//                             height="200"
//                             image={post}
//                             alt={`Post ${index + 1}`}
//                         />
//                         </Card>
//                     </Grid>
//                     ))}
//                 </Grid>
//             </Box>
//         </div>
//     </div>
//   );
// };

// export default UserProfile;
import React from 'react';
import { Avatar, Box, Typography, Grid, Card, CardMedia, Divider } from '@mui/material';
import Navbar from '../Home/navbar';

const userProfile = {
  username: 'john_doe',
  fullName: 'John Doe',
  bio: 'Lover of nature, photography, and coffee.',
  profilePicture: 'https://i.pravatar.cc/150?img=1',
  posts: [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2',
    'https://picsum.photos/200/200?random=3',
    'https://picsum.photos/200/200?random=4',
    'https://picsum.photos/200/200?random=5',
    'https://picsum.photos/200/200?random=6',
  ],
};

const UserProfile = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100vh',
      padding: '0',
      margin: '0',
    }}>
      <Navbar />
      <div style={{
        flexGrow: 2,
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'scroll',
        // backgroundColor: '#f4f4f4', // Softer background
      }} className='bg-secondary'>
        <Box sx={{
          height: '100vh',
          maxWidth: 800,
          margin: 'auto',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Soft shadow
        }}>
          {/* Profile Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3, padding: 3 }}>
            <Avatar src={userProfile.profilePicture} sx={{ width: 100, height: 100 }} />
            <Box sx={{ marginLeft: 2 }}>
              <Typography variant="h5">{userProfile.fullName}</Typography>
              <Typography variant="subtitle1" color="text.secondary">@{userProfile.username}</Typography>
              <Typography variant="body2" color="text.secondary">{userProfile.bio}</Typography>
            </Box>
          </Box>
          <Divider />

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0,0,0,0.2)',
            height: '50px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: 1,
          }}>
            <Typography variant="h5">Posts</Typography>
          </Box>

          <Divider />
          {/* Posts Grid */}
          <Grid container spacing={2} sx={{ padding: 3 }}>
            {userProfile.posts.map((post, index) => (
              <Grid item xs={4} key={index}>
                <Card sx={{
                  '&:hover': { boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)' }, // Hover effect
                  borderRadius: 1,
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={post}
                    alt={`Post ${index + 1}`}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default UserProfile;