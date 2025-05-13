import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface Produk {
  id: string;
  nama: string;
  harga: number;
  stok: number;
}

interface State {
  produk: Produk[];
  tambahProduk: (item: Produk) => void;
  kurangiStokSetelahTransaksi: (items: { id: string; qty: number }[]) => void;
  muatData: () => Promise<void>;
  simpanData: () => Promise<void>;
}

export const useProdukStore = create<State>((set, get) => ({
  produk: [],
  tambahProduk: (item) => {
    const updated = [...get().produk, item];
    set({ produk: updated });
    AsyncStorage.setItem('produk', JSON.stringify(updated));
  },
  
  kurangiStokSetelahTransaksi: (items: { id: string; qty: number }[]) => {
    const produk = get().produk.map((item) => {
      const found = items.find((x) => x.id === item.id);
      if (found) {
        return {
          ...item,
          stok: item.stok - found.qty,
        };
      }
      return item;
    });
    set({ produk });
    AsyncStorage.setItem('produk', JSON.stringify(produk));
  },

  muatData: async () => {
    const data = await AsyncStorage.getItem('produk');
    if (data) set({ produk: JSON.parse(data) });
  },

  simpanData: async () => {
    await AsyncStorage.setItem('produk', JSON.stringify(get().produk));
  },
}));
