import { Button, Box } from '@mui/material';
import React, { useState } from 'react';

// Props için interface tanımı
interface ImageSelectorProps {
    imageUrlList: string[];
    onChooseButtonClicked: (imageUrl: string) => void;
}

// Fonksiyonel bileşen tanımı
const ImageSelector: React.FC<ImageSelectorProps> = ({ imageUrlList, onChooseButtonClicked }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {/* Görselleri gösteren alan */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                {imageUrlList.map((url, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
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
                            onClick={() => setSelectedImage(url)} // ✅ Resme tıklanınca seçili state güncellenir
                        />
                    </Box>
                ))}
            </Box>

            {/* En alttaki "Choose" butonu */}
            <Button
                variant="contained"
                size="medium"
                disabled={!selectedImage} // Eğer resim seçili değilse butonu disable et
                onClick={() => selectedImage && onChooseButtonClicked(selectedImage)} // ✅ Sadece seçili görseli gönder
            >
                Choose Selected Image
            </Button>
        </Box>
    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(ImageSelector);
