const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Delete a user and associated thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.Thoughts } });
      res.json({ message: 'User and associated thoughts deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },
// Adds a Friend to a User
async addFriend(req, res) {
  try {
    const { friendId } = req.body; // Extract friendId from the request body

    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'No User with this id!' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error in addFriend:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
},
// Remove Friend from User
async deleteFriend(req, res) {
  try {
    const { friendId } = req.params; // Extract friendId from the request body

    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'No user with this id!' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error in deleteFriend:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
},
};

