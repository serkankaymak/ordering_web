import { ProductImageDto } from '@/application/dtos/ProductImageDto';
import { Button, Box, TextField, Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface ImageSelector3Props {
  avaibleProductImageDtos: ProductImageDto[];
  onChooseButtonClicked: (imageUrl: string) => void;
  pageSize?: number; // Dışarıdan sayfa boyutu verilebilir
}

const ImageSelector3: React.FC<ImageSelector3Props> = ({ avaibleProductImageDtos: avaibleProductImageDtos, onChooseButtonClicked, pageSize = 24 }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Arama: Hem path hem de tags içerisinde arama yapıyoruz
  const filteredImages = avaibleProductImageDtos.filter(image => {
    const lowerSearch = searchTerm.toLowerCase();
    const pathMatches = image.path.toLowerCase().includes(lowerSearch);
    const tagMatches = image.tags.some(tag => tag.toLowerCase().includes(lowerSearch));
    return pathMatches || tagMatches;
  });

  const totalPages = Math.ceil(filteredImages.length / pageSize);
  const currentImages = filteredImages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };


  useEffect(() => {
    console.log("avaibleProductImageDtos", avaibleProductImageDtos);
  })


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Arama Alanı */}
      <TextField
        label="Search Images"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
        }}
        sx={{ width: '100%', maxWidth: '400px' }}
      />

      {/* Görsellerin Gösterildiği Alan */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {currentImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedImage(image.path)}
          >
            <img
              src={image.path}
              alt={`image-${index}`}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                border: selectedImage === image.path ? "3px solid blue" : "2px solid transparent",
                transition: "border-color 0.3s",
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Pagination Bileşeni */}
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2 }}
        />
      )}

      {/* Seçilen Görseli Gönderme Butonu */}
      <Button
        variant="contained"
        size="medium"
        disabled={!selectedImage}
        onClick={() => selectedImage && onChooseButtonClicked(selectedImage)}
      >
        Choose Selected Image
      </Button>
    </Box>
  );
};

export default React.memo(ImageSelector3);
