import { useState, useEffect } from 'react';
import { X, Pencil } from 'lucide-react';
import type { Skill, SkillCategory } from '../types';
import { CATEGORY_INFO } from '../types'; // CATEGORY_INFO is still used
import { useAppStore } from '../stores/appStore';
import './SettingsModal.css';

interface EditSkillModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingSkill: Skill | null; // If null, we are adding a new skill
}

const DEFAULT_SKILL: Skill = {
    id: '',
    name: '',
    description: '',
    category: 'collaboration',
    references: [],
    icon: '✨'
};

export function EditSkillModal({ isOpen, onClose, editingSkill }: EditSkillModalProps) {
    const { addSkill, updateSkill } = useAppStore();
    const [formData, setFormData] = useState<Skill>(DEFAULT_SKILL);
    const [referencesString, setReferencesString] = useState('');

    useEffect(() => {
        if (editingSkill) {
            setFormData(editingSkill);
            setReferencesString(editingSkill.references.join(', '));
        } else {
            setFormData(DEFAULT_SKILL);
            setReferencesString('');
        }
    }, [editingSkill, isOpen]);

    const handleSave = () => {
        const references = referencesString
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const skillToSave = { ...formData, references };

        if (editingSkill) {
            updateSkill(skillToSave);
        } else {
            // For new skills, ensure ID is kebab-case of name if empty
            if (!skillToSave.id) {
                skillToSave.id = skillToSave.name.toLowerCase().replace(/\s+/g, '-');
            }
            addSkill(skillToSave);
        }
        onClose();
    };

    if (!isOpen) return null;

    const categories: SkillCategory[] = Object.keys(CATEGORY_INFO) as SkillCategory[];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-wrapper">
                        <Pencil size={20} />
                        <h2 className="modal-title">{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="setting-group">
                        <label className="setting-label">Name</label>
                        <input
                            type="text"
                            className="setting-input"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Skill Name"
                        />
                    </div>

                    <div className="setting-group">
                        <label className="setting-label">Description</label>
                        <input
                            type="text"
                            className="setting-input"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description"
                        />
                    </div>

                    <div className="setting-group" style={{ flexDirection: 'row', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="setting-label">ID (slug)</label>
                            <input
                                type="text"
                                className="setting-input"
                                value={formData.id}
                                onChange={e => setFormData({ ...formData, id: e.target.value })}
                                placeholder="my-skill-id"
                                disabled={!!editingSkill} // Disable ID editing for now to avoid breaking refs
                            />
                        </div>
                        <div style={{ width: '80px' }}>
                            <label className="setting-label">Icon</label>
                            <input
                                type="text"
                                className="setting-input"
                                value={formData.icon}
                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="✨"
                            />
                        </div>
                    </div>

                    <div className="setting-group">
                        <label className="setting-label">Category</label>
                        <select
                            className="setting-input"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value as SkillCategory })}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{CATEGORY_INFO[cat].label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="setting-group">
                        <label className="setting-label">References (comma separated IDs)</label>
                        <input
                            type="text"
                            className="setting-input"
                            value={referencesString}
                            onChange={e => setReferencesString(e.target.value)}
                            placeholder="brainstorming, writing-plans"
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        {editingSkill ? 'Save Changes' : 'Create Skill'}
                    </button>
                </div>
            </div>
        </div>
    );
}
