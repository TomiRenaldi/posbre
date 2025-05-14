// app/index.tsx
import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useProdukStore } from '../../store/useProdukStore';

export default function Produk() {
  const { produk, muatData, tambahProduk, editProduk, hapusProduk } = useProdukStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: '', harga: '', stok: '' });

  useEffect(() => {
    muatData();
  }, []);

  const resetForm = () => {
    setForm({ nama: '', harga: '', stok: '' });
    setEditId(null);
  };

  const handleSubmit = () => {
  const { nama, harga, stok } = form;

  // Cek apakah semua terisi
  if (!nama.trim() || !harga.trim() || !stok.trim()) {
    alert('Semua field harus diisi!');
    return;
  }

  // Cek apakah angka valid
  const hargaNum = parseInt(harga);
  const stokNum = parseInt(stok);

  if (isNaN(hargaNum) || hargaNum < 0) {
    alert('Harga harus angka positif!');
    return;
  }

  if (isNaN(stokNum) || stokNum < 0) {
    alert('Stok harus angka positif!');
    return;
  }

  const payload = { nama: nama.trim(), harga: hargaNum, stok: stokNum };

  if (editId) {
    editProduk(editId, payload);
  } else {
    tambahProduk(payload);
  }

  resetForm();
  setModalVisible(false);
};

  const startEdit = (item: any) => {
    setForm({
      nama: item.nama,
      harga: item.harga.toString(),
      stok: item.stok.toString(),
    });
    setEditId(item.id);
    setModalVisible(true);
  };

  return (
    <View className="p-4 flex-1 bg-white">
      <Text className="text-xl font-bold mb-4">📦 Produk</Text>

      <FlatList
        data={produk}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Belum ada produk</Text>}
        renderItem={({ item }) => (
          <View className="border p-3 rounded mb-3">
            <Text className="font-semibold">{item.nama}</Text>
            <Text className='text-sm text-gray-600'>Harga: Rp {item.harga}</Text>
            <Text className={`text-sm ${item.stok <= 3 ? 'text-red-500' : 'text-green-600'}`}>Stok: {item.stok}</Text>

            <View className="flex-row mt-2 gap-2">
              <Pressable
                className="bg-blue-500 px-3 py-1 rounded"
                onPress={() => startEdit(item)}
              >
                <Text className="text-white">Edit</Text>
              </Pressable>
              <Pressable
                className="bg-red-500 px-3 py-1 rounded"
                onPress={() => hapusProduk(item.id)}
              >
                <Text className="text-white">Hapus</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable
        className="bg-green-600 px-4 py-2 rounded mt-4"
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text className="text-white text-center font-bold">➕ Tambah Produk</Text>
      </Pressable>

      {/* Modal Form */}
      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white w-[90%] p-5 rounded-xl shadow">
            <Text className="text-lg font-bold mb-3">
              {editId ? 'Edit Produk' : 'Tambah Produk'}
            </Text>

            <TextInput
              className="border p-2 rounded mb-2"
              placeholder="Nama Produk"
              value={form.nama}
              onChangeText={(v) => setForm((f) => ({ ...f, nama: v }))}
            />
            <TextInput
              className="border p-2 rounded mb-2"
              placeholder="Harga"
              keyboardType="numeric"
              value={form.harga}
              onChangeText={(v) => setForm((f) => ({ ...f, harga: v }))}
            />
            <TextInput
              className="border p-2 rounded mb-2"
              placeholder="Stok"
              keyboardType="numeric"
              value={form.stok}
              onChangeText={(v) => setForm((f) => ({ ...f, stok: v }))}
            />

            <View className="flex-row justify-between mt-3">
              <Pressable
                className="bg-gray-400 px-4 py-2 rounded"
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text className="text-white">Batal</Text>
              </Pressable>
              <Pressable
                className="bg-green-600 px-4 py-2 rounded"
                onPress={handleSubmit}
              >
                <Text className="text-white">{editId ? 'Simpan' : 'Tambah'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
