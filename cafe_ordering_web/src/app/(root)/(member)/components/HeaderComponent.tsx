"use client";

import React, { useState, MouseEvent } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Link, List, ListItem, useTheme } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useMyLocale } from "@/app/providers/global.providers/locale.provider";
import { useMyTheme } from "@/app/providers/global.providers/theme/theme.provider";
import { ThemeMode } from '@/application/services/theme/ThemeService';
import { LanguageMode } from '@/application/services/locale/LocaleService';
import { LocalizationKeys } from '@/application/services/locale/LocalizationKeys';
import "./HeaderComponent.css";
import ReactCountryFlag from 'react-country-flag';
import { useRouter } from 'next/navigation';

interface HeaderComponentProps {
    className?: string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ className }) => {

    const { languageMode, translate, toggleLanguageAsync } = useMyLocale();
    const { themeMode, toggleTheme } = useMyTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [active, setActive] = useState('About');
    const router = useRouter();

    const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        setActive(path);
    };

    const theme = useTheme();

    return (
        <AppBar color='default' sx={{}} className={className}>
            <Toolbar>
                <Box
                    style={{ flexGrow: 1 }}
                    onClick={() => handleNavigation('/')}
                    sx={{ cursor: 'pointer' }}
                >
                    <Typography className="header text-xl sm:text-3xl" component="div">
                        Cafe Klassy
                    </Typography>
                </Box>

                {/* Sol taraf: Menü */}
                <Box className="mr-6 hidden sm:inline-block">
                    <List sx={{ display: 'flex', m: 0, p: 2 }}>
                        {['Test', 'About', 'Product', 'Contact'].map((item) => (
                            <ListItem
                                key={item}
                                onClick={() => handleNavigation(`/${item.toLowerCase()}`)}
                                sx={{
                                    textDecoration: 'none',
                                    color: active === item ? 'blueviolet' : 'inherit',
                                    fontWeight: active === item ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                }}
                            >
                                {item}
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Sağ taraf: Dil ve Tema Seçenekleri */}
                <Box>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                        {languageMode === LanguageMode.EN ? (
                            <ReactCountryFlag countryCode="US" svg />
                        ) : (
                            <ReactCountryFlag countryCode="TR" svg />
                        )}
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem
                            onClick={() => {
                                toggleLanguageAsync();
                                //handleMenuClose();
                            }}
                        >
                            {languageMode === LanguageMode.TR ?
                                (<ReactCountryFlag countryCode="US" svg />) :
                                (<ReactCountryFlag countryCode="TR" svg />)}
                            &nbsp; {languageMode === LanguageMode.TR ? translate(LocalizationKeys.en) : translate(LocalizationKeys.tr)}
                        </MenuItem>
                    </Menu>

                    <IconButton onClick={toggleTheme}>
                        {themeMode === ThemeMode.DARK ? <LightMode /> : <DarkMode />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderComponent;
