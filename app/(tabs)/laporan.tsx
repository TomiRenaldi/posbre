// app/laporan.tsx
import { useProdukStore } from '@/store/useProdukStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Button, FlatList, Platform, Text, View } from 'react-native';
import { useTransaksiStore } from '../../store/useTransaksiStore';

export default function LaporanScreen() {
  const { riwayat, muatRiwayat } = useTransaksiStore();
  const { muatData } = useProdukStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    muatData();
  }, []);

  // Filter transaksi sesuai tanggal yg dipilih
  const filtered = riwayat.filter((trx) => {
    const trxDate = new Date(trx.tanggal);
    return (
      trxDate.getDate() === selectedDate.getDate() &&
      trxDate.getMonth() === selectedDate.getMonth() &&
      trxDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>📄 Riwayat Transaksi</Text>

      {/* Date Picker */}
      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>🗓️ Pilih Tanggal:</Text>
        <Button
          title={selectedDate.toDateString()}
          onPress={() => setShowPicker(true)}
        />
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              if (date) {
                setSelectedDate(date);
              }
              setShowPicker(false);
            }}
          />
        )}
      </View>

      {filtered.length === 0 ? (
        <Text>Tidak ada transaksi pada tanggal ini.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                marginVertical: 12,
                padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>
                🗓️ {new Date(item.tanggal).toLocaleString()}
              </Text>
              {item.items.map((produk, idx) => (
                <Text key={idx}>
                  - {produk.nama} x{produk.qty} = Rp {produk.qty * produk.harga}
                </Text>
              ))}
              <Text style={{ marginTop: 4, fontWeight: 'bold' }}>
                Total: Rp {item.total}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
