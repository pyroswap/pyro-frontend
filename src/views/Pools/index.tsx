import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import usePersistState from 'hooks/usePersistState'
import { usePools, useFetchCakeVault } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import Hero from './components/Hero'

const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  useFetchCakeVault()
  const { path } = useRouteMatch()
  const { account } = useWeb3React()
  const pools = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () => finishedPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [openPools],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  // This pool is passed explicitly to the cake vault
  const cakePoolData = useMemo(() => openPools.find((pool) => pool.sousId === 0), [openPools])

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  return (
    <>
      <Hero />
      <Page>
        <PoolTabButtons
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          hasStakeInFinishedPools={hasStakeInFinishedPools}
        />
        <FlexLayout>
          <Route exact path={`${path}`}>
            <>
              <CakeVaultCard pool={cakePoolData} showStakedOnly={stakedOnly} />
              {stakedOnly
                ? orderBy(stakedOnlyOpenPools, ['sortOrder'])
                    .slice(0, numberOfPoolsVisible)
                    .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)
                : orderBy(openPools, ['sortOrder'])
                    .slice(0, numberOfPoolsVisible)
                    .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)}
            </>
          </Route>
          <Route path={`${path}/history`}>
            {stakedOnly
              ? orderBy(stakedOnlyFinishedPools, ['sortOrder'])
                  .slice(0, numberOfPoolsVisible)
                  .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)
              : orderBy(finishedPools, ['sortOrder'])
                  .slice(0, numberOfPoolsVisible)
                  .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)}
          </Route>
        </FlexLayout>
        <div ref={loadMoreRef} />
      </Page>
    </>
  )
}

export default Pools
