/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { ibc, osmosis } from 'osmojs';
import { PageRequest } from 'osmojs/dist/codegen/cosmos/base/query/v1beta1/pagination';
import { Pool as BalancerPool, PoolAsset } from 'osmojs/dist/codegen/osmosis/gamm/pool-models/balancer/balancerPool';

type ItemProps = {title: string, subtitle: string};

const Item = ({title, subtitle}: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.itemTitle}>{title}</Text>
    <Text style={styles.itemSubtitle}>{subtitle}</Text>
  </View>
);

interface Pool {
    asset1: string,
    asset2: string,
    address: string
}

const rpcEndpoint = 'https://rpc.testnet.osmosis.zone';
const { createRPCQueryClient: createOsmoClient } = osmosis.ClientFactory;
const { createRPCQueryClient: createIbcClient } = ibc.ClientFactory;

async function getDenom(asset: PoolAsset, ibcClient) {
    if (asset.token.denom.startsWith('ibc/')) {
        const hash = asset.token.denom.substring(4);
        const traceRes = await ibcClient.ibc.applications.transfer.v1.denomTrace({hash: hash});
        return traceRes.denomTrace.baseDenom;
    } else {
        return asset.token.denom;
    }
}

function App(): JSX.Element {
    const [pools, setPools] = useState<Array<Pool>>([]);

    useEffect(() => {
        (async () => {
            try {
                console.log("fetching pools");
                
                const client = await createOsmoClient({rpcEndpoint: rpcEndpoint})
                const ibcClient = await createIbcClient({rpcEndpoint: rpcEndpoint})
                
                const poolRes = await client.osmosis.gamm.v1beta1.pools({
                    pagination: PageRequest.fromPartial({
                        limit: 5n
                    })
                });

                console.log(poolRes.pools)

                let pools: Array<Pool> = [];
                
                for (const pool of poolRes.pools) {
                    const balancePool = pool as BalancerPool;
                    const asset1 = balancePool.poolAssets[0];
                    const asset2 = balancePool.poolAssets[1];

                    let denom1 = await getDenom(asset1, ibcClient);
                    let denom2 = await getDenom(asset2, ibcClient);

                    pools.push({
                        asset1: denom1,
                        asset2: denom2,
                        address: balancePool.address
                    })
                }
                
                setPools(pools)
            } catch(error) {
                console.log(error);
            }
        })()
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text style={styles.title}>Osmo Pools</Text>
      <FlatList
        data={pools}
        renderItem={({item}) => <Item title={item.asset1 + ' / ' + item.asset2} subtitle={item.address} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  
  item: {
    backgroundColor: 'lightgrey',
    padding: 20
  },
  title: {
    fontSize: 32,
    padding: 30,
    textAlign: 'center',
    backgroundColor: '#140f34',
    color: '#f0f0f0'
  },
  itemTitle: {
    fontSize: 24,
  },
  itemSubtitle: {
    fontSize: 14,
  }
});

export default App;
