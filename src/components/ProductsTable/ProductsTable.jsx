import { IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core'
import { Cancel, Delete, Done, Edit } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import instance from '../../axios';
import { deleteProduct, selectProducts, setProducts, updateProduct } from '../../features/dataSlice';

const useStyles = makeStyles({
    table: {
        minWidth: 950,
    },
});

function ProductsTable() {
    const classes = useStyles();
    const [isEditable, setIsEditable] = useState(false);
    const [editableRowIndex, setEditableRowIndex] = useState(-1);

    const [editedFormData, setEditedFormData] = useState({
        productName: '',
        manufacturer: '',
        category: '',
        reOrderQty: ''
    })

    const dispatch = useDispatch();
    const products = useSelector(selectProducts);

    useEffect(() => {

        instance.get('/get-products').then(res => {
            dispatch(setProducts(res.data))
        })


        return () => {
        }
    }, [dispatch])

    const handleCancelEditing = () => {
        setIsEditable(false);
        setEditableRowIndex(-1);
        setEditedFormData({
            productName: '',
            manufacturer: '',
            category: '',
            reOrderQty: ''
        })
    }

    const handleProductEdit = (e, product, index) => {
        e.preventDefault();

        setEditedFormData(product)
        setEditableRowIndex(index);
        setIsEditable(true);

        console.log(product, index);
    }

    const onEditedRowSave = async (e, product, index) => {

        try {

            const updateData = {
                objectId: editedFormData._id,
                updatedData: {
                    productId: editedFormData.productId,
                    productName: editedFormData.productName,
                    manufacturer: editedFormData.manufacturer,
                    category: editedFormData.category,
                    reOrderQty: editedFormData.reOrderQty
                }
            }

            let res = await instance.post('/update-product', updateData)

            dispatch(updateProduct(updateData))

            console.log(res);

            setIsEditable(false);
            setEditableRowIndex(-1);
            setEditedFormData({
                productName: '',
                manufacturer: '',
                category: '',
                reOrderQty: ''
            })


        } catch (err) {
            console.log(err);
            alert("unable to edit");
        }
    }

    const handleProductDelete = async (e, product) => {

        if (window.confirm('Are you sure you want to delete this product from database?')) {

            try {
                const res = await instance.post('/delete-product', { objectId: product._id, productId: product.productId })
                console.log(res);
                dispatch(deleteProduct({ _id: product._id }))
            }
            catch (err) {
                console.log(err);
                alert("error in deleting product")
            }

        }

    }

    return (
        <div style={{ padding: '10px' }}>

            <h1 style={{ marginBottom: '20px', fontSize: '36px' }}>Products</h1>

            <TableContainer >
                <Table className={classes.table} aria-label="products table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Product Id</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell align="center">Manufacturer</TableCell>
                            <TableCell align="center">Category</TableCell>
                            <TableCell align="center">Re-order Qty</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={product.productId}>
                                <TableCell align="left">
                                    {product.productId}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {isEditable && editableRowIndex === index ?
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={editedFormData.productName}
                                            onChange={e => setEditedFormData({ ...editedFormData, productName: e.target.value })}
                                        />
                                        :
                                        (product.productName)
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {isEditable && editableRowIndex === index ?
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            value={editedFormData.manufacturer}
                                            onChange={e => setEditedFormData({ ...editedFormData, manufacturer: e.target.value })}
                                        />
                                        :
                                        (product.manufacturer)
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {isEditable && editableRowIndex === index ?
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={editedFormData.category}
                                            onChange={e => setEditedFormData({ ...editedFormData, category: e.target.value })}
                                        />
                                        :
                                        (product.category)
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {isEditable && editableRowIndex === index ?
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={editedFormData.reOrderQty}
                                            onChange={e => setEditedFormData({ ...editedFormData, reOrderQty: e.target.value })}
                                        />
                                        :
                                        (product.reOrderQty)
                                    }
                                </TableCell>
                                <TableCell align="center">

                                    {!isEditable ?
                                        <>
                                            <Tooltip title="Edit" arrow>
                                                <IconButton onClick={e => handleProductEdit(e, product, index)}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete" arrow>
                                                <IconButton onClick={e => handleProductDelete(e, product)}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                        :
                                        <>
                                            {
                                                index === editableRowIndex ?
                                                    <>
                                                        <Tooltip title="Save" arrow>
                                                            <IconButton onClick={e => onEditedRowSave(e, product, index)}>
                                                                <Done />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Cancel" arrow>
                                                            <IconButton onClick={e => handleCancelEditing()}>
                                                                <Cancel />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                    : null
                                            }
                                        </>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default ProductsTable
