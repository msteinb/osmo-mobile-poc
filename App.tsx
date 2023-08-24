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
import { Coin } from 'osmojs/dist/codegen/cosmos/base/v1beta1/coin';


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

function App(): JSX.Element {
  const { createRPCQueryClient } = osmosis.ClientFactory;
  const [pools, setPools] = useState<Array<Pool>>([]);
    
  console.log("got here");

    useEffect(() => {
        (async () => {
            try {
                console.log("fetching pools");
                const client = await createRPCQueryClient({rpcEndpoint: 'https://rpc.osmosis.zone'})
                const response = await client.osmosis.gamm.v1beta1.pools();
                const ibcClient = await ibc.ClientFactory.createRPCQueryClient({rpcEndpoint: 'https://rpc.osmosis.zone'})
                
                let pools: Array<Pool> = [];
                
                for (let i = 0; i < 10; i++) {
                    const pool = response.pools[i];
                    const asset1 = pool.poolAssets[0];
                    const asset2 = pool.poolAssets[1];
                                        
                    let denom1 = asset1.token.denom;
                    let denom2 = asset2.token.denom;

                    if (asset1.token.denom.startsWith('ibc/')) {
                        const hash = asset1.token.denom.substr(4);
                        const traceRes = await ibcClient.ibc.applications.transfer.v1.denomTrace({hash: hash})
                        denom1 = traceRes.denomTrace.baseDenom
                    }

                    if (asset2.token.denom.startsWith('ibc/')) {
                        const hash = asset2.token.denom.substr(4);
                        const traceRes = await ibcClient.ibc.applications.transfer.v1.denomTrace({hash: hash})
                        denom2 = traceRes.denomTrace.baseDenom
                    }

                    pools.push({
                        asset1: denom1,
                        asset2: denom2,
                        address: pool.address
                    })
                }

                console.log(response.pools[0]);
                
                setPools(pools)
            } catch(error) {
                console.log(error);
            }
        })()
  });

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
