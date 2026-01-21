import { useState, useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions {
  hasNextPage: boolean
  fetchNextPage: () => void
  threshold?: number
}

export function useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  threshold = 100
}: UseInfiniteScrollOptions) {
  const [isFetching, setIsFetching] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (isFetching || !hasNextPage) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          setIsFetching(true)
          fetchNextPage()
        }
      },
      { threshold: 0.1, rootMargin: `${threshold}px` }
    )

    if (node) {
      observerRef.current.observe(node)
    }
  }, [isFetching, hasNextPage, fetchNextPage, threshold])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const resetFetching = useCallback(() => {
    setIsFetching(false)
  }, [])

  return { lastElementRef, isFetching, resetFetching }
}