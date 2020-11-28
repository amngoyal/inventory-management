import { IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { Delete, Edit } from '@material-ui/icons';
import React from 'react'

function createData(pid, pname, manufacturer, category, reOrderQty) {
    return { pid, pname, manufacturer, category, reOrderQty };
}

const rows = [
    createData('PI-01', "Cadbury Choclate (Rs.10)", "Cadbury", "Food", 100),
];

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function ProductsTable() {
    const classes = useStyles();

    return (
        <div>

            <h1>Products</h1>

            <TableContainer component={Paper}>
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
                        {rows.map((row) => (
                            <TableRow key={row.pid}>
                                <TableCell align="left">{row.pid}</TableCell>
                                <TableCell component="th" scope="row">
                                    {row.pname}
                                </TableCell>
                                <TableCell align="center">{row.manufacturer}</TableCell>
                                <TableCell align="center">{row.category}</TableCell>
                                <TableCell align="center">{row.reOrderQty}</TableCell>
                                <TableCell align="center">
                                    <IconButton>
                                        <Edit />
                                    </IconButton>
                                    <IconButton>
                                        <Delete />
                                    </IconButton>
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
