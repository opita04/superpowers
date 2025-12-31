import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Skill, Agent, Plugin, AppMode } from '../types';
import { GENERATED_SKILLS } from '../data/generatedSkills';
import { GENERATED_AGENTS } from '../data/generatedAgents';
import { GENERATED_PLUGINS } from '../data/generatedPlugins';

interface AppStore {
    skills: Skill[];
    agents: Agent[];
    plugins: Plugin[];
    mode: AppMode;
    selectedSkill: Skill | null;
    selectedAgent: Agent | null;
    selectedPlugin: Plugin | null;
    userGoal: string;
    setMode: (mode: AppMode) => void;
    setSelectedSkill: (skill: Skill | null) => void;
    setSelectedAgent: (agent: Agent | null) => void;
    setSelectedPlugin: (plugin: Plugin | null) => void;
    setUserGoal: (goal: string) => void;
    addSkill: (skill: Skill) => void;
    updateSkill: (skill: Skill) => void;
    deleteSkill: (id: string) => void;
    deleteAgent: (agent: Agent) => void;
    deletePlugin: (plugin: Plugin) => void;
    resetSkills: () => void;
    reset: () => void;
    viewMode: 'grid' | 'list';
    setViewMode: (viewMode: 'grid' | 'list') => void;
    // Favorites
    favoriteSkillIds: string[];
    favoriteAgentIds: string[];
    favoritePluginIds: string[];
    toggleFavoriteSkill: (id: string) => void;
    toggleFavoriteAgent: (id: string) => void;
    toggleFavoritePlugin: (id: string) => void;
}

export const useAppStore = create<AppStore>()(
    persist(
        (set) => ({
            skills: GENERATED_SKILLS,
            agents: GENERATED_AGENTS,
            plugins: GENERATED_PLUGINS,
            mode: 'skills',
            viewMode: 'grid',
            selectedSkill: null,
            selectedAgent: null,
            selectedPlugin: null,
            userGoal: '',
            // Favorites
            favoriteSkillIds: [],
            favoriteAgentIds: [],
            favoritePluginIds: [],
            setMode: (mode) => set({ mode, selectedSkill: null, selectedAgent: null, selectedPlugin: null }),
            setViewMode: (viewMode) => set({ viewMode }),
            setSelectedSkill: (skill) => set({ selectedSkill: skill }),
            setSelectedAgent: (agent) => set({ selectedAgent: agent }),
            setSelectedPlugin: (plugin) => set({ selectedPlugin: plugin }),
            setUserGoal: (goal) => set({ userGoal: goal }),
            addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
            updateSkill: (updatedSkill) => set((state) => ({
                skills: state.skills.map(s => s.id === updatedSkill.id ? updatedSkill : s)
            })),
            deleteSkill: (id) => {
                set((state) => ({
                    skills: state.skills.map(s => s.id === id ? { ...s, isArchived: true } : s),
                    selectedSkill: state.selectedSkill?.id === id ? null : state.selectedSkill
                }));
                fetch('/api/archive', {
                    method: 'POST',
                    body: JSON.stringify({ type: 'skill', id })
                }).catch(console.error);
            },
            deleteAgent: (agent) => {
                set((state) => ({
                    agents: state.agents.map(a => a.id === agent.id && a.plugin === agent.plugin ? { ...a, isArchived: true } : a),
                    selectedAgent: state.selectedAgent?.id === agent.id ? null : state.selectedAgent
                }));
                fetch('/api/archive', {
                    method: 'POST',
                    body: JSON.stringify({ type: 'agent', path: agent.path })
                }).catch(console.error);
            },
            deletePlugin: (plugin) => {
                set((state) => ({
                    plugins: state.plugins.map(p => p.id === plugin.id ? { ...p, isArchived: true } : p),
                    selectedPlugin: state.selectedPlugin?.id === plugin.id ? null : state.selectedPlugin
                }));
                fetch('/api/archive', {
                    method: 'POST',
                    body: JSON.stringify({ type: 'plugin', id: plugin.id })
                }).catch(console.error);
            },
            resetSkills: () => set({ skills: GENERATED_SKILLS }),
            reset: () => set({ selectedSkill: null, selectedAgent: null, selectedPlugin: null, userGoal: '' }),
            // Favorites toggles
            toggleFavoriteSkill: (id) => set((state) => ({
                favoriteSkillIds: state.favoriteSkillIds.includes(id)
                    ? state.favoriteSkillIds.filter(fid => fid !== id)
                    : [...state.favoriteSkillIds, id]
            })),
            toggleFavoriteAgent: (id) => set((state) => ({
                favoriteAgentIds: state.favoriteAgentIds.includes(id)
                    ? state.favoriteAgentIds.filter(fid => fid !== id)
                    : [...state.favoriteAgentIds, id]
            })),
            toggleFavoritePlugin: (id) => set((state) => ({
                favoritePluginIds: state.favoritePluginIds.includes(id)
                    ? state.favoritePluginIds.filter(fid => fid !== id)
                    : [...state.favoritePluginIds, id]
            })),
        }),
        {
            name: 'superpowers-store',
            partialize: (state) => ({
                skills: state.skills,
                userGoal: state.userGoal,
                mode: state.mode,
                viewMode: state.viewMode,
                selectedSkill: state.selectedSkill,
                selectedAgent: state.selectedAgent,
                selectedPlugin: state.selectedPlugin,
                favoriteSkillIds: state.favoriteSkillIds,
                favoriteAgentIds: state.favoriteAgentIds,
                favoritePluginIds: state.favoritePluginIds,
            }),
        }
    )
);
