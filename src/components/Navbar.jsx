import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router';
import { signOut } from '../lib/auth';

export function Navbar({onLoginClick, openSignupClick}) {
    const [open, setOpen] = React.useState(false);
    const toggle = () => setOpen(o => !o);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            alert(error.message);
        } else {
            navigate('/', { replace: true });
        }
    }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const guestMenu = [
        { text: 'ค้นหา',     icon: <MailIcon />,   onClick: () => navigate('/') },
    ];
    const secondaryGuest = [
        { text: 'เข้าสู่ระบบ',     icon: <MailIcon />,   onClick: () => onLoginClick() },
        { text: 'สมัครเป็นครูสอนว่ายน้ำ',    icon: <InboxIcon />,  onClick: () => openSignupClick() },
    ];
    const userMenu = [
        { text: 'หน้าหลัก',       icon: <InboxIcon />,   onClick: () => {/* navigate('/dashboard') */} },
        { text: 'โปรไฟล์ของฉัน',      icon: <MailIcon />,    onClick: () => {/* navigate('/profile') */} },
    ];
    const secondaryUser = [
        { text: 'ตั้งค่า',        icon: <InboxIcon />,   onClick: () => {/* navigate('/settings') */} },
        { text: 'ออกจากระบบ',         icon: <MailIcon />,    onClick: () => handleSignOut() },
    ];
    const guestMenuLaptop = [
        { text: 'สมัครเป็นครูสอนว่ายน้ำ',    icon: <InboxIcon />,  onClick: () => openSignupClick(), className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out'},
        { text: 'เข้าสู่ระบบ',     icon: <MailIcon />,   onClick: () => onLoginClick(), className: 'cursor-pointer text-white bg-[#023047] px-4 py-2 rounded-lg hover:bg-gray-600 duration-300 ease-in-out'},
    ];
    const userMenuLaptop = [
        { text: 'หน้าหลัก',       icon: <InboxIcon />,   onClick: () => {/* navigate('/dashboard') */}, className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
        { text: 'โปรไฟล์ของฉัน',      icon: <MailIcon />,    onClick: () => {/* navigate('/profile') */}, className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
        { text: 'ตั้งค่า',        icon: <InboxIcon />,   onClick: () => {/* navigate('/settings') */}, className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
        { text: 'ออกจากระบบ',         icon: <MailIcon />,    onClick: () => handleSignOut(), className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
    ]

    const mobilePrimary   = user ? userMenu        : guestMenu;
    const mobileSecondary = user ? secondaryUser   : secondaryGuest;
    const laptopMenu      = user ? userMenuLaptop  : guestMenuLaptop;

    const DrawerList = (
    <Box sx={{ width: 300 }} onClick={toggle}>
        <List>
        {mobilePrimary.map(({ text, icon, onClick }) => (
            <ListItem key={text} disablePadding>
            <ListItemButton onClick={onClick}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
            </ListItem>
        ))}
        </List>
        <Divider />
        <List>
        {mobileSecondary.map(({ text, icon, onClick }) => (
            <ListItem key={text} disablePadding>
            <ListItemButton onClick={onClick}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
            </ListItem>
        ))}
        </List>
    </Box>
    );

    return (
        <div>
            <nav className="p-4 w-full overflow-auto bg-red-200 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-#023047 text-lg font-bold lg:text-xl"><a href="/">ว่ายน้ำ.com</a></div>
                    <div className='lg:hidden'>
                        <IconButton
                            onClick={toggle}
                            aria-label={open ? 'close drawer' : 'open drawer'}
                            sx={{ color: '#023047' }}
                        >
                            {open ? <CloseIcon /> : <MenuIcon />}
                        </IconButton>
                    </div>
                    <div className="hidden lg:flex space-x-4">
                        {laptopMenu.map(({ text, onClick, className }) => (
                            <button
                                key={text}
                                onClick={onClick}
                                className={`${className ?? 'text-white hover:underline'}`}
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                </div>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
            </nav>
        </div>
    );
}