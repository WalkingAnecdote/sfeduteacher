import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
    CssBaseline, Drawer, Box, AppBar, Toolbar, List,
    Typography, Divider, IconButton, Badge, Container,
    ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import {
    ChevronLeft, Notifications, People, Layers, Menu
} from '@mui/icons-material';
import { Copyright, Users, Semesters, Groups, Subjects } from '../components';


const drawerWidth = 240;

const CustomAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const CustomDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function switchContent(category) {
    switch (category) {
        case 'users':
            return <Users />;
        case 'semesters':
            return <Semesters />
        case 'groups':
            return <Groups />;
        case 'subjects':
            return <Subjects />;
        case 'lessons':
            return <Typography>Lessons</Typography>;
        default:
            return <Typography>Null</Typography>;
    }
}

function DashboardContent() {
  const [selectedCategory, setSelectedCategory] = React.useState('users');
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleCategory = (category) => () => {
    setSelectedCategory(category)
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <CustomAppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <Menu />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Панель администратора
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>
          </Toolbar>
        </CustomAppBar>
        <CustomDrawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeft />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton onClick={handleCategory('users')}>
                <ListItemIcon>
                    <People />
                </ListItemIcon>
                <ListItemText primary="Пользователи" />
            </ListItemButton>
            {/* <ListItemButton onClick={handleCategory('semesters')}>
                <ListItemIcon>
                    <Layers />
                </ListItemIcon>
                <ListItemText primary="Семестры" />
            </ListItemButton> */}
            <ListItemButton onClick={handleCategory('groups')}>
                <ListItemIcon>
                    <Layers />
                </ListItemIcon>
                <ListItemText primary="Группы" />
            </ListItemButton>
            <ListItemButton onClick={handleCategory('subjects')}>
                <ListItemIcon>
                    <Layers />
                </ListItemIcon>
                <ListItemText primary="Предметы" />
            </ListItemButton>
            <ListItemButton onClick={handleCategory('lessons')}>
                <ListItemIcon>
                    <Layers />
                </ListItemIcon>
                <ListItemText primary="Занятия" />
            </ListItemButton>
          </List>
        </CustomDrawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {switchContent(selectedCategory)}
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}