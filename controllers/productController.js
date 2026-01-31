import Product from '../models/product.js';

export const getProducts = async (req, res) => {
    try {
        const { category, maxPrice, page } = req.query;

        let filter = {};

        if (category && category !== 'all') {
            filter.category = category;
        }

        filter.price = { $lte: Number(maxPrice) || 1000 };

        const limit = 10;
        const skip = (Number(page) - 1) * limit;

        const products = await Product.find(filter)
            .limit(limit)
            .skip(skip < 0 ? 0 : skip);

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Invalid ID format or Server Error" });
    }
};