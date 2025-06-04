#!/bin/bash

# Fix ESLint warnings automatically

echo "🔧 Fixing ESLint warnings..."

# Fix nullish coalescing
sed -i '' 's/|| 0/?? 0/g' src/components/performance-dashboard.tsx
sed -i '' 's/|| /null || //?? /g' src/components/ui/dropdown-menu.tsx
sed -i '' 's/|| /null || //?? /g' src/components/ui/filter-bar.tsx  
sed -i '' 's/|| /null || //?? /g' src/components/ui/page-header.tsx
sed -i '' 's/|| /null || //?? /g' src/lib/env.ts
sed -i '' 's/|| /null || //?? /g' src/lib/performance.ts

# Fix string concatenation in performance-reporter.ts
sed -i '' 's/+/ + /g' src/lib/performance-reporter.ts

# Fix interface to type in env.d.ts
sed -i '' 's/interface /type /g' src/types/env.d.ts

echo "✅ Fixed most lint issues"
echo "🔍 Running lint to verify..."
npm run lint:strict
