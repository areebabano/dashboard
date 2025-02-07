// order.ts

export default {
    name: "order",
    type: "document",
    title: "Order",
    fields: [
      {
        name: "fullName",
        type: "string",
        title: "Full Name",
        validation: (Rule: any) => Rule.required().min(3).max(50), // Name required, 3-50 characters
      },
      {
        name: "email",
        type: "string",
        title: "Email",
        validation: (Rule: any) => Rule.required().email(), // Valid email required
      },
      {
        name: "phoneNumber",
        type: "string",
        title: "Phone Number",
        validation: (Rule: any) =>
          Rule.required().regex(/^\d{10,15}$/, {
            name: "Phone number",
            invert: false,
          }), // 10-15 digits phone number
      },
      {
        name: "address",
        type: "string",
        title: "Address",
        validation: (Rule: any) => Rule.required().min(10).max(100), // Address required, 10-100 characters
      },
      {
        name: "city",
        type: "string",
        title: "City",
        validation: (Rule: any) => Rule.required(), // City required
      },
      {
        name: "postalCode",
        type: "string",
        title: "Postal Code",
        validation: (Rule: any) =>
          Rule.required().regex(/^\d{5}$/, {
            name: "Postal code",
            invert: false,
          }), // 5 digits postal code
      },
      {
        name: "country",
        type: "string",
        title: "Country",
        validation: (Rule: any) => Rule.required(), // Country required
      },
      {
        name: "cartItems",
        title: "Cart Items",
        type: "array",
        of: [{ type: "reference", to: [{ type: "productData" }] }],
      },
      {
        name: "totalPrice",
        title: "Total Price",
        type: "number",
        validation: (Rule: any) => Rule.required(), // Total price required
      },
      {
        name: "discount",
        title: "Discount",
        type: "number",
        // hidden: true, // Hide this field as well
      },
      {
        name: "cardNumber",
        type: "string",
        title: "Card Number",
        hidden: true, // Hide this field in Sanity Studio for security
      },
      {
        name: "cardExpiry",
        type: "string",
        title: "Card Expiry",
        hidden: true, // Hide this field as well
      },
      {
        name: "cardCVC",
        type: "string",
        title: "CVC",
        hidden: true, // Hide this field too
      },
      {
        name: "orderDate",
        type: "datetime",
        title: "Order Date",
        validation: (Rule: any) => Rule.required(), // Order date required
        initialValue: () => new Date().toISOString(), // Automatically set to current date/time
      },
      {
        name: "orderStatus",
        title: "Order Status",
        type: "string",
        options: {
          list: [
            { title: "Pending", value: "pending" },
            { title: "Shipped", value: "shipped" },
            { title: "Delivered", value: "delivered" },
            { title: "Cancelled", value: "cancelled" },
          ],
          layout: "radio",
        },
        initialValue: "pending",
      },
    ],
  };