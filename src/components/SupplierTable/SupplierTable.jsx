import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core'
import { Cancel, Delete, Done, Edit } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import instance from '../../axios';
import { selectSuppliers, setSuppliers, updateSupplier, deleteSupplier } from '../../features/dataSlice';

const useStyles = makeStyles({
    table: {
        minWidth: 950,
    },
});

function ProductsTable() {
    const classes = useStyles();


    // ******************** States ***************************
    const [isEditable, setIsEditable] = useState(false);
    const [editableRowIndex, setEditableRowIndex] = useState(-1);

    const [editedFormData, setEditedFormData] = useState({
        productName: '',
        manufacturer: '',
        supplier: '',
        moq: '',
        leadTime: ''
    })

    //************************* useEffect *********************/ 

    const dispatch = useDispatch();
    const suppliers = useSelector(selectSuppliers);
    const [allProducts, setAllProducts] = useState([])

    const [openDialog, setOpenDialog] = React.useState(false)
    const [addSupplierForm, setAddSupplierForm] = useState({
        product: null,
        supplier: '',
        moq: '',
        leadTime: '',
    })

    useEffect(() => {

        instance.get('/get-suppliers').then(res => {
            dispatch(setSuppliers(res.data))
        })

        instance.get('/get-products')
            .then(res => {
                setAllProducts(res.data)
            })
            .catch(err => {
                console.log(err);
            })

        return () => {
        }
    }, [dispatch])


    // ************* Handlers ************************

    const handleCancelEditing = () => {
        setIsEditable(false);
        setEditableRowIndex(-1);
        setEditedFormData({
            productName: '',
            manufacturer: '',
            supplier: '',
            moq: '',
            leadTime: ''
        })
    }

    const handleProductEdit = (e, supplier, index) => {
        e.preventDefault();

        setEditedFormData(supplier)
        setEditableRowIndex(index);
        setIsEditable(true);

        console.log(supplier, index);
    }

    const onEditedRowSave = async () => {

        try {

            const updateData = {
                objectId: editedFormData._id,
                updatedData: {
                    productId: editedFormData.productId,
                    productName: editedFormData.productName,
                    manufacturer: editedFormData.manufacturer,
                    supplier: editedFormData.supplier,
                    moq: editedFormData.moq,
                    leadTime: editedFormData.leadTime
                }
            }

            let res = await instance.post('/update-supplier', updateData)

            dispatch(updateSupplier(updateData))

            console.log(res);

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

    const handleProductDelete = async (e, supplier) => {

        try {
            const res = await instance.post('/delete-supplier', { objectId: supplier._id })
            console.log(res);
            dispatch(deleteSupplier({ _id: supplier._id }))
        }
        catch (err) {
            console.log(err);
            alert("error in deleting product")
        }

    }

    const handleDialogClose = () => setOpenDialog(false)

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        try {

            const { product, supplier, leadTime, moq } = addSupplierForm
            console.log(addSupplierForm);
            const { productId, productName, manufacturer } = product

            let newSupplier = {
                productId, productName, manufacturer, supplier, leadTime, moq
            }
            let newSupplierRes = await instance.post('/add-supplier', { newSupplier })
            console.log(newSupplierRes);

            dispatch(setSuppliers(suppliers.concat(newSupplier)))

            setOpenDialog(false);
            setAddSupplierForm({
                product: null,
                supplier: '',
                moq: '',
                leadTime: '',
            })
        }
        catch (err) {
            console.log(err);
            alert("Unable to add supplier")
        }
    }

    return (
        <div>

            <h1>Suppliers</h1>

            <Button onClick={() => setOpenDialog(true)}>Add Supplier</Button>

            <TableContainer >
                <Table className={classes.table} aria-label="suppliers table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Product Id</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell align="center">Manufacturer</TableCell>
                            <TableCell align="center">Supplier</TableCell>
                            <TableCell align="center">MOQ (units)</TableCell>
                            <TableCell align="center">Lead Time</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {suppliers.map((supplier, index) => (
                            <TableRow key={supplier.supplier}>
                                <TableCell align="left">
                                    {supplier.productId}
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
                                        (supplier.productName)
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
                                        (supplier.manufacturer)
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {isEditable && editableRowIndex === index ?
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={editedFormData.supplier}
                                            onChange={e => setEditedFormData({ ...editedFormData, supplier: e.target.value })}
                                        />
                                        :
                                        (supplier.supplier)
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {isEditable && editableRowIndex === index ?
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={editedFormData.moq}
                                            onChange={e => setEditedFormData({ ...editedFormData, moq: e.target.value })}
                                        />
                                        :
                                        (supplier.moq)
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {isEditable && editableRowIndex === index ?
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={editedFormData.leadTime}
                                            onChange={e => setEditedFormData({ ...editedFormData, leadTime: e.target.value })}
                                        />
                                        :
                                        (supplier.leadTime + ' hrs')
                                    }
                                </TableCell>
                                <TableCell align="center">

                                    {!isEditable ?
                                        <>
                                            <Tooltip title="Edit" arrow>
                                                <IconButton onClick={e => handleProductEdit(e, supplier, index)}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete" arrow>
                                                <IconButton onClick={e => handleProductDelete(e, supplier)}>
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

            <Dialog fullWidth open={openDialog}
                onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle >Add New Supplier</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={allProducts}
                                value={addSupplierForm.product}
                                onChange={(e, value) => setAddSupplierForm({ ...addSupplierForm, product: value })}
                                getOptionLabel={(option) => option.productId}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="Product ID" variant="outlined" />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                value={addSupplierForm.supplier}
                                label="Supplier"
                                onChange={(e) => setAddSupplierForm({ ...addSupplierForm, supplier: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                value={addSupplierForm.reOrderQty}
                                type="number"
                                label="MOQ"
                                onChange={(e) => setAddSupplierForm({ ...addSupplierForm, moq: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                type="number"
                                value={addSupplierForm.leadTime}
                                label="Lead Time (in Hrs)"
                                onChange={(e) => setAddSupplierForm({ ...addSupplierForm, leadTime: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddSupplier} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ProductsTable
