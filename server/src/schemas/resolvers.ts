import User from '../models/User.js';
import { signToken } from '../services/auth.js';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (context.req.user) {
        return User.findById(context.req.user._id).populate('savedBooks');
      }
      throw new Error('Not authenticated');
    },
  },
  Mutation: {
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Invalid credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_: any, { input }: { input: any }, context: any) => {
      if (!context.req.user) {
       console.error('SaveBook Error: User not authenticated.');
       throw new Error('Not authenticated');
      }

      try {
        console.log('SaveBook Input:', input);
        console.log('Authenticated User:', context.req.user);

        const updatedUser = await User.findByIdAndUpdate(
          context.req.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        ).populate('savedBooks');

        console.log('Updated User:', updatedUser);

        return updatedUser;
      } catch (err) {
        console.error('SaveBook Error:', err);
        throw new Error('Failed to save book');
      }
    },
    removeBook: async (_: any, { bookId }: { bookId: string }, context: any) => {
      if (context.req.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.req.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new Error('Not authenticated');
    },
  },
};

