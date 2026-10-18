#!/usr/bin/env node

/**
 * Jewelry Storefronts - Phase 1 Catalog Validation Script
 *
 * Validates the product catalogs for all three brands according to Phase 1 requirements:
 * - At least 12 products for Aurelle, 12 for Gemma & Grove, 12 for Lustre
 * - Unique IDs and slugs within each brand
 * - Required fields and valid data types
 * - Valid image paths (files exist)
 * - At least one in-stock variant per product
 * - Price formatting and numeric validation
 * - API resolution consistency
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..');
const API_DIR = path.join(REPO_ROOT, 'public/api');
const IMAGES_DIR = path.join(REPO_ROOT, 'public/images/products');

const BRAND_CONFIG = {
  'aurelle': { minProducts: 12, categories: ['Engagement Rings'] },
  'gemma-grove': { minProducts: 12, categories: ['Gemstone Rings'] },
  'lustre': { minProducts: 12, categories: ['Moissanite Rings', 'Moissanite Earrings'] },
};

const REQUIRED_FIELDS = [
  'id', 'slug', 'brandId', 'name', 'description', 'category', 'price',
  'rating', 'reviewCount', 'images', 'variants', 'specifications', 'tags',
  'featured', 'createdAt', 'updatedAt'
];

const NUMERIC_FIELDS = ['price', 'rating', 'reviewCount'];

class ValidationError extends Error {
  constructor(message, brand, productId = null) {
    super(`${brand}${productId ? ` (product ${productId})` : ''}: ${message}`);
    this.name = 'ValidationError';
  }
}

function validateBrandFile(brandId) {
  console.log(`\n📋 Validating ${brandId} catalog...`);
  const filePath = path.join(API_DIR, brandId, 'products.json');

  if (!fs.existsSync(filePath)) {
    throw new ValidationError(`Catalog file not found: ${filePath}`, brandId);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let products;

  try {
    products = JSON.parse(content);
  } catch (e) {
    throw new ValidationError(`Invalid JSON: ${e.message}`, brandId);
  }

  if (!Array.isArray(products)) {
    throw new ValidationError('Catalog must be an array of products', brandId);
  }

  console.log(`  Found ${products.length} products (minimum required: ${BRAND_CONFIG[brandId].minProducts})`);

  // Check product count
  if (products.length < BRAND_CONFIG[brandId].minProducts) {
    throw new ValidationError(
      `Insufficient products: ${products.length} found, need ${BRAND_CONFIG[brandId].minProducts}`,
      brandId
    );
  }

  // Validate each product
  const seenIds = new Set();
  const seenSlugs = new Set();

  products.forEach((product, index) => {
    const productNum = index + 1;

    // Check ID uniqueness
    if (seenIds.has(product.id)) {
      throw new ValidationError(`Duplicate product ID: ${product.id}`, brandId);
    }
    seenIds.add(product.id);

    // Check slug uniqueness
    if (seenSlugs.has(product.slug)) {
      throw new ValidationError(`Duplicate slug: ${product.slug}`, brandId);
    }
    seenSlugs.add(product.slug);

    // Required fields
    for (const field of REQUIRED_FIELDS) {
      if (!(field in product)) {
        throw new ValidationError(`Missing required field: ${field}`, brandId, product.id);
      }
    }

    // Data type validation
    if (typeof product.name !== 'string' || !product.name.trim()) {
      throw new ValidationError(`Invalid product name`, brandId, product.id);
    }

    if (typeof product.slug !== 'string' || !product.slug.trim()) {
      throw new ValidationError(`Invalid slug`, brandId, product.id);
    }

    if (product.brandId !== brandId) {
      throw new ValidationError(
        `Product brandId mismatch: expected "${brandId}", got "${product.brandId}"`,
        brandId,
        product.id
      );
    }

    // Numeric fields
    for (const field of NUMERIC_FIELDS) {
      const value = product[field];
      if (typeof value !== 'number' || isNaN(value)) {
        throw new ValidationError(`Field "${field}" must be a number, got ${typeof value}`, brandId, product.id);
      }
      if (value < 0) {
        throw new ValidationError(`Field "${field}" must be non-negative, got ${value}`, brandId, product.id);
      }
    }

    // Price validation
    if (product.price <= 0) {
      throw new ValidationError(`Price must be positive, got ${product.price}`, brandId, product.id);
    }

    if (product.compareAtPrice !== undefined) {
      if (typeof product.compareAtPrice !== 'number' || isNaN(product.compareAtPrice)) {
        throw new ValidationError(`compareAtPrice must be a number or undefined`, brandId, product.id);
      }
      if (product.compareAtPrice <= product.price) {
        throw new ValidationError(`compareAtPrice must be greater than price`, brandId, product.id);
      }
    }

    // Rating bounds
    if (product.rating < 0 || product.rating > 5) {
      throw new ValidationError(`Rating must be between 0 and 5, got ${product.rating}`, brandId, product.id);
    }

    // Images validation
    if (!Array.isArray(product.images) || product.images.length === 0) {
      throw new ValidationError(`Product must have at least one image`, brandId, product.id);
    }

    product.images.forEach((img, imgIndex) => {
      if (!img.url) {
        throw new ValidationError(`Image ${imgIndex + 1} missing URL`, brandId, product.id);
      }
      if (!img.alt) {
        throw new ValidationError(`Image ${imgIndex + 1} missing alt text`, brandId, product.id);
      }
      if (img.url.startsWith('/')) {
        const imagePath = path.join(REPO_ROOT, 'public', img.url.replace(/^\//, ''));
        if (!fs.existsSync(imagePath)) {
          throw new ValidationError(`Image file not found: ${img.url} (expected at ${imagePath})`, brandId, product.id);
        }
      }
    });

    // Variants validation
    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      throw new ValidationError(`Product must have at least one variant`, brandId, product.id);
    }

    const hasInStockVariant = product.variants.some(v => v.inStock);
    if (!hasInStockVariant) {
      throw new ValidationError(`No in-stock variants found`, brandId, product.id);
    }

    // Tags validation
    if (!Array.isArray(product.tags)) {
      throw new ValidationError(`Tags must be an array`, brandId, product.id);
    }

    // Category consistency
    const allowedCategories = BRAND_CONFIG[brandId].categories;
    const categoryMatches = allowedCategories.some(
      (cat) => cat.toLowerCase() === product.category.toLowerCase()
    );
    if (!categoryMatches) {
      throw new ValidationError(
        `Category mismatch: expected one of [${allowedCategories.join(', ')}], got "${product.category}"`,
        brandId,
        product.id
      );
    }

    // Date format validation (ISO 8601)
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/;
    if (!dateRegex.test(product.createdAt)) {
      throw new ValidationError(`Invalid createdAt format: ${product.createdAt}`, brandId, product.id);
    }
    if (!dateRegex.test(product.updatedAt)) {
      throw new ValidationError(`Invalid updatedAt format: ${product.updatedAt}`, brandId, product.id);
    }
  });

  console.log(`  ✓ All ${products.length} products validated successfully`);
  return products.length;
}

function validateImagePaths() {
  console.log('\n🖼️  Validating image assets...');

  for (const brandId of Object.keys(BRAND_CONFIG)) {
    const brandImageDir = path.join(IMAGES_DIR, brandId);
    if (!fs.existsSync(brandImageDir)) {
      console.warn(`  ⚠️  Image directory missing for ${brandId}: ${brandImageDir}`);
      continue;
    }

    const files = fs.readdirSync(brandImageDir);
    const imageFiles = files.filter(f => /\.(svg|png|jpg|jpeg|webp)$/i.test(f));

    console.log(`  ${brandId}: Found ${imageFiles.length} image files`);

    if (imageFiles.length === 0) {
      console.warn(`  ⚠️  No images found for ${brandId} in ${brandImageDir}`);
    }
  }
}

function validateAPIResolution() {
  console.log('\n🔗 Testing API module resolution...');

  // Simulate API loading by reading each catalog file
  for (const brandId of Object.keys(BRAND_CONFIG)) {
    const filePath = path.join(API_DIR, brandId, 'products.json');
    const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Test slug uniqueness and resolution
    const slugs = products.map(p => p.slug);
    const uniqueSlugs = new Set(slugs);

    if (slugs.length !== uniqueSlugs.size) {
      throw new ValidationError('Duplicate slugs found (API consistency check)', brandId);
    }

    // Pick a sample product to verify API path construction
    const sampleProduct = products[0];
    const expectedPaths = {
      'aurelle': `/aurelle/engagement-rings/${sampleProduct.slug}`,
      'gemma-grove': `/gemma-grove/gemstone-rings/${sampleProduct.slug}`,
      'lustre': `/lustre/moissanite-rings/${sampleProduct.slug}`,
    };

    if (brandId !== sampleProduct.brandId) {
      throw new ValidationError(
        `API brand mismatch: product ${sampleProduct.id} has brandId ${sampleProduct.brandId}, expected ${brandId}`,
        brandId
      );
    }

    console.log(`  ${brandId}: ✓ ${products.length} unique slugs, sample product "${sampleProduct.name}"`);
  }
}

function validateBrandTotals(brandCounts) {
  console.log('\n📊 Validation Summary:');
  let allPassed = true;

  for (const brandId of Object.keys(BRAND_CONFIG)) {
    const count = brandCounts[brandId] || 0;
    const required = BRAND_CONFIG[brandId].minProducts;
    const passed = count >= required;

    console.log(`  ${brandId}: ${count}/${required} products ${passed ? '✓' : '✗'}`);
    if (!passed) {
      allPassed = false;
    }
  }

  const totalProducts = Object.values(brandCounts).reduce((a, b) => a + b, 0);
  console.log(`\n  Total products: ${totalProducts}`);

  if (allPassed) {
    console.log('\n🎉 All catalogs meet Phase 1 requirements!');
  } else {
    throw new Error('One or more catalogs do not meet minimum product requirements');
  }
}

async function main() {
  try {
    console.log('🔍 Jewelry Storefronts - Phase 1 Catalog Validation');
    console.log('='.repeat(60));

    // Check API directory exists
    if (!fs.existsSync(API_DIR)) {
      throw new Error(`API directory not found: ${API_DIR}`);
    }

    const brandCounts = {};

    // Validate each brand's catalog
    for (const brandId of Object.keys(BRAND_CONFIG)) {
      const count = validateBrandFile(brandId);
      brandCounts[brandId] = count;
    }

    // Additional validations
    validateImagePaths();
    validateAPIResolution();
    validateBrandTotals(brandCounts);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Validation failed:', error.message);
    if (error instanceof ValidationError) {
      console.error('   Details:', error.message);
    }
    process.exit(1);
  }
}

main();

// ES module exports
export {
  validateBrandFile,
  validateImagePaths,
  validateAPIResolution,
  validateBrandTotals,
  BRAND_CONFIG,
  REQUIRED_FIELDS,
};