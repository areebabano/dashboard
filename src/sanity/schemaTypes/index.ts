import { type SchemaTypeDefinition } from 'sanity'
import orderSchema from './orderSchema'
import productSchema from './productSchema'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [orderSchema, productSchema],
}
