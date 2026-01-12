import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AudioRecorder = ({ audioData, onSave, onDelete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const { t } = useTranslation();

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Detect supported MIME type
            const mimeType = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/mp4',
                'audio/aac',
                'audio/ogg',
            ].find(type => MediaRecorder.isTypeSupported(type));

            const options = mimeType ? { mimeType } : {};
            const mediaRecorder = new MediaRecorder(stream, options);

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Use the detected mimeType or fallback to what the recorder reports
                const finalType = mimeType || mediaRecorder.mimeType || 'audio/webm';
                const blob = new Blob(chunksRef.current, { type: finalType });
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
            alert(t('audioRecorder.micError'));
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
                    <span>{t('audioRecorder.recordLog')}</span>
                </button>
            )}

            {isRecording && (
                <div className="recording-status">
                    <div className="recording-indicator">
                        <span className="pulse"></span>
                        {t('audioRecorder.recording')} {formatTime(recordingTime)}
                    </div>
                    <button className="btn-stop" onClick={stopRecording}>
                        <Square size={16} fill="currentColor" />
                    </button>
                </div>
            )}

            {audioData && (
                <div className="audio-player-wrapper">
                    <audio controls src={audioData} className="native-audio" />
                    <button className="btn-delete-audio" onClick={onDelete} title={t('audioRecorder.deleteTooltip')}>
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
