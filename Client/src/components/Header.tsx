import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GamesIcon from '@mui/icons-material/SportsEsports';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BottomNav: React.FC = () => {
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
      }}
      showLabels
      style={{ 
        position: 'fixed', 
        height:"70px",
        bottom: 0, 
        width: '100%', 
        backgroundColor: '#4e44ce', // Custom background color
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', flex: 1 }}>
        <BottomNavigationAction 
          label="Home" 
          icon={<HomeIcon style={{ color: 'white' }} />} 
          sx={{
            '& .MuiBottomNavigationAction-label': {
              color: 'white',
              opacity: 1, // Ensure label is fully visible
              fontSize: '1rem', // Adjust font size if needed
              transition: 'none', // Remove the default transition
              cursor: 'pointer' 
            },
            color: 'white',
          }} 
        />
      </Link>

      <Link to="/lottery" style={{ textDecoration: 'none', flex: 1 }}>
        <BottomNavigationAction 
          label="Lottery" 
          icon={<GamesIcon style={{ color: 'white' }} />} 
          sx={{
            '& .MuiBottomNavigationAction-label': {
              color: 'white',
              opacity: 1,
              fontSize: '1rem',
              transition: 'none',
            },
            color: 'white',
          }} 
        />
      </Link>

      <Link to="/victory" style={{ textDecoration: 'none', flex: 1 }}>
        <BottomNavigationAction 
          label="Victory" 
          icon={<GamesIcon style={{ color: 'white' }} />} 
          sx={{
            '& .MuiBottomNavigationAction-label': {
              color: 'white',
              opacity: 1,
              fontSize: '1rem',
              transition: 'none',
            },
            color: 'white',
          }} 
        />
      </Link>

      <Link to="/lottryresult" style={{ textDecoration: 'none', flex: 1 }}>
        <BottomNavigationAction 
          label="Result" 
          icon={<ListAltIcon style={{ color: 'white' }} />} 
          sx={{
            '& .MuiBottomNavigationAction-label': {
              color: 'white',
              opacity: 1,
              fontSize: '1rem',
              transition: 'none',
            },
            color: 'white',
          }} 
        />
      </Link>

      <Link to="/profile" style={{ textDecoration: 'none', flex: 1 }}>
        <BottomNavigationAction 
          label="My" 
          icon={<AccountCircleIcon style={{ color: 'white' }} />} 
          sx={{
            '& .MuiBottomNavigationAction-label': {
              color: 'white',
              opacity: 1,
              fontSize: '1rem',
              transition: 'none',
            },
            color: 'white',
          }} 
        />
      </Link>
    </BottomNavigation>
  );
};

export default BottomNav;
