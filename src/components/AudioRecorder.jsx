import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2 } from 'lucide-react';

const AudioRecorder = ({ audioData, onSave, onDelete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    onSave(reader.result);
                };
                // Stop all tracks to release mic
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Start timer
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Microphone access denied or not available.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="audio-controls">
            {!audioData && !isRecording && (
                <button className="btn-record" onClick={startRecording}>
                    <Mic size={16} />
                    <span>RECORD LOG</span>
                </button>
            )}

            {isRecording && (
                <div className="recording-status">
                    <div className="recording-indicator">
                        <span className="pulse"></span>
                        RECORDING {formatTime(recordingTime)}
                    </div>
                    <button className="btn-stop" onClick={stopRecording}>
                        <Square size={16} fill="currentColor" />
                    </button>
                </div>
            )}

            {audioData && (
                <div className="audio-player-wrapper">
                    <audio controls src={audioData} className="native-audio" />
                    <button className="btn-delete-audio" onClick={onDelete} title="Delete Audio Log">
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
