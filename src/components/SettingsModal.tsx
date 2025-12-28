import { useState } from 'react';
import { Settings, FolderOpen, X } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import './SettingsModal.css';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { superpowersPath, setSuperpowersPath } = useSettingsStore();
    const [tempPath, setTempPath] = useState(superpowersPath);

    const handleSave = () => {
        setSuperpowersPath(tempPath);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-wrapper">
                        <Settings size={20} />
                        <h2 className="modal-title">Settings</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="setting-group">
                        <label className="setting-label">
                            <FolderOpen size={16} />
                            Superpowers Directory Path
                        </label>
                        <p className="setting-description">
                            The local path where your Superpowers skills are installed.
                        </p>
                        <input
                            type="text"
                            className="setting-input"
                            value={tempPath}
                            onChange={(e) => setTempPath(e.target.value)}
                            placeholder="C:/Superpowers"
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
