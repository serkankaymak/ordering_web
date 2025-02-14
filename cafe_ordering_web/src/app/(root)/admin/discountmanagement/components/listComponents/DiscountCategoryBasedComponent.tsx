'use client'
import { DiscountModel, DiscountItemModel, DiscountType } from '@/domain/DiscountModels';
import { Box, Button, Chip, FormControl, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import React from 'react';
import DiscountItemProductComponent from './components/DiscountItemProductComponent';
import DiscountItemComponent from './components/DiscountItemComponent';
import { Update, Delete, Add, Remove, Save, Category, Check } from '@mui/icons-material';
import {MyDatePicker, MyDateTimePicker} from '@/shared/components/MyDatePicker';
import { CategoryModel } from '@/domain/ProductModels';

interface DiscountCategoryBasedComponentProps {
    discount: DiscountModel;
    showUpdateActions?: boolean;
}


const DiscountCategoryBasedComponent: React.FC<DiscountCategoryBasedComponentProps> = ({
    discount,
    showUpdateActions = true

}) => {
    const [selectedId, setSelectedId] = React.useState<number | null>(null);
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
                                <span>  {discount.discountType == DiscountType.CategoryBasedDiscount && "CategoryBasedDiscount"}  </span>
                            </Box>

                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <Box className="flex w-full">
                                <Box className="flex flex-col">
                                    <div>  indirimOranı :  {discount.discountPercentage}</div>
                                    <div>  kaçKezUygulanabilir :  {discount.maxApplicableTimes}</div>
                                </Box>


                            </Box>

                        </TableCell>
                    </TableRow>

                    {showUpdateActions && <TableRow>
                        <TableCell sx={{ padding: 1 }}>
                            <Box className="flex w-full" sx={{ gap: 1, flexWrap: 'wrap' }}>
                                {CategoryModel.getExamples().map((option) => (
                                    <Chip
                                        size="small"
                                        key={option.id}
                                        label={option.name}
                                        clickable
                                        color={selectedId === option.id ? 'primary' : 'default'}
                                        onClick={() => setSelectedId(option.id)}
                                        icon={selectedId === option.id ? <Check /> : undefined}
                                    />
                                ))}
                            </Box>
                        </TableCell>
                    </TableRow>}

                    <TableRow>
                        <TableCell sx={{ padding: 1 }}>
                            {
                                showUpdateActions &&
                                <Box className="flex items-center  mt-4 justify-between  w-full">

                                    <FormControl>
                                        <TextField
                                            type='number'
                                            fullWidth variant="outlined" size="small"
                                            label={"Percentage"}
                                            sx={{ width: 100 }}
                                            value={discount.discountPercentage??''} >
                                        </TextField>
                                    </FormControl>

                                    <Box className="flex justify-end w-full">
                                        <IconButton sx={{ padding: 0 }} size='small'  ><Remove /></IconButton>
                                        <IconButton sx={{ padding: 0 }} size='small'  >{discount.maxApplicableTimes}</IconButton>
                                        <IconButton sx={{ padding: 0 }} size='small'  ><Add /></IconButton>

                                    </Box>
                                </Box>
                            }
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



                    {/** special ın discount item ı olmaz  */}
                    {false && <TableRow>
                        <TableCell>
                            {discount.discountItems.map((d, i) =>
                                <DiscountItemComponent
                                    showActions={false} key={i} discountItem={d}></DiscountItemComponent>
                            )}
                        </TableCell>
                    </TableRow>}



                    {
                        !showUpdateActions && <TableRow>
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
                        </TableRow>
                    }


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

export default React.memo(DiscountCategoryBasedComponent);
