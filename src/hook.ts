import { useEffect, useState } from 'react'

/**
 * 尝试将url hash解析为键值对
 * @example
 * ```
 * #key1=value&key2=value
 * ```
 * 解析为
 * ```
 * {
 *  key1: value
 *  key2: value
 * }
 * ```
 */
 function paserHash(hash: string): Record<string, string> {
  if (!hash) return {}
  return (hash.startsWith('#') ? hash.substring(1) : hash)
    .split(/(?<!\\)&/)
    .map(item => item.split(/(?<!\\)=/))
    .map(kv   => kv.length === 1 ? kv.concat(['']) : kv)
    .reduce((map, kv) => {
      map[kv[0]] = kv[1]
      return map
    }, {})
}


/**
 * 键值对表序列化为url hash
 */
function serialize(map: Record<string, string>): string {
  return '#' + Reflect.ownKeys(map).map(key => String(key)).map(key => `${key}=${map[key]}`).join('&')
}

function currentHashState() {
  return paserHash(decodeURI(location.hash))
}

export function useURLHash(): [URLHashData, URLHashSetFunction] {
  const [data, setData] = useState(currentHashState())

  useEffect(() => {
    const onPopstate = () => setData(currentHashState())
    window.addEventListener('popstate', onPopstate)
    return () => window.removeEventListener('popstate', onPopstate)
  })


  const set = (name: string, value: string) => {
    if (data[name] === value) return
    data[name] = value
    location.hash = serialize(data)
  }

  return [data, set]
}

export interface URLHashData {
  [key: string]: string
}

export interface URLHashSetFunction {
  (name: string, value: string): void
}
