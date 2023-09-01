import { InfiniteSWRHookConfig, SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { GetPoolsArgs, getPoolsUrl, Pools } from '../../pure/pools/pools.js'

export const usePools = ({ args, shouldFetch }: SWRHookConfig<GetPoolsArgs>) => {
  return useSWR<Pools>(shouldFetch !== false ? getPoolsUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
export const usePoolsInfinite = ({ args, shouldFetch }: InfiniteSWRHookConfig<GetPoolsArgs>) => {
  return useSWRInfinite<Pools>(
    (pageIndex, previousData) => {
      if (shouldFetch === false) return null

      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return getPoolsUrl(args)

      // add the cursor to the API endpoint
      return getPoolsUrl({ ...args, cursor: previousData?.[previousData.length - 1]?.id })
    },
    (url) => fetch(url).then((data) => data.json())
  )
}