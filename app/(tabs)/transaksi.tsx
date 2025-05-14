import { useEffect } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { useProdukStore } from '../../store/useProdukStore';
import { useTransaksiStore } from '../../store/useTransaksiStore';

export default function TransaksiScreen() {
  const { produk, muatData } = useProdukStore(); // Ambil produk dari store
  const {
    keranjang,
    tambahKeKeranjang,
    simpanTransaksi,
    kosongkanKeranjang,
  } = useTransaksiStore();

  useEffect(() => {
    muatData(); // Muat produk dari AsyncStorage
  }, []);

  const total = keranjang.reduce((sum, item) => sum + item.harga * item.qty, 0);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>🛒 Daftar Produk</Text>
      <FlatList
        data={produk}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 6 }}>
            <Text>{item.nama} - Rp {item.harga}</Text>
            <Text>Stok: {item.stok}</Text>
            <Button
              title="Tambah ke Keranjang"
              onPress={() =>
                tambahKeKeranjang({ ...item, qty: 1 })
              }
              disabled={item.stok <= 0}
            />
          </View>
        )}
      />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>🧾 Keranjang:</Text>
      <FlatList
        data={keranjang}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.nama} x{item.qty} = Rp {item.harga * item.qty}</Text>
        )}
      />
      <Text style={{ marginTop: 10 }}>Total: Rp {total}</Text>
      <Button title="💾 Simpan Transaksi" onPress={simpanTransaksi} />
      <Button title="🧹 Kosongkan Keranjang" onPress={kosongkanKeranjang} />
    </View>
  );
}
