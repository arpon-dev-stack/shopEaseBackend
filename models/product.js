import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    lowercase: true // Keeps naming consistent as per your data
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['fashion', 'electronics', 'home', 'fitness'], // Optional: restricts to your specific categories
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the model
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;