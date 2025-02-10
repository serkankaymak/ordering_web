"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import AdminMenuItemAddOrUpdateComponent from "../../components/AdminMenuItemAddOrUpdateComponent";
import { Box } from "@mui/material";
import { useProductContext } from "@/app/providers/product.provider";
import { ProductService } from "@/application/services/product/ProductService";
import ArrayListStream from "@/shared/ArrayListStream";

const UpdateMenuPage: React.FC = () => {
    const router = useRouter();
    const params = useParams(); // Dinamik parametreleri almak için
    const productId = params?.menuId;

    const [product, setProduct] = useState<ProductModel | null>(null);



    useEffect(() => {
        if (productId) {
            const servie = new ProductService();
            let prod = servie.products.find(x => x.id.toString() == productId)!;
            // prod = ArrayListStream.fromList(ProductModel.getExamples()).getFromIndex(ProductModel.getExamples().length - 1)!
            console.log("?????", prod);
            setProduct(prod);
        }
    }, [productId]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!product) return;


        // Gerçek uygulamada API aracılığıyla güncelleme işlemi yapabilirsiniz.
        console.log("Güncellenmiş Ürün:", product);
        alert("Ürün güncellendi!");

        // İşlem sonrası yönlendirme yapılabilir
        router.push("/menus");
    };



    return (
        <Box className='flex flex-col items-center justify-center' >
            <Box className=" w-[100%] md:w-[70%]">
                {product && <AdminMenuItemAddOrUpdateComponent menu={product!}></AdminMenuItemAddOrUpdateComponent>}
            </Box>
        </Box>
    );
};

export default UpdateMenuPage;
