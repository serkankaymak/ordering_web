import { DiscountModel, DiscountItemModel, DiscountType } from '@/domain/DiscountModels';
import { Box, Button, FormControl, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DiscountItemProductComponent from './components/DiscountItemProductComponent';
import DiscountItemComponent from './components/DiscountItemComponent';
import { Update, Delete, Save, Add, Remove } from '@mui/icons-material';
import { MyDatePicker, MyDateTimePicker } from '@/shared/components/MyDatePicker';
import ArrayListStream from '@/shared/ArrayListStream';
import ProductSelector from '@/app/(root)/components/ProductSelector';
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

                        <TableRow>
                            <TableCell>
                                <Box className='flex flex-col'>
                                    <h5>{discount.name}</h5>
                                    <span>  {discount.discountType == DiscountType.ProductBasedDiscount && "ProductBasedDiscount"}  </span>
                                    <span>  {discount.discountType == DiscountType.DynamicDiscount && "DynamicDiscount"}  </span>
                                </Box>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <div>  discountPercentage :   {discount.discountPercentage}</div>
                                <div>  maxApplicableTimes :   {discount.maxApplicableTimes}</div>
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
                                        onValueChanged={(date) => {
                                            onAnyPropertyChanged &&
                                                onAnyPropertyChanged("endDate", date!)
                                        }}
                                        slotProps={{ textField: { variant: "outlined", fullWidth: true } }}
                                        label={'İndirimBitişTarihi'} />
                                </TableCell>
                            </TableRow>
                        }

                        <TableRow>
                            <TableCell>
                                <Box className="flex justify-end mt-2 mb-3">
                                    <Button
                                        onClick={(e: any) => { setisOpenProductSelectorModal(true); }}
                                        variant='outlined' color='secondary' startIcon={<Add></Add>}>Add Product</Button>
                                </Box>

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
                                        ToplamÜrünFiyatı : {ArrayListStream.fromList(discount.discountItems).sum(x => x?.productsPrice!)} TL
                                    </span>
                                    <span>
                                        İndirimliFiyatı : {10.00} TL
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


            <MyModal isOpen={isOpenProductSelectorModal}
                onCloseClicked={() => { setisOpenProductSelectorModal(false) }} >
                <ProductSelector
                    products={products}
                    onChooseButtonClicked={function (selectedProduct: ProductModel): void {
                        setisOpenProductSelectorModal(false)
                        var newDİscountItem = new DiscountItemModel({ productId: selectedProduct.id, product: selectedProduct, requiredQuantity: 1 })
                        discount.discountItems = [...discount.discountItems, newDİscountItem]
                        onAnyPropertyChanged && onAnyPropertyChanged("discountItems", discount.discountItems)
                    }} ></ProductSelector>

            </MyModal>

        </>


    );
};

export default React.memo(DiscountProductBasedComponent);
