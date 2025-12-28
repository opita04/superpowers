import type { Skill } from '../types';

export const INITIAL_SKILLS: Skill[] = [
    // Testing
    {
        id: 'test-driven-development',
        name: 'Test-Driven Development',
        description: 'RED-GREEN-REFACTOR cycle. Write tests first, always.',
        shortDescription: 'RED-GREEN-REFACTOR cycle. Write tests first, always.',
        longDescription: 'Enforces the RED-GREEN-REFACTOR cycle: (1) Write a failing test that defines desired behavior, (2) Write minimal code to make the test pass, (3) Refactor while keeping all tests green. Ensures code is testable by design, prevents over-engineering, and creates living documentation through tests.',
        category: 'testing',
        references: [],
        icon: '🧪'
    },

    // Debugging
    {
        id: 'systematic-debugging',
        name: 'Systematic Debugging',
        description: '4-phase root cause process with defense-in-depth techniques.',
        shortDescription: '4-phase root cause process with defense-in-depth techniques.',
        longDescription: 'A rigorous 4-phase debugging framework: (1) Reproduce and isolate the issue, (2) Analyze patterns and gather evidence, (3) Form and test hypotheses methodically, (4) Implement fix with regression prevention. Uses defense-in-depth techniques to prevent recurrence.',
        category: 'debugging',
        references: ['verification-before-completion'],
        icon: '🔍'
    },
    {
        id: 'verification-before-completion',
        name: 'Verification Before Completion',
        description: 'Ensure fixes are actually working before declaring success.',
        shortDescription: 'Ensure fixes are actually working before declaring success.',
        longDescription: 'Never assume a fix works—prove it. Run the exact reproduction steps that triggered the bug, verify edge cases, check for regressions in related functionality, and confirm the fix addresses root cause rather than just symptoms.',
        category: 'debugging',
        references: [],
        icon: '✅'
    },

    // Collaboration
    {
        id: 'brainstorming',
        name: 'Brainstorming',
        description: 'Socratic design refinement. Explore ideas before implementation.',
        shortDescription: 'Socratic design refinement. Explore ideas before implementation.',
        longDescription: 'Interactive Socratic method for design exploration. Ask probing questions, challenge assumptions, explore edge cases, and refine ideas through dialogue. Produces better solutions by considering multiple perspectives before committing to implementation.',
        category: 'collaboration',
        references: ['using-git-worktrees', 'writing-plans'],
        icon: '💡'
    },
    {
        id: 'writing-plans',
        name: 'Writing Plans',
        description: 'Create detailed implementation plans with bite-sized tasks.',
        shortDescription: 'Create detailed implementation plans with bite-sized tasks.',
        longDescription: 'Transform complex features into structured implementation plans with discrete, testable tasks. Each task should be completable in a single session, have clear acceptance criteria, and include verification steps. Plans serve as contracts between design and execution.',
        category: 'collaboration',
        references: ['executing-plans', 'subagent-driven-development'],
        icon: '📝'
    },
    {
        id: 'executing-plans',
        name: 'Executing Plans',
        description: 'Batch execution of plans with human checkpoints.',
        shortDescription: 'Batch execution of plans with human checkpoints.',
        longDescription: 'Systematic plan execution with built-in review gates. Complete tasks in batches, pause for human review at critical decision points, track progress against the plan, and adjust approach based on discoveries during implementation.',
        category: 'collaboration',
        references: ['finishing-a-development-branch'],
        icon: '▶️'
    },
    {
        id: 'subagent-driven-development',
        name: 'Subagent-Driven Development',
        description: 'Fresh subagent per task with two-stage review.',
        shortDescription: 'Fresh subagent per task with two-stage review.',
        longDescription: 'Spawn fresh AI context for each discrete task to avoid context pollution. Each subagent receives focused instructions, completes its task, then outputs undergo two-stage review: automated verification followed by human approval before integration.',
        category: 'collaboration',
        references: ['finishing-a-development-branch'],
        icon: '🤖'
    },
    {
        id: 'dispatching-parallel-agents',
        name: 'Dispatching Parallel Agents',
        description: 'Concurrent subagent workflows for parallel tasks.',
        shortDescription: 'Concurrent subagent workflows for parallel tasks.',
        longDescription: 'Orchestrate multiple subagents working concurrently on independent tasks. Define clear boundaries to prevent conflicts, establish merge strategies, and coordinate completion. Dramatically accelerates development when tasks have minimal interdependencies.',
        category: 'collaboration',
        references: [],
        icon: '⚡'
    },
    {
        id: 'requesting-code-review',
        name: 'Requesting Code Review',
        description: 'Pre-review checklist before submitting for review.',
        shortDescription: 'Pre-review checklist before submitting for review.',
        longDescription: 'Prepare code for review by running the pre-review checklist: verify tests pass, self-review for obvious issues, ensure documentation is updated, provide context on design decisions, and highlight areas where reviewer feedback is most valuable.',
        category: 'collaboration',
        references: [],
        icon: '📤'
    },
    {
        id: 'receiving-code-review',
        name: 'Receiving Code Review',
        description: 'Respond to and address code review feedback.',
        shortDescription: 'Respond to and address code review feedback.',
        longDescription: 'Process code review feedback constructively: acknowledge all comments, ask clarifying questions before disputing, implement agreed changes, explain reasoning for pushback, and use feedback as learning opportunities for future code quality.',
        category: 'collaboration',
        references: [],
        icon: '📥'
    },
    {
        id: 'using-git-worktrees',
        name: 'Using Git Worktrees',
        description: 'Create isolated workspaces for parallel development.',
        shortDescription: 'Create isolated workspaces for parallel development.',
        longDescription: 'Leverage git worktrees to work on multiple branches simultaneously without stashing or switching contexts. Each worktree is a separate directory with its own working state, enabling parallel feature development, hotfixes, and code reviews.',
        category: 'collaboration',
        references: [],
        icon: '🌳'
    },
    {
        id: 'finishing-a-development-branch',
        name: 'Finishing a Development Branch',
        description: 'Merge/PR decision workflow after task completion.',
        shortDescription: 'Merge/PR decision workflow after task completion.',
        longDescription: 'Complete branch work systematically: final self-review, ensure CI passes, rebase/merge main changes, update PR description, request final review, and decide between squash merge, merge commit, or rebase based on history clarity needs.',
        category: 'collaboration',
        references: [],
        icon: '🏁'
    },

    // Meta
    {
        id: 'writing-skills',
        name: 'Writing Skills',
        description: 'Create new skills following best practices.',
        shortDescription: 'Create new skills following best practices.',
        longDescription: 'Author new AI skills using established patterns: clear trigger conditions, well-defined inputs/outputs, example invocations, and edge case handling. Skills should be modular, composable, and include comprehensive documentation.',
        category: 'meta',
        references: [],
        icon: '✍️'
    },
    {
        id: 'using-superpowers',
        name: 'Using Superpowers',
        description: 'Introduction to the skills system.',
        shortDescription: 'Introduction to the skills system.',
        longDescription: 'Master the Superpowers skill system: understand how to discover available skills, combine them for complex workflows, customize skill parameters, and extend the system with new capabilities. Foundation for AI-augmented development.',
        category: 'meta',
        references: [],
        icon: '🦸'
    },

    // Creative
    {
        id: 'algorithmic-art',
        name: 'Algorithmic Art',
        description: 'Creating algorithmic art using p5.js with seeded randomness.',
        shortDescription: 'Creating algorithmic art using p5.js with seeded randomness.',
        longDescription: 'Generate visual art through code using p5.js with seeded randomness for reproducibility. Techniques include particle systems, flow fields, recursive patterns, color theory algorithms, and interactive parameter exploration for creative iteration.',
        category: 'creative',
        references: [],
        icon: '🎨'
    },
    {
        id: 'slack-gif-creator',
        name: 'Slack Gif Creator',
        description: 'Creating animated GIFs optimized for Slack.',
        shortDescription: 'Creating animated GIFs optimized for Slack.',
        longDescription: 'Create high-impact animated GIFs optimized for Slack: proper dimensions, file size limits, loop timing, and visual clarity at small sizes. Includes techniques for screen recordings, reaction GIFs, and custom animations.',
        category: 'creative',
        references: [],
        icon: '🎞️'
    },

    // Design
    {
        id: 'brand-guidelines',
        name: 'Brand Guidelines',
        description: 'Create brand guidelines and design systems.',
        shortDescription: 'Create brand guidelines and design systems.',
        longDescription: 'Develop comprehensive brand guidelines covering visual identity (logos, colors, typography), voice and tone, component libraries, usage rules, and accessibility requirements. Create living documentation that evolves with the brand.',
        category: 'design',
        references: [],
        icon: '🏷️'
    },
    {
        id: 'canvas-design',
        name: 'Canvas Design',
        description: 'Create and edit visual designs using HTML Canvas.',
        shortDescription: 'Create and edit visual designs using HTML Canvas.',
        longDescription: 'Design and manipulate graphics using the HTML Canvas API: drawing primitives, image manipulation, animations, responsive rendering, and export to various formats. Bridge between code and visual design.',
        category: 'design',
        references: [],
        icon: '🖼️'
    },
    {
        id: 'frontend-design',
        name: 'Frontend Design',
        description: 'Distinctive, production-grade frontend interfaces.',
        shortDescription: 'Distinctive, production-grade frontend interfaces.',
        longDescription: 'Create bespoke frontend interfaces that stand out: intentional minimalism, asymmetric layouts, typography-first design, micro-interactions, and performance-conscious animations. Avoid template-like aesthetics; every element has purpose.',
        category: 'design',
        references: [],
        icon: '💅'
    },
    {
        id: 'theme-factory',
        name: 'Theme Factory',
        description: 'Toolkit for styling artifacts with themes.',
        shortDescription: 'Toolkit for styling artifacts with themes.',
        longDescription: 'Apply visual themes to UI artifacts using a curated library of 10+ preset themes. Each theme includes color palettes, typography scales, spacing systems, and component variants. Supports custom theme creation and theme switching.',
        category: 'design',
        references: [],
        icon: '🎭'
    },

    // Productivity
    {
        id: 'doc-coauthoring',
        name: 'Doc Coauthoring',
        description: 'Collaborative document editing and writing refinement.',
        shortDescription: 'Collaborative document editing and writing refinement.',
        longDescription: 'Interactive document co-authoring: iterative drafting, structural suggestions, tone adjustments, clarity improvements, and version management. Supports multiple writing styles and maintains consistent voice across documents.',
        category: 'productivity',
        references: [],
        icon: '🤝'
    },
    {
        id: 'docx',
        name: 'Docx',
        description: 'Word document creation, reading, and analysis.',
        shortDescription: 'Word document creation, reading, and analysis.',
        longDescription: 'Full Word document manipulation: create from templates, extract text and structure, analyze formatting, generate reports with tables and images, and maintain styling consistency. Handles complex documents with embedded content.',
        category: 'productivity',
        references: [],
        icon: '📄'
    },
    {
        id: 'pdf',
        name: 'Pdf',
        description: 'PDF form filling, generation, and analysis.',
        shortDescription: 'PDF form filling, generation, and analysis.',
        longDescription: 'Comprehensive PDF handling: fill forms programmatically, extract text and metadata, generate formatted documents, merge/split files, and analyze document structure. Supports both simple and complex PDF workflows.',
        category: 'productivity',
        references: [],
        icon: '📑'
    },
    {
        id: 'pptx',
        name: 'Pptx',
        description: 'Presentation creation, editing, and analysis.',
        shortDescription: 'Presentation creation, editing, and analysis.',
        longDescription: 'PowerPoint automation: generate slides from content, maintain design consistency, extract presentation structure, update existing decks, and create data-driven visualizations. Produces professional presentations efficiently.',
        category: 'productivity',
        references: [],
        icon: '📊'
    },
    {
        id: 'xlsx',
        name: 'Xlsx',
        description: 'Comprehensive spreadsheet creation, editing, and analysis.',
        shortDescription: 'Comprehensive spreadsheet creation, editing, and analysis.',
        longDescription: 'Advanced Excel manipulation: read/write complex workbooks, create formulas and pivot tables, generate charts, apply formatting, and automate data processing. Handles multi-sheet workbooks with cross-references.',
        category: 'productivity',
        references: [],
        icon: '📉'
    },

    // Communication
    {
        id: 'internal-comms',
        name: 'Internal Comms',
        description: 'Drafting internal communications and announcements.',
        shortDescription: 'Drafting internal communications and announcements.',
        longDescription: 'Craft effective internal communications: company announcements, team updates, policy changes, and celebration messages. Balances professional tone with approachability, ensures clarity, and considers audience context.',
        category: 'communication',
        references: [],
        icon: '📢'
    },

    // Coding
    {
        id: 'mcp-builder',
        name: 'Mcp Builder',
        description: 'Build and verify MCP servers in Python.',
        shortDescription: 'Build and verify MCP servers in Python.',
        longDescription: 'Develop Model Context Protocol (MCP) servers in Python: implement tool handlers, resource providers, and prompt templates. Includes testing strategies, deployment patterns, and integration with AI assistants.',
        category: 'coding',
        references: [],
        icon: '🛠️'
    },
    {
        id: 'web-artifacts-builder',
        name: 'Web Artifacts Builder',
        description: 'Multi-component HTML artifacts using React/Tailwind/Shadcn.',
        shortDescription: 'Multi-component HTML artifacts using React/Tailwind/Shadcn.',
        longDescription: 'Build elaborate web artifacts with React, Tailwind CSS, and Shadcn UI: interactive dashboards, data visualizations, complex forms, and rich components. Produces self-contained, production-ready HTML artifacts.',
        category: 'coding',
        references: [],
        icon: '🏗️'
    },

    // Testing
    {
        id: 'webapp-testing',
        name: 'Webapp Testing',
        description: 'Testing local web applications using Playwright.',
        shortDescription: 'Testing local web applications using Playwright.',
        longDescription: 'Comprehensive web application testing with Playwright: end-to-end flows, visual regression, accessibility audits, performance metrics, and cross-browser validation. Automated test generation from user scenarios.',
        category: 'testing',
        references: [],
        icon: '🧪'
    },

    // Meta
    {
        id: 'skill-creator',
        name: 'Skill Creator',
        description: 'Guide for creating effective AI skills.',
        shortDescription: 'Guide for creating effective AI skills.',
        longDescription: 'Comprehensive guide for authoring AI skills: define clear triggers, structure inputs/outputs, write example invocations, handle edge cases, and ensure skills are discoverable and composable within the Superpowers ecosystem.',
        category: 'meta',
        references: [],
        icon: '✨'
    }
];
