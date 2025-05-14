import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';

type Produk = {
  id: string;
  nama: string;
  harga: number;
  stok: number;
};

type ProdukStore = {
  produk: Produk[];
  muatData: () => Promise<void>;
  simpanData: () => Promise<void>;
  tambahProduk: (produk: Omit<Produk, 'id'>) => void;
  editProduk: (id: string, data: Partial<Produk>) => void;
  hapusProduk: (id: string) => void;
  kurangiStok: (stokItems: { id: string; qty: number }[]) => void;
};

const PRODUK_KEY = 'produk';

export const useProdukStore = create<ProdukStore>((set, get) => ({
  produk: [],

  muatData: async () => {
    const json = await AsyncStorage.getItem(PRODUK_KEY);
    if (json) set({ produk: JSON.parse(json) });
  },

  simpanData: async () => {
    const data = get().produk;
    await AsyncStorage.setItem(PRODUK_KEY, JSON.stringify(data));
  },

  tambahProduk: (produkBaru) => {
  const produkLengkap = { ...produkBaru, id: nanoid() };
  set((state) => {
    const produk = [...state.produk, produkLengkap];
    AsyncStorage.setItem(PRODUK_KEY, JSON.stringify(produk));
    return { produk };
  });
},

  editProduk: (id, data) => {
  set((state) => {
    const produk = state.produk.map((p) =>
      p.id === id ? { ...p, ...data } : p
    );
    AsyncStorage.setItem(PRODUK_KEY, JSON.stringify(produk));
    return { produk };
  });
},

  hapusProduk: (id) => {
  set((state) => {
    const produk = state.produk.filter((p) => p.id !== id);
    AsyncStorage.setItem(PRODUK_KEY, JSON.stringify(produk));
    return { produk };
  });
},

  kurangiStok: (stokItems) => {
    const produk = get().produk.map((p) => {
      const stokItem = stokItems.find((item) => item.id === p.id);
      if (stokItem) {
        return { ...p, stok: p.stok - stokItem.qty };
      }
      return p;
    });
    set({ produk });
  },
}));
