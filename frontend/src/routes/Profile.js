import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
    CssBaseline, Drawer, Box, AppBar, Toolbar, List,
    Typography, Divider, IconButton, Container,
    ListItemButton, ListItemIcon, ListItemText, Button
} from '@mui/material';
import {
    ChevronLeft, People, Chat as ChatIcon, Menu
} from '@mui/icons-material';
import { Copyright, Chat, UserProfile, TeacherSubjects, Rating, Tests, StudentsTests, News } from '../components';
import { useSelector, useDispatch } from 'react-redux';


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
        case 'chat':
          return <Chat />;
        case 'profile':
          return <UserProfile />
        case 'subjects':
          return <TeacherSubjects />
        case 'rating':
          return <Rating />
        case 'tests':
          return <Tests />
        case 'studentTest':
          return <StudentsTests />
        case 'news':
          return <News />
        default:
            return <Typography>Данный раздел сайта в находится в активной фазе разработки.</Typography>;
    }
}

function DashboardContent() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [selectedCategory, setSelectedCategory] = React.useState('profile');
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleCategory = (category) => () => {
    setSelectedCategory(category)
  }

  const handleSignout = () => {
    dispatch.token.asyncLogout()
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
              Здравствуйте, {`${user?.middle_name} ${user?.first_name} ${user?.last_name}`}!
            </Typography>
            <Button color="inherit" onClick={handleSignout}>
              Выйти
            </Button>
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
            <ListItemButton onClick={handleCategory('profile')}>
                <ListItemIcon>
                    <People />
                </ListItemIcon>
                <ListItemText primary="Профиль" />
            </ListItemButton>
            <ListItemButton onClick={handleCategory('chat')}>
                <ListItemIcon>
                    <ChatIcon />
                </ListItemIcon>
                <ListItemText primary="Чат" />
            </ListItemButton>
            {user?.roles.includes('student') && (
              <>
                <ListItemButton onClick={handleCategory('studentTest')}>
                  <ListItemIcon>
                      <ChatIcon />
                  </ListItemIcon>
                  <ListItemText primary="Тесты" />
                </ListItemButton>
                <ListItemButton onClick={handleCategory('news')}>
                  <ListItemIcon>
                      <ChatIcon />
                  </ListItemIcon>
                  <ListItemText primary="Новости" />
              </ListItemButton>
              </>
            )}
            {user?.roles.includes('teacher') && (
              <>
                <ListItemButton onClick={handleCategory('subjects')}>
                  <ListItemIcon>
                      <ChatIcon />
                  </ListItemIcon>
                  <ListItemText primary="Предметы" />
                </ListItemButton>
                <ListItemButton onClick={handleCategory('rating')}>
                  <ListItemIcon>
                      <ChatIcon />
                  </ListItemIcon>
                  <ListItemText primary="Успеваемость" />
              </ListItemButton>
              <ListItemButton onClick={handleCategory('tests')}>
                  <ListItemIcon>
                      <ChatIcon />
                  </ListItemIcon>
                  <ListItemText primary="Тесты" />
              </ListItemButton>
              <ListItemButton onClick={handleCategory('news')}>
                  <ListItemIcon>
                      <ChatIcon />
                  </ListItemIcon>
                  <ListItemText primary="Новости" />
              </ListItemButton>
            </>
            )}
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

export default function Profile() {
  return <DashboardContent />;
}