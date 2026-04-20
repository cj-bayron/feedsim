import { useState, useCallback } from 'react'

export function useFeed(getToken) {
  const [feedUrl, setFeedUrl] = useState('')
  const [posts, setPosts] = useState([])
  const [paging, setPaging] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const doFetch = useCallback(async (url, cursor = null) => {
    setLoading(true)
    setError(null)
    try {
      let fetchUrl = url
      if (cursor) {
        const u = new URL(url)
        u.searchParams.set('after', cursor)
        fetchUrl = u.toString()
      }
      const res = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'X-Client-Id': 'BandLab-Backend',
        },
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} ${res.statusText}${body ? ' — ' + body.slice(0, 300) : ''}`)
      }
      const json = await res.json()
      const newPosts = json.data || []
      if (cursor) {
        setPosts(prev => [...prev, ...newPosts])
      } else {
        setPosts(newPosts)
      }
      setPaging(json.paging || null)
    } catch (e) {
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
        setError('Network error — the request was blocked. This is likely a CORS issue. The API server must allow cross-origin requests from this origin.')
      } else {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const handleFetch = useCallback((url) => {
    setFeedUrl(url)
    setPosts([])
    setPaging(null)
    doFetch(url, null)
  }, [doFetch])

  const handleLoadMore = useCallback(() => {
    if (paging?.cursors?.after) {
      doFetch(feedUrl, paging.cursors.after)
    }
  }, [paging, feedUrl, doFetch])

  return { posts, paging, loading, error, handleFetch, handleLoadMore }
}
