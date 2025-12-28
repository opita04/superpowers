// Claude Code Plugins from https://github.com/anthropics/claude-code/tree/main/plugins

import type { Plugin } from '../types';

export const GENERATED_PLUGINS: Plugin[] = [
    {
        id: 'agent-sdk-dev',
        name: 'Agent SDK Dev',
        description: 'Development kit for working with the Claude Agent SDK. Provides tools and guidance for building agent-based applications.',
        shortDescription: 'Development kit for Claude Agent SDK',
        contents: 'Command: /new-sdk-app • Agents: agent-sdk-verifier-py, agent-sdk-verifier-ts',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/agent-sdk-dev',
        icon: '🛠️'
    },
    {
        id: 'claude-opus-4-5-migration',
        name: 'Claude Opus 4.5 Migration',
        description: 'Migrate code and prompts from Sonnet 4.x and Opus 4.1 to Opus 4.5. Automated migration of model strings, beta headers, and prompt adjustments.',
        shortDescription: 'Migrate code to Opus 4.5',
        contents: 'Skill: claude-opus-4-5-migration',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration',
        icon: '🔄'
    },
    {
        id: 'code-review',
        name: 'Code Review',
        description: 'Automated PR code review using multiple specialized agents with confidence-based scoring to filter false positives.',
        shortDescription: 'Automated PR code review with AI agents',
        contents: 'Command: /code-review • Agents: 5 parallel Sonnet agents for compliance, bugs, context, history, comments',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/code-review',
        icon: '🔍'
    },
    {
        id: 'commit-commands',
        name: 'Commit Commands',
        description: 'Git workflow automation for committing, pushing, and creating pull requests. Streamlined git operations.',
        shortDescription: 'Git workflow automation',
        contents: 'Commands: /commit, /commit-push-pr, /clean_gone',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/commit-commands',
        icon: '📦'
    },
    {
        id: 'explanatory-output-style',
        name: 'Explanatory Output Style',
        description: 'Adds educational insights about implementation choices and codebase patterns. Mimics the deprecated Explanatory output style.',
        shortDescription: 'Educational implementation insights',
        contents: 'Hook: SessionStart - Injects educational context at session start',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/explanatory-output-style',
        icon: '📚'
    },
    {
        id: 'feature-dev',
        name: 'Feature Dev',
        description: 'Comprehensive feature development workflow with a structured 7-phase approach. Guides you through the complete feature lifecycle.',
        shortDescription: 'Structured 7-phase feature development',
        contents: 'Command: /feature-dev • Agents: code-explorer, code-architect, code-reviewer',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev',
        icon: '🚀'
    },
    {
        id: 'frontend-design',
        name: 'Frontend Design',
        description: 'Create distinctive, production-grade frontend interfaces that avoid generic AI aesthetics. Auto-invoked for frontend work.',
        shortDescription: 'Production-grade frontend interfaces',
        contents: 'Skill: frontend-design - Guidance on bold design choices, typography, animations',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design',
        icon: '🎨'
    },
    {
        id: 'hookify',
        name: 'Hookify',
        description: 'Easily create custom hooks to prevent unwanted behaviors by analyzing conversation patterns or explicit instructions.',
        shortDescription: 'Create custom behavior hooks',
        contents: 'Commands: /hookify, /hookify:list, /hookify:configure • Agent: conversation-analyzer',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/hookify',
        icon: '🪝'
    },
    {
        id: 'learning-output-style',
        name: 'Learning Output Style',
        description: 'Interactive learning mode that requests meaningful code contributions at decision points. Encourages writing 5-10 lines of meaningful code.',
        shortDescription: 'Interactive learning mode',
        contents: 'Hook: SessionStart - Encourages writing meaningful code with educational insights',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/learning-output-style',
        icon: '🎓'
    },
    {
        id: 'plugin-dev',
        name: 'Plugin Dev',
        description: 'Comprehensive toolkit for developing Claude Code plugins with 7 expert skills and AI-assisted creation. 8-phase guided workflow.',
        shortDescription: 'Toolkit for developing plugins',
        contents: 'Command: /plugin-dev:create-plugin • Agents: agent-creator, plugin-validator, skill-reviewer',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/plugin-dev',
        icon: '🔌'
    },
    {
        id: 'pr-review-toolkit',
        name: 'PR Review Toolkit',
        description: 'Comprehensive PR review agents specializing in comments, tests, error handling, type design, code quality, and code simplification.',
        shortDescription: 'Specialized PR review agents',
        contents: 'Command: /pr-review-toolkit:review-pr • Agents: comment-analyzer, pr-test-analyzer, silent-failure-hunter, type-design-analyzer, code-reviewer, code-simplifier',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/pr-review-toolkit',
        icon: '📋'
    },
    {
        id: 'ralph-wiggum',
        name: 'Ralph Wiggum',
        description: 'Interactive self-referential AI loops for iterative development. Claude works on the same task repeatedly until completion.',
        shortDescription: 'Iterative AI development loops',
        contents: 'Commands: /ralph-loop, /cancel-ralph • Hook: Stop - Intercepts exit to continue iteration',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum',
        icon: '🔁'
    },
    {
        id: 'security-guidance',
        name: 'Security Guidance',
        description: 'Security reminder hook that warns about potential security issues when editing files. Monitors 9 security patterns including command injection, XSS, eval usage.',
        shortDescription: 'Security warnings for code edits',
        contents: 'Hook: PreToolUse - Monitors command injection, XSS, eval, dangerous HTML, pickle, os.system',
        githubUrl: 'https://github.com/anthropics/claude-code/tree/main/plugins/security-guidance',
        icon: '🔐'
    }
];
