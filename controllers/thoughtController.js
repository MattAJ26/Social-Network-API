const { Thought, User } = require('../models');

module.exports = {
  // Function to get all of the Thoughts by invoking the find() method with no arguments.
  // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
  async getThoughts(req, res) {
    try {
      const Thoughts = await Thought.find();
      res.json(Thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Gets a single Thought using the findOneAndUpdate method. We pass in the ID of the Thought and then respond with it, or an error if not found
  async getSingleThought(req, res) {
    try {
      const Thought = await Thought.findOne({ _id: req.params.ThoughtId });

      if (!Thought) {
        return res.status(404).json({ message: 'No Thought with that ID' });
      }

      res.json(Thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Creates a new Thought. Accepts a request body with the entire Thought object.
  // Because Thoughts are associated with Users, we then update the User who created the app and add the ID of the Thought to the Thoughts array
  async createThought(req, res) {
    try {
      const Thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { Thoughts: Thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought created, but found no user with that ID',
        })
      }

      res.json('Created the Thought 🎉');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Updates and Thought using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  async updateThought(req, res) {
    try {
      const Thought = await Thought.findOneAndUpdate(
        { _id: req.params.ThoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!Thought) {
        return res.status(404).json({ message: 'No Thought with this id!' });
      }

      res.json(Thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Deletes an Thought from the database. Looks for an app by ID.
  // Then if the app exists, we look for any users associated with the app based on he app ID and update the Thoughts array for the User.
  async deleteThought(req, res) {
    try {
      const Thought = await Thought.findOneAndRemove({ _id: req.params.ThoughtId });

      if (!Thought) {
        return res.status(404).json({ message: 'No Thought with this id!' });
      }

      const user = await User.findOneAndUpdate(
        { Thoughts: req.params.ThoughtId },
        { $pull: { Thoughts: req.params.ThoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought created but no user with this id!',
        });
      }

      res.json({ message: 'Thought successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Adds a Reaction to an Thought. This method is unique in that we add the entire body of the Reaction rather than the ID with the mongodb $addToSet operator.
  async addReaction(req, res) {
    try {
      const Thought = await Thought.findOneAndUpdate(
        { _id: req.params.ThoughtId },
        { $addToSet: { Reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!Thought) {
        return res.status(404).json({ message: 'No Thought with this id!' });
      }

      res.json(Thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove Thought Reaction. This method finds the Thought based on ID. It then updates the Reactions array associated with the app in question by removing it's ReactionId from the Reactions array.
  async deleteReaction(req, res) {
    try {
      const Thought = await Thought.findOneAndUpdate(
        { _id: req.params.ThoughtId },
        { $pull: { Reactions: { ReactionId: req.params.ReactionId } } },
        { runValidators: true, new: true }
      );

      if (!Thought) {
        return res.status(404).json({ message: 'No Thought with this id!' });
      }

      res.json(Thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
