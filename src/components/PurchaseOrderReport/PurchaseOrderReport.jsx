import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectPurchaseOrderReport, setPurchaseOrderReport } from '../../features/dataSlice';
import instance from '../../axios';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


export default function PurchaseOrderReport() {
    const classes = useStyles();
    const purchaseOrderReport = useSelector(selectPurchaseOrderReport)

    const [openDialog, setOpenDialog] = useState(false)
    const [allSuppliersArr, setAllSuppliersArr] = useState([])

    const dispatch = useDispatch();

    useEffect(() => {

        instance.get('/get-purchase-report').then(res => {
            dispatch(setPurchaseOrderReport(res.data));
        })

        return () => {
        }
    }, [dispatch])

    const handleDialogOpen = (e, allSuppliers) => {
        setAllSuppliersArr(allSuppliers)
        setOpenDialog(true);
    }

    const handleDialogClose = () => setOpenDialog(false);

    return (
        <div style={{ padding: '10px' }}>
            <h1 style={{ marginBottom: '20px', fontSize: '36px' }}>Purchase Order Report</h1>
            <TableContainer>
                <Table className={classes.table} aria-label="por table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Product Id</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell align="center">Manufacturer</TableCell>
                            <TableCell align="center">Re-order Qty</TableCell>
                            <TableCell align="center">Balance Qty</TableCell>
                            <TableCell align="center">Vendor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchaseOrderReport.map((por, index) => (
                            <TableRow key={por.productId}>
                                <TableCell align="left">
                                    {por.productId}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {por.productName}
                                </TableCell>
                                <TableCell align="center">
                                    {por.manufacturer}
                                </TableCell>
                                <TableCell align="center">
                                    {por.reOrderQty}
                                </TableCell>
                                <TableCell align="center">
                                    {por.balance}
                                </TableCell>
                                <TableCell align="center">
                                    <Button variant="outlined" color="primary" onClick={(e) => handleDialogOpen(e, por.allSuppliers)}>View</Button>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog fullWidth open={openDialog}
                onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle >Vendors for this product </DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Supplier</TableCell>
                                    <TableCell>MOQ</TableCell>
                                    <TableCell>Lead Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allSuppliersArr.map((supp, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{supp.supplier}</TableCell>
                                            <TableCell>{supp.moq}</TableCell>
                                            <TableCell>{supp.leadTime} Hrs</TableCell>
                                        </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </div>
    );
}

