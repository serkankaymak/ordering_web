'use client';

import React, { useState } from 'react';
import { Box, Pagination } from '@mui/material';
import AdminProductCard from './AdminProductCard';
import { ProductModel } from '@/domain/ProductModels';

export interface ProductListComponentProps {
  /** Tüm ürünlerin listesi */
  products: ProductModel[];
  /** Ürün kartına tıklandığında çağrılacak callback */
  onProductClick: (id: string | number) => void;
}

const ProductListComponent: React.FC<ProductListComponentProps> = ({
  products,
  onProductClick,
}) => {
  // Eğer ürün verisi içinde beklenmeyen bir "products" alanı varsa hata fırlat
  if (products.some(x => x.products != null)) {
    throw new Error("Sadece ürünler listelenmelidir. ürün kutuları dahil olmamalı");
  }

  // Pagination için dahili state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 48;

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));

  // Şu anki sayfaya ait ürünleri seç
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination değişim olayını handle et
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Ürünler grid şeklinde listeleniyor */}
      <Box
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          sm:gap-5 gap-2 p-2
        "
      >
        {paginatedProducts.map((product) => (
          <AdminProductCard
            key={product.id}
            product={product}
            onOpenUpdateCardClicked={onProductClick}
          />
        ))}
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </>
  );
};

export default ProductListComponent;
