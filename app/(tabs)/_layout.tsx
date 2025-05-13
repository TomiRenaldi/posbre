import { Tabs } from "expo-router"
import React from "react"

const _Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false }} />
            <Tabs.Screen name="laporan" options={{ title: 'Laporan', headerShown: false }} />
            <Tabs.Screen name="produk" options={{ title: 'Produk', headerShown: false }} />
            <Tabs.Screen name="transaksi" options={{ title: 'Transaksi', headerShown: false }} />
        </Tabs>
    )
}

export default _Layout