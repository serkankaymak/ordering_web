import { DiscountItemModel } from '@/domain/DiscountModels';
import { Box, FormControl, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import React from 'react';
import DiscountItemProductComponent from './DiscountItemProductComponent';
import { Add, Delete, Padding, Remove } from '@mui/icons-material';


interface DiscountItemComponentProps {
    discountItem: DiscountItemModel;
    discountPercentage?: number;
    showActions?: boolean;
    useTopDiscount?: boolean;
    onRequiredQuantityChanged?: (item: DiscountItemModel) => void;
}

const DiscountItemComponent: React.FC<DiscountItemComponentProps> = ({
    discountItem,
    showActions = true,
    useTopDiscount = true,
    onRequiredQuantityChanged,
    discountPercentage

}) => {

    return (
        <TableContainer sx={{ padding: 1 }} className="border my-1" component={Paper}>
            <Table padding='none' sx={{ "& td, & th": { borderBottom: "none" } }} size="small">
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Box className="flex w-full">
                                <Box className="flex flex-col  items-start justify-center  ">
                                    <div>gerekliTutar :   {discountItem.requiredQuantity}</div>
                                    {useTopDiscount == false && <div>  discountPercentage :   {discountItem.discountPercentage}</div>}
                                    {discountItem.requiredQuantity != 1 && <div>  sonÜrünİndirimi :   {discountItem.discountPercentage ?? (discountPercentage ?? 0) * discountItem.requiredQuantity}%</div>}

                                </Box>

                                {
                                    showActions &&
                                    <Box className="flex flex-col    w-full">

                                        {
                                            useTopDiscount == false &&
                                            <Box className="flex justify-end w-full">
                                                <FormControl>
                                                    <TextField
                                                        type='number'
                                                        fullWidth variant="outlined" size="small"
                                                        label={"İndirimYüzdesi"}
                                                        sx={{ width: 100 }}
                                                        value={discountItem.discountPercentage} >
                                                    </TextField>
                                                </FormControl>
                                            </Box>
                                        }



                                        <Box className="flex items-center  justify-end w-full">
                                            <IconButton
                                                onClick={() => {
                                                    onRequiredQuantityChanged
                                                        && onRequiredQuantityChanged(
                                                            discountItem.copy({ requiredQuantity: discountItem.requiredQuantity - 1 })
                                                        )
                                                }}
                                                disabled={discountItem.requiredQuantity == 1}
                                                sx={{ padding: 0 }} size='small'  ><Remove /></IconButton>
                                            <IconButton disabled={true} sx={{ padding: 0 }} size='small'  >{discountItem.requiredQuantity}</IconButton>
                                            <IconButton

                                                onClick={() => {
                                                    onRequiredQuantityChanged
                                                        && onRequiredQuantityChanged(
                                                            discountItem.copy({ requiredQuantity: discountItem.requiredQuantity + 1 })
                                                        )
                                                }}
                                                sx={{ padding: 0 }} size='small'  ><Add /></IconButton>
                                            <IconButton

                                                onClick={() => {
                                                    onRequiredQuantityChanged
                                                        && onRequiredQuantityChanged(
                                                            discountItem.copy({ requiredQuantity: 0 })
                                                        )
                                                }}

                                                sx={{ padding: 1 }} size='small'  ><Delete /></IconButton>
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
