import { z } from 'zod'

// PriceBlock schema
export const priceBlockSchema = z.object({
  priceFrom: z.union([z.number(), z.string()]).optional(),
  currency: z.string().optional(),
  notes: z.string().optional(),
  tiers: z.array(z.object({
    name: z.string(),
    price: z.union([z.number(), z.string()]),
    description: z.string().optional(),
  })).optional(),
})

// ColorsBlock schema
export const colorsBlockSchema = z.object({
  title: z.string().optional(),
  colors: z.array(z.object({
    name: z.string(),
    image: z.string().url().optional(),
    hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  })).optional(),
})

// GalleryBlock schema
export const galleryBlockSchema = z.object({
  title: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    caption: z.string().optional(),
    alt: z.string().optional(),
  })).optional(),
  columns: z.number().min(1).max(4).optional(),
})

// FAQBlock schema
export const faqBlockSchema = z.object({
  title: z.string().optional(),
  items: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
})

// FeaturesBlock schema
export const featuresBlockSchema = z.object({
  title: z.string().optional(),
  items: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
  })).optional(),
  columns: z.number().min(1).max(4).optional(),
})

// HeroBlock schema
export const heroBlockSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  image: z.string().url().optional(),
})

// TextBlock schema
export const textBlockSchema = z.object({
  content: z.string().optional(),
})

// CTABlock schema
export const ctaBlockSchema = z.object({
  title: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
})

// Union schema for all block types
export const blockDataSchema = z.union([
  priceBlockSchema,
  colorsBlockSchema,
  galleryBlockSchema,
  faqBlockSchema,
  featuresBlockSchema,
  heroBlockSchema,
  textBlockSchema,
  ctaBlockSchema,
])

// Type exports
export type PriceBlockData = z.infer<typeof priceBlockSchema>
export type ColorsBlockData = z.infer<typeof colorsBlockSchema>
export type GalleryBlockData = z.infer<typeof galleryBlockSchema>
export type FAQBlockData = z.infer<typeof faqBlockSchema>
export type FeaturesBlockData = z.infer<typeof featuresBlockSchema>
export type HeroBlockData = z.infer<typeof heroBlockSchema>
export type TextBlockData = z.infer<typeof textBlockSchema>
export type CTABlockData = z.infer<typeof ctaBlockSchema>

