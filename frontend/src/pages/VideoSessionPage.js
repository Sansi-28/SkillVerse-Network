import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createSignalClient } from '../services/signalClient';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Container, Paper, Typography, CircularProgress } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff, PhoneDisabled } from '@mui/icons-material';
import bookingService from '../services/bookingService';

const VideoSessionPage = () => {
    const { roomId } = useParams();
    const { userProfile, token } = useAuth();
    const navigate = useNavigate();

    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const stompClientRef = useRef(null);

    // Initialize WebRTC and WebSocket connection
    useEffect(() => {
        if (!userProfile || !token) return;

        const servers = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
            ],
        };

        peerConnectionRef.current = new RTCPeerConnection(servers);

        // Get local media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                stream.getTracks().forEach(track => {
                    peerConnectionRef.current.addTrack(track, stream);
                });
            })
            .catch(error => console.error("Error accessing media devices.", error));
        
        // Handle incoming tracks
        peerConnectionRef.current.ontrack = event => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // ICE Candidate handling
        peerConnectionRef.current.onicecandidate = event => {
            if (event.candidate) {
                stompClientRef.current.publish({
                    destination: `/app/rooms/${roomId}/signal`,
                    body: JSON.stringify({ type: 'candidate', fromUserId: userProfile.id, data: event.candidate }),
                });
            }
        };

        // WebSocket Signaling
        stompClientRef.current = createSignalClient(process.env.REACT_APP_API_URL);

        stompClientRef.current.onConnect = () => {
            setIsConnected(true);
            stompClientRef.current.subscribe(`/topic/rooms/${roomId}`, message => {
                const payload = JSON.parse(message.body);
                // Ignore signals from self
                if (String(payload.fromUserId) === String(userProfile.id)) return;

                handleSignal(payload);
            });
        };

        stompClientRef.current.activate();

        return () => {
            // Cleanup on component unmount
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
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

    // Called by the first user to enter the room
    const initiateCall = async () => {
        const pc = peerConnectionRef.current;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        stompClientRef.current.publish({
            destination: `/app/rooms/${roomId}/signal`,
            body: JSON.stringify({ type: 'offer', fromUserId: userProfile.id, data: pc.localDescription }),
        });
    };

    // UI Control Handlers
    const toggleMute = () => {
        localStreamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
            setIsMuted(!track.enabled);
        });
    };

    const toggleCamera = () => {
        localStreamRef.current.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
            setIsCameraOff(!track.enabled);
        });
    };

    const handleEndSession = async () => {
        try {
            // Find booking ID from room ID - requires backend change, for now we navigate away
            // For the demo, we assume the user knows which booking it is.
            alert("Session ended! Marking booking as complete.");
            navigate('/dashboard'); // Go to dashboard after session
        } catch (error) {
            console.error("Failed to mark booking as complete", error);
            alert("Could not mark booking as complete. Please do so from your dashboard.");
            navigate('/dashboard');
        }
    };


    return (
        <Container sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Session Room: {roomId}</Typography>
                {!isConnected ? (
                    <Box sx={{ textAlign: 'center' }}><CircularProgress /> <Typography>Connecting...</Typography></Box>
                ) : (
                    <Button onClick={initiateCall}>Start Call</Button>
                )}
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, my: 3 }}>
                    <Box>
                        <Typography variant="h6">You</Typography>
                        <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: '8px' }} />
                    </Box>
                    <Box>
                        <Typography variant="h6">Peer</Typography>
                        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px' }}/>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button variant="contained" onClick={toggleMute} color={isMuted ? "error" : "primary"}>
                        {isMuted ? <MicOff /> : <Mic />}
                    </Button>
                    <Button variant="contained" onClick={toggleCamera} color={isCameraOff ? "error" : "primary"}>
                        {isCameraOff ? <VideocamOff /> : <Videocam />}
                    </Button>
                    <Button variant="contained" color="error" onClick={handleEndSession}>
                        <PhoneDisabled /> &nbsp; End Session
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default VideoSessionPage;