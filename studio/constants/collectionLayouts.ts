/**
 * Single source of truth for collection layout options.
 * Add entries here when you define new layouts (e.g. time.com-style + extras).
 * Images: use paths to PNG/JPG files (e.g. from studio static folder or URLs).
 */
export interface CollectionLayoutOption {
  value: string
  title: string
  /** Path to layout preview image (PNG or JPG). e.g. "/static/layouts/hero-grid.png" */
  image: string
}

export const COLLECTION_LAYOUTS: CollectionLayoutOption[] = [
  // Example layouts – tweak/replace as you design the real ones.
  {
    value: 'layout1',
    title: 'Layout 1',
    image: '/images/layout1.png', // studio/images/layout.png
  },
  {
    value: 'layout2',
    title: 'Layout 2',
    image: '/images/layout2.png',
  },
  {
    value: 'layout3',
    title: 'Layout 3',
    image: '/images/layout3.png',
  },
  {
    value: 'layout4',
    title: 'Layout 4',
    image: '/images/layout4.png',
  },
  {
    value: 'layout5',
    title: 'Layout 5',
    image: '/images/layout5.png',
  },
  {
    value: 'layout6',
    title: 'Layout 6',
    image: '/images/layout6.png',
  },
]
