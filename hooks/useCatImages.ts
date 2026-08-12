/**
 * Fetches cat images from the public Cat API.
 *
 * The API gives a maximum of 10 images for one anonymous request. The hook
 * asks for that maximum and repeats the list when the deck needs more.
 */
import { useCallback, useEffect, useState } from 'react'

const ENDPOINT = 'https://api.thecatapi.com/v1/images/search'
const MAX_PER_REQUEST = 10

interface CatApiImage {
  id: string
  url: string
}

export interface CatImagesResult {
  /** One URL per requested item. Empty until the request completes. */
  urls: string[]
  loading: boolean
  /** True when the request failed. The deck still works without images. */
  failed: boolean
  /** Runs the request again. */
  reload: () => void
}

export function useCatImages(count: number): CatImagesResult {
  const [urls, setUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    // `cancelled` stops a late response from writing to an unmounted screen.
    let cancelled = false

    setLoading(true)
    setFailed(false)

    const limit = Math.min(count, MAX_PER_REQUEST)
    const url = `${ENDPOINT}?limit=${limit}&size=small&mime_types=jpg,png`

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Cat API returned ${response.status}`)
        return response.json() as Promise<CatApiImage[]>
      })
      .then((images) => {
        if (cancelled) return
        const source = images.map((image) => image.url).filter(Boolean)
        if (source.length === 0) throw new Error('Cat API returned no images')
        // Repeat the list when the deck is longer than the response.
        setUrls(
          Array.from({ length: count }, (_, i) => source[i % source.length]),
        )
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setUrls([])
        setFailed(true)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [count, attempt])

  return { urls, loading, failed, reload }
}
