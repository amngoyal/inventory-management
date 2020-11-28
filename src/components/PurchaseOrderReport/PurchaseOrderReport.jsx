import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectPurchaseOrderReport } from '../../features/dataSlice';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


export default function PurchaseOrderReport() {
    const classes = useStyles();
    const purchaseOrderReport = useSelector(selectPurchaseOrderReport)

    return (
        <div>
            <h1>Purchase Order Report</h1>
            <TableContainer>
                <Table className={classes.table} aria-label="por table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Product Id</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell align="center">Manufacturer</TableCell>
                            <TableCell align="center">Re-order Qty</TableCell>
                            <TableCell align="center">Balance Qty</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchaseOrderReport.map((supplier, index) => (
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
                                    {supplier.reOrderQty}
                                </TableCell>
                                <TableCell align="center">
                                    {supplier.balance}
                                </TableCell>
                                <TableCell align="center">
                                    <Button>View</Button>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

