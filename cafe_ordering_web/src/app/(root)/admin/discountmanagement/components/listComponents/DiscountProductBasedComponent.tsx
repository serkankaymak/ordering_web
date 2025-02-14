import { DiscountModel, DiscountItemModel, DiscountType } from '@/domain/DiscountModels';
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import React from 'react';
import DiscountItemProductComponent from './components/DiscountItemProductComponent';
import DiscountItemComponent from './components/DiscountItemComponent';
import { Update, Delete, Save } from '@mui/icons-material';
import { MyDatePicker, MyDateTimePicker } from '@/shared/components/MyDatePicker';

interface DiscountProductBasedComponentProps {
    discount: DiscountModel;
    showUpdateActions?: boolean;
}

const DiscountProductBasedComponent: React.FC<DiscountProductBasedComponentProps> = ({
    discount, showUpdateActions = true
}) => {

    return (
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

                    {showUpdateActions &&
                        <TableRow>
                            <TableCell sx={{ padding: 1 }}>

                                <MyDateTimePicker
                                    slotProps={{ textField: { variant: "outlined", fullWidth: true } }}
                                    label={'İndirimBitişTarihi'} />
                            </TableCell>
                        </TableRow>
                    }

                    <TableRow>
                        <TableCell>
                            {discount.discountItems.map((d, i) =>
                                <DiscountItemComponent key={i} discountItem={d}></DiscountItemComponent>
                            )}
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <Box className='flex flex-col items-end'>
                                <span>
                                    ToplamÜrünFiyatı : {10.00} TL
                                </span>
                                <span>
                                    İndirimliFiyatı : {10.00} TL
                                </span>
                            </Box>
                        </TableCell>
                    </TableRow>

                    {showUpdateActions == false && <TableRow>
                        <TableCell>
                            <Box className="text-xs" sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
                                <IconButton onClick={() => { }}>
                                    <Update />
                                </IconButton>
                                <IconButton onClick={() => { }}>
                                    <Delete />
                                </IconButton>
                            </Box>
                        </TableCell>
                    </TableRow>}



                    {showUpdateActions && < TableRow >
                        <TableCell align='right' sx={{ padding: 1 }}>
                            <Button startIcon={<Save />}>Save</Button>
                        </TableCell>
                    </TableRow>}

                </TableBody>
            </Table>

        </TableContainer>
    );
};

export default React.memo(DiscountProductBasedComponent);
