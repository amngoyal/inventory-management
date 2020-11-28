import { IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core'
import { Cancel, Delete, Done, Edit } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import instance from '../../axios';
import { selectProducts, setProducts } from '../../features/dataSlice';

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

        if (products.length === 0) {
            instance.get('/get-products').then(res => {
                dispatch(setProducts(res.data))
            })
        }

        return () => {
        }
    }, [products, dispatch])

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
            let res = await instance.post('/update-product', {
                objectId: editedFormData._id,
                updatedData: {
                    productId: editedFormData.productId,
                    productName: editedFormData.productName,
                    manufacturer: editedFormData.manufacturer,
                    category: editedFormData.category,
                    reOrderQty: editedFormData.reOrderQty
                }
            })

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

        try {
            const res = await instance.post('/delete-product', { objectId: product._id })
            console.log(res);
        }
        catch (err) {
            console.log(err);
            alert("error in deleting product")
        }

    }

    return (
        <div>

            <h1>Products</h1>

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
                                            <IconButton onClick={e => handleProductEdit(e, product, index)}>
                                                <Edit />
                                            </IconButton>

                                            <IconButton onClick={e => handleProductDelete(e, product)}>
                                                <Delete />
                                            </IconButton>
                                        </>
                                        :
                                        <>
                                            {
                                                index === editableRowIndex ?
                                                    <>
                                                        <IconButton onClick={e => onEditedRowSave(e, product, index)}>
                                                            <Done />
                                                        </IconButton>
                                                        <IconButton onClick={e => handleCancelEditing()}>
                                                            <Cancel />
                                                        </IconButton>
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
