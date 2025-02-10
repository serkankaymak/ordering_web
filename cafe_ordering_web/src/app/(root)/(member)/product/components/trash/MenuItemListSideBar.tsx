import { Box, Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { CategoryModel } from "@/domain/ProductModels";


// Props için interface tanımı
interface MenuItemListSidebarProps {
    className?: string;
    categoryList: CategoryModel[];
}

const MenuItemListSidebarComponent: React.FC<MenuItemListSidebarProps> = ({
    className,
    categoryList,
}) => {
    const [openCategories, setOpenCategories] = useState<number[]>([]);

    // Alt kategorileri getiren yardımcı fonksiyon
    const getSubCategories = (parentId: number | null): CategoryModel[] => {
        return categoryList.filter((category) => category.parentId === parentId);
    };

    // Kategoriyi açma/kapama işlemi
    const toggleCategory = (id: number) => {
        setOpenCategories((prev) =>
            prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    };

    // Kategori ağacını render eden yardımcı fonksiyon
    const renderCategoryTree = (parentId: number | null) => {
        const subCategories = getSubCategories(parentId);

        return (
            <ul className="ml-4  list-none">
                {subCategories.map((category) => (
                    <li key={category.id} className="mb-2">
                        {/* Kategori bağlantısı */}
                        
                            <a
                                href={`#${category.id}`}
                                className="cursor-pointer text-blue-500 hover:underline"
                                onClick={(e) => {
                                    e.stopPropagation(); // Açılır/kapanır işlevi tetiklenmesin
                                }}
                            >
                                {category.name}
                            </a>
                     


                        {/* Alt kategoriler */}
                        {getSubCategories(category.id).length > 0 && (
                            <IconButton
                                size="small"
                                onClick={() => toggleCategory(category.id)}
                                sx={{ marginLeft: 1 }}
                            >
                                {openCategories.includes(category.id) ? (
                                    <ExpandLess fontSize="small" />
                                ) : (
                                    <ExpandMore fontSize="small" />
                                )}
                            </IconButton>
                        )}

                        {/* Alt kategoriler render */}
                        {openCategories.includes(category.id) &&
                            renderCategoryTree(category.id)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Box className={`${className}`}>
            <Box className="">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                {/* Ana kategorileri render et */}
                {renderCategoryTree(null)}
            </Box>

        </Box>
    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(MenuItemListSidebarComponent);
