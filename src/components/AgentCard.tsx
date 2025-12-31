import React, { useRef, useState } from 'react';
import { Edit2, Archive, Check, ChevronDown, ChevronUp, ExternalLink, Star } from 'lucide-react';
import type { Agent } from '../types';
import { Tooltip } from './Tooltip';
import './SkillCard.css';

// Map plugin categories to emojis for visual variety
const PLUGIN_ICONS: Record<string, string> = {
    'accessibility-compliance': '♿',
    'agent-orchestration': '🎯',
    'api-scaffolding': '🔌',
    'api-testing-observability': '📡',
    'application-performance': '⚡',
    'arm-cortex-microcontrollers': '🔧',
    'backend-api-security': '🔐',
    'backend-development': '⚙️',
    'blockchain-web3': '🔗',
    'business-analytics': '📊',
    'c4-architecture': '🏗️',
    'cicd-automation': '🚀',
    'cloud-infrastructure': '☁️',
    'code-documentation': '📝',
    'code-refactoring': '🔄',
    'code-review-ai': '🔍',
    'codebase-cleanup': '🧹',
    'comprehensive-review': '📋',
    'content-marketing': '📢',
    'context-management': '🧠',
    'customer-sales-automation': '💼',
    'data-engineering': '🗄️',
    'data-validation-suite': '✅',
    'database-cloud-optimization': '💾',
    'database-design': '🗃️',
    'database-migrations': '📦',
    'debugging-toolkit': '🐛',
    'dependency-management': '📚',
    'deployment-strategies': '🎢',
    'deployment-validation': '✔️',
    'distributed-debugging': '🔬',
    'documentation-generation': '📖',
    'error-debugging': '🚨',
    'error-diagnostics': '🩺',
    'framework-migration': '🔀',
    'frontend-mobile-development': '📱',
    'frontend-mobile-security': '🛡️',
    'full-stack-orchestration': '🎼',
    'functional-programming': 'λ',
    'game-development': '🎮',
    'git-pr-workflows': '🌿',
    'hr-legal-compliance': '⚖️',
    'incident-response': '🚒',
    'javascript-typescript': '🟨',
};

function getAgentIcon(plugin: string): string {
    return PLUGIN_ICONS[plugin] || '🤖';
}

// Construct GitHub URL from agent path
function getAgentGithubUrl(agent: Agent): string {
    return `https://github.com/anthropics/anthropic-cookbook/tree/main/tool_use/claude_code/${agent.path}`;
}

interface AgentCardProps {
    agent: Agent;
    isSelected: boolean;
    isFavorite?: boolean;
    onClick: () => void;
    onEdit: (agent: Agent) => void;
    onDelete: (agent: Agent) => void;
    onToggleFavorite?: (id: string) => void;
}

export function AgentCard({ agent, isSelected, isFavorite, onClick, onEdit, onDelete, onToggleFavorite }: AgentCardProps) {
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

    const hasFullDescription = agent.description.length > agent.shortDescription.length;

    return (
        <Tooltip content={agent.description} maxWidth={400}>
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
                            onToggleFavorite(agent.id);
                        }}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                )}
                <div className="skill-header">
                    <div className="skill-icon">
                        {getAgentIcon(agent.plugin)}
                    </div>
                    {isSelected && (
                        <div className="skill-check">
                            <Check size={14} strokeWidth={3} />
                        </div>
                    )}
                </div>

                <div className="skill-content">
                    <h3 className="skill-name">{agent.name}</h3>
                    <div className="skill-description-wrapper">
                        <p className={`skill-description ${isExpanded ? 'expanded' : ''}`}>
                            {isExpanded ? agent.description : agent.shortDescription}
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
                    <span className="skill-category">
                        {agent.plugin}
                    </span>

                    <div className="skill-actions" onClick={e => e.stopPropagation()}>
                        <button
                            className="action-btn"
                            onClick={() => onEdit(agent)}
                            title="Edit Agent"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            className="action-btn archive-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Are you sure you want to archive agent "${agent.name}"?`)) {
                                    onDelete(agent);
                                }
                            }}
                            title="Archive Agent"
                        >
                            <Archive size={14} />
                        </button>
                        <a
                            href={getAgentGithubUrl(agent)}
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
