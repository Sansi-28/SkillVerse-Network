import api, { API_BASE_URL } from './api';

const API_URL = API_BASE_URL + '/api/listings';

const getAuthHeaders = () => {
  const user = authService.getCurrentUser();
  if (user && user.accessToken) {
    return { Authorization: `Bearer ${user.accessToken}` };
  }
  return {};
};

// Curated Master Craft Seed Listings with real photographs
const DEFAULT_CRAFT_LISTINGS = [
  {
    id: 101,
    title: 'Acoustic Cello Luthier & String Voicing',
    description: 'Learn the sacred discipline of hand-carving spruce tone-woods, adjusting soundposts, and understanding the acoustic resonance physics of classical instruments.',
    tokenPrice: 18,
    durationMinutes: 75,
    format: '1:1 Master Atelier Workshop',
    teacherId: 1,
    teacherName: 'Silas Vance',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
    photoUrl: '/photos/m138547195-1200.webp',
    guild: 'Acoustic & Sonic Arts',
    archivalNumber: 'N° 0841',
    rating: 4.98,
    reviewsCount: 34,
  },
  {
    id: 102,
    title: 'Generative Shaders & Creative WebGL Art',
    description: 'Deconstruct raymarching, GLSL fragment math, fluid simulation pipelines, and procedural canvas rendering for interactive web art installations.',
    tokenPrice: 20,
    durationMinutes: 60,
    format: '1:1 Live Code Architecture',
    teacherId: 2,
    teacherName: 'Elena Rostova',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    guild: 'Computational Systems',
    archivalNumber: 'N° 0842',
    rating: 5.0,
    reviewsCount: 52,
  },
  {
    id: 103,
    title: 'Wild Sourdough Fermentation & Hearth Baking',
    description: 'Master starter microbiology, flour hydration percentages, dough tension scoring, and thermodynamic steam control in artisanal brick hearth ovens.',
    tokenPrice: 12,
    durationMinutes: 90,
    format: '1:1 Sensory Kitchen Lab',
    teacherId: 3,
    teacherName: 'Julian Moreau',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    photoUrl: '/photos/m37164269-1200.webp',
    guild: 'Culinary Alchemy',
    archivalNumber: 'N° 0843',
    rating: 4.94,
    reviewsCount: 29,
  },
  {
    id: 104,
    title: 'Japanese Joinery & Hand-Tool Woodworking',
    description: 'Precision chiseled mortise and tenon joints without fasteners. Learn blade sharpening with natural waterstones and grain reading.',
    tokenPrice: 22,
    durationMinutes: 80,
    format: '1:1 Tactile Workshop',
    teacherId: 4,
    teacherName: 'Kenji Takahashi',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    guild: 'Tactile Materials',
    archivalNumber: 'N° 0844',
    rating: 4.97,
    reviewsCount: 41,
  },
  {
    id: 105,
    title: 'Silver Gelatin 35mm Darkroom Chemistry',
    description: 'Analog print enlargement, chemical batch temperatures, split-filter contrast tuning, and archival selenium toning on baryta fiber paper.',
    tokenPrice: 15,
    durationMinutes: 60,
    format: '1:1 Darkroom Critique',
    teacherId: 5,
    teacherName: 'Astrid Lindholm',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    guild: 'Visual Mediums',
    archivalNumber: 'N° 0845',
    rating: 4.92,
    reviewsCount: 38,
  },
  {
    id: 106,
    title: 'Ceramic Stoneware Throwing & Glaze Chemistry',
    description: 'Centering clay on the electric wheel, trimming porcelain footrings, and formulating matte crystalline glazes from raw mineral oxides.',
    tokenPrice: 16,
    durationMinutes: 70,
    format: '1:1 Studio Wheel Session',
    teacherId: 6,
    teacherName: 'Clara Chen',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    guild: 'Tactile Materials',
    archivalNumber: 'N° 0846',
    rating: 4.99,
    reviewsCount: 63,
  },
];

// Helper to attach photo and guild metadata
const enrichListing = (listing, index = 0) => {
  const fallback = DEFAULT_CRAFT_LISTINGS[index % DEFAULT_CRAFT_LISTINGS.length];
  return {
    ...fallback,
    ...listing,
    photoUrl: listing.photoUrl || fallback.photoUrl,
    guild: listing.guild || fallback.guild,
    archivalNumber: listing.archivalNumber || `N° ${String(1000 + (listing.id || index)).slice(1)}`,
    rating: listing.rating || fallback.rating,
    reviewsCount: listing.reviewsCount || fallback.reviewsCount,
  };
};

const getAllListings = async () => {
  try {
    const response = await axios.get(API_URL);
    const data = response.data;
    if (Array.isArray(data) && data.length > 0) {
      // Merge server listings with rich craft metadata
      const enriched = data.map((item, idx) => enrichListing(item, idx));
      return { data: enriched };
    }
    return { data: DEFAULT_CRAFT_LISTINGS };
  } catch (err) {
    console.warn('Backend unavailable, using curated atelier listings:', err);
    return { data: DEFAULT_CRAFT_LISTINGS };
  }
};

const getListingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return { data: enrichListing(response.data) };
  } catch (err) {
    const found = DEFAULT_CRAFT_LISTINGS.find((l) => String(l.id) === String(id));
    if (found) {
      return { data: found };
    }
    // Return first fallback if not found
    return { data: DEFAULT_CRAFT_LISTINGS[0] };
  }
};

const getPriceSuggestion = (skill) => {
  return api.get('/api/listings/price-suggestion', { params: { skill } });
};

const createListing = (listingData) => {
  return api.post('/api/listings', listingData);
};

const listingService = {
  getAllListings,
  getListingById,
  getPriceSuggestion,
  createListing,
  DEFAULT_CRAFT_LISTINGS,
};

export default listingService;
