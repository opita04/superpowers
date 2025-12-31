import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PLUGINS_DIR = path.join(PROJECT_ROOT, 'agents', 'plugins');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'generatedPlugins.ts');

// Icons for plugins based on category/name patterns
const ICON_MAP: Record<string, string> = {
    'accessibility': '♿',
    'agent': '🤖',
    'api': '🔌',
    'backend': '⚙️',
    'blockchain': '⛓️',
    'business': '📊',
    'cicd': '🔄',
    'cloud': '☁️',
    'code-review': '👁️',
    'code': '💻',
    'commit': '📦',
    'data': '📈',
    'database': '🗄️',
    'debugging': '🔍',
    'deployment': '🚀',
    'developer': '👨‍💻',
    'documentation': '📚',
    'error': '❌',
    'feature': '✨',
    'framework': '🏗️',
    'frontend': '🎨',
    'game': '🎮',
    'git': '🌳',
    'hookify': '🪝',
    'hr': '👥',
    'incident': '🚨',
    'javascript': '🟨',
    'julia': '🔬',
    'jvm': '☕',
    'kubernetes': '🐳',
    'learning': '🎓',
    'llm': '🧠',
    'machine-learning': '🤖',
    'mobile': '📱',
    'observability': '📡',
    'payment': '💳',
    'performance': '⚡',
    'plugin': '🔌',
    'pr-review': '📋',
    'python': '🐍',
    'quantitative': '📉',
    'ralph': '🔁',
    'security': '🔐',
    'seo': '🔎',
    'shell': '🐚',
    'systems': '🖥️',
    'tdd': '🧪',
    'team': '👥',
    'testing': '🧪',
    'unit': '🧪',
    'web': '🌐',
};

interface ComponentInfo {
    name: string;
    description: string;
    file: string;
}

interface PluginData {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    sourcePath: string;
    components: {
        agents: ComponentInfo[];
        commands: ComponentInfo[];
        skills: ComponentInfo[];
    };
    installInstructions: string;
    icon: string;
    isArchived?: boolean;
}

function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
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

function getIcon(pluginId: string): string {
    for (const [pattern, icon] of Object.entries(ICON_MAP)) {
        if (pluginId.includes(pattern)) {
            return icon;
        }
    }
    return '📦';
}

function generateShortDescription(text: string, maxLength = 100): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

function scanDirectory(dir: string, type: 'agents' | 'commands' | 'skills'): ComponentInfo[] {
    const components: ComponentInfo[] = [];

    if (!fs.existsSync(dir)) {
        return components;
    }

    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
        const entryPath = path.join(dir, entry);
        const stat = fs.statSync(entryPath);

        if (type === 'skills' && stat.isDirectory()) {
            // Skills are in subdirectories with SKILL.md or skill.md
            const skillFile = fs.existsSync(path.join(entryPath, 'SKILL.md'))
                ? path.join(entryPath, 'SKILL.md')
                : path.join(entryPath, 'skill.md');

            if (fs.existsSync(skillFile)) {
                const content = fs.readFileSync(skillFile, 'utf-8');
                const { frontmatter, body } = parseFrontmatter(content);
                components.push({
                    name: frontmatter.name || formatName(entry),
                    description: frontmatter.description || body.split('\n')[0] || '',
                    file: entry
                });
            }
        } else if (stat.isFile() && entry.endsWith('.md') && !entry.toLowerCase().includes('readme')) {
            // Agents and commands are direct .md files
            const content = fs.readFileSync(entryPath, 'utf-8');
            const { frontmatter, body } = parseFrontmatter(content);
            const name = frontmatter.name || formatName(entry.replace('.md', ''));
            components.push({
                name,
                description: frontmatter.description || body.split('\n')[0] || '',
                file: entry
            });
        }
    }

    return components;
}

function generateInstallInstructions(plugin: PluginData): string {
    const lines: string[] = [];
    lines.push(`## Plugin: ${plugin.name}`);
    lines.push('');
    lines.push(`**Source:** \`${plugin.sourcePath}\``);
    lines.push('');
    lines.push('### Install:');
    lines.push('Copy the plugin contents to your project root:');
    lines.push('');
    lines.push('```');
    lines.push('.instructions/');

    if (plugin.components.agents.length > 0) {
        lines.push('├── agents/');
        plugin.components.agents.forEach((a, i, arr) => {
            const prefix = i === arr.length - 1 && plugin.components.commands.length === 0 && plugin.components.skills.length === 0 ? '└──' : '├──';
            lines.push(`│   ${prefix} ${a.file}`);
        });
    }

    if (plugin.components.commands.length > 0) {
        lines.push('├── commands/');
        plugin.components.commands.forEach((c, i, arr) => {
            const prefix = i === arr.length - 1 && plugin.components.skills.length === 0 ? '└──' : '├──';
            lines.push(`│   ${prefix} ${c.file}`);
        });
    }

    if (plugin.components.skills.length > 0) {
        lines.push('└── skills/');
        plugin.components.skills.forEach((s, i, arr) => {
            const prefix = i === arr.length - 1 ? '└──' : '├──';
            lines.push(`    ${prefix} ${s.file}/`);
        });
    }

    lines.push('```');
    lines.push('');
    lines.push('### Available:');

    if (plugin.components.agents.length > 0) {
        lines.push(`- **Agents:** ${plugin.components.agents.map(a => `\`${a.name}\``).join(', ')}`);
    }
    if (plugin.components.commands.length > 0) {
        lines.push(`- **Commands:** ${plugin.components.commands.map(c => `\`/${c.file.replace('.md', '')}\``).join(', ')}`);
    }
    if (plugin.components.skills.length > 0) {
        lines.push(`- **Skills:** ${plugin.components.skills.map(s => `\`${s.name}\``).join(', ')}`);
    }

    return lines.join('\n');
}

function generatePluginDescription(plugin: PluginData): string {
    const parts: string[] = [];

    if (plugin.components.agents.length > 0) {
        parts.push(`${plugin.components.agents.length} agent${plugin.components.agents.length > 1 ? 's' : ''}`);
    }
    if (plugin.components.commands.length > 0) {
        parts.push(`${plugin.components.commands.length} command${plugin.components.commands.length > 1 ? 's' : ''}`);
    }
    if (plugin.components.skills.length > 0) {
        parts.push(`${plugin.components.skills.length} skill${plugin.components.skills.length > 1 ? 's' : ''}`);
    }

    const componentSummary = parts.join(', ');

    // Try to get description from README.md
    const readmePath = path.join(plugin.sourcePath, 'README.md');
    if (fs.existsSync(readmePath)) {
        const readme = fs.readFileSync(readmePath, 'utf-8');
        const lines = readme.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('!'));
        if (lines.length > 0) {
            return lines[0].trim();
        }
    }

    // Fallback: generate from components
    if (plugin.components.agents.length > 0) {
        return plugin.components.agents[0].description || `Plugin with ${componentSummary}`;
    }
    if (plugin.components.commands.length > 0) {
        return plugin.components.commands[0].description || `Plugin with ${componentSummary}`;
    }

    return `Plugin bundle with ${componentSummary}`;
}

const plugins: PluginData[] = [];

function scanPlugins(directory: string, isArchived: boolean) {
    console.log(`Scanning plugins in: ${directory} (Archived: ${isArchived})`);

    if (!fs.existsSync(directory)) {
        if (!isArchived) {
            console.error(`Plugins directory not found: ${directory}`);
            process.exit(1);
        }
        return;
    }

    const pluginDirs = fs.readdirSync(directory).filter(d => {
        const stat = fs.statSync(path.join(directory, d));
        return stat.isDirectory() && !d.startsWith('.') && d !== 'anthropic-temp';
    });

    for (const pluginId of pluginDirs) {
        const pluginPath = path.join(directory, pluginId);

        const agents = scanDirectory(path.join(pluginPath, 'agents'), 'agents');
        const commands = scanDirectory(path.join(pluginPath, 'commands'), 'commands');
        const skills = scanDirectory(path.join(pluginPath, 'skills'), 'skills');

        // Skip plugins with no components
        if (agents.length === 0 && commands.length === 0 && skills.length === 0) {
            console.log(`  Skipping ${pluginId}: no agents, commands, or skills found`);
            continue;
        }

        const plugin: PluginData = {
            id: pluginId,
            name: formatName(pluginId),
            description: '',
            shortDescription: '',
            sourcePath: pluginPath,
            components: { agents, commands, skills },
            installInstructions: '',
            icon: getIcon(pluginId),
            isArchived
        };

        plugin.description = generatePluginDescription(plugin);
        plugin.shortDescription = generateShortDescription(plugin.description);
        plugin.installInstructions = generateInstallInstructions(plugin);

        plugins.push(plugin);
        console.log(`  Found: ${pluginId} (${agents.length} agents, ${commands.length} commands, ${skills.length} skills)`);
    }
}

scanPlugins(PLUGINS_DIR, false);
const ARCHIVE_PLUGINS_DIR = path.join(PROJECT_ROOT, 'ARCHIVE', 'plugins');
scanPlugins(ARCHIVE_PLUGINS_DIR, true);

// Sort plugins by name
plugins.sort((a, b) => a.name.localeCompare(b.name));

const fileContent = `// Auto-generated by scripts/generate-plugins-index.ts
// Do not edit manually

import type { Plugin } from '../types';

export const GENERATED_PLUGINS: Plugin[] = ${JSON.stringify(plugins, null, 4)};
`;

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, fileContent);
console.log(`\nGenerated index for ${plugins.length} plugins at ${OUTPUT_FILE}`);
