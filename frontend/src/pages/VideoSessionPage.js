import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createSignalClient } from '../services/signalClient';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';

const VideoSessionPage = () => {
  const { roomId } = useParams();
  const { userProfile, token } = useAuth();
  const navigate = useNavigate();

  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!userProfile || !token) return;

    const servers = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    peerConnectionRef.current = new RTCPeerConnection(servers);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, stream);
        });
      })
      .catch((error) => console.error('Error accessing media devices.', error));

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate && stompClientRef.current) {
        stompClientRef.current.publish({
          destination: `/app/rooms/${roomId}/signal`,
          body: JSON.stringify({ type: 'candidate', fromUserId: userProfile.id, data: event.candidate }),
        });
      }
    };

    stompClientRef.current = createSignalClient(process.env.REACT_APP_API_URL);

    stompClientRef.current.onConnect = () => {
      setIsConnected(true);
      stompClientRef.current.subscribe(`/topic/rooms/${roomId}`, (message) => {
        const payload = JSON.parse(message.body);
        if (String(payload.fromUserId) === String(userProfile.id)) return;
        handleSignal(payload);
      });
    };

    stompClientRef.current.activate();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [roomId, userProfile, token]);

  const handleSignal = async (payload) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    switch (payload.type) {
      case 'offer':
        await pc.setRemoteDescription(new RTCSessionDescription(payload.data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        stompClientRef.current.publish({
          destination: `/app/rooms/${roomId}/signal`,
          body: JSON.stringify({ type: 'answer', fromUserId: userProfile.id, data: pc.localDescription }),
        });
        break;
      case 'answer':
        await pc.setRemoteDescription(new RTCSessionDescription(payload.data));
        break;
      case 'candidate':
        await pc.addIceCandidate(new RTCIceCandidate(payload.data));
        break;
      default:
        break;
    }
  };

  const initiateCall = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    setCallStarted(true);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    stompClientRef.current.publish({
      destination: `/app/rooms/${roomId}/signal`,
      body: JSON.stringify({ type: 'offer', fromUserId: userProfile.id, data: pc.localDescription }),
    });
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsCameraOff(!track.enabled);
    });
  };

  const handleEndSession = async () => {
    alert('Session concluded! Returning to dashboard.');
    navigate('/dashboard');
  };

  return (
    <Box sx={{ backgroundColor: '#09150e', minHeight: 'calc(100vh - 120px)', py: 4, color: '#ffffff' }}>
      <Container maxWidth="xl">
        {/* Top Session Info Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <ShieldCheck size={18} color="#10b981" />
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#ffffff' }}>
                Secure 1:1 Session Room
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Room ID: {roomId} • End-to-End Encrypted WebRTC
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              size="small"
              label={isConnected ? 'Signal Connected' : 'Connecting...'}
              sx={{
                backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isConnected ? '#10b981' : '#f59e0b',
                fontWeight: 700,
                fontSize: '0.75rem',
                border: '1px solid currentColor',
              }}
            />

            {!callStarted && isConnected && (
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<PhoneCall size={16} />}
                onClick={initiateCall}
                sx={{ borderRadius: '50px', fontWeight: 700 }}
              >
                Start Call Signal
              </Button>
            )}
          </Box>
        </Box>

        {/* Video Stage */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Local User */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/10',
                backgroundColor: '#112217',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)', // Mirror local camera
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(8px)',
                  px: 2,
                  py: 0.6,
                  borderRadius: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  You ({userProfile?.name})
                </Typography>
                {isMuted && <MicOff size={14} color="#ef4444" />}
              </Box>
            </Box>
          </Grid>

          {/* Peer User */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/10',
                backgroundColor: '#112217',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(8px)',
                  px: 2,
                  py: 0.6,
                  borderRadius: '50px',
                }}
              >
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  Peer Participant
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Floating Call Action Controls */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            p: 2,
            backgroundColor: 'rgba(17, 34, 23, 0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: '50px',
            maxWidth: 440,
            mx: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Tooltip title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}>
            <IconButton
              onClick={toggleMute}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: isMuted ? '#ef4444' : 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: isMuted ? '#dc2626' : 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </IconButton>
          </Tooltip>

          <Tooltip title={isCameraOff ? 'Turn Video On' : 'Turn Video Off'}>
            <IconButton
              onClick={toggleCamera}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: isCameraOff ? '#ef4444' : 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: isCameraOff ? '#dc2626' : 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            color="error"
            startIcon={<PhoneOff size={18} />}
            onClick={handleEndSession}
            sx={{
              borderRadius: '50px',
              px: 3,
              py: 1.2,
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
            }}
          >
            End Session
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default VideoSessionPage;
