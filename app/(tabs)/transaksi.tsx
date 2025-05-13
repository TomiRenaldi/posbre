import { useEffect } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { useProdukStore } from '../../store/useProdukStore';
import { useTransaksiStore } from '../../store/useTransaksiStore';

export default function Transaksi() {
  const { produk, muatData } = useProdukStore();
  const {
    keranjang,
    tambahKeKeranjang,
    simpanTransaksi,
    kosongkanKeranjang,
  } = useTransaksiStore();

  useEffect(() => {
    muatData();
  }, []);

  const total = keranjang.reduce((sum, item) => sum + item.harga * item.qty, 0);

  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Daftar Produk</Text>
      <FlatList
        data={produk}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={`+ ${item.nama} (Rp ${item.harga})`}
            onPress={() =>
              tambahKeKeranjang({ ...item, qty: 1 })
            }
          />
        )}
      />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Keranjang:</Text>
      <FlatList
        data={keranjang}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.nama} x{item.qty} = Rp {item.harga * item.qty}</Text>
        )}
      />
      <Text style={{ marginTop: 10 }}>Total: Rp {total}</Text>
      <Button title="Simpan Transaksi" onPress={simpanTransaksi} />
      <Button title="Kosongkan Keranjang" onPress={kosongkanKeranjang} />
    </View>
  );
}
