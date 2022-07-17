import LruCache from 'lru-cache'

const cache = new LruCache({
  max: 10,
})

export { cache }
