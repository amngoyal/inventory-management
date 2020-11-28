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
        updateProduct: (state, { payload }) => {
            state.products = state.products.map(product => {
                if (payload.objectId === product._id) {
                    return {
                        _id: payload.objectId,
                        productName: payload.updatedData.productName,
                        productId: payload.updatedData.productId,
                        manufacturer: payload.updatedData.manufacturer,
                        reOrderQty: payload.updatedData.reOrderQty,
                        category: payload.updatedData.category,
                    }
                }
                else
                    return product
            })
        },
        deleteProduct: (state, { payload }) => {
            state.products = state.products.filter(product => product._id !== payload._id);
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

export const { setProducts, updateProduct, deleteProduct,
    setStock,
    setPurchaseOrderReport,
    setSuppliers } = dataSlice.actions;

export const selectProducts = state => state.data.products;
export const selectPurchaseOrderReport = state => state.data.purchaseOrderReport;
export const selectStock = state => state.data.stock;
export const selectSuppliers = state => state.data.suppliers;

export default dataSlice.reducer;
