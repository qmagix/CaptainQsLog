import React, { useRef } from 'react';
import { Image, Film, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './MediaManager.css';

const MediaManager = ({ images = [], videos = [], onUpdate }) => {
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const { t } = useTranslation();

    const handleFileSelect = (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            alert(t('media.fileTooLarge'));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            if (type === 'image') {
                onUpdate({ images: [...images, result] });
            } else {
                onUpdate({ videos: [...videos, result] });
            }
        };
        reader.readAsDataURL(file);

        // Reset input
        event.target.value = '';
    };

    const removeMedia = (index, type) => {
        if (type === 'image') {
            const newImages = [...images];
            newImages.splice(index, 1);
            onUpdate({ images: newImages });
        } else {
            const newVideos = [...videos];
            newVideos.splice(index, 1);
            onUpdate({ videos: newVideos });
        }
    };

    return (
        <div className="media-manager">
            <div className="media-controls">
                <button className="btn-media" onClick={() => imageInputRef.current.click()}>
                    <Image size={16} />
                    <span>{t('media.addPhoto')}</span>
                </button>
                <button className="btn-media" onClick={() => videoInputRef.current.click()}>
                    <Film size={16} />
                    <span>{t('media.addVideo')}</span>
                </button>

                <input
                    type="file"
                    ref={imageInputRef}
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'image')}
                />
                <input
                    type="file"
                    ref={videoInputRef}
                    hidden
                    accept="video/*"
                    onChange={(e) => handleFileSelect(e, 'video')}
                />
            </div>

            {(images.length > 0 || videos.length > 0) && (
                <div className="media-grid">
                    {images.map((img, idx) => (
                        <div key={`img-${idx}`} className="media-item">
                            <img src={img} alt="Log attachment" loading="lazy" />
                            <button
                                className="btn-remove-media"
                                onClick={() => removeMedia(idx, 'image')}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {videos.map((vid, idx) => (
                        <div key={`vid-${idx}`} className="media-item">
                            <video src={vid} controls />
                            <button
                                className="btn-remove-media"
                                onClick={() => removeMedia(idx, 'video')}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaManager;
