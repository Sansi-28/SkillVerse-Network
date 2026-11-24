import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Paper,
  Divider,
  InputAdornment,
} from '@mui/material';
import { Plus, X, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

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
        if (!formData.skillsOffered.includes(skillValue)) {
          setFormData((prev) => ({ ...prev, skillsOffered: [...prev.skillsOffered, skillValue] }));
        }
        setNewSkillOffered('');
      } else {
        if (!formData.skillsWanted.includes(skillValue)) {
          setFormData((prev) => ({ ...prev, skillsWanted: [...prev.skillsWanted, skillValue] }));
        }
        setNewSkillWanted('');
      }
    }
  };

  const handleDeleteSkill = (skillToDelete, skillType) => {
    if (skillType === 'offered') {
      setFormData((prev) => ({
        ...prev,
        skillsOffered: prev.skillsOffered.filter((skill) => skill !== skillToDelete),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        skillsWanted: prev.skillsWanted.filter((skill) => skill !== skillToDelete),
      }));
    }
  };

  const handleKeyDown = (e, skillType) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(skillType);
    }
  };

  const handleSaveChanges = () => {
    onSave(formData);
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
      {/* Basic Info */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            color: '#0d1e16',
            mb: 2,
          }}
        >
          Basic Information
        </Typography>

        <TextField
          label="Your Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ mb: 2.5 }}
        />

        <TextField
          label="Bio / About Yourself"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Tell other community members what you're passionate about, what you teach, and what you're excited to learn..."
          helperText="A friendly, authentic bio helps build trust with learners and teachers."
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Skills Offered */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <BookOpen size={18} color="#0f3822" />
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              color: '#0d1e16',
            }}
          >
            Skills You Can Teach
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Add skills, tools, or subjects you're comfortable teaching others.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
            minHeight: 44,
            p: 1.5,
            borderRadius: '14px',
            backgroundColor: '#fbfbfa',
            border: '1px solid rgba(13, 30, 22, 0.08)',
          }}
        >
          {formData.skillsOffered.length > 0 ? (
            formData.skillsOffered.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                onDelete={() => handleDeleteSkill(skill, 'offered')}
                sx={{
                  backgroundColor: '#eef5f1',
                  color: '#0f3822',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              />
            ))
          ) : (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', alignSelf: 'center', px: 1 }}>
              No skills added yet. Type a skill below and press Add or Enter.
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            variant="outlined"
            placeholder="e.g., JavaScript, Python, Classical Piano, Oil Painting..."
            size="small"
            fullWidth
            value={newSkillOffered}
            onChange={(e) => setNewSkillOffered(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'offered')}
          />
          <Button
            variant="outlined"
            onClick={() => handleAddSkill('offered')}
            disabled={!newSkillOffered.trim()}
            startIcon={<Plus size={16} />}
            sx={{ flexShrink: 0, borderRadius: '12px' }}
          >
            Add
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Skills Wanted */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <GraduationCap size={18} color="#d97706" />
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              color: '#0d1e16',
            }}
          >
            Skills You Want to Learn
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          List areas you're curious about. Teachers can find you and offer matching sessions!
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
            minHeight: 44,
            p: 1.5,
            borderRadius: '14px',
            backgroundColor: '#fbfbfa',
            border: '1px solid rgba(13, 30, 22, 0.08)',
          }}
        >
          {formData.skillsWanted.length > 0 ? (
            formData.skillsWanted.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                onDelete={() => handleDeleteSkill(skill, 'wanted')}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                  color: '#92400e',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              />
            ))
          ) : (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', alignSelf: 'center', px: 1 }}>
              No learning goals added yet. Type a skill below and press Add or Enter.
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            variant="outlined"
            placeholder="e.g., Spanish, Video Editing, Guitar, Swimming..."
            size="small"
            fullWidth
            value={newSkillWanted}
            onChange={(e) => setNewSkillWanted(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'wanted')}
          />
          <Button
            variant="outlined"
            onClick={() => handleAddSkill('wanted')}
            disabled={!newSkillWanted.trim()}
            startIcon={<Plus size={16} />}
            sx={{ flexShrink: 0, borderRadius: '12px' }}
          >
            Add
          </Button>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 3, borderTop: '1px solid rgba(13, 30, 22, 0.08)' }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            px: 3,
            borderRadius: '50px',
            borderColor: 'rgba(13, 30, 22, 0.15)',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          sx={{
            px: 4,
            borderRadius: '50px',
            fontWeight: 700,
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileEditForm;
