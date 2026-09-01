import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Avatar,
  AvatarGroup,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  BookOpen,
  Coins,
  GraduationCap,
  Users,
  Gift,
  ShieldCheck,
  ShoppingCart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import listingService from '../services/listingService';
import SkillCard from '../components/SkillCard';
import bgImage from '../resources/bg3.jpg';
import cardBg from '../resources/card-bg.jpg';

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: 'easeOut'
    }
  })
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// ─── Step Card ──────────────────────────────────────────────────────────────

const StepItem = ({ icon: Icon, label, sub, delay }) => (
  <Box
    component={motion.div}
    custom={delay}
    variants={fadeUp}
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      paddingLeft: '10px',
      gap: 1.5,
      mb: 1.5
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '12px',
        backgroundColor: '#f1f4ec',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <Icon size={20} color="#163a24" />
    </Box>

    <Box>
      <Typography
        sx={{
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: '#1a3626',
          lineHeight: 1.2
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontFamily: 'Inter',
          fontSize: '0.82rem',
          color: '#6b7280',
          mt: 0.2
        }}
      >
        {sub}
      </Typography>
    </Box>
  </Box>
);

// ─── Value Banner Item ──────────────────────────────────────────────────────

const BannerItem = ({ icon: Icon, title, sub }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <Icon size={20} color="#ffffff" />
    </Box>

    <Box>
      <Typography
        sx={{
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 600,
          color: '#ffffff',
          fontSize: '0.95rem',
          lineHeight: 1.2
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontFamily: 'Inter',
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.65)'
        }}
      >
        {sub}
      </Typography>
    </Box>
  </Box>
);

// ─── Sample avatar colors ───────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#d4edda',
  '#c3e6cb',
  '#b1dfbb',
  '#9fd9ab'
];

// ─── Home Page ──────────────────────────────────────────────────────────────

const HomePage = () => {
  const { data: listings } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const res = await listingService.getAllListings();
      return res.data;
    }
  });

  const featuredListings = listings ? listings.slice(0, 3) : [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        overflowX: 'hidden'
      }}
    >
      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}

      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 4, sm: 5, md: 5 },
          pb: { xs: 3, sm: 4, md: 4 }
        }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 4 }}
          alignItems="center"
        >
          {/* ── Left: Headline & CTA ─────────────────────────────────────── */}

          <Grid item xs={12} md={6}>
            <Box
              component={motion.div}
              variants={stagger}
              initial="hidden"
              animate="show"
              sx={{
                pl: 10, // 2.5 * 8px = 20px
                gap: 1.5,
                mb: 2
              }}

            >
              {/* Badge */}

              <Box
                component={motion.div}
                variants={fadeUp}
                custom={0}
                sx={{ mb: 1.5 }}
              >
                <Chip
                  label="Knowledge-based community"
                  size="small"
                  sx={{
                    backgroundColor: '#f1f4ec',
                    color: '#163a24',
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    border: '1px solid rgba(22,58,36,0.12)',
                    borderRadius: '50px'
                  }}
                />
              </Box>

              {/* Main heading */}

              <Typography
                component={motion.h1}
                custom={1}
                variants={fadeUp}
                variant="h2"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 700,
                  fontSize: {
                    xs: '2.6rem',
                    sm: '3rem',
                    md: '3.3rem',
                    lg: '3.8rem'
                  },
                  color: '#1a3626',
                  lineHeight: 1.05,
                  mb: 0.5
                }}
              >
                Share a Skill.
              </Typography>

              <Typography
                component={motion.h1}
                custom={2}
                variants={fadeUp}
                variant="h2"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 700,
                  fontSize: {
                    xs: '2.6rem',
                    sm: '3rem',
                    md: '3.3rem',
                    lg: '3.8rem'
                  },
                  color: '#163a24',
                  lineHeight: 1.05,
                  mb: 2
                }}
              >
                Learn another.
              </Typography>

              {/* Description */}

              <Typography
                component={motion.p}
                custom={3}
                variants={fadeUp}
                sx={{
                  fontFamily: 'Inter',
                  fontSize: {
                    xs: '1rem',
                    md: '1.05rem'
                  },
                  color: '#4b5563',
                  mb: 2.5,
                  maxWidth: '480px',
                  lineHeight: 1.6
                }}
              >
                A friendly community where your knowledge becomes your
                currency. Teach what you love, and earn tokens to learn
                something new.
              </Typography>

              {/* CTA Buttons */}

              <Box
                component={motion.div}
                custom={4}
                variants={fadeUp}
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  mb: 3
                }}
              >
                <Button
                  component={RouterLink}
                  to="/discover"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.3,
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  Discover Skills
                </Button>

                <Button
                  component={RouterLink}
                  to="/create-listing"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderColor: '#163a24',
                    color: '#163a24',
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px',
                      backgroundColor: 'rgba(22,58,36,0.04)'
                    }
                  }}
                >
                  Share a Skill
                </Button>
              </Box>

              {/* Social proof */}

              <Box
                component={motion.div}
                custom={5}
                variants={fadeUp}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <AvatarGroup
                  max={4}
                  sx={{
                    '& .MuiAvatar-root': {
                      width: 36,
                      height: 36,
                      fontSize: '0.8rem',
                      border: '2px solid #faf9f5'
                    }
                  }}
                >
                  {AVATAR_COLORS.map((bg, i) => (
                    <Avatar
                      key={i}
                      sx={{
                        bgcolor: bg,
                        color: '#163a24',
                        fontWeight: 700
                      }}
                    >
                      {['S', 'A', 'M', 'R'][i]}
                    </Avatar>
                  ))}
                </AvatarGroup>

                <Box>
                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#1a3626'
                    }}
                  >
                    2.5K+ Active Members
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: 'Inter',
                      fontSize: '0.78rem',
                      color: '#6b7280'
                    }}
                  >
                    Already learning and teaching
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* ── Right: Welcome Card ─────────────────────────────────────── */}

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
                delay: 0.2
              }}
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 440
              }}
            >
              {/* Decorative blob */}

              <Box
                sx={{
                  position: 'absolute',
                  top: -32,
                  right: -32,
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(209,233,218,0.6) 0%, transparent 70%)',
                  zIndex: 0
                }}
              />

              {/* Welcome Card */}

              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,

                  borderRadius: '28px',
                  overflow: 'hidden',

                  /* Background image covers the ENTIRE card */
                  backgroundImage: `
                    linear-gradient(
                      rgba(255, 255, 255, 0),
                      rgba(255, 255, 255, 0)
                    ),
                    url(${cardBg})
                  `,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',

                  p: { xs: 5, md: 6 },

                  boxShadow: '0 16px 64px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.03)'
                }}
              >
                {/* Card Content */}

                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      color: '#1a3626',
                      mb: 2
                    }}
                  >
                    Welcome!
                  </Typography>

                  <Box
                    component={motion.div}
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                  >
                    <StepItem
                      icon={Gift}
                      label="1. Offer a skill you're good at."
                      sub="Teaching is a gift — share yours"
                      delay={0}
                    />

                    <StepItem
                      icon={Coins}
                      label="2. Earn tokens from teaching."
                      sub="Your knowledge has real value"
                      delay={1}
                    />

                    <StepItem
                      icon={ShoppingCart}
                      label="3. Spend tokens to learn from others!"
                      sub="Then grow by learning something new"
                      delay={2}
                    />
                  </Box>

                  {/* Small divider accent */}

                  <Box
                    sx={{
                      width: 40,
                      height: 3,
                      borderRadius: '4px',
                      backgroundColor: '#d1e9da',
                      mt: 1
                    }}
                  />
                </Box>
              </Box>

              {/* Floating badge */}

              <Box
                component={motion.div}
                initial={{
                  opacity: 0,
                  scale: 0.8
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.7
                }}
                sx={{
                  position: 'absolute',
                  bottom: -18,
                  left: 24,
                  zIndex: 2,
                  backgroundColor: '#163a24',
                  borderRadius: '50px',
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <ShieldCheck
                  size={16}
                  color="#ffffff"
                />

                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: '0.78rem',
                    color: '#ffffff',
                    fontWeight: 600
                  }}
                >
                  Token-based exchange
                </Typography>
              </Box>
            </Box>
          </Grid>

        </Grid>
      </Container>

      {/* ═══ VALUE BANNER ═══════════════════════════════════════════════════ */}

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, md: 4 },
          pt: { xs: 5, md: 8 },
          mb: { xs: 5, md: 6 }
        }}
      >
        <Box
          component={motion.div}
          initial={{
            opacity: 0,
            y: 24
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.5
          }}
          sx={{
            backgroundColor: '#163a24',
            borderRadius: '24px',
            px: { xs: 3, md: 5 },
            py: { xs: 2.5, md: 3 }
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            {[
              {
                icon: BookOpen,
                title: 'Teach',
                sub: 'What you love'
              },
              {
                icon: Coins,
                title: 'Earn Tokens',
                sub: 'For your knowledge'
              },
              {
                icon: GraduationCap,
                title: 'Learn New Skills',
                sub: 'From others'
              },
              {
                icon: Users,
                title: 'Grow Together',
                sub: 'As a community'
              }
            ].map(({ icon, title, sub }) => (
              <Grid
                item
                xs={6}
                md={3}
                key={title}
              >
                <BannerItem
                  icon={icon}
                  title={title}
                  sub={sub}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* ═══ FEATURED SKILLS ════════════════════════════════════════════════ */}

      {featuredListings.length > 0 && (
        <Container
          maxWidth="xl"
          sx={{
            pb: { xs: 6, md: 8 }
          }}
        >
          <Box
            component={motion.div}
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5
            }}
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 700,
                  color: '#1a3626'
                }}
              >
                Featured Skills
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'Inter',
                  color: '#6b7280',
                  mt: 0.5
                }}
              >
                Browse what the community is currently teaching
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/discover"
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#163a24',
                color: '#163a24',
                borderWidth: '1.5px',
                '&:hover': {
                  borderWidth: '1.5px'
                }
              }}
            >
              View All
            </Button>
          </Box>

          <Grid
            container
            spacing={3}
            component={motion.div}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true
            }}
          >
            {featuredListings.map((listing, i) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={listing.id}
                component={motion.div}
                variants={fadeUp}
                custom={i}
              >
                <SkillCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default HomePage;
