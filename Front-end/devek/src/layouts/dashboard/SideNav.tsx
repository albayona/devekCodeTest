import { Link as RouterLink } from 'react-router-dom';
import {
    Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, useTheme
} from '@mui/material';
import { items } from './Config';
import React, { useState } from 'react';
import { createTheme, styled } from "@mui/material/styles";
import { CSSObject, Theme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const CustomDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open ? openedMixin(theme) : closedMixin(theme)),
    '& .MuiDrawer-paper': open ? openedMixin(theme) : closedMixin(theme),
}));

interface SideNavProps {
    width: number;
    height: number;
}

export const SideNav: React.FC<SideNavProps> = ({ width, height }) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const theme = useTheme();
    const [open, setOpen] = useState<boolean>(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
        setSelectedIndex(index);
    };

    const sideNavTheme = createTheme(theme, {
        components: {
            MuiListItemButton: {
                styleOverrides: {
                    root: ({ ownerState }: any) => ({
                        ...(ownerState.selected === true && {
                            backgroundColor: theme.palette.primary.main + '!important'
                        }),
                    }),
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: ({ ownerState }: any) => ({
                        color: (ownerState["aria-selected"] === true ? theme.palette.primary.contrastText : theme.palette.text.secondary) + '!important',
                        minWidth: 'auto',
                    }),
                },
            },
            MuiListItemText: {
                styleOverrides: {
                    primary: ({ ownerState }: any) => ({
                        color: (ownerState["aria-selected"] === true ? theme.palette.primary.contrastText : theme.palette.text.secondary) + '!important',
                        minWidth: 'auto',
                    }),
                },
            },
        },
    });

    return (
        <CustomDrawer
            open={open}
            variant="permanent"
            PaperProps={{
                sx: {
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    height: `calc(100% - ${height}px)`,
                    p: 0,
                    top: height,
                    width: width,
                    zIndex: (theme) => theme.zIndex.appBar - 100
                }
            }}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List sx={{ width: '100%' }}>
                {items.map((item) => (
                    <ListItem
                        disablePadding
                        component={RouterLink}
                        key={item.href}
                        to={item.href}
                        sx={{ display: 'block' }}
                    >
                        <ThemeProvider theme={sideNavTheme}>
                            <ListItemButton
                                selected={selectedIndex === item.index}
                                onClick={(event) => handleListItemClick(event, item.index)}
                                sx={{
                                    minHeight: 48,
                                    px: 2.5,
                                    justifyContent: open ? 'initial' : 'center',
                                }}
                            >
                                <ListItemIcon
                                    aria-selected={selectedIndex === item.index}
                                    sx={{
                                        minWidth: 0,
                                        justifyContent: 'center',
                                        mr: open ? 3 : 'auto',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    aria-selected={selectedIndex === item.index}
                                    disableTypography={false}
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        variant: 'h6',
                                    }}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ThemeProvider>
                    </ListItem>
                ))}
                
            </List>
        </CustomDrawer>
    );
};
