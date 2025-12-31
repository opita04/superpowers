import React, { useRef, useState } from 'react';
import { Edit2, Archive, Check, ChevronDown, ChevronUp, Star, ExternalLink } from 'lucide-react';
import type { Skill } from '../types';
import { Tooltip } from './Tooltip';
import './SkillCard.css';

interface SkillCardProps {
    skill: Skill;
    isSelected: boolean;
    isFavorite: boolean;
    onClick: () => void;
    onEdit: (skill: Skill) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
}

export function SkillCard({ skill, isSelected, isFavorite, onClick, onEdit, onDelete, onToggleFavorite }: SkillCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x} px`);
        cardRef.current.style.setProperty('--mouse-y', `${y} px`);
    };

    return (
        <Tooltip content={skill.longDescription || skill.description} maxWidth={400}>
            <div
                ref={cardRef}
                className={`skill-card ${isSelected ? 'selected' : ''}`}
                onClick={onClick}
                onMouseMove={handleMouseMove}
            >
                <button
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(skill.id);
                    }}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <div className="skill-header">
                    <div className="skill-icon">
                        {skill.icon || '⚡'}
                    </div>
                    {isSelected && (
                        <div className="skill-check">
                            <Check size={14} strokeWidth={3} />
                        </div>
                    )}
                </div>

                <div className="skill-content">
                    <h3 className="skill-name">{skill.name}</h3>
                    <div className="skill-description-wrapper">
                        <p className={`skill-description ${isExpanded ? 'expanded' : ''}`}>
                            {isExpanded ? skill.description : skill.shortDescription}
                        </p>
                        {skill.description.length > skill.shortDescription.length && (
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
                    <span className="skill-category">
                        {skill.category}
                    </span>

                    <div className="skill-actions" onClick={e => e.stopPropagation()}>
                        <button
                            className="action-btn"
                            onClick={() => onEdit(skill)}
                            title="Edit Skill"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            className="action-btn archive-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to archive this skill?')) {
                                    onDelete(skill.id);
                                }
                            }}
                            title="Archive Skill"
                        >
                            <Archive size={14} />
                        </button>
                        {skill.references && skill.references.length > 0 && skill.references[0].startsWith('http') && (
                            <a
                                href={skill.references[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn github-btn"
                                title="View Reference"
                                onClick={e => e.stopPropagation()}
                            >
                                <ExternalLink size={14} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </Tooltip>
    );
}
