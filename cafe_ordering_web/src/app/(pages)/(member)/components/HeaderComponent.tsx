"use client";

import React, { useState, MouseEvent, useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, List, ListItem, ListItemIcon, useTheme } from '@mui/material';
import { AccountCircle, AdminPanelSettingsOutlined, DarkMode, LightMode, Login, Logout, Settings } from '@mui/icons-material';
import { useMyLocale } from "@/app/providers/global.providers/locale.provider";
import { useMyTheme } from "@/app/providers/global.providers/theme/theme.provider";
import { ThemeMode } from '@/application/services/theme/ThemeService';
import { LanguageMode } from '@/application/services/locale/LocaleService';
import { LocalizationKeys } from '@/application/services/locale/LocalizationKeys';
import "./HeaderComponent.css";
import ReactCountryFlag from 'react-country-flag';
import { useRouter } from 'next/navigation';
import { IComponent } from '@/app/types/ViewTypes';
import { useUserContext } from '@/app/providers/global.providers/user.provider';
import { Router } from 'next/router';

interface HeaderComponentProps {
    className?: string;
}

const HeaderComponent: IComponent<HeaderComponentProps> = ({ className }) => {
    const theme = useTheme();
    const { languageMode, translate, toggleLanguageAsync } = useMyLocale();
    const { themeMode, toggleTheme } = useMyTheme();
    const { logout, user } = useUserContext();
    const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
    const [active, setActive] = useState('About');
    const router = useRouter();

    useEffect(() => { }, []);

    const handleNavigation = (path: string) => {
        router.push(path);
        setActive(path);
    };

    const handleLanguageMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setLanguageMenuAnchor(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageMenuAnchor(null);
    };

    const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setProfileMenuAnchor(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null);
    };

    return (
        <Toolbar variant="dense">
            <Box
                style={{ flexGrow: 1 }}
                onClick={() => handleNavigation('/')}
                sx={{ cursor: 'pointer' }}
            >
                <Typography
                    sx={{
                        fontSize: 30,
                        fontFamily: 'Dancing Script, cursive',
                        cursor: 'pointer'
                    }}
                    className="header text-xl sm:text-5xl"
                    component="div"
                >
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

            {/* Sağ taraf: Dil, Tema ve Profil Seçenekleri */}
            <Box>
                {/* Dil Menüsü */}
                <IconButton color="inherit" onClick={handleLanguageMenuOpen}>
                    {languageMode === LanguageMode.EN ? (
                        <ReactCountryFlag countryCode="US" svg />
                    ) : (
                        <ReactCountryFlag countryCode="TR" svg />
                    )}
                </IconButton>
                <Menu
                    anchorEl={languageMenuAnchor}
                    open={Boolean(languageMenuAnchor)}
                    onClose={handleLanguageMenuClose}
                >
                    <MenuItem
                        onClick={() => {
                            toggleLanguageAsync();
                            //handleLanguageMenuClose();
                        }}
                    >
                        {languageMode === LanguageMode.TR ? (
                            <ReactCountryFlag countryCode="US" svg />
                        ) : (
                            <ReactCountryFlag countryCode="TR" svg />
                        )}
                        &nbsp; {languageMode === LanguageMode.TR ? translate(LocalizationKeys.en) : translate(LocalizationKeys.tr)}
                    </MenuItem>
                </Menu>

                {/* Tema Değiştir */}
                <IconButton onClick={toggleTheme}>
                    {themeMode === ThemeMode.DARK ? <LightMode /> : <DarkMode />}
                </IconButton>

                {/* Profil Menüsü */}
                <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                    <AccountCircle />
                </IconButton>
                <Menu
                    anchorEl={profileMenuAnchor}
                    open={Boolean(profileMenuAnchor)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >

                    {!user &&
                        <MenuItem onClick={() => {
                            console.log('Sign In tıklandı');
                            router.push("/signin");
                            handleProfileMenuClose();
                        }}>
                            <ListItemIcon>
                                <Login fontSize="small" />
                            </ListItemIcon>
                            Sign In
                        </MenuItem>
                    }

                    {user &&
                        <MenuItem onClick={() => {
                            console.log('Sign Out tıklandı');
                            logout();
                            handleProfileMenuClose();
                        }}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Sign Out
                        </MenuItem>}

                    {user &&
                        <MenuItem onClick={() => {
                            console.log('Preferences tıklandı');
                            handleProfileMenuClose();
                        }}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Preferences
                        </MenuItem>
                    }


                    {user?.canViewAdminPanel() &&
                        <MenuItem onClick={() => {
                            router.push('/admin')
                        }}>
                            <ListItemIcon>
                                <AdminPanelSettingsOutlined></AdminPanelSettingsOutlined>
                            </ListItemIcon>
                            Admin Panel
                        </MenuItem>
                    }


                </Menu>
            </Box>
        </Toolbar>
    );
};

export default HeaderComponent;
