const PostModel = require('../model/post');
const UserModel = require('../model/user'); // Make sure to import the User model

class MyPosts {
  async getPosts(req, res) {
    try {
      const { user } = req.body; 
      console.log(user);
      // Ensure user is defined
      if (!user || !user.following || !Array.isArray(user.following)) {
        return res.status(400).json({ message: 'User or following list is not defined or not an array.' });
      }

      const following = [...user.following]; // Copy the following array
      following.push(user._id); // Add current user ID to the following list

      if (following.length === 0) {
        return res.status(400).json({ message: 'Following list is required.' });
      }

      // Fetch posts where the user ID is in the following list
      const posts = await PostModel.find({
        userId: { $in: following }
      }).sort({ createdAt: -1 }); // Sort by createdAt timestamp

      const formattedPosts = posts.map(post => {
        // Assuming you have a field named image that is a Buffer
        if (post.post.data && Buffer.isBuffer(post.post.data)) {
          post.post.data = post.post.data.toString('base64'); // Change to post.post.data
        }
        return post;
      });

      const userProfiles = await UserModel.find({ _id: { $in: following } }); // Use UserModel to fetch profiles
      if (!userProfiles || !posts) {
        return res.status(400).json({ message: "User not found or no posts available." });
      }

      const userpro = userProfiles.map(userall => {
        if (userall.profile && Buffer.isBuffer(userall.profile)) {
          userall.profile = userall.profile.toString('base64');
        }
        return userall;
      });

      return res.status(200).json({ allposts: formattedPosts, userp: userpro });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while fetching posts.' });
    }
  }
  async FriendSuggestions(req, res) {
    const userId = req.params.userId;

    try {
        // Fetch the current user, including their following and followers
        const currentUser = await UserModel.findById(userId).populate('following follwers');

        // Get the IDs of users that the current user follows
        const userFollowingIds = currentUser.following.map(user => user._id.toString());

        // Get the IDs of users who follow the current user
        const userFollowersIds = currentUser.follwers.map(user => user._id.toString());

        // Find other users who are:
        // - not the current user
        // - not in the current user's following list (i.e., users they aren't already following)
        const suggestions = await UserModel.find({
            _id: { $ne: userId, $nin: userFollowingIds } // Exclude the current user and users they already follow
        }).populate('follwers following'); // Populate followers and following for each suggestion

        // Prepare the suggestions with mutual friends count and filtering logic
        const results = suggestions.map(user => {
            // Get mutual friends by comparing the user's followers with the current user's following list
            const mutualFollowers = user.follwers.filter(follower =>
                userFollowingIds.includes(follower._id.toString())
            );

            // Include users who are followed by the current user's followers but whom the user isn't following yet
            const followersYouDontFollow = user.follwers.filter(follower =>
                !userFollowingIds.includes(follower._id.toString()) && userFollowersIds.includes(follower._id.toString())
            );

            // Check the followers of the user's followers and find users that the current user isn't following
            const extendedSuggestions = user.follwers.flatMap(follower => 
                follower.following.filter(followedUser =>
                    !userFollowingIds.includes(followedUser._id.toString()) &&
                    followedUser._id.toString() !== userId
                )
            );

            // Create a unique set of extended users to avoid duplicates
            const uniqueExtendedSuggestions = Array.from(new Set(extendedSuggestions.map(user => user._id.toString())));

            return {
                ...user.toObject(),
                mutualFriendsCount: mutualFollowers.length,
                followersYouDontFollowCount: followersYouDontFollow.length,
                mutualFriends: mutualFollowers, // Optional: include the actual mutual friends if needed
                followersYouDontFollow, // Optional: include followers that the user isn’t following back
                extendedSuggestionsCount: uniqueExtendedSuggestions.length,
                extendedSuggestions: uniqueExtendedSuggestions // Include suggestions from followers of followers
            };
        }).filter(user => user.mutualFriendsCount > 0 || user.followersYouDontFollowCount > 0 || user.extendedSuggestionsCount > 0); // Filter users with at least one mutual friend, relevant follower, or extended suggestions

        res.json(results);
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        res.status(500).send('Internal Server Error');
    }
}

}

module.exports = new MyPosts();
