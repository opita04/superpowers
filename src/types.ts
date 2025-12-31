export type SkillCategory = 'testing' | 'debugging' | 'collaboration' | 'meta' | 'creative' | 'productivity' | 'design' | 'communication' | 'coding';

export interface Skill {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    longDescription?: string;
    category: SkillCategory;
    references: string[];
    icon: string;
    isArchived?: boolean;
}

export interface Settings {
    superpowersPath: string;
}

export type AppMode = 'skills' | 'agents' | 'plugins' | 'archive';

export interface Plugin {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    contents: string;
    githubUrl: string;
    icon: string;
    isArchived?: boolean;
}

export interface Agent {
    plugin: string;
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    model: string;
    path: string;
    isArchived?: boolean;
}


export const CATEGORY_INFO: Record<SkillCategory, { label: string; color: string }> = {
    testing: { label: 'Testing', color: 'var(--cat-testing)' },
    debugging: { label: 'Debugging', color: 'var(--cat-debugging)' },
    collaboration: { label: 'Collaboration', color: 'var(--cat-collaboration)' },
    meta: { label: 'Meta', color: 'var(--cat-meta)' },
    creative: { label: 'Creative', color: 'var(--cat-creative)' },
    productivity: { label: 'Productivity', color: 'var(--cat-productivity)' },
    design: { label: 'Design', color: 'var(--cat-design)' },
    communication: { label: 'Communication', color: 'var(--cat-communication)' },
    coding: { label: 'Coding', color: 'var(--cat-coding)' }
};
