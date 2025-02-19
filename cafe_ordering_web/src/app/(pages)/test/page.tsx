"use client";
import React from 'react';
import { Box } from '@mui/material';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.snow.css';
import { useSitePreferencesContext } from '@/app/providers/global.providers/sitePreferences.provider';



const TestPage: React.FC = () => {
    const { sitePreferences: preferences } = useSitePreferencesContext();

    React.useEffect(() => {

    }, []);


    return (

        <Box sx={{ overflow: 'scroll' }}>
            {JSON.stringify(preferences)}
        </Box>


    );
};

export default TestPage;