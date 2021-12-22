import { ReactNode } from 'react'
import { useURLHash, URLHashData, URLHashSetFunction } from './hook'

interface URLHashProps {
  children: (ref: URLHashRef) => ReactNode
}

interface URLHashRef {
  state: URLHashData,
  set: URLHashSetFunction
}

export const URLHash = (props: URLHashProps) => {
  const { children: proxyRender } = props
  const [state, set] = useURLHash()
  if (typeof proxyRender !== 'function') {
    throw new Error('the children of <URLHash /> must be a render function')
  }
  return proxyRender({ state, set })
}
