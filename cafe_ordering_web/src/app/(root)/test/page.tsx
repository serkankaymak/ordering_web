"use client";
import React from 'react';
import { Box } from '@mui/material';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.snow.css';
import MyMasonary from '@/shared/components/MyMasonary';
import ProductSelector from '../components/ProductSelector';
import { ProductModel } from '@/domain/ProductModels';



const TestPage: React.FC = () => {
    const imageUrlList = ["antique-cafe-bg-01.jpg", "antique-cafe-bg-02.jpg",
        "antique-cafe-bg-03.jpg", "antique-cafe-bg-04.jpg", "menu-item-1.jpg",
        "menu-item-2.jpg"
    ]

    const imageUrlList2 = imageUrlList.map((url) => "/images/" + url);
    // Listeyi 10 kez tekrar etmek için
    const repeatedImageUrlList = Array(10).fill(imageUrlList2).flat();

    React.useEffect(() => {

    }, []);


    return (

        <Box sx={{ overflow: 'scroll' }}>
           <ProductSelector  products={ProductModel.getExamples()} ></ProductSelector>
        </Box>


    );
};

export default TestPage;