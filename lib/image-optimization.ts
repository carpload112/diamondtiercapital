// Helper functions for image optimization

/**
 * Generates responsive image sizes attribute based on image width
 * @param imageWidth The natural width of the image in pixels
 * @returns A sizes attribute string for responsive images
 */
export function getResponsiveSizes(imageWidth: number): string {
  if (imageWidth <= 640) {
    return "(max-width: 640px) 100vw, 640px"
  } else if (imageWidth <= 768) {
    return "(max-width: 768px) 100vw, 768px"
  } else if (imageWidth <= 1024) {
    return "(max-width: 1024px) 100vw, 1024px"
  } else if (imageWidth <= 1280) {
    return "(max-width: 1280px) 100vw, 1280px"
  } else {
    return "100vw"
  }
}

/**
 * Determines if an image should be loaded with priority based on its position
 * @param index The index of the image in a list
 * @param isAboveFold Whether the image is above the fold
 * @returns Boolean indicating if the image should be loaded with priority
 */
export function shouldPrioritize(index: number, isAboveFold: boolean): boolean {
  if (isAboveFold) return true
  return index < 2 // Only prioritize the first two images in a list
}

/**
 * Calculates the optimal quality setting for an image based on its importance
 * @param isPrimary Whether this is a primary/important image
 * @returns The quality value (1-100)
 */
export function getImageQuality(isPrimary: boolean): number {
  return isPrimary ? 85 : 75
}
