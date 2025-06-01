# 🔧 MCP-Driven Development Rules & Guidelines

## 📋 Project Configuration

- **Root Directory**: `/Users/fristname_lastname/Documents/Obsidian/dboard`
- **Project Name**: CPA Analytics Dashboard
- **Architecture**: Next.js 15 + React 19 + TypeScript
- **Management**: TaskMaster MCP integration

---

## 🧩 MCP Tool Distribution & Responsibilities

### 🎯 TaskMaster MCP - Project Management Core

**Primary Responsibilities:**

- Task decomposition and complexity analysis
- Progress tracking and dependency validation
- Project structure maintenance
- Automated task completion reporting
- Subtask generation for complex tasks (>6 complexity)

**Usage Pattern:**

```bash
# Check current task status
get_tasks → get_task → set_task_status → update_task
# Generate reports and manage dependencies
complexity_report → expand_task → next_task
```

### 🔍 Context7 MCP - Technology Research Hub

**Primary Responsibilities:**

- Pre-development documentation lookup
- Best practices and syntax verification
- Library compatibility checking
- Knowledge base updates

**Usage Pattern:**

```bash
# MANDATORY before ANY code generation
resolve-library-id → get-library-docs → [implement] → update memory
```

### 🗂️ Desktop Commander - File System Operations

**Primary Responsibilities:**

- Efficient file management
- Build process integration
- Configuration management
- Script execution

**Usage Pattern:**

```bash
read_file → write_file → edit_block → execute_command
```

### 🌐 Browser MCP + Playwright - E2E Testing

**Primary Responsibilities:**

- Automated UI testing
- Cross-browser compatibility
- Mobile responsive validation
- Performance testing

**Usage Pattern:**

```bash
browser_navigate → browser_snapshot → browser_click → browser_type
```

### 🧠 Knowledge Graph - Memory & Insights

**Primary Responsibilities:**

- Project memory persistence
- Relationship tracking
- Performance analytics
- Decision documentation

**Usage Pattern:**

```bash
create_entities → create_relations → add_observations → search_nodes
```

### 🤔 Sequential Thinking - Complex Problem Solving

**Primary Responsibilities:**

- Architectural decision making
- Complex debugging workflows
- Integration planning
- Multi-step reasoning

**Usage Pattern:**

```bash
sequentialthinking for complex problems requiring multiple steps
```

---

## 📐 Mandatory Development Rules

### Rule 1: Context7 Pre-Research Protocol

**BEFORE ANY CODE GENERATION:**

1. ✅ `resolve-library-id` for all mentioned technologies
2. ✅ `get-library-docs` to verify current syntax and best practices
3. ✅ Check for breaking changes or deprecations
4. ✅ Update Knowledge Graph with findings
5. ✅ Apply current standards to implementation

### Rule 2: Comprehensive Testing Requirements

**EVERY TASK MUST INCLUDE:**

- ✅ **Vitest Unit Tests**: All functions, components, utilities
- ✅ **Vitest Integration Tests**: Cross-component interactions
- ✅ **Playwright E2E Tests**: Complete user workflows
- ✅ **Test Coverage**: Minimum 80% requirement
- ✅ **Performance Benchmarks**: Load time and interaction metrics

### Rule 3: Sequential Test Execution Strategy

1. **Unit Tests First**: Individual component validation
2. **Integration Tests Second**: Service interaction validation
3. **E2E Tests Final**: Complete workflow validation
4. **Cross-Feature Testing**: When transitioning between major features

### Rule 4: Standardized Completion Reporting

**Required Format:**

```markdown
📋 **Task X.X Completion Report**
✅ **Features Implemented:**

- Detailed feature list with technical specifications
- Files created/modified with purpose explanation
  🐛 **Bugfixes:**
- Issues discovered and resolved
- Root cause analysis
  🧪 **Test Results:**
- Unit test coverage and results
- Integration test scenarios
- E2E test workflows
- Performance benchmarks
  📚 **Documentation Created:**
- Technical documentation updates
- API documentation changes
  **Next Steps:** Ready for [next-task] | Requires approval
```

### Rule 5: Git Workflow & Memory Updates

**After approval:**

1. ✅ Create semantic commit with standardized message
2. ✅ Update Knowledge Graph with implementation insights
3. ✅ Record MCP effectiveness metrics
4. ✅ Update project documentation
5. ✅ Proceed to next task/feature

### Rule 6: Continuous Memory & Documentation Updates

- ✅ **Real-time Memory Updates**: Record decisions immediately
- ✅ **Documentation Synchronization**: Keep all docs current
- ✅ **Performance Tracking**: Monitor MCP tool effectiveness
- ✅ **Knowledge Sharing**: Update team knowledge base

### Rule 7: MCP Effectiveness Evaluation

**Continuous Assessment:**

- ✅ **Response Times**: Track tool performance
- ✅ **Accuracy Metrics**: Validate information quality
- ✅ **Integration Success**: Measure workflow efficiency
- ✅ **Bottleneck Identification**: Address inefficiencies

---

## 🧪 Testing Strategy Implementation

### Unit Testing with Vitest

**Components:**

- Props validation and state management
- Event handling and user interactions
- Conditional rendering scenarios
- Error boundary behavior

**Utilities & Services:**

- Data transformation functions
- Business logic calculations
- API service interactions
- State management operations

### Integration Testing with Vitest

**Cross-Component Integration:**

- Parent-child communication
- State sharing mechanisms
- Event propagation
- Context provider functionality

### End-to-End Testing with Playwright

**User Workflow Testing:**

- Complete user journeys
- Multi-tab navigation
- Filter application cycles
- Export functionality

**Performance & Compatibility:**

- Cross-browser testing
- Mobile responsive validation
- Load time performance
- Accessibility compliance

---

## 🔄 Development Workflow

### Phase 1: Research & Documentation (Context7)

1. **Identify Dependencies**: Scan for mentioned technologies
2. **Resolve Documentation**: Use Context7 for current specs
3. **Gather Context**: Collect best practices and patterns
4. **Update Memory**: Record findings in Knowledge Graph

### Phase 2: Implementation (TaskMaster + Context7)

1. **Task Analysis**: Use TaskMaster for complexity assessment
2. **Code Generation**: Apply Context7 findings to implementation
3. **Testing Suite**: Comprehensive Vitest + Playwright tests
4. **Quality Gates**: TypeScript, ESLint, Prettier validation

### Phase 3: Validation & Commit (All MCPs)

1. **Test Execution**: Run full test suite
2. **Performance Check**: Validate benchmarks
3. **Documentation Update**: Sync all project docs
4. **Semantic Commit**: Following conventional commit standards

---

## 📊 Quality Gates & Automation

### Pre-Commit Quality Gates

- ✅ TypeScript compilation (zero errors)
- ✅ ESLint validation (no warnings)
- ✅ Prettier formatting (consistent style)
- ✅ Unit test execution (all passing)
- ✅ Type coverage (minimum standards)

### Pre-Push Quality Gates

- ✅ Full test suite (unit + integration + E2E)
- ✅ Performance benchmarks (no regressions)
- ✅ Build validation (successful production build)
- ✅ Documentation currency (all docs updated)
- ✅ Security scanning (dependency vulnerabilities)

### Continuous Integration

- ✅ Automated testing on every push
- ✅ Performance monitoring and metrics
- ✅ Code quality analysis and reporting
- ✅ Dependency update notifications

---

## 🎯 Current Project Status

### ✅ Completed Foundation (Phase 1)

- **Task 1.1**: Next.js 15 project initialization
- **Task 1.2**: TypeScript strict mode configuration
- **Task 1.3**: ESLint enhanced rules setup
- **Task 1.4**: Prettier code formatting
- **Task 1.5**: Environment variables structure
- **Task 1.9**: Git semantic versioning with hooks

### 🔄 Priority Queue

1. **Task 1.7**: Vitest setup (IMMEDIATE NEXT)
2. **Task 1.8**: Playwright E2E testing setup
3. **Task 1.6**: Build and deployment configuration
4. **Task 1.10**: Quality gates workflow integration

### 📈 Progress Metrics

- **Overall Progress**: 24% subtask completion (6/25)
- **Phase 1 Progress**: ~50% foundation complete
- **Testing Infrastructure**: Critical priority (pending)
- **Quality Assurance**: Git hooks ✅, testing tools needed

---

## 🚀 Next Steps

### Immediate Actions Required

1. **Start Task 1.7**: Vitest setup following Context7 research protocol
2. **Research Dependencies**: Vitest + testing ecosystem documentation
3. **Implement Comprehensive Testing**: Unit + integration test foundation
4. **Validate Quality Gates**: Ensure all tests integrate with git hooks

### Success Criteria for Next Task

- ✅ Vitest configured with TypeScript support
- ✅ Test scripts integrated in package.json
- ✅ Sample tests for existing components
- ✅ Coverage reporting configured
- ✅ Git hooks integration verified
- ✅ Documentation and completion report generated

---

## 📚 Reference Documentation

### Project Files

- **PRD**: `/scripts/prd.txt` - Product Requirements Document
- **Git Rules**: `/docs/git-semantic-versioning.md` - Semantic versioning guide
- **Environment**: `/docs/ENVIRONMENT_SETUP.md` - Environment configuration
- **Tasks**: `/tasks/tasks.json` - TaskMaster project structure

### External Resources

- **Context7 Documentation**: For current technology specifications
- **TaskMaster Guide**: For project management workflows
- **Testing Best Practices**: Vitest + Playwright integration patterns

---

> ✅ **MCP-Driven Development Rules established and documented. Ready to proceed with Task 1.7 - Vitest setup following comprehensive Context7 research protocol.**
