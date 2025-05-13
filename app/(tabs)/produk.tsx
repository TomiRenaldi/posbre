import { nanoid } from 'nanoid/non-secure';
import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';
import { useProdukStore } from '../../store/useProdukStore';

export default function Produk() {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const { produk, tambahProduk, muatData } = useProdukStore();

  useEffect(() => {
    muatData();
  }, []);

  return (
    <View>
      <TextInput placeholder="Nama Produk" onChangeText={setNama} value={nama} />
      <TextInput placeholder="Harga" keyboardType="numeric" onChangeText={setHarga} value={harga} />
      <Button
        title="Tambah"
        onPress={() => {
          tambahProduk({ id: nanoid(), nama, harga: parseFloat(harga), stok: 0 });
          setNama('');
          setHarga('');
        }}
      />
      <FlatList
        data={produk}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.nama} - Rp {item.harga}</Text>
        )}
      />
    </View>
  );
}
