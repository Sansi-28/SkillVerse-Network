import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Grid } from '@mui/material';
import searchService from '../services/searchService';
import UserCard from '../components/UserCard';
import SkillCard from '../components/SkillCard';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState({ users: [], listings: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults({ users: [], listings: [] });
            setLoading(false);
            return;
        }
        setLoading(true);
        searchService.search(query)
            .then(response => setResults(response.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Search Results for: <Typography component="span" variant="h4" color="primary">{query}</Typography>
            </Typography>

            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> : (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{mb: 2}}>Users</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {results?.users?.length > 0 ? (
                            results.users.map(user => <UserCard key={user.id} user={user} />)
                        ) : <Typography sx={{fontFamily: 'Inter'}}>No users found.</Typography>}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" sx={{mb: 2}}>Listings</Typography>
                        <Grid container spacing={2}>
                            {results?.listings?.length > 0 ? (
                                results.listings.map(listing => (
                                    <Grid item key={listing.id} xs={12} sm={6}><SkillCard listing={listing} /></Grid>
                                ))
                            ) : <Typography sx={{fontFamily: 'Inter', ml: 2}}>No listings found.</Typography>}
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default SearchPage;
