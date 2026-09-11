"use client"

import dynamic from "next/dynamic"

/**
 * react-pdf touches `DOMMatrix` at import time, which doesn't exist on the
 * server — statically importing it anywhere in the tree breaks SSR with
 * "DOMMatrix is not defined". These wrappers keep it browser-only.
 */
const fallback = () => (
  <div className="h-40 animate-pulse rounded-2xl border border-line bg-surface-sunken" />
)

export const PDFPreview = dynamic(
  () => import("./PDFPreview").then((m) => m.PDFPreview),
  { ssr: false, loading: fallback },
)

export const PDFViewerModal = dynamic(
  () => import("./PDFViewerModal").then((m) => m.PDFViewerModal),
  { ssr: false },
)
