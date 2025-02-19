import { DiscountModel, DiscountItemModel, DiscountType } from '@/domain/DiscountModels';
import { Box, Button, FormControl, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DiscountItemProductComponent from './components/DiscountItemProductComponent';
import DiscountItemComponent from './components/DiscountItemComponent';
import { Update, Delete, Save, Add, Remove } from '@mui/icons-material';
import { MyDatePicker, MyDateTimePicker } from '@/shared/components/MyDatePicker';
import ArrayListStream from '@/shared/ArrayListStream';
import ProductSelector from '@/app/(pages)/components/ProductSelector';
import { ProductModel } from '@/domain/ProductModels';
import MyModal from '@/shared/components/MyModal';
import { ProductService } from '@/application/services/product/ProductService';
import { tr } from 'date-fns/locale';

interface DiscountProductBasedComponentProps {
    discount: DiscountModel;
    showUpdateActions?: boolean;
    useTopDiscount?: boolean;
    onUpdateClicked?: (discountId: number) => void;
    onDeleteClicked?: (discountId: number) => void;
    onSaveClicked?: () => void;
    onAnyPropertyChanged?: (key: keyof DiscountModel, value: any) => void;
}

const productService = new ProductService();
const DiscountProductBasedComponent: React.FC<DiscountProductBasedComponentProps> = ({
    discount, showUpdateActions = true,
    onUpdateClicked, onDeleteClicked,
    onSaveClicked, onAnyPropertyChanged
}) => {

    const [isOpenProductSelectorModal, setisOpenProductSelectorModal] = useState<boolean>(false);
    const [products, setproducts] = useState<ProductModel[]>([]);


    useEffect(() => {
        productService.loadAllProductsAndMenus().then(response => {
            if (response.isSuccess) { setproducts(response.data!) }
        })
    }, [])

    return (

        <>
            <TableContainer sx={{ padding: 1 }} className="border my-1" component={Paper}>
                <Table padding='none' sx={{ "& td, & th": { borderBottom: "none" } }} size="small">

                    <TableBody>

                        <TableRow className=''>
                            <TableCell>
                                <Box className='flex flex-col'>
                                    {!showUpdateActions && <h5 className='uppercase'  >  {discount.name}</h5>}
                                    {showUpdateActions && <FormControl>
                                        <TextField
                                            value={discount.name}
                                            onChange={(e: any) => { onAnyPropertyChanged && onAnyPropertyChanged("name", e.target.value!) }}
                                            label={"discountName"}></TextField>
                                    </FormControl>}
                                </Box>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <div>  indirimOranı :   {discount.discountPercentage}</div>
                                <div>  kaçKezUygulanabilir :   {discount.maxApplicableTimes}</div>
                                <div>    Sona Erme Tarihi :   {discount.endDateUtc ? discount.getLocaleDate()?.toLocaleString() : ""}</div>
                            </TableCell>
                        </TableRow>




                        {
                            showUpdateActions &&
                            <TableRow>
                                <TableCell sx={{ padding: 1 }}>
                                    <Box className="flex  mt-4 justify-between  w-full">

                                        <FormControl>
                                            <TextField
                                                onChange={(e) => {
                                                    onAnyPropertyChanged
                                                        && onAnyPropertyChanged("discountPercentage", e.target.value!)
                                                }}
                                                type='number'
                                                fullWidth variant="outlined" size="small"
                                                label={"Percentage"}
                                                sx={{ width: 100 }}
                                                value={discount.discountPercentage ?? ''} >
                                            </TextField>
                                        </FormControl>

                                        <Box className="flex items-center  justify-end w-full">
                                            <IconButton
                                                onClick={(e) => {
                                                    onAnyPropertyChanged &&
                                                        onAnyPropertyChanged("maxApplicableTimes", (discount.maxApplicableTimes - 1))
                                                }}
                                                sx={{ padding: 0 }} size='small'><Remove />
                                            </IconButton>


                                            <IconButton
                                                disabled={true} size='small'  >{discount.maxApplicableTimes}
                                            </IconButton>


                                            <IconButton
                                                onClick={(e) => {
                                                    onAnyPropertyChanged &&
                                                        onAnyPropertyChanged("maxApplicableTimes", (discount.maxApplicableTimes + 1))
                                                }}
                                                sx={{ padding: 0 }} size='small'><Add />
                                            </IconButton>

                                        </Box>
                                    </Box>
                                </TableCell>
                            </TableRow>

                        }

                        {showUpdateActions &&
                            <TableRow>
                                <TableCell sx={{ padding: 1 }}>
                                    <MyDateTimePicker
                                        valueAsUtc={discount.getLocaleDate() ?? new Date()}
                                        onValueChanged={(date) => {
                                            console.log(date?.toUTCString())
                                            onAnyPropertyChanged &&
                                                onAnyPropertyChanged("endDateUtc", date!.toUTCString())
                                        }}
                                        slotProps={{ textField: { variant: "outlined", fullWidth: true } }}
                                        label={'İndirimBitişTarihi'} />
                                </TableCell>
                            </TableRow>
                        }


                        <TableRow>
                            <TableCell>

                                {showUpdateActions && <Box className="flex justify-end mt-2 mb-3">
                                    <Button
                                        onClick={(e: any) => { setisOpenProductSelectorModal(true); }}
                                        variant='outlined' color='secondary' startIcon={<Add></Add>}>Add Product</Button>
                                </Box>}

                                {discount.discountItems.map((d, i) =>
                                    <DiscountItemComponent
                                        onRequiredQuantityChanged={(changeddiscountItem) => {
                                            let discountItems = discount.discountItems;
                                            // let anyExist = discountItems.find(x=>x.productId==changeddiscountItem.productId);
                                            let filtered = discountItems.filter(x => x.productId != changeddiscountItem.productId)
                                            if (changeddiscountItem.requiredQuantity != 0) {
                                                let newDiscountItems = [...filtered, changeddiscountItem]
                                                onAnyPropertyChanged && onAnyPropertyChanged("discountItems", newDiscountItems);
                                            } if (changeddiscountItem.requiredQuantity == 0) {
                                                let newDiscountItems = [...filtered]
                                                onAnyPropertyChanged && onAnyPropertyChanged("discountItems", newDiscountItems);
                                            }

                                        }}
                                        showActions={showUpdateActions} key={i} discountItem={d}></DiscountItemComponent>
                                )}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <Box className='flex flex-col items-end'>
                                    <span>
                                        ToplamÜrünFiyatı : {discount.getProductsPrice()} TL
                                    </span>
                                    <span>
                                        İndirimliFiyatı : {discount.getDiscountedProductsPrice()} TL
                                    </span>
                                </Box>
                            </TableCell>
                        </TableRow>

                        {
                            !showUpdateActions && <TableRow>
                                <TableCell>
                                    <Box className="text-xs" sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
                                        <IconButton onClick={() => { onUpdateClicked && onUpdateClicked(discount.id) }}>
                                            <Update />
                                        </IconButton>
                                        <IconButton onClick={() => { onDeleteClicked && onDeleteClicked(discount.id) }}>
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        }


                        {showUpdateActions && < TableRow >
                            <TableCell align='right' sx={{ padding: 1 }}>
                                <Button variant='outlined' color='secondary'
                                    onClick={onSaveClicked}
                                    startIcon={<Save />}>Save</Button>
                            </TableCell>
                        </TableRow>}

                    </TableBody>
                </Table>

            </TableContainer>


            {showUpdateActions &&
                <MyModal isOpen={isOpenProductSelectorModal}
                    onCloseClicked={() => { setisOpenProductSelectorModal(false) }} >
                    <ProductSelector
                        products={products}
                        onChooseButtonClicked={function (selectedProduct0: ProductModel): void {
                            setisOpenProductSelectorModal(false)
                            const selectedProduct = selectedProduct0.copy({ products: [] })
                            const existing = discount.discountItems.find(x => x.productId == selectedProduct.id);
                            if (existing) {
                                var newDİscountItem = existing.copy({ requiredQuantity: existing.requiredQuantity + 1 })
                                discount.discountItems = [...discount.discountItems.filter(x => x.productId != selectedProduct.id), newDİscountItem]
                                onAnyPropertyChanged && onAnyPropertyChanged("discountItems", discount.discountItems)
                            }
                            else {
                                var newDİscountItem = new DiscountItemModel({ productId: selectedProduct.id, product: selectedProduct, requiredQuantity: 1 })
                                discount.discountItems = [...discount.discountItems, newDİscountItem]
                                onAnyPropertyChanged && onAnyPropertyChanged("discountItems", discount.discountItems)
                            }

                        }} ></ProductSelector>

                </MyModal>
            }



        </>


    );
};

export default React.memo(DiscountProductBasedComponent);
