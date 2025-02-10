import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Card } from '@mui/material';
import 'react-quill-new/dist/quill.snow.css';

import './shared.components.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface MyRichEditorProps {
    initialValue?: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    performOnSave: (value: string) => void;
}

const MyRichEditor: React.FC<MyRichEditorProps> = ({
    initialValue = '',
    value,
    placeholder,
    onChange,
    performOnSave,
}) => {
    const [editorKey, setEditorKey] = useState(0);

    useEffect(() => {
        if (initialValue) { onChange(initialValue); }
    }, [initialValue, onChange]);

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
        ],
    };

    const handleSave = () => {
        performOnSave(value);
    };

    const handleClear = () => {
        onChange('');
        setEditorKey(prevKey => prevKey + 1); // Bileşeni yeniden oluşturmak için key'i güncelle
    };

    return (
        <Box sx={{ padding: 0 }}>
            <Card sx={{ padding: 1, paddingTop: 1, paddingBottom: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <ReactQuill
                        key={editorKey} // Bileşenin yeniden oluşturulmasını sağlamak için key prop'u ekle
                        style={{ width: '100%', minHeight: '6em' }}
                        value={value}
                        onChange={onChange}
                        modules={modules}
                        placeholder={placeholder}
                        theme="snow"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={handleClear} variant="outlined">
                            Clear
                        </Button>
                        <Button variant="outlined" onClick={handleSave}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default MyRichEditor;
