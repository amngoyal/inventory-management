import { IconButton, makeStyles,  Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { Delete, Edit } from '@material-ui/icons';
import React from 'react'

function createData(pid, pname, manufacturer, supplier, moq, leadTime) {
    return { pid, pname, manufacturer, supplier, moq, leadTime };
}

const rows = [
    createData('PI-01', "Cadbury Choclate (Rs.10)", "Cadbury", "Balaji Traders", 100, 72),
];

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function SupplierTable() {
    const classes = useStyles();

    return (
        <div>

            <h1>Suppliers</h1>

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
                                <TableCell align="center">{row.supplier}</TableCell>
                                <TableCell align="center">{row.moq}</TableCell>
                                <TableCell align="center">{row.leadTime} Hrs</TableCell>
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

export default SupplierTable

