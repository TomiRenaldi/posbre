import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';
import { useProdukStore } from './useProdukStore';

interface ItemKeranjang {
  id: string;
  nama: string;
  harga: number;
  qty: number;
}

interface Transaksi {
  id: string;
  tanggal: string;
  items: ItemKeranjang[];
  total: number;
}

interface State {
  keranjang: ItemKeranjang[];
  riwayat: Transaksi[];
  tambahKeKeranjang: (item: ItemKeranjang) => void;
  kosongkanKeranjang: () => void;
  simpanTransaksi: () => void;
  muatRiwayat: () => void;
}

export const useTransaksiStore = create<State>((set, get) => ({
  keranjang: [],
  riwayat: [],
  tambahKeKeranjang: (item) => {
    const keranjang = get().keranjang;
    const { produk } = useProdukStore.getState(); // ambil stok produk

    const stokTersedia = produk.find((p) => p.id === item.id)?.stok ?? 0;
    const jumlahDiKeranjang = keranjang.find((k) => k.id === item.id)?.qty ?? 0;

    if (jumlahDiKeranjang + item.qty > stokTersedia) {
      alert('Stok tidak mencukupi!');
      return;
    }

    const existing = keranjang.find((i) => i.id === item.id);
    let updated;
    if (existing) {
      updated = keranjang.map((i) =>
        i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
      );
    } else {
      updated = [...keranjang, item];
    }
    set({ keranjang: updated });
  },

  kosongkanKeranjang: () => set({ keranjang: [] }),
  simpanTransaksi: async () => {
    const keranjang = get().keranjang;

    if (keranjang.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }

    // Validasi qty
    for (const item of keranjang) {
      if (item.qty <= 0) {
        alert(`Qty produk "${item.nama}" tidak boleh nol`);
        return;
      }
    }

    // Validasi stok dari useProdukStore
    const produkStore = useProdukStore.getState();
    for (const item of keranjang) {
      const produk = produkStore.produk.find((p) => p.id === item.id);
      if (!produk) {
        alert(`Produk "${item.nama}" tidak ditemukan`);
        return;
      }
      if (produk.stok < item.qty) {
        alert(`Stok produk "${item.nama}" tidak cukup!`);
        return;
      }
    }

    const transaksiBaru: Transaksi = {
      id: nanoid(),
      tanggal: new Date().toISOString(),
      items: keranjang,
      total: keranjang.reduce((sum, item) => sum + item.harga * item.qty, 0),
    };
    const riwayat = [...get().riwayat, transaksiBaru];

    const kurangiStok = useProdukStore.getState().kurangiStok;

    kurangiStok(
      keranjang.map((item) => ({ id: item.id, qty: item.qty }))
    );

    set({ riwayat, keranjang: [] });
    await AsyncStorage.setItem('riwayat', JSON.stringify(riwayat));
  },

  muatRiwayat: async () => {
    const data = await AsyncStorage.getItem('riwayat');
    if (data) set({ riwayat: JSON.parse(data) });
  },
}));
