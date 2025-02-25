import { Button, Box, TextField, Pagination } from '@mui/material';
import React, { useState } from 'react';

interface ImageSelector2Props {
  imageUrlList: string[];
  onChooseButtonClicked: (imageUrl: string) => void;
  pageSize?: number; // Dışarıdan sayfa boyutu verilebilir
}

const ImageSelector2: React.FC<ImageSelector2Props> = ({ imageUrlList, onChooseButtonClicked, pageSize = 12 }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Arama: URL içinde arama terimine göre filtreleme yapıyoruz
  const filteredImages = imageUrlList.filter(url =>
    url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredImages.length / pageSize);
  const currentImages = filteredImages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Arama alanı */}
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

      {/* Görsellerin gösterildiği alan */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {currentImages.map((url, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedImage(url)}
          >
            <img
              src={url}
              alt={`image-${index}`}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                border: selectedImage === url ? "3px solid blue" : "2px solid transparent",
                transition: "border-color 0.3s",
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Pagination bileşeni */}
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2 }}
        />
      )}

      {/* Seçilen görseli gönderme butonu */}
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

export default React.memo(ImageSelector2);
