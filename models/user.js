
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true // Recommended: removes whitespace from ends
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, // Recommended: ensures emails are always stored in lowercase
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true // Recommended: adds createdAt and updatedAt fields automatically
});

const User = mongoose.model('User', userSchema);

export default User;