import React from 'react';
import { Paper, Typography, Box, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const UserCard = ({ user }) => {
    return (
        <Paper 
            component={RouterLink} 
            to={`/profile/${user.id}`}
            sx={{ p: 2, border: '2px solid #4a4a4a', display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', color: 'inherit' }}
        >
            <Avatar sx={{ width: 48, height: 48 }} src={user.avatarUrl} />
            <Box>
                <Typography variant="h6">{user.name}</Typography>
                <Typography sx={{fontFamily: 'Inter', fontSize: '0.9rem'}} noWrap>{user.bio}</Typography>
            </Box>
        </Paper>
    );
};

export default UserCard;
