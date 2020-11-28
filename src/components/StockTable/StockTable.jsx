import {makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React from 'react'

function createData(pid, pname, manufacturer, orderedQty, QtySold, balance) {
    return { pid, pname, manufacturer, orderedQty, QtySold, balance };
}

const rows = [
    createData('PI-01', "Cadbury Choclate (Rs.10)", "Cadbury", 200, 150, 50),
];

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function StockTable() {
    const classes = useStyles();

    return (
        <div>

            <h1>Stock</h1>

            <TableContainer>
                <Table className={classes.table} aria-label="stock table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Product Id</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell align="center">Manufacturer</TableCell>
                            <TableCell align="center">Supplier</TableCell>
                            <TableCell align="center">MOQ (units)</TableCell>
                            <TableCell align="center">Lead Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.pid}>
                                <TableCell align="left">{row.pid}</TableCell>
                                <TableCell component="th" scope="row">
                                    {row.pname}
                                </TableCell>
                                <TableCell align="center">{row.manufacturer}</TableCell>
                                <TableCell align="center">{row.orderedQty}</TableCell>
                                <TableCell align="center">{row.QtySold}</TableCell>
                                <TableCell align="center">{row.balance} Hrs</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default StockTable


