'use client'

import { AppearOnMount } from '@sushiswap/ui/components/animation'
import { Button } from '@sushiswap/ui/components/button'
import { GlobalNav, NavLink } from '@sushiswap/ui/components/GlobalNav'
import { useConnect } from '@sushiswap/wagmi'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { HeaderNetworkSelector } from '@sushiswap/wagmi/future/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi/future/components/UserProfile'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC } from 'react'

export const Header: FC = () => {
  const { isLoading } = useConnect()
  return (
    <GlobalNav
      rightElement={
        isLoading ? (
          <></>
        ) : (
          <AppearOnMount className="flex gap-2">
            <HeaderNetworkSelector networks={SUPPORTED_CHAIN_IDS} />
            <UserProfile networks={SUPPORTED_CHAIN_IDS} />
          </AppearOnMount>
        )
      }
    >
      <NavLink title="Swap" href="https://www.sushi.com/swap" />
      <NavLink title="Pools" href="https://www.sushi.com/pools" />
      <NavLink title="Pay" href="https://www.sushi.com/furo" />
      <Onramper.Button>
        <Button variant="ghost" className="whitespace-nowrap">
          Buy Crypto
        </Button>
      </Onramper.Button>
    </GlobalNav>
  )
}