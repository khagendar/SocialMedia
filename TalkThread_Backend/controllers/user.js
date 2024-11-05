const model = require("../model/user");
const bcrypt = require('bcrypt');
const auth = require('./auth'); // Assuming you have a file for authentication utilities
const UserModel = require("../model/user");
const PostModel =require("../model/post");
const ConversationModel=require('../model/Conversation');
class LoginController {
  // Sign Up
  async signup (req, res)  {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await model.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new model({ name, email, password: hashedPassword, role: "user" });
        await newUser.save();

        // Generate a token
        const token = auth.token(newUser); // Correct variable

        // Send response
        res.status(200).json({ message: 'Signup successful', user: newUser, token });
    } catch (err) {
        console.error('Signup error:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Sign In
  async signin(req, res) {
    const { email, password } = req.body;
    try {
      // Find the user
      const user = await model.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      // Generate JWT token
      const token = auth.token(user);

      // Send response
      res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
      console.error('Error during sign-in:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // forgot password
  async forgotPassword(req, res) {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    try {
      const user = await model.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // You may want to validate the newPassword for strength/security

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error during password reset:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async changePassword(req,res){
    const { currentPassword, newPassword, email } = req.body;

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Validate the new password (e.g., check length, complexity)
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        // Hash the new password and update the user's password in the database
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Send a success response
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
  }
  async followers(req, res) {
    const { userId } = req.params;
    const { action, currentUserId } = req.body;  // Destructure currentUserId from req.body
    // console.log("Target User ID:", userId);
    // console.log("Current User ID:", currentUserId);
    // console.log("Action:", action);

    try {
        const userToFollow = await model.findById(userId);
        const currentUser = await model.findById(currentUserId);
        
        if (action === 'follow') {
            // Add userId to currentUser's following and currentUserId to userToFollow's followers if not already present
            if (!currentUser.following.includes(userToFollow._id)) {
                currentUser.following.push(userToFollow._id);
                userToFollow.follwers.push(currentUser._id);
            }
        } else {
            // Remove userId from following and followers arrays if already present
            currentUser.following = currentUser.following.filter(id => id.toString() !== userToFollow._id.toString());
            userToFollow.follwers = userToFollow.follwers.filter(id => id.toString() !== currentUser._id.toString());
        }

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({ message: action === 'follow' ? 'Followed successfully' : 'Unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating follow status' });
    }
}


async  deleteUserAccount(req,res) {
  const userId=req.params.userId;
    try {
        // 1. Delete all posts created by the user
        await PostModel.deleteMany({ userId });

        // 2. Remove comments made by the user on other posts
        await PostModel.updateMany(
            { "comments.userId": userId }, // Find posts containing comments by the user
            { $pull: { comments: { userId } } } // Remove the user’s comments from these posts
        );

        await PostModel.updateMany(
          { likes: userId },
          { $pull: { likes: userId } } // Remove the user's ID from likes array
      );

         await ConversationModel.deleteMany({
          members: userId
      });
      await UserModel.updateMany(
        { following: userId },
        { $pull: { following: userId } }
        );

        await UserModel.updateMany(
            { follwers: userId },
            { $pull: { follwers: userId } }
        );
        // 3. Delete the user account
        await UserModel.findByIdAndDelete(userId);

        res.status(200).json({ message: "User account and associated data deleted successfully." });
    } catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).json({ error: 'An error occurred while deleting account' });
    }
}

}
module.exports = new LoginController();
