'use client';

import React from 'react';
import { AppBar, Toolbar, List, ListItem, IconButton, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useMyTheme } from '@/app/providers/global.providers/theme/theme.provider';
import { ThemeMode } from '@/application/services/theme/ThemeService';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/app/routes/PageRoutes';


// Navigasyon linklerini enum'dan oluşturulacak dizi
const navItems = [
  { label: 'Menüler', path: AppRoutes.MenuManagement },
  { label: 'Ürünler', path: AppRoutes.ProductManagement },
  { label: 'İndirimler', path: AppRoutes.DiscountManagement }
];

const AdminHeaderComponent: React.FC = () => {
  const { themeMode, toggleTheme } = useMyTheme();
  const router = useRouter();

  return (
    <AppBar color='secondary' elevation={4} position="fixed">
      <Toolbar 
       sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <Typography className="header text-xl sm:text-3xl" component="div">
            Cafe Klassy
          </Typography>
        </Box>
        <Box sx={{ mr: 5 }}>
          <List sx={{ display: 'flex', gap: 2, p: 0, m: 0, listStyle: 'none' }}>
            {navItems.map(({ label, path }) => (
              <ListItem key={path} sx={{ p: 0 }}>
                <Link href={path} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {label}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
        <IconButton onClick={toggleTheme} color="inherit">
          {themeMode === ThemeMode.DARK ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeaderComponent;
