export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-05'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
export const token = assertValue(
  "skuqVINAepo6X99fvzApMywvMXKWR15hBTMebUOoSvkx5s9H3jmA1BfARR7cewndGi0qg8zm2zEWp9UAmkthDsMn0ILiaJG3bVuzTIsYHSHfidbQ2atT3RZnO5guQMtrKu3BIuPMjUNpYCKr9ZN7ZRluxHFFGeGCK5NyWi7V6qc06F0FSX2j",
  'Missing environment variable: SANITY_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
