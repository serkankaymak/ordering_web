import { DiscountItemModel } from '@/domain/DiscountModels';
import { Box, FormControl, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import React from 'react';
import DiscountItemProductComponent from './DiscountItemProductComponent';
import { Add, Delete, Padding, Remove } from '@mui/icons-material';


interface DiscountItemComponentProps {
    discountItem: DiscountItemModel;
    showActions?: boolean;
}

const DiscountItemComponent: React.FC<DiscountItemComponentProps> = ({
    discountItem,
    showActions = true

}) => {

    return (
        <TableContainer sx={{ padding: 1 }} className="border my-1" component={Paper}>
            <Table padding='none' sx={{ "& td, & th": { borderBottom: "none" } }} size="small">
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Box className="flex w-full">
                                <Box className="flex flex-col">
                                    <div>  requiredQuantity :   {discountItem.requiredQuantity}</div>
                                    <div>  discountPercentage :   {discountItem.discountPercentage}</div>
                                    <div>  sonÜrünİndirimi :   {discountItem.lastProductDiscountPercentage}</div>
                                </Box>

                                {
                                    showActions &&
                                    <Box className="flex flex-col items-end  w-full">
                                        <Box className="flex justify-end w-full">

                                            <FormControl>
                                                <TextField
                                                    type='number'
                                                    fullWidth variant="outlined" size="small"
                                                    label={"Percentage"}
                                                    sx={{ width: 100 }}
                                                    value={discountItem.discountPercentage} >
                                                </TextField>
                                            </FormControl>

                                        </Box>
                                         <Box className="flex items-center  justify-end w-full">
                                            <IconButton sx={{ padding: 0 }} size='small'  ><Remove /></IconButton>
                                            <IconButton sx={{ padding: 0 }} size='small'  >{discountItem.requiredQuantity}</IconButton>
                                            <IconButton sx={{ padding: 0 }} size='small'  ><Add /></IconButton>
                                            <IconButton sx={{ padding: 1 }} size='small'  ><Delete /></IconButton>
                                        </Box>
                                    </Box>
                                }

                            </Box>

                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <DiscountItemProductComponent
                                product={discountItem.product!}></DiscountItemProductComponent>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </TableContainer>
    );
};

export default React.memo(DiscountItemComponent);
