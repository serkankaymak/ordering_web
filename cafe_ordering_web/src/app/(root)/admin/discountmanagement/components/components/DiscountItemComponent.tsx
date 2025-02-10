import { DiscountItem } from '@/domain/DiscountModels';
import { Paper, Table, TableBody, TableContainer, TableRow } from '@mui/material';
import React from 'react';
import DiscountItemProductComponent from './DiscountItemProductComponent';


interface DiscountItemComponentProps {
    discountItem: DiscountItem;
}

const DiscountItemComponent: React.FC<DiscountItemComponentProps> = ({
    discountItem

}) => {

    return (
        <TableContainer sx={{ padding: 1 }} className="border my-1" component={Paper}>
            <Table padding='none' sx={{ "& td, & th": { borderBottom: "none" } }} size="small">
                <TableBody>
                    <TableRow>
                        <DiscountItemProductComponent product={discountItem.product!}></DiscountItemProductComponent>
                    </TableRow>
                </TableBody>
            </Table>

        </TableContainer>
    );
};

export default React.memo(DiscountItemComponent);
