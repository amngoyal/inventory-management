import { createSlice } from '@reduxjs/toolkit';

export const dataSlice = createSlice({
    name: 'dataSlice',
    initialState: {
        products: [],
        suppliers: [],
        purchaseOrderReport: [],
        stock: []
    },
    reducers: {
        setProducts: (state, { payload }) => {
            state.products = payload
        },
        setStock: (state, { payload }) => {
            state.stock = payload
        },
        setPurchaseOrderReport: (state, { payload }) => {
            state.purchaseOrderReport = payload
        },
        setSuppliers: (state, { payload }) => {
            state.suppliers = payload
        },
    },
});

export const { setProducts, setStock, setPurchaseOrderReport, setSuppliers } = dataSlice.actions;

export const selectProducts = state => state.data.products;
export const selectPurchaseOrderReport = state => state.data.purchaseOrderReport;
export const selectStock = state => state.data.stock;
export const selectSuppliers = state => state.data.suppliers;

export default dataSlice.reducer;
