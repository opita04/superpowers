import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PROJECT_ROOT, 'skills');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'generatedSkills.ts');

// Category mapping based on skill content/name patterns
const CATEGORY_MAP: Record<string, string> = {
    'test-driven-development': 'testing',
    'webapp-testing': 'testing',
    'systematic-debugging': 'debugging',
    'verification-before-completion': 'debugging',
    'brainstorming': 'collaboration',
    'writing-plans': 'collaboration',
    'executing-plans': 'collaboration',
    'subagent-driven-development': 'collaboration',
    'dispatching-parallel-agents': 'collaboration',
    'requesting-code-review': 'collaboration',
    'receiving-code-review': 'collaboration',
    'using-git-worktrees': 'collaboration',
    'finishing-a-development-branch': 'collaboration',
    'writing-skills': 'meta',
    'using-superpowers': 'meta',
    'skill-creator': 'meta',
    'algorithmic-art': 'creative',
    'slack-gif-creator': 'creative',
    'brand-guidelines': 'design',
    'canvas-design': 'design',
    'frontend-design': 'design',
    'theme-factory': 'design',
    'doc-coauthoring': 'productivity',
    'docx': 'productivity',
    'pdf': 'productivity',
    'pptx': 'productivity',
    'xlsx': 'productivity',
    'internal-comms': 'communication',
    'mcp-builder': 'coding',
    'web-artifacts-builder': 'coding',
};

// Icons for skills
const ICON_MAP: Record<string, string> = {
    'test-driven-development': '🧪',
    'webapp-testing': '🧪',
    'systematic-debugging': '🔍',
    'verification-before-completion': '✅',
    'brainstorming': '💡',
    'writing-plans': '📝',
    'executing-plans': '▶️',
    'subagent-driven-development': '🤖',
    'dispatching-parallel-agents': '⚡',
    'requesting-code-review': '📤',
    'receiving-code-review': '📥',
    'using-git-worktrees': '🌳',
    'finishing-a-development-branch': '🏁',
    'writing-skills': '✍️',
    'using-superpowers': '🦸',
    'skill-creator': '✨',
    'algorithmic-art': '🎨',
    'slack-gif-creator': '🎞️',
    'brand-guidelines': '🏷️',
    'canvas-design': '🖼️',
    'frontend-design': '💅',
    'theme-factory': '🎭',
    'doc-coauthoring': '🤝',
    'docx': '📄',
    'pdf': '📑',
    'pptx': '📊',
    'xlsx': '📉',
    'internal-comms': '📢',
    'mcp-builder': '🛠️',
    'web-artifacts-builder': '🏗️',
};

interface SkillData {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    longDescription: string;
    category: string;
    references: string[];
    icon: string;
}

function generateShortDescription(text: string, maxLength = 150): string {
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
    // Normalize line endings to LF (handles Windows CRLF)
    const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    const match = normalizedContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
        return { frontmatter: {}, body: normalizedContent };
    }

    const frontmatterLines = match[1].split('\n');
    const frontmatter: Record<string, string> = {};
    for (const line of frontmatterLines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
            const key = line.substring(0, colonIdx).trim();
            const value = line.substring(colonIdx + 1).trim();
            frontmatter[key] = value;
        }
    }

    return { frontmatter, body: match[2].trim() };
}

function formatName(id: string): string {
    return id
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const skills: SkillData[] = [];

console.log(`Scanning skills in: ${SKILLS_DIR}`);

if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`Skills directory not found: ${SKILLS_DIR}`);
    process.exit(1);
}

const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
);

for (const skillId of skillDirs) {
    const skillFile = path.join(SKILLS_DIR, skillId, 'skill.md');

    if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, 'utf-8');
        const { frontmatter, body } = parseFrontmatter(content);

        const githubUrl = `https://github.com/anthropics/skills/tree/main/skills/${skillId}`;
        const description = frontmatter.description || '';
        skills.push({
            id: skillId,
            name: frontmatter.name || formatName(skillId),
            description: description,
            shortDescription: generateShortDescription(description),
            longDescription: body,
            category: CATEGORY_MAP[skillId] || 'coding',
            references: [githubUrl],
            icon: ICON_MAP[skillId] || '⚡',
        });
    }
}

const fileContent = `// Auto-generated by scripts/generate-skills-index.ts
// Do not edit manually

import type { Skill } from '../types';

export const GENERATED_SKILLS: Skill[] = ${JSON.stringify(skills, null, 4)};
`;

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, fileContent);
console.log(`Generated index for ${skills.length} skills at ${OUTPUT_FILE}`);
