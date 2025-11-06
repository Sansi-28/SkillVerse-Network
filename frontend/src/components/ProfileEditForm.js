import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Chip } from '@mui/material';

const ProfileEditForm = ({ profileData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: profileData.name || '',
    bio: profileData.bio || '',
    skillsOffered: profileData.skillsOffered || [],
    skillsWanted: profileData.skillsWanted || [],
  });
  
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAddSkill = (skillType) => {
    const skillValue = skillType === 'offered' ? newSkillOffered.trim() : newSkillWanted.trim();
    if (skillValue) {
        if (skillType === 'offered') {
            setFormData(prev => ({ ...prev, skillsOffered: [...prev.skillsOffered, skillValue] }));
            setNewSkillOffered('');
        } else {
            setFormData(prev => ({ ...prev, skillsWanted: [...prev.skillsWanted, skillValue] }));
            setNewSkillWanted('');
        }
    }
  };

  const handleDeleteSkill = (skillToDelete, skillType) => {
    if (skillType === 'offered') {
        setFormData(prev => ({ ...prev, skillsOffered: prev.skillsOffered.filter(skill => skill !== skillToDelete) }));
    } else {
        setFormData(prev => ({ ...prev, skillsWanted: prev.skillsWanted.filter(skill => skill !== skillToDelete) }));
    }
  };
  
  const handleSaveChanges = () => {
      onSave(formData);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        label="Your Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        variant="standard"
        sx={{ mb: 3 }}
      />
      <TextField
        label="Your Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        variant="standard"
        sx={{ mb: 4 }}
      />
      
      <Typography variant="h5" sx={{ mb: 1 }}>Edit Skills You Can Teach</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, p: 1, border: '1px dashed grey', borderRadius: '4px' }}>
          {formData.skillsOffered.map(skill => (
              <Chip key={skill} label={skill} onDelete={() => handleDeleteSkill(skill, 'offered')} />
          ))}
      </Box>
      <Box sx={{display: 'flex', gap: 1, mb: 4}}>
        <TextField variant="standard" label="Add a skill..." size="small" value={newSkillOffered} onChange={e => setNewSkillOffered(e.target.value)} />
        <Button onClick={() => handleAddSkill('offered')}>Add</Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 1 }}>Edit Skills You Want to Learn</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, p: 1, border: '1px dashed grey', borderRadius: '4px' }}>
          {formData.skillsWanted.map(skill => (
              <Chip key={skill} label={skill} onDelete={() => handleDeleteSkill(skill, 'wanted')} />
          ))}
      </Box>
      <Box sx={{display: 'flex', gap: 1, mb: 4}}>
        <TextField variant="standard" label="Add a skill..." size="small" value={newSkillWanted} onChange={e => setNewSkillWanted(e.target.value)} />
        <Button onClick={() => handleAddSkill('wanted')}>Add</Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button onClick={onCancel} sx={{fontSize: '1rem'}}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSaveChanges} sx={{fontSize: '1rem'}}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileEditForm;