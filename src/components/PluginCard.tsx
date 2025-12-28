import React, { useRef, useState } from 'react';
import { Edit2, Trash2, Check, ChevronDown, ChevronUp, ExternalLink, Star } from 'lucide-react';
import type { Plugin } from '../types';
import { Tooltip } from './Tooltip';
import './SkillCard.css';

interface PluginCardProps {
    plugin: Plugin;
    isSelected: boolean;
    isFavorite?: boolean;
    onClick: () => void;
    onEdit: (plugin: Plugin) => void;
    onDelete: (plugin: Plugin) => void;
    onToggleFavorite?: (id: string) => void;
}

export function PluginCard({ plugin, isSelected, isFavorite, onClick, onEdit, onDelete, onToggleFavorite }: PluginCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const hasFullDescription = plugin.description.length > plugin.shortDescription.length;

    return (
        <Tooltip content={plugin.description} maxWidth={400}>
            <div
                ref={cardRef}
                className={`skill-card ${isSelected ? 'selected' : ''}`}
                onClick={onClick}
                onMouseMove={handleMouseMove}
            >
                {onToggleFavorite && (
                    <button
                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(plugin.id);
                        }}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                )}
                <div className="skill-header">
                    <div className="skill-icon">
                        {plugin.icon}
                    </div>
                    {isSelected && (
                        <div className="skill-check">
                            <Check size={14} strokeWidth={3} />
                        </div>
                    )}
                </div>

                <div className="skill-content">
                    <h3 className="skill-name">{plugin.name}</h3>
                    <div className="skill-description-wrapper">
                        <p className={`skill-description ${isExpanded ? 'expanded' : ''}`}>
                            {isExpanded ? plugin.description : plugin.shortDescription}
                        </p>
                        {hasFullDescription && (
                            <button
                                className="expand-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }}
                                title={isExpanded ? 'Show less' : 'Show full description'}
                            >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                <span>{isExpanded ? 'Less' : 'More'}</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="skill-footer">
                    <span className="skill-category plugin-contents">
                        {plugin.contents.length > 50 ? plugin.contents.substring(0, 47) + '...' : plugin.contents}
                    </span>

                    <div className="skill-actions" onClick={e => e.stopPropagation()}>
                        <button
                            className="action-btn"
                            onClick={() => onEdit(plugin)}
                            title="Edit Plugin"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            className="action-btn delete-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Are you sure you want to delete plugin "${plugin.name}"?`)) {
                                    onDelete(plugin);
                                }
                            }}
                            title="Delete Plugin"
                        >
                            <Trash2 size={14} />
                        </button>
                        <a
                            href={plugin.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn github-btn"
                            title="View on GitHub"
                            onClick={e => e.stopPropagation()}
                        >
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>
        </Tooltip>
    );
}
