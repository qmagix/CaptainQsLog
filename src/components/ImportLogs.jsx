import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { useLogs } from '../store/LogContext';
import { Upload, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ImportLogs = ({ variant }) => {
    const { importLogs } = useLogs();
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef(null);
    const { t } = useTranslation();

    const getMimeFromExt = (ext, type) => {
        if (ext === 'jpg') return 'image/jpeg';
        if (ext === 'jpeg') return 'image/jpeg';
        if (ext === 'png') return 'image/png';
        if (ext === 'gif') return 'image/gif';
        if (ext === 'webp') return 'image/webp';

        if (ext === 'mov') return 'video/quicktime';
        if (ext === 'mp4') return 'video/mp4';

        if (ext === 'wav') return 'audio/wav';
        if (ext === 'mp3' || ext === 'mpeg') return 'audio/mpeg';
        if (ext === 'webm') return type === 'video' ? 'video/webm' : 'audio/webm';

        return type === 'video' ? 'video/mp4' : 'application/octet-stream';
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const zip = await JSZip.loadAsync(file);

            // Read logs.json
            const logsFile = zip.file("logs.json");
            if (!logsFile) {
                throw new Error(t('import.invalidFile'));
            }

            const logsContent = await logsFile.async("string");
            const logsData = JSON.parse(logsContent);

            const processedLogs = await Promise.all(logsData.map(async (log) => {
                // Process Audio
                if (log.audio && log.audio.startsWith("media/")) {
                    const filename = log.audio.split('/').pop();
                    const ext = filename.split('.').pop();
                    const fileInZip = zip.file(log.audio);
                    if (fileInZip) {
                        const base64 = await fileInZip.async("base64");
                        const mime = getMimeFromExt(ext, 'audio');
                        log.audio = `data:${mime};base64,${base64}`;
                    }
                }

                // Process Images
                if (log.images && log.images.length > 0) {
                    log.images = await Promise.all(log.images.map(async (img) => {
                        if (typeof img === 'string' && img.startsWith("media/")) {
                            const filename = img.split('/').pop();
                            const ext = filename.split('.').pop();
                            const fileInZip = zip.file(img);
                            if (fileInZip) {
                                const base64 = await fileInZip.async("base64");
                                const mime = getMimeFromExt(ext, 'image');
                                return `data:${mime};base64,${base64}`;
                            }
                        }
                        return img; // Return original if not processed
                    }));
                }

                // Process Videos
                if (log.videos && log.videos.length > 0) {
                    log.videos = await Promise.all(log.videos.map(async (vid) => {
                        if (typeof vid === 'string' && vid.startsWith("media/")) {
                            const filename = vid.split('/').pop();
                            const ext = filename.split('.').pop();
                            const fileInZip = zip.file(vid);
                            if (fileInZip) {
                                const base64 = await fileInZip.async("base64");
                                const mime = getMimeFromExt(ext, 'video');
                                return `data:${mime};base64,${base64}`;
                            }
                        }
                        return vid;
                    }));
                }

                return log;
            }));

            importLogs(processedLogs);
            alert(t('import.success', { count: processedLogs.length }));

        } catch (err) {
            console.error("Import failed:", err);
            alert(t('import.failure', { error: err.message }));
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".zip"
                style={{ display: 'none' }}
            />
            {variant === 'icon' ? (
                <button
                    className="btn-import-icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    title={t('import.title')}
                    style={{
                        background: 'transparent',
                        color: 'var(--color-text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                    {isImporting ? <Loader size={16} className="spin" /> : <Upload size={16} />}
                </button>
            ) : (
                <button
                    className="btn-export" // Reusing export button class for consistent styling
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    title={t('import.title')}
                >
                    {isImporting ? <Loader size={16} className="spin" /> : <Upload size={16} />}
                    <span>{t('import.button')}</span>
                </button>
            )}
        </>
    );
};

export default ImportLogs;
