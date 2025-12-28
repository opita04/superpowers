import { useState, useMemo } from 'react';
import { CATEGORY_INFO, type SkillCategory, type Skill, type Agent } from '../types';
import { useAppStore } from '../stores/appStore';
import { SkillCard } from './SkillCard';
import { AgentCard } from './AgentCard';
import { PluginCard } from './PluginCard';
import { Search, LayoutGrid, List } from 'lucide-react';
import { EditSkillModal } from './EditSkillModal';
import './SkillPicker.css';

const categories: SkillCategory[] = ['collaboration', 'testing', 'debugging', 'meta'];

// Agent category definitions - broad, meaningful categories
type AgentCategory = 'backend' | 'frontend' | 'devops' | 'testing' | 'security' | 'documentation' | 'code-quality' | 'database' | 'languages' | 'business' | 'ai-ml';

const AGENT_CATEGORIES: Record<AgentCategory, { label: string; icon: string }> = {
    'backend': { label: 'Backend', icon: '⚙️' },
    'frontend': { label: 'Frontend', icon: '🎨' },
    'devops': { label: 'DevOps', icon: '🚀' },
    'testing': { label: 'Testing', icon: '🧪' },
    'security': { label: 'Security', icon: '🔐' },
    'documentation': { label: 'Docs', icon: '📖' },
    'code-quality': { label: 'Code Quality', icon: '✨' },
    'database': { label: 'Database', icon: '🗄️' },
    'languages': { label: 'Languages', icon: '💻' },
    'business': { label: 'Business', icon: '💼' },
    'ai-ml': { label: 'AI & ML', icon: '🤖' },
};

// Map agent names to broad categories based on what they actually do
function getAgentCategory(agent: Agent): AgentCategory {
    const name = agent.name.toLowerCase();
    const desc = agent.description.toLowerCase();

    // Backend development
    if (name.includes('backend') || name.includes('graphql') ||
        name.includes('django') || name.includes('fastapi') ||
        name.includes('temporal') || name.includes('payment')) {
        return 'backend';
    }

    // Frontend & Mobile
    if (name.includes('frontend') || name.includes('mobile') ||
        name.includes('flutter') || name.includes('ios') ||
        name.includes('android') || name.includes('ui-ux') ||
        name.includes('ui-visual')) {
        return 'frontend';
    }

    // DevOps & Infrastructure
    if (name.includes('deploy') || name.includes('kubernetes') ||
        name.includes('terraform') || name.includes('cloud') ||
        name.includes('network') || name.includes('devops') ||
        name.includes('incident') || name.includes('observability') ||
        name.includes('performance') && desc.includes('infrastructure')) {
        return 'devops';
    }

    // Testing & Debugging
    if (name.includes('test') || name.includes('debug') ||
        name.includes('tdd') || name.includes('error')) {
        return 'testing';
    }

    // Security
    if (name.includes('security') || name.includes('audit')) {
        return 'security';
    }

    // Documentation
    if (name.includes('doc') || name.includes('tutorial') ||
        name.includes('mermaid') || name.includes('reference') ||
        name.includes('c4-')) {
        return 'documentation';
    }

    // Code Quality & Architecture
    if (name.includes('review') || name.includes('architect') ||
        name.includes('legacy') || name.includes('refactor') ||
        name.includes('dx-optimizer')) {
        return 'code-quality';
    }

    // Database
    if (name.includes('database') || name.includes('sql') ||
        name.includes('data-engineer')) {
        return 'database';
    }

    // AI & ML
    if (name.includes('context-manager') || name.includes('ml') ||
        desc.includes('ai-powered') || desc.includes('machine learning')) {
        return 'ai-ml';
    }

    // Business & Marketing
    if (name.includes('business') || name.includes('content') ||
        name.includes('seo') || name.includes('sales') ||
        name.includes('customer') || name.includes('hr') ||
        name.includes('legal') || name.includes('search-specialist')) {
        return 'business';
    }

    // Programming Languages (language-specific experts)
    if (name.includes('-pro') || name.includes('blockchain') ||
        name.includes('unity') || name.includes('minecraft') ||
        name.includes('game')) {
        return 'languages';
    }

    // Default fallback
    return 'backend';
}

export function SkillPicker() {
    const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
    const [activeAgentCategory, setActiveAgentCategory] = useState<AgentCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);

    // Use skills from store to allow for future dynamic updates
    const {
        skills, selectedSkill, setSelectedSkill, deleteSkill,
        agents, selectedAgent, setSelectedAgent, deleteAgent,
        plugins, selectedPlugin, setSelectedPlugin, deletePlugin,
        favoriteSkillIds, favoriteAgentIds, favoritePluginIds,
        toggleFavoriteSkill, toggleFavoriteAgent, toggleFavoritePlugin,
        mode, setMode,
        viewMode, setViewMode
    } = useAppStore();

    // Group agents by category and get counts
    const agentsByCategory = useMemo(() => {
        const grouped: Record<AgentCategory | 'all', Agent[]> = {
            'all': agents,
            'backend': [],
            'frontend': [],
            'devops': [],
            'testing': [],
            'security': [],
            'documentation': [],
            'code-quality': [],
            'database': [],
            'languages': [],
            'business': [],
            'ai-ml': [],
        };

        agents.forEach(agent => {
            const cat = getAgentCategory(agent);
            grouped[cat].push(agent);
        });

        return grouped;
    }, [agents]);

    // Get categories that have agents (sorted by count descending)
    const activeAgentCategories = useMemo(() => {
        return (Object.keys(AGENT_CATEGORIES) as AgentCategory[])
            .filter(cat => agentsByCategory[cat].length > 0)
            .sort((a, b) => agentsByCategory[b].length - agentsByCategory[a].length);
    }, [agentsByCategory]);

    // Filtering logic
    const filteredSkills = mode === 'skills' ? skills.filter(skill => {
        const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
        const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        const aFav = favoriteSkillIds.includes(a.id) ? 0 : 1;
        const bFav = favoriteSkillIds.includes(b.id) ? 0 : 1;
        return aFav - bFav;
    }) : [];

    const filteredAgents = mode === 'agents' ? agents.filter(agent => {
        const agentCat = getAgentCategory(agent);
        const matchesCategory = activeAgentCategory === 'all' || agentCat === activeAgentCategory;
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.plugin.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        const aFav = favoriteAgentIds.includes(a.id) ? 0 : 1;
        const bFav = favoriteAgentIds.includes(b.id) ? 0 : 1;
        return aFav - bFav;
    }) : [];

    const filteredPlugins = mode === 'plugins' ? plugins.filter(plugin => {
        const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plugin.contents.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    }).sort((a, b) => {
        const aFav = favoritePluginIds.includes(a.id) ? 0 : 1;
        const bFav = favoritePluginIds.includes(b.id) ? 0 : 1;
        return aFav - bFav;
    }) : [];

    // ... (handlers unchanged)
    const handleEditSkill = (skill: Skill) => {
        setSkillToEdit(skill);
        setIsEditModalOpen(true);
    };

    const handleAddSkill = () => {
        setSkillToEdit(null);
        setIsEditModalOpen(true);
    };

    return (
        <div className="skill-picker">
            <div className="picker-header">
                <div className="picker-title-row">
                    <div>
                        <h2 className="picker-title">
                            {mode === 'skills' ? 'Superpowers' : mode === 'agents' ? 'Intelligence' : 'Plugins'}
                        </h2>
                        <p className="picker-subtitle">
                            {mode === 'skills'
                                ? 'Select a specialized capability to enhance your workflow.'
                                : mode === 'agents'
                                    ? 'Deploy an autonomous agent for complex tasks.'
                                    : 'Official Claude Code plugins from Anthropic.'
                            }
                        </p>
                    </div>
                    <div className="mode-toggle">
                        <button
                            className={`mode-btn ${mode === 'skills' ? 'active' : ''}`}
                            onClick={() => setMode('skills')}
                        >
                            Skills
                        </button>
                        <button
                            className={`mode-btn ${mode === 'agents' ? 'active' : ''}`}
                            onClick={() => setMode('agents')}
                        >
                            Agents
                        </button>
                        <button
                            className={`mode-btn ${mode === 'plugins' ? 'active' : ''}`}
                            onClick={() => setMode('plugins')}
                        >
                            Plugins
                        </button>
                    </div>
                </div>
            </div>

            <div className="search-bar-row">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder={mode === 'skills' ? "Search for a capability..." : mode === 'agents' ? "Search for an agent..." : "Search for a plugin..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="view-toggle">
                    <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {mode === 'skills' && (
                <div className="category-tabs">
                    <button
                        className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        <span className="tab-icon">✦</span>
                        All
                        <span className="tab-count">{skills.length}</span>
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {CATEGORY_INFO[cat].label}
                            <span className="tab-count">
                                {skills.filter(s => s.category === cat).length}
                            </span>
                        </button>
                    ))}
                    <button className="add-skill-btn" onClick={handleAddSkill}>
                        + Add Custom
                    </button>
                </div>
            )}

            {mode === 'agents' && (
                <div className="category-tabs">
                    <button
                        className={`category-tab ${activeAgentCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveAgentCategory('all')}
                    >
                        <span className="tab-icon">✦</span>
                        All
                        <span className="tab-count">{agents.length}</span>
                    </button>
                    {activeAgentCategories.map(cat => (
                        <button
                            key={cat}
                            className={`category-tab ${activeAgentCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveAgentCategory(cat)}
                        >
                            <span className="tab-icon">{AGENT_CATEGORIES[cat].icon}</span>
                            {AGENT_CATEGORIES[cat].label}
                            <span className="tab-count">
                                {agentsByCategory[cat].length}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <div className={`skills-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {mode === 'skills' && filteredSkills.map((skill, index) => (
                    <div
                        key={skill.id}
                        className="skill-item"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <SkillCard
                            skill={skill}
                            isSelected={selectedSkill?.id === skill.id}
                            isFavorite={favoriteSkillIds.includes(skill.id)}
                            onClick={() => setSelectedSkill(
                                selectedSkill?.id === skill.id ? null : skill
                            )}
                            onEdit={handleEditSkill}
                            onDelete={deleteSkill}
                            onToggleFavorite={toggleFavoriteSkill}
                        />
                    </div>
                ))}

                {mode === 'agents' && filteredAgents.map((agent, index) => (
                    <div
                        key={agent.id + agent.plugin}
                        className="skill-item"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <AgentCard
                            agent={agent}
                            isSelected={selectedAgent?.id === agent.id}
                            isFavorite={favoriteAgentIds.includes(agent.id)}
                            onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                            onEdit={(agent) => {
                                // Placeholder for agent edit functionality
                                console.log('Edit agent:', agent.name);
                            }}
                            onDelete={deleteAgent}
                            onToggleFavorite={toggleFavoriteAgent}
                        />
                    </div>
                ))}

                {mode === 'plugins' && filteredPlugins.map((plugin, index) => (
                    <div
                        key={plugin.id}
                        className="skill-item"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <PluginCard
                            plugin={plugin}
                            isSelected={selectedPlugin?.id === plugin.id}
                            isFavorite={favoritePluginIds.includes(plugin.id)}
                            onClick={() => setSelectedPlugin(selectedPlugin?.id === plugin.id ? null : plugin)}
                            onEdit={(plugin) => {
                                // Placeholder for plugin edit functionality
                                console.log('Edit plugin:', plugin.name);
                            }}
                            onDelete={deletePlugin}
                            onToggleFavorite={toggleFavoritePlugin}
                        />
                    </div>
                ))}

                {((mode === 'skills' && filteredSkills.length === 0) ||
                    (mode === 'agents' && filteredAgents.length === 0) ||
                    (mode === 'plugins' && filteredPlugins.length === 0)) && searchQuery && (
                        <div className="no-results">
                            <Search size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                            <p>No results found for "{searchQuery}"</p>
                        </div>
                    )}
            </div>

            {isEditModalOpen && (
                <EditSkillModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    editingSkill={skillToEdit}
                />
            )}
        </div>
    );
}
