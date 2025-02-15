'use client';
import DiscountManagementPageContent from "../discountmanagement/pageContent";

import React, {  } from 'react';
import {
    Container,
} from '@mui/material';
import { IPage } from '@/app/types/ViewTypes';



const DiscountManagementPage: IPage = () => {

    return (
        <Container >
            <DiscountManagementPageContent></DiscountManagementPageContent>
        </Container>
    );
};

export default React.memo(DiscountManagementPage);
