import { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Zap, Settings } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useSettingsStore } from '../stores/settingsStore';
import './PromptBuilder.css';

interface PromptBuilderProps {
    onOpenSettings: () => void;
}

export function PromptBuilder({ onOpenSettings }: PromptBuilderProps) {
    const { selectedSkill, userGoal, setUserGoal, skills, mode, selectedAgent, selectedPlugin } = useAppStore();
    const { superpowersPath } = useSettingsStore();
    const [copied, setCopied] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    useEffect(() => {
        if (mode === 'plugins') {
            if (!selectedPlugin) {
                setGeneratedPrompt('');
                return;
            }
            // For plugins, generate install/use instructions with goal injected
            const goalText = userGoal || '[Enter your goal above]';
            const instructions = selectedPlugin.installInstructions.replace(/\[YOUR_GOAL\]/g, goalText);
            const prompt = `${instructions}\n\n### Your Goal:\n${goalText}`;
            setGeneratedPrompt(prompt);
        } else if (mode === 'agents') {
            if (!selectedAgent) {
                setGeneratedPrompt('');
                return;
            }
            // Agent paths are relative from project root in generated data
            const agentPath = `${superpowersPath}/${selectedAgent.path}`;
            const prompt = `@${agentPath}\n\nGoal: ${userGoal || '[Enter goal]'}`;
            setGeneratedPrompt(prompt);
        } else {
            if (!selectedSkill) {
                setGeneratedPrompt('');
                return;
            }

            const skillPath = `${superpowersPath}/skills/${selectedSkill.id}/SKILL.md`;
            let prompt = `Use the superpowers:${selectedSkill.id} skill to: ${userGoal || '[Enter your goal above]'}\n\n`;
            prompt += `Skill location: ${skillPath}\n`;

            if (selectedSkill.references && selectedSkill.references.length > 0) {
                prompt += `\nReferenced skills:\n`;
                selectedSkill.references.forEach(refId => {
                    const refSkill = skills.find(s => s.id === refId);
                    if (refSkill) {
                        prompt += `- superpowers:${refId} → ${superpowersPath}/skills/${refId}/SKILL.md\n`;
                    }
                });
            }
            setGeneratedPrompt(prompt);
        }
    }, [selectedSkill, selectedAgent, selectedPlugin, userGoal, mode, skills, superpowersPath]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const hasSelection =
        (mode === 'skills' && selectedSkill) ||
        (mode === 'agents' && selectedAgent) ||
        (mode === 'plugins' && selectedPlugin) ||
        (mode === 'archive' && (selectedSkill || selectedAgent || selectedPlugin));

    // Get the appropriate icon and name based on mode
    const getSelectionIcon = () => {
        if (mode === 'skills' || selectedSkill) return selectedSkill?.icon;
        if (mode === 'agents' || selectedAgent) return '🤖';
        if (mode === 'plugins' || selectedPlugin) return selectedPlugin?.icon;
        return '❓';
    };

    const getSelectionName = () => {
        if (selectedSkill) return selectedSkill.name;
        if (selectedAgent) return selectedAgent.name;
        if (selectedPlugin) return selectedPlugin.name;
        return '';
    };

    const getModeLabel = () => {
        if (mode === 'skills' || selectedSkill) return 'Skill';
        if (mode === 'agents' || selectedAgent) return 'Agent';
        if (mode === 'plugins' || selectedPlugin) return 'Plugin';
        return 'Item';
    };

    return (
        <div className="prompt-builder">
            <div className="builder-header">
                <div className="builder-icon">
                    <Terminal size={20} />
                </div>
                <h2 className="builder-title">Prompt Engine</h2>
            </div>

            {!hasSelection ? (
                <div className="builder-empty">
                    <div className="empty-icon">
                        <Zap size={48} strokeWidth={1} />
                    </div>
                    <p>Select a {getModeLabel().toLowerCase()} from the right to begin constructing your prompt.</p>
                </div>
            ) : (
                <div className="builder-content">
                    {/* Selected Item Badge */}
                    <div className="selected-skill-section">
                        <div className="selected-icon">
                            {getSelectionIcon()}
                        </div>
                        <div>
                            <div className="section-label">Active {getModeLabel()}</div>
                            <div style={{ fontWeight: 600 }}>
                                {getSelectionName()}
                            </div>
                        </div>
                    </div>

                    {/* Goal Input */}
                    <div className="input-section">
                        <label className="section-label">Your Goal / Context</label>
                        <textarea
                            className="goal-input"
                            placeholder="Describe what you want to achieve..."
                            value={userGoal}
                            onChange={(e) => setUserGoal(e.target.value)}
                            rows={1}
                            style={{ height: 'auto', minHeight: '40px' }}
                            onInput={(e) => {
                                e.currentTarget.style.height = 'auto';
                                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                            }}
                        />
                    </div>

                    {/* Output Terminal */}
                    <div className="output-section">
                        <div className="output-header">
                            <span className="section-label">Generated Prompt</span>
                            <button
                                className={`copy-btn ${copied ? 'copied' : ''}`}
                                onClick={handleCopy}
                                disabled={!generatedPrompt}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'COPIED' : 'COPY'}
                            </button>
                        </div>
                        <div className="terminal-window">
                            <div className="prompt-content">
                                {generatedPrompt || <span style={{ opacity: 0.3 }}>// Awaiting input...</span>}
                            </div>

                            {/* Item Info Footer inside terminal */}
                            {(mode === 'skills' ? selectedSkill : mode === 'agents' ? selectedAgent : selectedPlugin) && (
                                <div style={{
                                    marginTop: 'var(--space-md)',
                                    paddingTop: 'var(--space-sm)',
                                    borderTop: '1px dashed #333',
                                    color: '#555',
                                    fontSize: '0.7rem'
                                }}>
                                    Target: {mode === 'skills' ?
                                        `skills/${selectedSkill?.id}/SKILL.md` :
                                        mode === 'agents' ?
                                            selectedAgent?.path :
                                            selectedPlugin?.sourcePath
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="builder-footer">
                <button
                    className="settings-trigger-btn"
                    onClick={onOpenSettings}
                    title="Settings"
                >
                    <Settings size={18} />
                </button>
            </div>
        </div>
    );
}
