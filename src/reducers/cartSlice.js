import { createSlice } from "@reduxjs/toolkit";

export const initialCartState = {
    subTotal: 0,
    tax: 0,
    items: []
};

export const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        calculateSubTotal: (state) => {
            // Hitung subtotal dengan menjumlahkan harga x jumlah kuantitas dari setiap item
            state.subTotal = state.items.reduce((acc, item) => acc + item.harga * item.quantity, 0)
        },
        setTaxRate: (state, action) => {
            state.tax = action.payload
        },
        addItem: (state, action) => {
            const { id, name, quantity, amountPrice, harga, notes } = action.payload;
      
            const existingItem = state.items.find(item => item.id === id);
      
            if (existingItem) {
              existingItem.quantity += quantity
              existingItem.amountPrice += amountPrice
              existingItem.notes = existingItem.notes 
              ? existingItem.notes + ', ' + notes
              : notes;
            } else {
                state.items.push(action.payload);
            }
            cartSlice.caseReducers.calculateSubTotal(state);
          },
        deleteItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);

            cartSlice.caseReducers.calculateSubTotal(state);
        },
        updateItem: (state, action) => {
            state.items = state.items.map(item => 
                item.id === action.payload.id
                ? {...item, ...action.payload}
                : item
            )
            // Setelah item diupdate, hitung ulang subtotal dan total
            cartSlice.caseReducers.calculateSubTotal(state)
        },
        clearCart: (state) => {
            state.items = []
            state.subTotal = 0
            state.tax = 0
        }
    }
});

export const { addItem, deleteItem, setTaxRate, updateItem, clearCart } = cartSlice.actions;
