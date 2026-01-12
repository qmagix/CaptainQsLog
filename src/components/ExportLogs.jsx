import React, { useState } from 'react';
import JSZip from 'jszip';
import { useLogs } from '../store/LogContext';
import { Download, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const ExportLogs = () => {
    const { logs } = useLogs();
    const [isExporting, setIsExporting] = useState(false);
    const { t } = useTranslation();

    // Helper to process Data URL to Blob without string duplication overhead
    const processDataUrl = async (dataUrl) => {
        try {
            // Fetch handles Data URL parsing efficiently into a Blob
            const res = await fetch(dataUrl);
            const blob = await res.blob();

            // Extract extension from MIME type
            const mime = blob.type;
            let ext = mime.split('/')[1] || 'dat';

            // Common extension fixes
            if (ext === 'jpeg') ext = 'jpg';
            if (ext === 'quicktime') ext = 'mov';
            if (ext === 'mpeg') ext = 'mp3'; // crude fix, but works for audio/mpeg

            // If mime is generic, try to recover from dataUrl header if present
            if (ext === 'octet-stream') {
                const match = dataUrl.match(/^data:(.*?);/);
                if (match) {
                    const originalMime = match[1];
                    ext = originalMime.split('/')[1];
                }
            }

            return { blob, ext };
        } catch (e) {
            console.error("Failed to process data URL", e);
            return null;
        }
    };

    const handleExport = async () => {
        if (logs.length === 0) return;
        setIsExporting(true);

        // Allow UI to update before heavy lifting
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const zip = new JSZip();
            const mediaFolder = zip.folder("media");
            const cleanLogs = [];

            // Process logs sequentially to avoid massive parallel memory strings
            for (const log of logs) {
                const cleanLog = { ...log, images: [], videos: [], audio: null };

                // Process Audio
                if (log.audio) {
                    const result = await processDataUrl(log.audio);
                    if (result) {
                        const filename = `${log.id}_audio.${result.ext}`;
                        // Use STORE to avoid re-compressing media (saves CPU/Time)
                        mediaFolder.file(filename, result.blob, { compression: "STORE" });
                        cleanLog.audio = `media/${filename}`;
                    }
                }

                // Process Images
                if (log.images && log.images.length > 0) {
                    for (let i = 0; i < log.images.length; i++) {
                        const img = log.images[i];
                        const result = await processDataUrl(img);
                        if (result) {
                            const filename = `${log.id}_img_${i}.${result.ext}`;
                            mediaFolder.file(filename, result.blob, { compression: "STORE" });
                            cleanLog.images.push(`media/${filename}`);
                        }
                    }
                }

                // Process Videos
                if (log.videos && log.videos.length > 0) {
                    for (let i = 0; i < log.videos.length; i++) {
                        const vid = log.videos[i];
                        const result = await processDataUrl(vid);
                        if (result) {
                            const filename = `${log.id}_vid_${i}.${result.ext}`;
                            mediaFolder.file(filename, result.blob, { compression: "STORE" });
                            cleanLog.videos.push(`media/${filename}`);
                        }
                    }
                }

                cleanLogs.push(cleanLog);
            }

            // Add JSON dump (compress this one)
            zip.file("logs.json", JSON.stringify(cleanLogs, null, 2));

            // Add README
            const readmeContent = t('export.readme', { date: new Date().toLocaleString() });
            zip.file("README.txt", readmeContent);

            // Generate Zip
            const content = await zip.generateAsync({
                type: "blob",
                platform: "UNIX", // Helps with compatibility
            });

            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `captains_log_export_${format(new Date(), 'yyyy-MM-dd')}.zip`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);

        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to create export zip: " + err.message);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            className="btn-export"
            onClick={handleExport}
            disabled={isExporting || logs.length === 0}
            title={t('export.title')}
        >
            {isExporting ? <Loader size={16} className="spin" /> : <Download size={16} />}
            <span>{isExporting ? t('export.exporting') : t('export.button')}</span>
        </button>
    );
};

export default ExportLogs;
