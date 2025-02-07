// utils/sanityAPI.ts

import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,  // Replace with your Sanity project ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,         // Replace with your Sanity dataset
  apiVersion: '2023-01-01',      // Use the latest API version
  useCdn: true,
});

// Fetch Products
export const getProducts = async () => {
  const query = '*[_type == "productData"]';  // Adjust this query based on your Sanity schema
  return client.fetch(query);
};

// Fetch Orders
export const getOrders = async () => {
  const query = '*[_type == "order"]';  // Adjust this query based on your Sanity schema
  return client.fetch(query);
};
