'use client';

import React from 'react';
import clsx from 'clsx';
import { Container, Box, CircularProgress, Typography } from '@mui/material';

type DataLoadingComponentProps = {
    className?: string;
    message?: string;
};

const DataLoadingComponent: React.FC<DataLoadingComponentProps> = ({
    className = 'flex flex-col',
    message = 'Loading...',
}) => {
    return (
        <Container
            className={clsx(
                'gap-5 justify-center items-center h-full ',
                className
            )}
        >
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
            <Typography color="primary" align="center" variant="subtitle1">
                {message}
            </Typography>
        </Container>
    );
};

export default DataLoadingComponent;
