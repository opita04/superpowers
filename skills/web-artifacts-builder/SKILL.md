---
name: web-artifacts-builder
description: Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts.
license: Complete terms in LICENSE.txt
---

# Web Artifacts Builder

To build powerful frontend claude.ai artifacts, follow these steps:
1. Initialize the frontend repo using `scripts/init-artifact.sh`
2. Develop your artifact by editing the generated code
3. Bundle all code into a single HTML file using `scripts/bundle-artifact.sh`
4. Display artifact to user
5. (Optional) Test the artifact

**Stack**: React 18 + TypeScript + Vite + Parcel (bundling) + Tailwind CSS + shadcn/ui

## Design & Style Guidelines

VERY IMPORTANT: To avoid what is often referred to as "AI slop", avoid using excessive centered layouts, purple gradients, uniform rounded corners, and Inter font.

## Quick Start

### Step 1: Initialize Project

Run the initialization script to create a new React project:
```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

This creates a fully configured project with:
- ✅ React + TypeScript (via Vite)
- ✅ Tailwind CSS 3.4.1 with shadcn/ui theming system
- ✅ Path aliases (`@/`) configured
- ✅ 40+ shadcn/ui components pre-installed
- ✅ All Radix UI dependencies included
- ✅ Parcel configured for bundling (via .parcelrc)
- ✅ Node 18+ compatibility (auto-detects and pins Vite version)

### Step 2: Develop Your Artifact

To build the artifact, edit the generated files. See **Common Development Tasks** below for guidance.

### Step 3: Bundle to Single HTML File

To bundle the React app into a single HTML artifact:
```bash
bash scripts/bundle-artifact.sh
```

This creates `bundle.html` - a self-contained artifact with all JavaScript, CSS, and dependencies inlined. This file can be directly shared in Claude conversations as an artifact.

**Requirements**: Your project must have an `index.html` in the root directory.

**What the script does**:
- Installs bundling dependencies (parcel, @parcel/config-default, parcel-resolver-tspaths, html-inline)
- Creates `.parcelrc` config with path alias support
- Builds with Parcel (no source maps)
- Inlines all assets into single HTML using html-inline

### Step 4: Share Artifact with User

Finally, share the bundled HTML file in conversation with the user so they can view it as an artifact.

### Step 5: Testing/Visualizing the Artifact (Optional)

Note: This is a completely optional step. Only perform if necessary or requested.

To test/visualize the artifact, use available tools (including other Skills or built-in tools like Playwright or Puppeteer). In general, avoid testing the artifact upfront as it adds latency between the request and when the finished artifact can be seen. Test later, after presenting the artifact, if requested or if issues arise.

## Reference

- **shadcn/ui components**: https://ui.shadcn.com/docs/components

# Referenced Files

## File: scripts/bundle-artifact.sh

```sh
#!/bin/bash
set -e

echo "📦 Bundling React app to single HTML artifact..."

# Check if we're in a project directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: No package.json found. Run this script from your project root."
  exit 1
fi

# Check if index.html exists
if [ ! -f "index.html" ]; then
  echo "❌ Error: No index.html found in project root."
  echo "   This script requires an index.html entry point."
  exit 1
fi

# Install bundling dependencies
echo "📦 Installing bundling dependencies..."
pnpm add -D parcel @parcel/config-default parcel-resolver-tspaths html-inline

# Create Parcel config with tspaths resolver
if [ ! -f ".parcelrc" ]; then
  echo "🔧 Creating Parcel configuration with path alias support..."
  cat > .parcelrc << 'EOF'
{
  "extends": "@parcel/config-default",
  "resolvers": ["parcel-resolver-tspaths", "..."]
}
EOF
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist bundle.html

# Build with Parcel
echo "🔨 Building with Parcel..."
pnpm exec parcel build index.html --dist-dir dist --no-source-maps

# Inline everything into single HTML
echo "🎯 Inlining all assets into single HTML file..."
pnpm exec html-inline dist/index.html > bundle.html

# Get file size
FILE_SIZE=$(du -h bundle.html | cut -f1)

echo ""
echo "✅ Bundle complete!"
echo "📄 Output: bundle.html ($FILE_SIZE)"
echo ""
echo "You can now use this single HTML file as an artifact in Claude conversations."
echo "To test locally: open bundle.html in your browser"
```

## File: scripts/init-artifact.sh

```sh
#!/bin/bash

# Exit on error
set -e

# Detect Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

echo "🔍 Detected Node.js version: $NODE_VERSION"

if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Error: Node.js 18 or higher is required"
  echo "   Current version: $(node -v)"
  exit 1
fi

# Set Vite version based on Node version
if [ "$NODE_VERSION" -ge 20 ]; then
  VITE_VERSION="latest"
  echo "✅ Using Vite latest (Node 20+)"
else
  VITE_VERSION="5.4.11"
  echo "✅ Using Vite $VITE_VERSION (Node 18 compatible)"
fi

# Detect OS and set sed syntax
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_INPLACE="sed -i ''"
else
  SED_INPLACE="sed -i"
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo "📦 pnpm not found. Installing pnpm..."
  npm install -g pnpm
fi

# Check if project name is provided
if [ -z "$1" ]; then
  echo "❌ Usage: ./create-react-shadcn-complete.sh <project-name>"
  exit 1
fi

PROJECT_NAME="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPONENTS_TARBALL="$SCRIPT_DIR/shadcn-components.tar.gz"

# Check if components tarball exists
if [ ! -f "$COMPONENTS_TARBALL" ]; then
  echo "❌ Error: shadcn-components.tar.gz not found in script directory"
  echo "   Expected location: $COMPONENTS_TARBALL"
  exit 1
fi

echo "🚀 Creating new React + Vite project: $PROJECT_NAME"

# Create new Vite project (always use latest create-vite, pin vite version later)
pnpm create vite "$PROJECT_NAME" --template react-ts

# Navigate into project directory
cd "$PROJECT_NAME"

echo "🧹 Cleaning up Vite template..."
$SED_INPLACE '/<link rel="icon".*vite\.svg/d' index.html
$SED_INPLACE 's/<title>.*<\/title>/<title>'"$PROJECT_NAME"'<\/title>/' index.html

echo "📦 Installing base dependencies..."
pnpm install

# Pin Vite version for Node 18
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "📌 Pinning Vite to $VITE_VERSION for Node 18 compatibility..."
  pnpm add -D vite@$VITE_VERSION
fi

echo "📦 Installing Tailwind CSS and dependencies..."
pnpm install -D tailwindcss@3.4.1 postcss autoprefixer @types/node tailwindcss-animate
pnpm install class-variance-authority clsx tailwind-merge lucide-react next-themes

echo "⚙️  Creating Tailwind and PostCSS configuration..."
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo "📝 Configuring Tailwind with shadcn theme..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
EOF

# Add Tailwind directives and CSS variables to index.css
echo "🎨 Adding Tailwind directives and CSS variables..."
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

# Add path aliases to tsconfig.json
echo "🔧 Adding path aliases to tsconfig.json..."
node -e "
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
config.compilerOptions = config.compilerOptions || {};
config.compilerOptions.baseUrl = '.';
config.compilerOptions.paths = { '@/*': ['./src/*'] };
fs.writeFileSync('tsconfig.json', JSON.stringify(config, null, 2));
"

# Add path aliases to tsconfig.app.json
echo "🔧 Adding path aliases to tsconfig.app.json..."
node -e "
const fs = require('fs');
const path = 'tsconfig.app.json';
const content = fs.readFileSync(path, 'utf8');
// Remove comments manually
const lines = content.split('\n').filter(line => !line.trim().startsWith('//'));
const jsonContent = lines.join('\n');
const config = JSON.parse(jsonContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/,(\s*[}\]])/g, '\$1'));
config.compilerOptions = config.compilerOptions || {};
config.compilerOptions.baseUrl = '.';
config.compilerOptions.paths = { '@/*': ['./src/*'] };
fs.writeFileSync(path, JSON.stringify(config, null, 2));
"

# Update vite.config.ts
echo "⚙️  Updating Vite configuration..."
cat > vite.config.ts << 'EOF'
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
EOF

# Install all shadcn/ui dependencies
echo "📦 Installing shadcn/ui dependencies..."
pnpm install @radix-ui/react-accordion @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
pnpm install sonner cmdk vaul embla-carousel-react react-day-picker react-resizable-panels date-fns react-hook-form @hookform/resolvers zod

# Extract shadcn components from tarball
echo "📦 Extracting shadcn/ui components..."
tar -xzf "$COMPONENTS_TARBALL" -C src/

# Create components.json for reference
echo "📝 Creating components.json config..."
cat > components.json << 'EOF'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
EOF

echo "✅ Setup complete! You can now use Tailwind CSS and shadcn/ui in your project."
echo ""
echo "📦 Included components (40+ total):"
echo "  - accordion, alert, aspect-ratio, avatar, badge, breadcrumb"
echo "  - button, calendar, card, carousel, checkbox, collapsible"
echo "  - command, context-menu, dialog, drawer, dropdown-menu"
echo "  - form, hover-card, input, label, menubar, navigation-menu"
echo "  - popover, progress, radio-group, resizable, scroll-area"
echo "  - select, separator, sheet, skeleton, slider, sonner"
echo "  - switch, table, tabs, textarea, toast, toggle, toggle-group, tooltip"
echo ""
echo "To start developing:"
echo "  cd $PROJECT_NAME"
echo "  pnpm dev"
echo ""
echo "📚 Import components like:"
echo "  import { Button } from '@/components/ui/button'"
echo "  import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'"
echo "  import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'"

```

## File: scripts/shadcn-components.tar.gz

```gz
� �<�h �}iw�H��|֯@�M{�R"���g����~[זݵ�O�uC$$b\��Q*�oߌ<#/\�h��xU���"#3##"#F�t�΢�"?���z�����q@���п���˟�w�=9�����a����-8~��g�/4�?o����]]��~ȿ_�3R㿌������I�w�zr��M<����<-:Y����E~��:>N��������������zd�w�S}�������y�����0�?e�4^�7Qp��Ӡ�߳p�u�dQH(Jkgg��������������V���x��ܸ�#>��_�����xJ���q�X���'d��n��&<����'<�����Gٺ D���!͂Gz�ė�E��rŀ"�R�����]L~Y�����6��?GW/v��mM	÷��<J������-H��,���+^L�eI杳�]ҙ$���i�����;xlYt�ς]R�;3� �����H�dAÇ�l�~
�V<K�YԹJ��`��6��4�HC�,�OB��սx���l�;�upyݙ.�8�wz�"�[���TtM�Zm^������<��������ގ���8��IxY�a2�}���k��UF���x�D��c��7�������|���,��¹�)û�a0�#�O��tFF4��i�ų�Nzu�G��e8�Ć7Xd�,'�Ng�0IH��2���y|�D�"ڮ���D��>�?���~@�=$_ǃyC�:��!����^Ƌ��q7���sN�E4$cI|1 ��zႠHP���'�8�mD�|����)�5��(��ј�E�����W��)P��7@|�����p�0�Wضܐ�x�kk��U1�:�7"��y�����������F���2'��P�g����{��UP-r���b�ŗ�_�_�`5�q|Sy�[�]\�٘l�d�g�-���Mý�a�4-��a��Q8��H_�Z���:�4	�BX��c�j���
���.|�+�E}�H~,���e����� �&��>l�	���dQA��.��=o�|��s���d$	��s���[zP���b�lR�1C&N0_t�:P�Q��,K%i��+96�v4r���$X/]8a)-ı��6Zk�Om�ڴ͙�֨�b�j?:��'1,�k� K��>�����K���Ow��m�!�{O��L�H��Ȋ�y�6�Be�5�����W;W��,h����v��I,��h¸�<J@�B�ŲzF?Y�� �	j�jʄru�-d��қ(�J���$����QQ�3�I�av���x�l�����G�iB6R�QN�xZȁ�վM��K\�e��.N:G�3GF�9�O���w]�X~,S#�o��5%=�d��茣�F#Z�/�cOtA{$|��7���|����a⯙(���5���~�x��o�i-sX�cv�����H���U���%̬B��D�i���G��j6��Nx�b�7��[e��{��ؔ0��A�|B����G*-'��
�����	�m}M��������G|S->�ߏ&'�$�"�
���i�Ɣ���9=1	�`K� ��ScR:�f�pF�EԉgZ�(I�h��I)��+r���N�Q6M�gF���k�Ni�o�yi*ɫ	����b�N/�ˆd�G�E:��K���	��PJ��L8ȫ���M ���2���N�M|1#F*�G�q!=����5Y���l �/�H��+�c;�����6�����|�쓱�g�u�k�*��{G����99������O��G������<K�m�lQ]9�� k��	�e�@�]N}������^� ^[0`7��l��E�Y;s���y��:��`X���ƿ�OH'���ߤ��?w;���#Ӥ�R���t������Q_�=#k�X���ޙ÷���:W����3�Ŧ�����������������Ъ=I�O�H�C�D�d�Rض��\��+��v7 s��"F��G�Pv{GU� T��Z�FT'����m�\�_�'�������,΋e6�B�Bk��j>����p�+�!�C<n�>c�Q8b�^��"�L�B.6e����1��!(�XD��u���p��t@h3բ?{���=c__�o�fN�ȿk���A=�yD�8�(bO������ph�)��bQ MQ����GY�������?�>�O�	;���
�L�wxth��99>>ٮ��x���N�Rʎ��jd�dɶk��2Y�9a��h&�sTP_�WP�:e|�j�[�W$�s�f����h+��ڤwj�V�U��4�q^�ӧ��&3���߶'�mC���?�(Z�� �x��u��]C�w|r�����x���T���q&�um�7!96��/�%���KJ�&��N�${f/�Q	����r�Z]Ku�p0��:��4I���J�Tv.�@�g��,lH�]���dd��k����c�.��u�����*���A<��=݀�`����Oϻ����klt:Ŷ=<��m�C�+ftA�S��d� �8�(�@pd1�]-硒k$��0���af��W�g�î72�ؙ\}X(n�X��n �$���Єp0�_	�qG���0�tV���E
����4��A )��sO�nLj-`YJ��P;���]�'UR��H�����hFV��]�
�O��s��qs(���
��1��%�M��K�Ơ\�{d?��qt.9qL�je삆��Gv8Z]����錃��$!G�h6Λ���th{�Ƞ�����Q�_Sa����8ff��s'�,����؄D���ǪV%���aI��qϾ>`-��JձE;�TE��F�e�i l3O�nds����Y'辨��ÐT�k^��uۚMd��#BVc0�U���~�z��Ŭ/�y8�@y�Ig	)�����K�p,ꂐw��B�Ҕ�&��M�y�D3J^�ۥ�I��E����5����qާ���FY��+��5O�;�_���3����gBa�ɼ 3�t�~�s�[8M�@40d�վ���:�ĉ�5�9��;��Z�]i�t��Yn�������K��J��s���,���Yi�h�/��X�X��x4Vӡ@�T�ծM�x,��	NA�l-��|k��B'9�
��|����+��'�:a�O�?����C�7��$�Y�Q
X���w�7��O�[��F�:?J�HJ�@EFus�����ݰ�}EX�c����@�ek�8X9*�V^�>q�9�g�(�-?�^P�ֆ���:�92�N�Y�ɛm^�Î&ͽ̓��^�V�NZ��u�qRV�D�����!g�Z�@�(LZ5	�Q��.Qe��R���|��"�u�R��Z���c��g���H����J��R�ɂ3[��yo~w�t
�VĮ
�4)�?
k�~+�pP���u�Nϲf�kM%'yəE&E���(�w�TB�Ѵ�rl_��Y�ǿ�@i�:�2��|l��m��m���������zT�:��)��(	�3gQR�.�*r���w��)}����}U2Zm{:G����8��;�8��Q�Plo���i9�D�w�gc*�H�%,
��^7��w^�Y�,Ы{9 ;k�D�l�|pY�azט;c�h^�����W��b�T��;���[��_y��sG��-���W��&��j���a�[+ˤr��k�
�=�:��Pv��g�4sI޳q|s1�RP�t��'�A�lwo����u�‖氒��|��/9Èt;�ү��+�)���>�΋�J�.�#:����m�W[�	��K��(ٰ�_�w�?2��l���<����R)RzZ��_e���0�r�Sלw�#rė���2�ӌ�,�Rkz��5 e�R,�IM	��ǺrKW�����D�N����Ra�V׮�Dá����G��C�v�����t6۸�GX�����í��<ڍ�	Y���:�s�r����TD�E�3�!1]�9[߇��GVΙ���k��)Z�Z�tiҮ�ҶI3�	д%/��w�e_V+�ii��+Bݠ��[�s�¶Hk���=���TS���̗c�V��*�vEd)����>�̌�a%�A3���r�	�di8�,?|�y��'2�*�ag�aWz��\,H~G_UYȵ����g�CR�7�f_��i��"�I�bGp:���&}���7�5��&l�rMA���~�k��;=�m��l���� ��{Be��AJ�!�΅�ד�&Kgo��٪W��d�=ݯ˱��ڠ��R&��*3�'�
�c�����˰,�;�{jxqP�3rn��DQn���� ���q�
��~v+*�2}0~DY����d��T�Ha�۫}k�����K�ÿ#�.(�Eƙ�-߃+$_`2C���SEDW��+\w�#��wF���S����pE�w��}�,!�J���{!�~��o�*��2�v�,���B��Y$���5�k��������͡jpC?�D�Q}5�4��?��_���n��p��M0M��3�R��֨][�:��r���+Nj�vp;r�˖QK1��]G���J��	��S�V5��嫶�����Vߋ�F �ZGvT�NS(���uAǍT��H;�{�Fv~ؕW�!��X�h6v��8�;����v�a��zQ���T+] ��Xi���[`��`�=�}-�dȫ0`�O����;��"�3o����G��֊*e�D�A��4�=�M�;E��uXw��=�@]����tA��L:��<�+\������3��r�.��:�;Z�ǀ��~�l6UC�m<^L�*9�6/źdS��5-����d(��
L����)&�[�Se��=��q�lPr.�J8�a�Ӄ�Z�q0�����1��'c�nlZF�|��o�l���I�Oܱ1��<�ѱ�ދ���H;,���UƇ���^�U�zg�"��n[��_h�`�+�3��螜��t�>��(]��NB.V�8����ܣ���	��B��I���~����n�m�!�%��L�/��i�����ۤ9��\�W�Iq��`M|%TgH<%��!-��vi\C��&AK�����ѱ���B����q'!��N��κ2`�Z�/u��ru���2Z�F�'����~ypH�N&+�m ]�Hsft|9�o�5�X�=������c�p{�\���Һ�nI?�J���vQ��"j��է�[��/�uJ���$w����

Y��"�k��A�E�p�t�.�m690�ZO',�%(W���g�~����p$&1��_��+F���o_mk�mۄV�����q�n�����wl�'�m��M<M��7�N ��R�`�n�eR����+i9Y˒��Q�DQ�a *�:�Ҍ�1{���������컥�
7�)���b���fy�p!kB�>dY�pLk�j�iYb3�f����J��&{J(g��=�Vc�5���i��g��Ոa��6��+�	����o�:�h_�9�D�3C�=+��C�.�Z.��AJ ;�.h��99�W`�M���5`
N%�@�TLk6�:PFݹ��x�%*��m��$�h�Lt������N����r���c�"��Aw�-B� U����t�7�i���á�7�tq���|����P*d���`�9�o���2a�d�:Ad�ͽ �5s�XTJ��ڴ#D�%�R�"�Ӗ��3Dm�S���c�U)z�ޕKDD^�uu��fX�4Y�����[����_yj��?0�(��s�q���@|dr�U�4#���y�:`Y��	��7cí�����"���r�/��3�U�a���Ytʉ���+_��!���	���]x�}�B��#o�#4H��W؋O�
Q���s�y����&�O'c���G.���Ƥns�m-'[�����'Q���_�C�����O����OU���{���!��w��0�6�̡�.�?��P�L��y��-,�B�@�t�=��,�|3�U������<�F4�_�o�f��{?��}�#_d��B���u�(n��r�7�sd�6��=�P7���c��X�u�r���Y�"�6KZ�gNg'A�oo�͵㨚�	D���[���V+��W�R�2Š+�i��*�,�� z~
��:�*��;�|V?�O�����K����v��TƑK��R):��E*�qf׳�.9�q�,�wQE��u'�Pzk�!��h�mcr�X}�����6^�&��������g+����<�+%yx�}� (X�(4C]7�Fcj�p��Ǖ�@�����h�[e����պU��-d]_z�G>��]��u_���Zӡm��<v��"�{eW�G�h�	�2H��ӗ3���:z}���͡��K`�k�I:�CH˭�B�
�J1��XE�Ђ]��0���W��4�g~@�c\�pl�oy�����?�6Ap��r %��NN����דí���<�?d@���F�o�����Ƨ��4Ǿ�xބ��[[~��5)k���J^K�y�m`��8���)x�B��.�_)oR����HWdŤ���|��"��������D��c92_����]xZrcnr!Ik$]OҜ�Y�ʇ����U+kD
o�Z}/�33̝���H�u~��Ʊ5`C�8��1ʆ	=��<j{�?�i�.���;��y�pSI��~M/�s~3"I��9�����3�>`�
Êk�~p$�{��M|?o��-����<8��������n�2�U=�<�n�t��U�hdI��_�"B�ْ}����P���]��Xd$��O����Ƃ�eW���B��E�;[�@h&sק .Z��5,#|�  q�m�*�*,"�TmAN3a!�WB��:�K�"v��3Ӭ��.A�zY[y�
��A��� ͉J��7V�[�I2�)��«G�2��w�fW�qJ�4���Jd:0VCL4Z���FB��Ǡ��ُ�@Q�'������U��%ɏ|�H��[͆�)�����<Uf�h���c���s�i���]Ice[��Q�Jڐ�y�{*cyz����U��@˃8�|���T�%W.ˡJ����u��r�b,<�@gm��]sj�H�&�v<9|Cg�`CɄ!� x)�����iͬ{����dF�
�<Sߌ|�������q	�4D�0���4�V��$	�y�J'k�'�Q�jr�5l��i�3��x�Bh����sʐ������������Hb��R����4r�-��Q�qBm3�~��Z��� ���c-�&�h��8��c�gMR�2�s�=�K�����}���?\�YN���)|4����#ۯ���& @3$�B�lx�)Y}��DX���#���Z��Jܼ�zP�����x��F�e3��ȲX%��+�n,C��@�/+��T��h�sY�6P�s���-p�,e�ĊS�2N������9'�`Ȫ��2�&�u�Ɍ+� �3.zw�+��X�u��|����2��؅��+�.��$9�ӿx�bu^��[���2@�����h���Se�C�/�|vݓ�θ��D
9\���*ص��;N{�aʿ���V��0����=�}����R;պ-��A#�2�p5�����r�܄h�:Wª�n��s �J*��ِ�;?���eř�����Cc\T�<�������N�2�w��U�`���b\�?X�4	(M/�a	q%�mi�]䙦��*�"�rV.-m. ey��&u��<�5X�҅���0W�'	���li���<`
����cb4ރ
�G�Ĕ/��](��[��-kɎ >�� �v��j��Q:_�2O>|��h,%|C^��P���#�9�N��Dr�n�ü���U����%�7��3W��g���8�� e5���{��\g�"/fkԝ`��,��HY���R�c��R�J+�* _q��8�2,��4�N1�&ԡ��y�����j�:�!T��IZ7�t������yu/�QA%=��b0���Υ��<��r�Eo��ՎS`�k1z�'�۴�}�s>�Ό�(#,�:- �����F�����6��F���?ޓ3�R��F~$���H9�v�=Y�N���5�,?+:����Cn�~�k�ך�7-�'�I43p�+U���Rz�d�.+����0��[jN��3�ގ�i��R=/I���k� MZ5LS&g��sA�Jo�p���O�[�5�A�pB}c �xU�:����T�����{W�I\�I\��6#u���]��~iN@1�h��^�F�4���M�0�G2%/Ӕp/35yR���U����K��R�}�`��Ƽ���d��rH3<��N��OEd;������B�	'TcD�q�C� � ^v{*�-���5�8M��akN��m�m9�	��G�O��ߋC�BS�P*;�k�=�)��Y����@��'ނ2Qj'L�X+lS��.�#��d�OD���)A}�$�<��N�L$2:u��J�D!ݾ-��X�/������B0@�u�Yr�:�2^@23�f��HT��- ����F���7�@�L�@�9�9��g��mL��=�����C�k< ���:����������F�7�~���F� DF�Xg�$Z� �ZQ󎘣�u��y���=X���<7�)$����&��JU��/���rU�`�VpUT3����5��P��)�u]��^F�4X��HYD1s^uܨ�y��ռY���S'�dt0S�X�?)���`h��������D`�J}qP�-�O?�,q�}�=w�xۜ8���1���i8o��_�w�?5�����6�4��N���$��� �����`&�QT�ھ�G��',z��n�6��M3ږ6�+#&x.~���H�mw����b���Z]�bf�'��-6�"��}_q\��[�c�5;�bL8d*Cp��0�zx^�m8�B'��p'�NW��8���>��3v�3a�ً�������ء��-H��/�-�=�"�>�N#� �}#��6z;����Qv񑋘��n-�����Ү�w_�GW��;�O3Lr�$�8��x	m���>J5�Fw��M��V�}Z�
k/�ita�&�Q�����aKD���5v|�)��O��.wGj��"�j��ǖ*|�Ss�1�dYE�4!�5����6���`+[- �Nt����X�Ji����_���w�I���EZ��=����w|ɮ�5�Ah,
������n��Z�*c�
���=-C=/�}�̭킇v�� ���2�Z@V�H��Jh!�`����*�o6��3�b~f����.��Yjb�v��6�i���, ����o%b��BP���JR�xv�p[oҙߩ��VH}e��4����F{c�'gt�_��ⷊ	�{���S�b�:��0��Щ�����3��jxf��rZ弶e��Ʌ�F���Y$(��j�Hc1�+�-�Q�s ���\1�g��1��aƙ�d*��~.x�0G:��Vocp���ҌI�s��S�l$�
g��V?��F}�-z�h�4�w&mEٹ��h���ҟ[(��ǌ�r}�D�V ��?���N{[��yj�⨤ �td����?^Ok-u���P��-*�S����"�_��p��kր�0�R�+t����=G3j���ǥ�f�_F��=U���: �R�Ho3�9�2Ţp`T�<˦	���*Y�:���R:lk,(M�P�a�2'(�
����bPpF�YUMf�_�
T��ʠ�bC��1ח����x9�=z�ROZ��n���o�%��o����8��$���P��T]Y{t�;�U��5:�o[�������nȡl����ǧV��n�h��m������Q��1�a�Ǌ��m���8�W긲7��p=�G)�<�v泪�d�5�Xx]�wq��������2V ������Ld�慠!W�Jpn��H�k�$��vE��bV@�,�9�E������w�Oo6UD[K�����P�6�Amsd��E��	5-/�� ������i��;�����8����T��NQ���ѧ�qI|ջұo�����{�����^8a�O�v[�e��0=rIk�쨴9,<�j��!^KĠ�[�L�Wk�*��e�Ii��//Wk)��=��㓦�/M��ތ�Q�?�1Q�qv��8��e���<A욞��؈��2&Rm����`�=r�uP�"_i�x1��(b����k��Ʈ��fQ�]>���RI��B4���Σ�C���܅4�#��2rr�E�5�*i�B�H���˃";
SIMPP�&H�ؖ�� E`��YК'��5�Ҹ����el��-���/�ѽ�ZF�nH������/�W�~i.�|aU�T&�_�h���c�Ӌ�l��Q�ܐ�����Φ�pO!�L<�C�%)8����fߕ~�ib��(�&�u�YM�)����#/M%yU"9Q/��"�^�$fE�a��P�\�@�ۭF?�p4��F�7�X;XJ� �;vp�&��u�E��FQT�i�4�ݚ��&�m�6�Y&�5�}nQτ-��G��|���p�ϵ�*���|u�X~$�c���lOixh���񕵍���?|P�U�G�h,����S�W�flׄ�k��.���Z�7o��[�ގ\E*.!��G������MX������}?o*t����Sc�T۾�NdmY x�L��Az���6/\N�i�[��p�$AF}0�٨��С��8^	��I��K��k;�M)�U�\��Y��Y�'̹�;JSÌ�#�N�j2��[�֘�T"���)ZI�))��5�����<�.���3��}�]a��g�k�'����K�.@c�}>�W�r��U�+�i9��d��*���IQ�sM��4Y��Mcoh���2Ea�*��W
YEV�����W�v UwL�
I��+����W����.[F�~�'��O��^�H}�M�E��2G}��	�����2>�츌+�b4���~�x���U��0r9=ڰ�����a�{|zz�����S��G8L*6��<~�sU��ҕ�� f;�)=�	+ԃ87P��Y��D�X�]��&��zWs6��؃}%T߀=%T曮�h,c=S�2�`$d�9x�>���6[����xp�bt?a��C}U���&gZ<a�AF����O�Q�V�#z�;?���" q<�E�����»UNR�x�!�Y6��^|�{�G>����\f�M|lR�fŧ��� �"ez��A�����9��]�C�a��TE�S��z7��O7��"�*0U�%�#,IQ���Z7��5L6(���?D�! �3_毷�_��^��k�+�b�9ꘒX<?��X�X��"�9��<c$t�z��
%�G.�nU��$���wx���M|��Є?��MR�Eǚ�|��Y�\o���]3q�4���+a�>'.kH������[���o!ˋX(a��o��K7ZX����"�{��?���n��9#G�Wf��]�"/=r�",h�fmU��`��y�,����+*i��¥4.TJ��0nZ5�˒A�@j������s�����#zU����w6{Q�@:�5����1����h����߽�#S�s|����������M�~"�=|9��'���FX��m�4�ڀ�����]nlbv��5p�t�c�+�#��㡜{pM�@~ ��.��{b��r��
a��;�#��1�\�B	��^�W*k��z}�UȖ#�)*Ԉ�Y��CQW�^=��c:n�������?r�'��0�b����+*�s����	˚Wb�Y�.8��8�5Z���vv�����!����ܕ����f'��if�kZkۘ�ۍ�Kz�h ^���|tl�N����yJ��ʻ����h�4�
7�X1`��~�ˈ�Y;(�E�J��-^�(��n�-=�W��|��^�"�QǨ�N��}Dw�����k`y��Q�s+���Ev1�"ZE{�@�[H��t��%��j���5��s�����P��P���\v܉%H�q$�x_�����<���98����3 2@���>�)'ZI ��3a?K�J@*cT���f�+�2h�/:9F1V����tD��%��e����$�P�a�C.���U�.��E����]��L��8�4��EbL�|����q�����<�Q�Ό���������_���.��� ��x�C3�<4psK�φh�ѐ` :,b+�1�ʋ�_ߜ�)�ަTm��7׍3���Ҕ���$�ro�/J:,A�Y��o�������/�V��<���zG2����y���7�4��%mj�%M�8M6�d�U�������4܅|�n���W���0r�Ҍ�C�8�r����9UU1|P�E*j�����_I_�(����>/�1:�A�5�73�'�ʑ�47-����{��qϨ��w��W~��r� ��f�����G�����]�7�T���O҅7�3x�۬���ie�#D?��fM4K!�)�)�<�y����8�	��P"�$�/�>R�b�i�Nt��X�j+��&���*����r��u�m��qK��v���a%{/���U�VӶ:j��]�'i�ʆ�$��$��bpa:d�������&L���Da��߂��T�}��)M|�����u����.{�a�#��`��v��v]Z_gP�be0]���`��8���
jamdW��5���Y�/��⧭J۸��-���+%E_�I^xE�^�@�|/��B˺��1�P�@�s�md�j�V�!<�!_8�&�w�=>�-�l�/��H�M���m�K�5]��6�㴇��X��-����v��j��6�qߚr��y?]��wYK����D���N�׹���3)g��Ě�o��lE�:g�����u17$.y0��N��[02�^wc���(0܊��,�`I������hm8W�aV�3Z%�m[/������z�G]���x{�#Oc�� I��� P�`��N�7�G����95�_��_wm����Z=ET������Og���f,��?�u���\��t�QE3ajg]���d��M���/�lKB��;���w"����}~��6R��A�Z7:\w�(�:8K�80x"��s[Q��hqx��+8�\�3�:�KCRg�n�y4�,J�1Ý�RN!��XO>'�oW8����PH�{ٹۻ�rOI�+fТ�������ګ�U����}�^���i���>�����׌gvy4�]��^�ԕQ9g�qBu����\�Uy�ո6���^ȩ����Q����x�v���ɳ�f��r�]��Z���#O�W�wt�X!+/����
��ub��f�J<C��:>�*�xu!�R5_x�Y�j��9�GK��yf�G �Zk�98,Π�G�E�$g6���C�h�d�@�4n�V�E��F�I�}w4�C�eV�)d�h�QFT�%����fA�]��#������8���^��D��H�}�Y �Lx��#_q�]U ?���3΍�@�V˦i~���G��w����d*X0�Lh�ì��[w��3��[����˫����c�p�%i%+[���{�nP��n7�z���(*��p4r�!f��U���+��*FҌy.����p�W�f�,���?jy�Ͱ�ƴ�O�̛F�F~q�A���<L��o�U��wk���G����������a�x+����X�+�%��I��W��k�>V��J<T�s�T��9�H�4����Pa�ō�֮��)f����m4.UC�P+�&Н�1,�I�F�����J-��>bO�BY���AA���#3�?�$�op��h���������$	�t���(���G��;�u��JX�����G������
T���,G��4��@�mw�!e('�ee��h5T�mG�ڮz~'���l��M�ѐ�k[J�?N�c����G���y��o8�@��Ҙ��̃@;�������j��<�_�j�@A�0�|f0	Dc�x3�TW6�ψG�`�//��H�+�
i�G��ԩ0T�㮯�"L|��eE5�&V%BI��mj�����Dz-������r�0h�Hx�%�|�⡬�����sc'���'RZYYN�z�#}�*n򣬨.�K��L�8���'	2�:���_Erm����#x��>9�<�<뜙뚖�9	��#Uג�՞�z����=D����]�4��sj���)'�	�䄝IԺw�Y#�]�|�[ת1��p���- 5���x7�^�0E��l�i��]_�����5����ʬ@�����_����D�r:�|�f���9���U�W�P���0q��wM-(�?�W#�&h\�v�xퟕ��	���`���t\w?�;������J���Uh�ܚPbE>ؗ�+�Y��V!�W��(�}����en'r���NY&��l�TGj��D*�73���W�Tڎ�ЮYKÕ�e�ҒV����𗴢��1�P3�}
�6��p[�N9bC��(mu)�,ie!�(�t\[��9�OɈ��e~(���ڹ�Zi����њ��h�h5�=Yz�����/X�ܖJ\ .�]ɰ��1\���'.�d�u�W����73�h�8؟}.7?�i�"��L�몙@g��Q����e~��1�#�o��4�<�T�g�x��4=0�?��Y�O��ޑ������7�����Q����J�7����?櫪�Y���_�q�j��	��	���Y�/a������Ln\_��+����SVe��s��V�vP�s��+'z��GJ�N9w��gg'!�u��	a������؊V� 	$;�ŀ�O�9�wz+����{G�S8W�6�b�9�:*#eW�L�=�Ѝ��ۙ��c1���,M����+k�2��&�QPuv���zΐMY�Á���<_�ny��F��PB~`y Q��@Tq+�*jU"QE}�d�YYJ#� �d	A���L33 ��� �
��y��pԚ��9�`�N4���v>���C� N�F��_hw�hԧ�_�r�T��5zjm�1�Ej|E�CE���g@Y_��\=���v���7�v��_��@tc� ~y�(��r�0F2:]`�l�8�M��b�N���C�`<�2��\<��9n��b�wђ�H\)�����v��΁7��{�R��������p 6��@ެ��(ޝ�9gQM�^E�^E��V�|���6P^ZG�zKg�u�W�M��ī�(���|^͂��PH�ݯ�F�5<��*�����?t��5�](r.~RC�&N����"���8.���7PJ��X�h�)E�����[��4+,G[��
	$�T�H����T�(BQo�z��Ԙ�զ�u��?��o���Yn��K���Y�_��_6���{��S����" V�b}��Tت����rQ@�@���&�r0:骐��i$.�<B:	�v�Tl��ڈ�x��*�_SJ�w+�3��U�@P�v��L���S��p�����p�]�7�k�GWFOt9�(�˹}Jz�3G�9����ʙ��hIrA������^�,����n���;���7&8/�����7)s���Y����+�p�-m:M��Qb37��<�^�ێa���������S���x�����S��_-g�s�{N�\��7�������]o	��|���/�*�p��u+
���]	L�o3�e���S�����#��[�d��i#Os���T���T��O�q�!��T������,�sF��:�i6�B�}r�ҽ>!��ə�|B��'7:,�Oz}��\}M�o�ZV��{*�v%S�J���~�*h��N�촒�������deA=�H�t�[\�K��̤�Wm}Ӳ��jx�..�2�o>�,��FO��SqN�,k��k��k���MgQE5;]����Z��J.��������4���@�X�-,ǜ��4����jZ�}!���Ve+^�7�
5���0m7w�� �|,��������7H���|1V��۟����CV-��Kj5v�"_J���Lᦞ���uL���(�����iR�y���.�z}&=�,�=&�fQ����_���v��ºW4

yz^o;������P�n���V&�kh��740Q/)hUI�J���]�Z݅�J"�"�I����3I	>ʜ'9�g��|A����i�� ѝ*!�������C��UX�{x%#Is�dN_�v[��㳼�`����̑�S~h'�q�T^���G����g��e��r����c��<:�m���xjh��d/��' ����t�T���(��`�T�Dl���P#��#���1�2顧�G���p1ѿлQ���3I�O��O�XH �f*}6q\���Nx�)�>Ѧ����58 	�l��N@q�K$�F4P��\ҙ�f��@Č3`�����n�d�F���}����}x:r���Y���?(S����4�6��ǆ�����@���G6�l~���q�Ռ�
u�[�4ucH�SG�uW6�%_�F���v�j�dN8��d|�@T���:Z�"߃ʤ�ܣ?�tS}���T8���Ž��D���`���Od�I����6x�ei����6�����Y��������Y�����c���E�8f�$}��4����x�����#]�:P�ț(e��4]���JG����<���9�,�C�Sxo��>����p�}�I��L��5䝃f�%�,�XA�d})��鶨�pWl�Z�&�c<ލ�+�ca *RK�8�Q�>���<��w��	ϻh�*�W��y6ߵ=���Eg%�`w�9>A��&^w�v�������i�TFBO�p�̖#h��Ty��&���jP�M;�}�8}g1|+�{u?�56�F�h�kY[_�*�4�3D�؅�0�C�D^F����<�C)_��%,�V3��@n��}�}�y�f�32���߰�+Y�$�P�
�ȟ�)�:�*+�	\>Z�4��և�9Q��<��3#�̧��6$�bװ�dmh8ulnX�UB��Z8E��t|OR�:�2xO�,����E��e�j�)#�!�4Ⱦ���-�D0Z��@M�*$���UZ�=��ܼ�`��o��4x�.��8Gc�W���/^������'^�x��o%c�Ǹ���.'�����z��!�;���������vz���9���EO��0�>��m)j� �#������"{��w�բ�~�� M�I �>�'����-~�5�ɂ���y�bG�U|�}v-��Q�E0�&����~�kr�곋<�^��?%��x�'�3������|���U��9-��j O�$InM���dk	�V�[к��E<"/2�qh7���L�Nܤ�X
D"?��F

!l� a��{�	"�3TY��9�T�S��8��N$�@�d$���{�Ii�e�$�g�HM��s�ĉ��(t���KE	�{�m�EsF�J@6*�����t	��.�v�+�g�x�J$$��)��p�K����k`�]/��Ѷx���2}�_�ߥ4���ڜ���Py�`�8G����`L�F�B������\2��|�wr�w��孻�[��ˏF�۞�<4ڀ����&6.��<r�SF/���@��3�Cw�$�a׽ 	lQ:��#Oy&W������0���瀅^���%G���3j9rwGk>)��~�Z jq�������Z�/w��I�?�{���U4/s���	S��2%s�-|�����A���?E��v%���#l�ѿo������E;D�R�We?�U��Ǩɘ[�9�@���d�$F�^]*7�JPp��o�7li�D��R�6O��Usyub��
)����ĝE�f񂜦�	��a�\Y�k�%���ʙ���H�6	;����*���?^��g��j����Vkm;���>E�{��p���3j������G�k[�I��I��_m�w%�9m��ȫC�����/"��9A?A���`PCh#l��"Z�Æ�J��`���Zl�#�!-_C�s�� �!]Fִ�]	(�L6��9z�8nD�����F�\(�R[`'uY���j7�[X�����={�<���u�	\`��XL��qWu�U>OU�F�8�S�d�>�����˅\>6_A�>��=U�MF�5�WS�A>���'��a�Ի�2b�Z�RX�T�K��Ӭ��U8&�
�I:����s�/.����--~ׂ,�y�+maL��	C�!�6�s�=�
���G6����Z;|�ˮ>�;���<�%��;(5��n���~ wz{�@5r���P�>�b���Y
'�η�*�'��ѐ-����$}"豒|qL$�]r�˼�g�t�ܷ�$�҉�9�?dhL��7ED�5M����5E�YX㮾�)���.�ט"�������g���Yb���3M�W�" ���kM�6��|�[ԣ���������Vs��=�0y�:@�w|�������������{�?u��������l�?Ue�_�G'h�A�{xt�����G�Q����w	؛�!�P�B*R�.n���k����6��;S��6��"�6���|�*8��|��rw��]����U���{/�� ������=ٮ��x���C�|�$�@��ztrj���I��]�7�T��@�X�? ����::Dӯ����Άҗ����>~���wȹ��}����?���㛷߽�ߐ�P��FhUQF��DU3w��.��CO�H��B�H��!�i����'�V��M��ʫ7o>�N�S��M����ͫoe"~��o޽�����@{�- �� �di�vv�,?�TB�EV"����p9K�e?�#��
~XN/�l��W�����_�~|�Ç�{���� �������Is�W�P.?A�Ѡ���ߤ�R��s���0�F�)�JJ��l�S�-�0y�=�T�>8Z���/�f���1)+V���PG6W�(
��8z����u������QJ�,2f`��}8�&O�aI�G��lW^�
�����4����2���vy��L��/�k��O�\@����;ڕ��@
W���z�cp�ɒw��g.F�]} ̉�a} ~��Tc�v�ST.���4T4�-ڏ���e�x9���w���A�/D��#d��ocҕ`�A�CW�FvM!�L�n�C8�\\�C�&4s.����d���~�ģh���˸�3s�?k�6��׻?绻t$\��e��0�m�o/z��'�cW��s6\���X!��#K��pa�pp|���QQ����v���g~�4�_#�h���!�4�s:K	Y�۪�KB���[���hċ`e��*r�E���ZN2B��>����0*��zR�ې���0��NF���h~*2��o�'|��U<��(H��w�
��=��uP+43�Q{�����ї����aJ5�n��h���������6��8!;6���������lK�(#��ʲ�����I�[��O�-��L	�e���]��@[�ۑ뽱��~��H|�E_�T+������f���K���b����4^hlG;�����vJ�Eɷrl�K�s�N����uk���Y 9m|ۡř���9mz9튬j��I�Q��ת�ʣ�0���ܴjю�ع��Ag�X����]dKI���G���$�]��w�az���{$��D��ldw��Ӟ��!+{a�"��c�m��qe~��]%#����L���b�=E��e>���!�˰��TF��;���~���(��A��^�T�|N�
�&�k��<�����������^j�ge:$c*�HF�cġ��������>������ Z 
```
