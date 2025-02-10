import { Discount, DiscountItem } from '@/domain/DiscountModels';
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import React from 'react';
import DiscountItemProductComponent from './components/DiscountItemProductComponent';
import DiscountItemComponent from './components/DiscountItemComponent';
import { Update, Delete } from '@mui/icons-material';

interface DiscountProductBasedComponentProps {
    discount: Discount;
}

const DiscountProductBasedComponent: React.FC<DiscountProductBasedComponentProps> = ({
    discount

}) => {

    return (
        <TableContainer sx={{ padding: 1 }} className="border my-1" component={Paper}>
            <Table padding='none' sx={{ "& td, & th": { borderBottom: "none" } }} size="small">
                <TableBody>

                    <TableRow>
                        <TableCell>
                            <Box className='flex flex-col'>
                                <h5>{discount.name}</h5>
                                <span>  {discount.discountType.toString()}  </span>
                                <span>   {discount.discountPercentage}  </span>

                            </Box>
                        </TableCell>
                    </TableRow>

                    {discount.discountItems.map(d => <>
                        <TableRow>
                            <TableCell>
                                <DiscountItemComponent discountItem={d}></DiscountItemComponent>
                            </TableCell>
                        </TableRow>
                    </>)}

                    <TableRow>
                        <TableCell>
                            <Box className='flex flex-col items-end'>
                                <span>
                                    indirimli fiyat : ...
                                </span>
                            </Box>
                        </TableCell>
                    </TableRow>

                    <TableRow>
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

                </TableBody>
            </Table>

        </TableContainer>
    );
};

export default React.memo(DiscountProductBasedComponent);
