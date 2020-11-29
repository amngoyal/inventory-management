import { Button, IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core'
import { Cancel, Done } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import instance from '../../axios';
import { selectStock, setProducts, setStock, updateStock } from '../../features/dataSlice';

const useStyles = makeStyles({
    table: {
        minWidth: 950,
    },
});

function StockTable() {
    const classes = useStyles();


    // ******************** States ***************************
    const [isEditable, setIsEditable] = useState(false);
    const [editableRowIndex, setEditableRowIndex] = useState(-1);

    const [editedFormData, setEditedFormData] = useState({
        productId: '',
        orderedQty: '',
        qtySold: ''
    })

    //************************* useEffect *********************/ 

    const dispatch = useDispatch();
    const stock = useSelector(selectStock);

    useEffect(() => {

        instance.get('/get-stock').then(res => {
            dispatch(setStock(res.data))
        })

        return () => {
        }
    }, [dispatch])


    // ************* Handlers ************************

    const handleCancelEditing = () => {
        setIsEditable(false);
        setEditableRowIndex(-1);
        setEditedFormData({
            productId: '',
            orderedQty: '',
            qtySold: ''
        })
    }

    const handleProductEdit = (e, product, index) => {
        e.preventDefault();

        setEditedFormData(product)
        setEditableRowIndex(index);
        setIsEditable(true);

        console.log(product, index);
    }

    const onEditedRowSave = async () => {

        try {

            let productsArr = await instance.get('/get-products')
            dispatch(setProducts(productsArr.data))

            const products = productsArr.data;

            const balance = editedFormData.orderedQty - editedFormData.qtySold

            const updateData = {
                objectId: editedFormData._id,
                updatedData: {
                    productId: editedFormData.productId,
                    qtySold: editedFormData.qtySold,
                    orderedQty: editedFormData.orderedQty,
                    balance: editedFormData.orderedQty - editedFormData.qtySold
                }
            }

            let res = await instance.post('/update-stock', updateData)
            dispatch(updateStock(updateData))
            console.log("stock updated");
            console.log(res);

            const product = products.filter(el => el.productId === editedFormData.productId)

            if (!(balance <= product[0].reOrderQty)) {
                instance.post('/delete-por', { productId: editedFormData.productId })
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }


            setIsEditable(false);
            setEditableRowIndex(-1);
            setEditedFormData({
                productName: '',
                manufacturer: '',
                supplier: '',
                moq: '',
                leadTime: ''
            })


        } catch (err) {
            console.log(err);
            alert("unable to edit");
        }
    }

    return (
        <div>

            <h1>Stock</h1>

            <TableContainer >
                <Table className={classes.table} aria-label="suppliers table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Product Id</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell align="center">Manufacturer</TableCell>
                            <TableCell align="center">Ordered Quantity</TableCell>
                            <TableCell align="center">Quantity Sold</TableCell>
                            <TableCell align="center">Balance</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stock.map((supplier, index) => (
                            <TableRow key={supplier.productId}>
                                <TableCell align="left">
                                    {supplier.productId}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {supplier.productName}
                                </TableCell>
                                <TableCell align="center">
                                    {supplier.manufacturer}
                                </TableCell>
                                <TableCell align="center">
                                    {isEditable && editableRowIndex === index ?
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={editedFormData.orderedQty}
                                            onChange={e => setEditedFormData({ ...editedFormData, orderedQty: e.target.value })}
                                        />
                                        :
                                        (supplier.orderedQty)
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {isEditable && editableRowIndex === index ?
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={editedFormData.qtySold}
                                            onChange={e => setEditedFormData({ ...editedFormData, qtySold: e.target.value })}
                                        />
                                        :
                                        (supplier.qtySold)
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {supplier.balance}
                                </TableCell>
                                <TableCell align="center">

                                    {!isEditable ?
                                        <Button onClick={e => handleProductEdit(e, supplier, index)} variant="outlined">Edit</Button>
                                        :
                                        <>
                                            {
                                                index === editableRowIndex ?
                                                    <>

                                                        <Tooltip title="Save" arrow>
                                                            <IconButton onClick={e => onEditedRowSave(e, supplier, index)}>
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

export default StockTable
