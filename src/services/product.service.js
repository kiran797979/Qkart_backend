const { Product } = require("../models");

// Simple in-memory cache for product list to speed up repeated loads
let cachedProducts = null;
let cacheTs = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Fetch all products
 * @returns {Promise<List<Products>>}
 */
const getProducts = async () => {
  // Avoid caching during tests to keep data fresh
  const shouldUseCache = process.env.NODE_ENV !== "test";
  if (shouldUseCache && cachedProducts && Date.now() - cacheTs < CACHE_TTL_MS) {
    return cachedProducts;
  }

  const products = await Product.find({}).lean().exec();
  if (shouldUseCache) {
    cachedProducts = products;
    cacheTs = Date.now();
  }
  return products;
};

module.exports = {
  getProductById,
  getProducts,
};
