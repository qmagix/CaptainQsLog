import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useLogs } from '../store/LogContext';
import { Download, Loader } from 'lucide-react';

const ExportLogs = () => {
    const { logs } = useLogs();
    const [isExporting, setIsExporting] = useState(false);

    const parseDataUrl = (dataUrl) => {
        try {
            const [header, base64Data] = dataUrl.split(',');
            const mime = header.match(/:(.*?);/)[1];
            let ext = mime.split('/')[1];
            // Common fixes
            if (ext === 'jpeg') ext = 'jpg';
            if (ext === 'quicktime') ext = 'mov';
            return { mime, ext, base64Data };
        } catch (e) {
            console.error("Failed to parse data URL", e);
            return null;
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        const zip = new JSZip();
        const mediaFolder = zip.folder("media");
        const cleanLogs = [];

        logs.forEach(log => {
            const cleanLog = { ...log, images: [], videos: [], audio: null };

            // Process Audio
            if (log.audio) {
                const parsed = parseDataUrl(log.audio);
                if (parsed) {
                    const filename = `${log.id}_audio.${parsed.ext}`;
                    mediaFolder.file(filename, parsed.base64Data, { base64: true });
                    cleanLog.audio = `media/${filename}`;
                }
            }

            // Process Images
            if (log.images && log.images.length > 0) {
                log.images.forEach((img, idx) => {
                    const parsed = parseDataUrl(img);
                    if (parsed) {
                        const filename = `${log.id}_img_${idx}.${parsed.ext}`;
                        mediaFolder.file(filename, parsed.base64Data, { base64: true });
                        cleanLog.images.push(`media/${filename}`);
                    }
                });
            }

            // Process Videos
            if (log.videos && log.videos.length > 0) {
                log.videos.forEach((vid, idx) => {
                    const parsed = parseDataUrl(vid);
                    if (parsed) {
                        const filename = `${log.id}_vid_${idx}.${parsed.ext}`;
                        mediaFolder.file(filename, parsed.base64Data, { base64: true });
                        cleanLog.videos.push(`media/${filename}`);
                    }
                });
            }

            cleanLogs.push(cleanLog);
        });

        // Add JSON dump
        zip.file("logs.json", JSON.stringify(cleanLogs, null, 2));

        // Add README
        zip.file("README.txt", `Captain's Log Export\nGenerated: ${new Date().toLocaleString()}\n\nThis archive contains your logs in JSON format and all attached media files.`);

        // Generate Zip
        try {
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `captains_log_export_${new Date().toISOString().slice(0, 10)}.zip`);
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to create export zip.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            className="btn-export"
            onClick={handleExport}
            disabled={isExporting || logs.length === 0}
            title="Export All Logs to ZIP"
        >
            {isExporting ? <Loader size={16} className="spin" /> : <Download size={16} />}
            <span>{isExporting ? 'EXPORTING...' : 'EXPORT LOGS'}</span>
        </button>
    );
};

export default ExportLogs;
