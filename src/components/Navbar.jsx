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
import { toast } from 'react-toastify';

export function Navbar({onLoginClick, openSignupClick}) {
    const [open, setOpen] = React.useState(false);
    const toggle = () => setOpen(o => !o);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            toast.error('เกิดข้อผิดพลาดในการออกจากระบบ');
            console.error('Error signing out:', error);
        } else {
            toast.info('ออกจากระบบสำเร็จ');
            navigate('/', { replace: true });
        }
    }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const role = user?.user_metadata?.role;

    {/* Mobile */}
    // Not logged in
    const guestMenu = [
        { text: 'ค้นหา',     icon: <MailIcon />,   onClick: () => navigate('/search') },
    ];
    const secondaryGuest = [
        { text: 'เข้าสู่ระบบ',     icon: <MailIcon />,   onClick: () => onLoginClick() },
        { text: 'สมัครเป็นครูสอนว่ายน้ำ',    icon: <InboxIcon />,  onClick: () => {navigate('?r=teacher'); openSignupClick();}},
    ];
    // Logged in - Teacher
    const teacherMenu = [
        { text: 'ค้นหา',       icon: <InboxIcon />,   onClick: () => navigate('/search') },
        { text: 'แดชบอร์ด',      icon: <MailIcon />,    onClick: () => navigate('/teacher/dashboard') },
    ];
    const secondaryTeacherStudent = [
        { text: 'ตั้งค่า',        icon: <InboxIcon />,   onClick: () => navigate('/settings') },
        { text: 'ออกจากระบบ',         icon: <MailIcon />,    onClick: () => handleSignOut() },
    ];
    // Logged in - Student
    const studentMenu = [
        { text: 'ค้นหา',       icon: <InboxIcon />,   onClick: () => navigate('/search') },
        { text: 'ครูที่ชื่นชอบ',        icon: <InboxIcon />,   onClick: () => navigate('/student/favorites') },
    ];

    {/* Laptop */}
    // Not logged in
    const guestMenuLaptop = [
        { text: 'สมัครเป็นครูสอนว่ายน้ำ',    icon: <InboxIcon />,  onClick: () => {navigate('?r=teacher'); openSignupClick();}, className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out'},
        { text: 'เข้าสู่ระบบ',     icon: <MailIcon />,   onClick: () => onLoginClick(), className: 'cursor-pointer text-white bg-[#023047] px-4 py-2 rounded-lg hover:bg-gray-600 duration-300 ease-in-out'},
    ];
    // Logged in - Teacher
    const teacherMenuLaptop = [
        { text: 'ค้นหา',       icon: <InboxIcon />,   onClick: () => navigate('/search'), className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
        { text: 'แดชบอร์ด',      icon: <MailIcon />,    onClick: () => navigate('/teacher/dashboard'), className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
        { text: 'ตั้งค่า',        icon: <InboxIcon />,   onClick: () => navigate('/settings'), className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
        { text: 'ออกจากระบบ',         icon: <MailIcon />,    onClick: () => handleSignOut(), className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
    ]

     // Logged in - Student
     const studentMenuLaptop = [
        { text: 'ค้นหา',       icon: <InboxIcon />,   onClick: () => navigate('/search'), className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
        { text: 'ครูที่ชื่นชอบ',        icon: <InboxIcon />,   onClick: () => navigate('/student/favorites'), className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
        { text: 'ตั้งค่า',        icon: <InboxIcon />,   onClick: () => navigate('/settings'), className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
        { text: 'ออกจากระบบ',         icon: <MailIcon />,    onClick: () => handleSignOut(), className: 'cursor-pointer text-gray-800 hover:bg-[#023047] hover:text-white px-4 py-2 rounded-lg duration-300 ease-in-out' },
    ]

    const mobilePrimary = !user
        ? guestMenu
        : role === 'ครูสอนว่ายน้ำ'
            ? teacherMenu
            : studentMenu;

        const mobileSecondary = !user
        ? secondaryGuest
        : secondaryTeacherStudent;

        const laptopMenu = !user
        ? guestMenuLaptop
        : role === 'ครูสอนว่ายน้ำ'
          ? teacherMenuLaptop
          : studentMenuLaptop;
      

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
        <nav className="p-4 w-full overflow-hidden sticky top-0 z-50 bg-[#F0F9FA]">
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
    );
}