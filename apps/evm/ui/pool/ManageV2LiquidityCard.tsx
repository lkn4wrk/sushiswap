import { Pool } from '@sushiswap/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { FC } from 'react'

import { AddSectionLegacy } from './AddSectionLegacy'
import { AddSectionStake } from './AddSectionStake'
import { AddSectionTrident } from './AddSectionTrident'
import { PoolPositionProvider } from './PoolPositionProvider'
import { PoolPositionRewardsProvider } from './PoolPositionRewardsProvider'
import { PoolPositionStakedProvider } from './PoolPositionStakedProvider'
import { RemoveSectionLegacy } from './RemoveSectionLegacy'
import { RemoveSectionTrident } from './RemoveSectionTrident'
import { RemoveSectionUnstake } from './RemoveSectionUnstake'

interface ManageV2LiquidityCardProps {
  pool: Pool
}

export const ManageV2LiquidityCard: FC<ManageV2LiquidityCardProps> = ({ pool }) => {
  const isFarm = pool.wasIncentivized || pool.isIncentivized

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage</CardTitle>
        <CardDescription>Manage your position</CardDescription>
      </CardHeader>
      <Tabs className="w-full" defaultValue="add">
        <CardContent>
          <TabsList className="!flex">
            <TabsTrigger testdata-id="add-tab" value="add" className="flex flex-1">
              Add
            </TabsTrigger>
            <TabsTrigger testdata-id="remove-tab" value="remove" className="flex flex-1">
              Remove
            </TabsTrigger>
            <TabsTrigger testdata-id="stake-tab" disabled={!isFarm} value="stake" className="flex flex-1">
              Stake
            </TabsTrigger>
            <TabsTrigger testdata-id="unstake-tab" disabled={!isFarm} value="unstake" className="flex flex-1">
              Unstake
            </TabsTrigger>
          </TabsList>
        </CardContent>
        <div className="pb-4 px-6">
          <Separator />
        </div>
        <PoolPositionProvider pool={pool}>
          <PoolPositionStakedProvider pool={pool}>
            <PoolPositionRewardsProvider pool={pool}>
              <TabsContent value="add">
                <CardContent>
                  {pool.protocol === 'BENTOBOX_CLASSIC' || pool.protocol === 'BENTOBOX_STABLE' ? (
                    <AddSectionTrident pool={pool} />
                  ) : (
                    <AddSectionLegacy pool={pool} />
                  )}
                </CardContent>
              </TabsContent>
              <TabsContent value="remove">
                <CardContent>
                  {pool.protocol === 'BENTOBOX_CLASSIC' || pool.protocol === 'BENTOBOX_STABLE' ? (
                    <RemoveSectionTrident pool={pool} />
                  ) : (
                    <RemoveSectionLegacy pool={pool} />
                  )}
                </CardContent>
              </TabsContent>
              <TabsContent value="stake">
                <CardContent>
                  <AddSectionStake poolId={pool.id} />
                </CardContent>
              </TabsContent>
              <TabsContent value="unstake">
                <CardContent>
                  <RemoveSectionUnstake poolId={pool.id} />
                </CardContent>
              </TabsContent>
            </PoolPositionRewardsProvider>
          </PoolPositionStakedProvider>
        </PoolPositionProvider>
      </Tabs>
    </Card>
  )
}
