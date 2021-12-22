import { useEffect, useState } from 'react'

/**
 * 尝试将url hash解析为键值对
 * @example
 * ```
 * #key1=value&key2=value
 * ```
 * 解析为
 * ```
 * Map {
 *  key1 => value
 *  key2 => value
 * }
 * ```
 */
 function paserHash(hash: string): Map<string, string> {
  if (!hash) return new Map()
  return (hash.startsWith('#') ? hash.substring(1) : hash)
    .split(/(?<!\\)&/)
    .map(item => item.split(/(?<!\\)=/))
    .map(kv   => kv.length === 1 ? kv.concat(['']) : kv)
    .reduce((map, kv) => map.set(kv[0], kv[1]), new Map())
}

/**
 * 键值对表序列化为url hash
 */
function serialize(map: Map<string, string>): string {
  return '#' + Array.from(map).map(kv => kv.join('=')).join('&')
}

function mapToObject(map: Map<string | number, any>): URLHashData {
  return Array.from(map).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {})
}

function currentHashState() {
  return mapToObject(paserHash(decodeURI(location.hash)))
}

// ignore url hash change flag to make not trigger popstate event in all hook function
let ignoreHashChange = false

/**
 * 双向绑定URL hash
 */
export function useURLHash(): [URLHashData, URLHashSetFunction] {
  const [state, setState] = useState(currentHashState())

  useEffect(() => {
    const onPopstate = () => setTimeout(() => !ignoreHashChange && setState(currentHashState()), 0)
    window.addEventListener('popstate', onPopstate)
    return () => window.removeEventListener('popstate', onPopstate)
  })

  const set = (name: string, value: string) => {
    if (state[name] === value) return
    ignoreHashChange = true
    const map = paserHash(location.hash)
    map.set(name, value)
    location.hash = serialize(map)
    ignoreHashChange = false
    setState(mapToObject(map))
  }

  return [state, set]
}

export interface URLHashData {
  [key: string]: string
}

export interface URLHashSetFunction {
  (name: string, value: string): void
}
