import { createSlice } from "@reduxjs/toolkit";

export const initialCartState = {
    total: 0, 
    subTotal: 0,
    items: []
};

export const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        calculateSubTotal: (state) => {
            // Hitung subtotal dengan menjumlahkan harga x jumlah kuantitas dari setiap item
            state.subTotal = state.items.reduce((acc, item) => acc + item.harga * item.quantity, 0);
        },
        calculateTotal: (state) => {
            // Jika ingin menghitung total, misalnya dengan menambahkan pajak 10%
            state.total = state.subTotal * 1.1; // contoh 10% pajak
        },
        addItem: (state, action) => {
            const { name, quantity, amountPrice, harga, notes } = action.payload;
      
            const existingItem = state.items.find(item => item.name === name);
      
            if (existingItem) {
              existingItem.quantity += quantity;
              existingItem.amountPrice += amountPrice;
              existingItem.notes = existingItem.notes 
              ? existingItem.notes + ', ' + notes // Gabungkan notes baru
              : notes;
            } else {
                state.items.push(action.payload);
            }
            // Setelah item ditambahkan, hitung subtotal dan total
            cartSlice.caseReducers.calculateSubTotal(state);
            cartSlice.caseReducers.calculateTotal(state);
          },
        deleteItem: (state, action) => {
            state.items = state.items.filter(item => item.name !== action.payload);
            // Setelah item dihapus, hitung ulang subtotal dan total
            cartSlice.caseReducers.calculateSubTotal(state);
            cartSlice.caseReducers.calculateTotal(state);
        },
        updateItem: (state, action) => {
            state.items = state.items.map(item => 
                item.name === action.payload.name
                ? {...item, ...action.payload}
                : item
            );
            // Setelah item diupdate, hitung ulang subtotal dan total
            cartSlice.caseReducers.calculateSubTotal(state);
            cartSlice.caseReducers.calculateTotal(state);
        },
        clearCart: (state) => {
            state.items = [];
            state.subTotal = 0;
            state.total = 0;
        }
    }
});

export const { addItem, deleteItem, updateItem, clearCart } = cartSlice.actions;
