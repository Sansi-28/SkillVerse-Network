import React, { useState, useEffect, useCallback } from 'react';
import { Container, Paper, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import listingService from '../services/listingService';
import debounce from 'lodash/debounce';

const CreateListingPage = () => {
    const [formData, setFormData] = useState({ title: '', description: '', tokenPrice: '', format: '1:1 Session', durationMinutes: 60 });
    const [suggestion, setSuggestion] = useState(null);
    const navigate = useNavigate();

    const debouncedFetchSuggestion = useCallback(
        debounce((skill) => {
            if (skill) {
                listingService.getPriceSuggestion(skill)
                    .then(res => setSuggestion(res.data))
                    .catch(err => console.error(err));
            } else {
                setSuggestion(null);
            }
        }, 500), 
    []);

    useEffect(() => {
        debouncedFetchSuggestion(formData.title);
    }, [formData.title, debouncedFetchSuggestion]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await listingService.createListing(formData);
            navigate(`/listing/${response.data.id}`); // Navigate to the new listing
        } catch (err) {
            console.error("Failed to create listing", err);
        }
    };
    
    return (
        <Container sx={{ py: 4, maxWidth: '700px !important' }}>
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, border: '2px solid #4a4a4a' }}>
                <Typography variant="h4" sx={{ mb: 4 }}>Create a New Listing</Typography>
                <TextField name="title" label="Title (e.g., 'Beginner JavaScript Lesson')" value={formData.title} onChange={handleChange} fullWidth required variant="standard" sx={{ mb: 3 }}/>
                <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth required multiline rows={4} variant="standard" sx={{ mb: 3 }}/>
                <TextField name="tokenPrice" label="Token Price" type="number" value={formData.tokenPrice} onChange={handleChange} required variant="standard" sx={{ mb: 1 }}/>
                {suggestion && suggestion.count > 0 && (
                    <Typography sx={{fontFamily: 'Inter', fontSize: '0.8rem', color: 'text.secondary', mb: 3}}>
                        Suggestion for similar listings: {suggestion.min.toFixed(0)}-{suggestion.max.toFixed(0)} Tokens (Avg: {suggestion.average.toFixed(0)})
                    </Typography>
                )}
                {/* We can add Format and Duration fields here later */}
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, fontSize: '1.1rem' }}>Publish Listing</Button>
            </Paper>
        </Container>
    );
};

export default CreateListingPage;
