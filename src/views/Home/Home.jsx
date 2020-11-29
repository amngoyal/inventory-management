import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Assignment, HorizontalSplit, LocalShipping, ViewList } from '@material-ui/icons';
import ProductsTable from '../../components/ProductsTable/ProductsTable';
import { Route, Switch, withRouter } from 'react-router';
import SupplierTable from '../../components/SupplierTable/SupplierTable';
import StockTable from '../../components/StockTable/StockTable';
import PurchaseOrderReport from '../../components/PurchaseOrderReport/PurchaseOrderReport';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core';
import instance from '../../axios';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../features/dataSlice';

const drawerWidth = 220;

function generateProductId() {
    var digits = '0123456789';
    let productId = '';
    for (let i = 0; i < 4; i++) {
        productId += digits[Math.floor(Math.random() * 10)];
    }
    return productId;
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100%)`,
            marginLeft: drawerWidth,
            zIndex: theme.zIndex.drawer + 1,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

function Home(props) {
    const { window } = props;
    const classes = useStyles();

    const dispatch = useDispatch();
    // const purchaseOrderReport = useSelector(selectPurchaseOrderReport);

    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false)
    const [addProductForm, setAddProductForm] = useState({
        productId: '',
        productName: '',
        manufacturer: '',
        category: '',
        reOrderQty: '',
        supplier: '',
        moq: '',
        leadTime: '',
        orderedQty: '',
        qtySold: ''
    })

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDialogClose = () => setOpenDialog(false)

    const handleDialogOpen = () => {
        if (addProductForm.productId === '')
            setAddProductForm({ ...addProductForm, productId: 'PI-' + generateProductId() })
        setOpenDialog(true)
    }

    const handleAddProduct = () => {

        instance.post('add-product', addProductForm).then(res => {
            console.log(res);

            dispatch(addProduct(addProductForm));

            const { productId, productName, manufacturer, reOrderQty, supplier, moq, leadTime, orderedQty,
                qtySold } = addProductForm;

            const balance = orderedQty - qtySold;
            if (balance <= reOrderQty) {

                let allSuppliers = [{ supplier, moq, leadTime }]
                let por = {
                    productId, productName, manufacturer, reOrderQty, balance, allSuppliers
                }

                instance.post('/create-por', por)
                    .then(res => {
                        console.log("por created")
                    })
                    .catch(err => {
                        console.log(err);
                    })

            }


            setOpenDialog(false)
            setAddProductForm({
                productId: '',
                productName: '',
                manufacturer: '',
                category: '',
                reOrderQty: '',
                supplier: '',
                moq: '',
                leadTime: '',
                orderedQty: '',
                qtySold: ''
            })
        }).catch(err => {
            console.log(err);
            alert("error in adding product")
        })
    }

    const drawer = (
        <div>
            <div className={classes.toolbar}
                style={{ display: 'flex', placeItems: 'center', placeContent: 'center' }}
            >
            </div>
            <Divider />
            <List>
                <ListItem button onClick={e => { props.history.push('/home/products'); setMobileOpen(false) }}>
                    <ListItemIcon><ViewList /></ListItemIcon>
                    <ListItemText primary="Products" />
                </ListItem>
                <ListItem button onClick={e => { props.history.push('/home/suppliers'); setMobileOpen(false) }}>
                    <ListItemIcon><LocalShipping /></ListItemIcon>
                    <ListItemText primary="Suppliers" />
                </ListItem>
                <ListItem button onClick={e => { props.history.push('/home/stock'); setMobileOpen(false) }}>
                    <ListItemIcon> <HorizontalSplit /></ListItemIcon>
                    <ListItemText primary="Stock" />
                </ListItem>
                <ListItem button onClick={e => { props.history.push('/home/por'); setMobileOpen(false) }}>
                    <ListItemIcon> <Assignment /></ListItemIcon>
                    <ListItemText primary="Purchase Order Report" />
                </ListItem>
            </List>

        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between', margin: '0 30px' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        XYZ PROVISION STORE
                    </Typography>
                    <Button variant="contained" onClick={handleDialogOpen}>
                        Add Product
                   </Button>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route path="/home/products">
                        <ProductsTable />
                    </Route>
                    <Route path="/home/suppliers">
                        <SupplierTable />
                    </Route>
                    <Route path="/home/stock">
                        <StockTable />
                    </Route>
                    <Route path="/home/por">
                        <PurchaseOrderReport />
                    </Route>
                </Switch>
            </main>
            <Dialog fullWidth open={openDialog}
                onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add New Product</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                value={addProductForm.productId}
                                label="Product ID"
                                disabled
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                value={addProductForm.productName}
                                label="Product Name"
                                onChange={(e) => setAddProductForm({ ...addProductForm, productName: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                value={addProductForm.manufacturer}
                                label="Manufacturer"
                                onChange={(e) => setAddProductForm({ ...addProductForm, manufacturer: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                value={addProductForm.category}
                                label="Category"
                                onChange={(e) => setAddProductForm({ ...addProductForm, category: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                value={addProductForm.reOrderQty}
                                type="number"
                                label="Re-order Qty"
                                onChange={(e) => setAddProductForm({ ...addProductForm, reOrderQty: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                value={addProductForm.supplier}
                                label="Supplier"
                                onChange={(e) => setAddProductForm({ ...addProductForm, supplier: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                type="number"
                                value={addProductForm.moq}
                                label="MOQ"
                                onChange={(e) => setAddProductForm({ ...addProductForm, moq: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                type="number"
                                value={addProductForm.leadTime}
                                label="Lead Time (in Hrs)"
                                onChange={(e) => setAddProductForm({ ...addProductForm, leadTime: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                type="number"
                                value={addProductForm.orderedQty}
                                label="Ordered Qty"
                                onChange={(e) => setAddProductForm({ ...addProductForm, orderedQty: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                type="number"
                                value={addProductForm.qtySold}
                                label="Qty Sold"
                                onChange={(e) => setAddProductForm({ ...addProductForm, qtySold: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleAddProduct} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


export default withRouter(Home);
