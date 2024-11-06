const UserModel = require("../model/user"); // Ensure the path to your model is correct

class UserController {
  // Get User by ID
  async getUserById(req, res) {
    const { id } = req.params; // Extract 'id' from URL params
    try {
      // Find the user by ID
      const user = await UserModel.findById(id); // Use findById for ObjectId
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user", error });
    }
  }
  // Assuming you have an Express app and a UserModel for MongoDB
async getAllUsers(req, res) {
  try {
    // Fetch all users from the database
    const users = await UserModel.find(); // Use find() to get all users
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
}
 async Location (req, res){
  const { id } = req.params;
  const { longitude, latitude } = req.body;

  if (!longitude || !latitude) {
      return res.status(400).json({ error: "Longitude and latitude are required." });
  }

  try {
      // Find user by ID and update location
      const user = await UserModel.findByIdAndUpdate(
          id,
          { location: { longitude, latitude } },
          { new: true, runValidators: true }
      );

      if (!user) {
          return res.status(404).json({ error: "User not found." });
      }

      res.status(200).json({ message: "Location updated successfully.", user });
  } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ error: "Internal server error." });
  }
};

}

module.exports = new UserController();
