'use client'
import { DiscountModel, DiscountItemModel, DiscountType } from '@/domain/DiscountModels';
import { Box, Button, Chip, FormControl, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DiscountItemProductComponent from './components/DiscountItemProductComponent';
import DiscountItemComponent from './components/DiscountItemComponent';
import { Update, Delete, Add, Remove, Save, Category, Check } from '@mui/icons-material';
import { MyDatePicker, MyDateTimePicker } from '@/shared/components/MyDatePicker';
import { CategoryModel } from '@/domain/ProductModels';
import { ProductService } from '@/application/services/product/ProductService';

interface DiscountCategoryBasedComponentProps {
    discount: DiscountModel;
    showUpdateActions?: boolean;
    onUpdateClicked?: (discountId: number) => void;
    onDeleteClicked?: (discountId: number) => void;
    onSaveClicked?: () => void;
    onAnyPropertyChanged?: (key: keyof DiscountModel, value: any) => void;

}

const productService = new ProductService();

const DiscountCategoryBasedComponent: React.FC<DiscountCategoryBasedComponentProps> = ({
    discount,
    showUpdateActions = true,
    onUpdateClicked, onDeleteClicked,
    onSaveClicked, onAnyPropertyChanged
}) => {

    const [categories, setCategories] = useState<CategoryModel[]>([]);

    useEffect(() => {
        productService.loadCategories().then(response => {
            if (response.isSuccess) {
                setCategories(response.data!)
            }
        })
    }, [])


    return (
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
                            <Box className="flex w-full">
                                <Box className="flex flex-col">
                                    <div>  indirimOranı :  {discount.discountPercentage}</div>
                                    <div>  kaçKezUygulanabilir :  {discount.maxApplicableTimes}</div>
                                    <div>  endDate :   {discount.endDateUtc ? discount.getLocaleDate()?.toLocaleString() : ""}</div>
                                </Box>
                            </Box>

                        </TableCell>
                    </TableRow>

                    {showUpdateActions && <TableRow>
                        <TableCell sx={{ padding: 1 }}>
                            <Box className="flex w-full" sx={{ gap: 1, flexWrap: 'wrap' }}>
                                {categories.map((option) => (
                                    <Chip
                                        size="small"
                                        key={option.id}
                                        label={option.name}
                                        clickable
                                        color={discount.categoryId === option.id ? 'primary' : 'default'}
                                        onClick={() => onAnyPropertyChanged && onAnyPropertyChanged("categoryId", option.id)}
                                        icon={discount.categoryId === option.id ? <Check /> : undefined}
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

                                    <Box className="flex justify-end w-full">


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
                            }
                        </TableCell>
                    </TableRow>


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
                                    <IconButton
                                        onClick={() => { onUpdateClicked && onUpdateClicked(discount.id) }}>
                                        <Update />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => { onDeleteClicked && onDeleteClicked(discount.id) }}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    }


                    {showUpdateActions && < TableRow >
                        <TableCell align='right' sx={{ padding: 1 }}>
                            <Button variant='outlined' color='secondary'
                                onClick={(e: any) => {
                                    onSaveClicked && onSaveClicked();
                                }}
                                startIcon={<Save />}>Save</Button>
                        </TableCell>
                    </TableRow>}



                </TableBody>
            </Table>

        </TableContainer>
    );
};

export default React.memo(DiscountCategoryBasedComponent);
