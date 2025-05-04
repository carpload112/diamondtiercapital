import Image, { type ImageProps } from "next/image"
import { getResponsiveSizes, shouldPrioritize, getImageQuality } from "@/lib/image-optimization"

interface OptimizedImageProps extends Omit<ImageProps, "sizes"> {
  isAboveFold?: boolean
  isPrimary?: boolean
  imageWidth?: number
}

export function OptimizedImage({
  isAboveFold = false,
  isPrimary = false,
  imageWidth = 1200,
  loading,
  quality,
  sizes,
  priority,
  ...props
}: OptimizedImageProps) {
  // Determine loading strategy
  const shouldLoadEagerly = priority || shouldPrioritize(0, isAboveFold)
  const loadingStrategy = shouldLoadEagerly ? undefined : loading || "lazy"

  // Determine quality
  const imageQuality = quality || getImageQuality(isPrimary)

  // Determine sizes
  const imageSizes = sizes || getResponsiveSizes(imageWidth)

  return (
    <Image
      {...props}
      loading={loadingStrategy}
      quality={imageQuality}
      sizes={imageSizes}
      priority={shouldLoadEagerly}
    />
  )
}
