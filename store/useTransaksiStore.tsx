import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';

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
    const transaksiBaru: Transaksi = {
      id: nanoid(),
      tanggal: new Date().toISOString(),
      items: get().keranjang,
      total: get().keranjang.reduce((sum, item) => sum + item.harga * item.qty, 0),
    };
    const riwayat = [...get().riwayat, transaksiBaru];
    set({ riwayat, keranjang: [] });
    await AsyncStorage.setItem('riwayat', JSON.stringify(riwayat));
  },
  muatRiwayat: async () => {
    const data = await AsyncStorage.getItem('riwayat');
    if (data) set({ riwayat: JSON.parse(data) });
  },
}));
