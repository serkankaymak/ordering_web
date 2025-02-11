"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation"; // Next.js 13 için useRouter
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import AdminMenuItemAddOrUpdateComponent from "../components/AdminMenuItemAddOrUpdateComponent";

const AddMenuPage: React.FC = () => {


    return (
        <>
            <AdminMenuItemAddOrUpdateComponent></AdminMenuItemAddOrUpdateComponent>
        </>
    );
};

export default AddMenuPage;
