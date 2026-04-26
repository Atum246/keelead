# Contributing to KeeLead

Thank you for your interest in contributing to KeeLead! 🎉

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm
- Git

### Setup Development Environment

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/keelead.git
cd keelead
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

## 📋 How to Contribute

### 1. Find Something to Work On
- Check [Issues](https://github.com/YOUR_USERNAME/keelead/issues) for open tasks
- Look for labels: `good first issue`, `help wanted`, `bug`, `enhancement`
- Or propose your own idea!

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes
- Write clean, typed TypeScript
- Follow existing code patterns
- Add comments where needed
- Test your changes

### 4. Test Your Changes
```bash
# Build check
npm run build

# Lint check
npm run lint
```

### 5. Commit Your Changes
```bash
git add .
git commit -m "Add: description of your changes"
```

Use conventional commit prefixes:
- `Add:` — New features
- `Fix:` — Bug fixes
- `Update:` — Improvements to existing features
- `Docs:` — Documentation changes
- `Refactor:` — Code refactoring
- `Test:` — Adding tests
- `Chore:` — Maintenance tasks

### 6. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📡 Adding a New Data Source

1. Create a new file in `lib/sources/category/your-source.ts`
2. Extend the `BaseSource` class
3. Implement required methods
4. Register in `lib/sources/index.ts`
5. Add documentation

```typescript
import { BaseSource } from '../base'
import { Lead, SourceSearchOptions } from '../types'

export class YourSource extends BaseSource {
  id = 'your-source'
  name = 'Your Source Name'
  category = 'your-category'
  requiresApiKey = false
  rateLimit = 60

  async search(query: string, options?: SourceSearchOptions): Promise<Lead[]> {
    // Implement search logic
    return []
  }

  async getCompany(domain: string) {
    // Implement company lookup
    return null
  }

  async getContact(email: string) {
    // Implement contact lookup
    return null
  }
}
```

## 🎨 UI Guidelines

- Use the existing dark theme (black background)
- Electric blue (#3b82f6) and emerald (#10b981) as accent colors
- Use shadcn/ui components
- Follow Tailwind CSS patterns
- Ensure responsive design
- Add hover/active states

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test

# Run specific test
npm test -- --grep "email verification"
```

## 📝 Documentation

- Update README.md if adding features
- Add JSDoc comments to functions
- Update API docs if adding endpoints
- Include examples in documentation

## 🐛 Reporting Bugs

When reporting bugs, please include:
1. **Description**: What happened
2. **Steps to Reproduce**: How to trigger the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happened
5. **Environment**: OS, Node version, browser
6. **Screenshots**: If applicable

## 💡 Feature Requests

When requesting features, please include:
1. **Problem**: What problem does this solve?
2. **Solution**: How should it work?
3. **Alternatives**: Any workarounds?
4. **Context**: Who benefits from this?

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the community

## 📞 Getting Help

- Create an Issue for bugs/features
- Join discussions in existing Issues
- Check the README for documentation

## 🙏 Thank You!

Every contribution helps make KeeLead better for everyone. Thank you for taking the time to contribute! ❤️
