import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const archivePlugin = () => ({
  name: 'archive-plugin',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.method === 'POST' && req.url === '/api/archive') {
        let body = '';
        req.on('data', (chunk: any) => body += chunk.toString());
        req.on('end', async () => {
          try {
            const { type, id, path: itemPath } = JSON.parse(body);
            const rootDir = process.cwd();
            const archiveDir = path.join(rootDir, 'ARCHIVE');

            if (!fs.existsSync(archiveDir)) {
              fs.mkdirSync(archiveDir);
            }

            let sourcePath = '';
            let targetPath = '';

            if (type === 'skill') {
              sourcePath = path.join(rootDir, 'skills', id);
              targetPath = path.join(archiveDir, 'skills', id);
            } else if (type === 'agent') {
              sourcePath = path.join(rootDir, itemPath);
              targetPath = path.join(archiveDir, itemPath);
            } else if (type === 'plugin') {
              sourcePath = path.join(rootDir, 'agents', 'plugins', id);
              targetPath = path.join(archiveDir, 'agents', 'plugins', id);
            }

            if (fs.existsSync(sourcePath)) {
              const targetDir = path.dirname(targetPath);
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }

              fs.renameSync(sourcePath, targetPath);
              console.log(`Archived ${type}: ${sourcePath} -> ${targetPath}`);

              if (type === 'agent') {
                exec('npx -y tsx scripts/generate-agents-index.ts', (err) => {
                  if (err) console.error('Failed to regenerate agents index:', err);
                  else console.log('Regenerated agents index');
                });
              } else if (type === 'skill') {
                exec('npx -y tsx scripts/generate-skills-index.ts', (err) => {
                  if (err) console.error('Failed to regenerate skills index:', err);
                  else console.log('Regenerated skills index');
                });
              } else if (type === 'plugin') {
                // Determine if we need to update generatedPlugins.ts
                const pluginsPath = path.join(rootDir, 'src', 'data', 'generatedPlugins.ts');
                if (fs.existsSync(pluginsPath)) {
                  let content = fs.readFileSync(pluginsPath, 'utf-8');
                  // Simple regex injection. Note: This assumes id is unique and format matches.
                  // We inject isArchived: true after the id property.
                  const regex = new RegExp(`(id:\\s*['"]${id}['"])`);
                  if (content.match(regex)) {
                    if (!content.includes(`id: '${id}', isArchived: true`) && !content.includes(`id: "${id}", isArchived: true`)) {
                      content = content.replace(regex, `$1, isArchived: true`);
                      fs.writeFileSync(pluginsPath, content);
                      console.log('Updated generatedPlugins.ts with isArchived flag');
                    }
                  }
                }
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } else {
              console.error(`Source not found: ${sourcePath}`);
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Source not found' }));
            }
          } catch (e: any) {
            console.error('Archive error:', e);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
          }
        });
        return;
      }
      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), archivePlugin()],
});
