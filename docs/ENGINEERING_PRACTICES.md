# Lumo Task — 工程实践规范

> 本文档是所有开发工作的行为准则，持续更新。每次引入新的规范时，同步补充到对应章节。
>
> **原则**：规范不是约束，是降低认知负担、提高协作效率的工具。

---

## 目录

1. [核心编程哲学](#1-核心编程哲学)
2. [代码质量原则](#2-代码质量原则)
3. [前端专项规范](#3-前端专项规范)
4. [研发流程规范](#4-研发流程规范)
5. [Git 与版本控制](#5-git-与版本控制)
6. [CI/CD 与工程化](#6-cicd-与工程化)
7. [Code Review 标准](#7-code-review-标准)
8. [安全与隐私](#8-安全与隐私)
9. [性能基准](#9-性能基准)
10. [文档规范](#10-文档规范)
11. [本项目专项约定](#11-本项目专项约定)

---

## 1. 核心编程哲学

这些是所有决策的元原则，具体规范都从这里推导出来。

### 1.1 KISS — Keep It Simple, Stupid

> *"简单是可靠性的前提。"* — Edsger Dijkstra

- **做到刚好够用**，不为假设的未来需求写代码
- 三行解决的问题不写十行，一个函数能做的事不拆成三个
- 当你觉得需要写注释解释代码在做什么，说明代码本身太复杂了

```typescript
// ❌ 过度设计
class TaskManagerFactory {
  createManager(type: string): AbstractTaskManager { ... }
}

// ✅ 刚好够用
function createTask(title: string): Task { ... }
```

### 1.2 YAGNI — You Aren't Gonna Need It

> *"永远不要因为你预测将来会需要，就现在添加功能。"* — Ron Jeffries

- 不写当前 ticket 不要求的代码
- 不预留扩展点（除非明确知道会用到）
- 不写 `// TODO: support multiple providers later` 然后从不实现

### 1.3 DRY — Don't Repeat Yourself

> 知识在系统中应该有**唯一、明确、权威**的表示。

- 重复出现 **3 次及以上** 才考虑抽象，2 次的重复是巧合
- DRY 针对的是**知识和逻辑**，不是代码字符串——相似的代码不一定要合并
- 过度 DRY 比适度重复危害更大（Wrong Abstraction）

### 1.4 单一职责 (SRP)

每个模块/函数/组件只做一件事，只有一个改变它的理由。

```typescript
// ❌ 一个函数做三件事
async function handleTaskSubmit(data) {
  const validated = validate(data)    // 验证
  await api.post('/tasks', validated)  // 网络请求
  toast.show('Task created')           // UI 反馈
}

// ✅ 职责分离
const validated = validateTask(data)
const task = await tasksApi.create(validated)
notifySuccess('Task created')
```

### 1.5 关注点分离 (Separation of Concerns)

- **数据获取** 与 **数据展示** 分开
- **业务逻辑** 在 store/hooks 里，不在 JSX 里
- **样式** 不混入逻辑，**逻辑** 不混入样式

### 1.6 显式优于隐式

- 函数参数、返回值明确标注类型
- 依赖关系通过参数注入，不通过全局状态隐式传递
- 副作用要显式标注（命名为 `fetchXxx`、`updateXxx`，而非 `processXxx`）

---

## 2. 代码质量原则

### 2.1 命名即文档

好名字让注释变得多余。

| 场景 | ❌ | ✅ |
|---|---|---|
| 布尔值 | `flag`, `data`, `temp` | `isLoading`, `hasError`, `canSubmit` |
| 函数 | `handle()`, `process()` | `fetchTodayTasks()`, `markTaskComplete()` |
| 常量 | `n`, `t`, `MAX` | `MAX_RETRY_COUNT`, `POMO_DURATION_SECS` |
| 类型 | `Obj`, `Data` | `Task`, `AIRecommendation` |

规则：
- **函数名用动词**：`get`, `fetch`, `create`, `update`, `delete`, `validate`, `format`
- **布尔值用 is/has/can/should 前缀**
- **不缩写**（除非是领域通用缩写：`id`, `url`, `api`）
- **长度反映作用域**：局部变量可短（`i`, `e`），模块级必须长且清晰

### 2.2 函数规范

```typescript
// 函数的四个黄金标准：
// 1. 只做一件事
// 2. 输入输出类型明确
// 3. 无隐藏副作用（纯函数优先）
// 4. 长度不超过 40 行（超过考虑拆分）

// ❌
function doStuff(x: any) {
  // 50 行代码做了 5 件事
}

// ✅
function formatTaskTitle(title: string, lang: Language): string {
  return lang === 'zh' && title.zh ? title.zh : title.en
}
```

### 2.3 注释原则

**注释解释 WHY，代码解释 WHAT。**

```typescript
// ❌ 解释 what（代码已经说清楚了）
// increment count by 1
count++

// ✅ 解释 why（代码无法传达的背景）
// Safari 不支持 requestIdleCallback，用 setTimeout 降级
const schedule = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 1))

// ✅ 解释隐藏约束
// MSW 的 onUnhandledRequest: 'bypass' 让未拦截的请求透传到真实服务器
// 切换到生产 API 时无需修改任何业务代码
```

禁止：
- 注释掉的死代码（直接删，git 有历史）
- TODO 注释（应该是 GitHub Issue）
- 描述显而易见的事情

### 2.4 错误处理

- **在边界处理**，不在每一层都捕获
- **错误要有意义**，附带上下文信息
- **失败要快速失败**，不要静默吞掉错误

```typescript
// ❌ 静默吞掉错误
try {
  await fetchTasks()
} catch (e) {}

// ✅ 在调用层处理，携带上下文
try {
  await fetchTasks()
} catch (e) {
  set({ error: `Failed to load tasks: ${e.message}`, loading: false })
}
```

### 2.5 Magic Number 禁令

```typescript
// ❌
if (secondsLeft < 300) { ... }
setTimeout(fn, 86400000)

// ✅
const BREAK_WARNING_THRESHOLD_SECS = 300
const ONE_DAY_MS = 24 * 60 * 60 * 1000
```

---

## 3. 前端专项规范

### 3.1 组件设计原则

**单组件 = 单屏幕关注点**

```
组件层次：
Screen（整页）
  └── Section（区块）
        └── Component（复用单元）
              └── Primitive（原子：Btn, Input, Chip）
```

规则：
- 组件只接收它**真正需要**的 props，不透传大对象
- props 不超过 **6 个**，超过考虑用 context 或拆分组件
- 不在 JSX 里写业务逻辑，逻辑提到 store 或自定义 hook

```tsx
// ❌ props drilling + 内联业务逻辑
<TaskRow
  task={task}
  onComplete={() => {
    api.patch(`/tasks/${task.id}`, { status: 'completed' })
    setTasks(tasks.filter(t => t.id !== task.id))
  }}
/>

// ✅ 逻辑封装在 store，组件只关心展示
<TaskRow task={task} />
// TaskRow 内部调用 useTasksStore().completeTask(task.id)
```

### 3.2 状态管理原则

**状态放在离它最近的地方。**

| 状态类型 | 存放位置 |
|---|---|
| 服务器状态（task 列表等） | Zustand store |
| 全局 UI 状态（accent、lang） | Zustand store + localStorage |
| 组件内部 UI 状态（modal open） | `useState` |
| 表单状态 | `useState`（局部）|
| URL 状态（当前 tab） | React Router |

禁止：
- 在组件里直接调用 `fetch`（统一走 store action）
- 在 store 里写 UI 逻辑（toast、navigation）
- 把 store 当 props 的替代品（仍需合理组件化）

### 3.3 TypeScript 规范

```typescript
// ✅ 显式类型，禁止 any
function getTasksByQuadrant(quadrant: Quadrant): Task[] { ... }

// ✅ 用 type 定义数据结构，interface 定义可扩展契约
type Task = { id: string; title: LocalizedText; ... }
interface ApiResponse<T> { data: T; error?: string }

// ✅ 用 as const 替代枚举
const QUADRANTS = ['Q1', 'Q2', 'Q3', 'Q4'] as const
type Quadrant = typeof QUADRANTS[number]

// ❌ 禁止
const data: any = await fetch(...)
function process(x): any { ... }
// @ts-ignore（极特殊情况需加注释说明原因）
```

### 3.4 CSS / 样式规范

- 使用 **CSS Modules**（已建立），禁止全局 class
- 所有值从 **Design Token** 变量取，禁止硬编码颜色/间距
- 响应式断点统一，不在组件里单独定义
- 动效时长从 `--duration-*` token 取

```css
/* ❌ */
.btn { background: #00C896; padding: 8px 16px; }

/* ✅ */
.btn { background: var(--accent); padding: var(--space-2) var(--space-4); }
```

### 3.5 性能规范

- 列表渲染必须有稳定的 `key`（用 `id`，不用 `index`）
- 大列表（>100 项）使用虚拟滚动
- 图片懒加载，避免 layout shift
- 不在 render 函数里创建对象/函数（用 `useMemo`/`useCallback`）
- `useEffect` 的依赖数组必须完整

---

## 4. 研发流程规范

### 4.1 需求确认（开始编码前）

开始写代码前必须明确：
1. **User Story**：谁在什么场景下需要做什么
2. **验收标准**：怎么算完成了
3. **边界条件**：异常情况怎么处理
4. **影响范围**：会影响哪些已有功能

不清楚就问，不要靠猜。

### 4.2 编码节奏（番茄工作法）

大厂内部普遍认可的编码节奏：

```
1. 理解需求（10%）→ 设计接口/数据结构
2. 写核心逻辑（60%）→ 不追求完美，先让它跑起来
3. 重构 + 自测（20%）→ 清理代码，处理边界
4. 写文档/注释（10%）→ 更新 openapi.yaml，PR 描述
```

### 4.3 自测清单（PR 前必做）

- [ ] `pnpm type-check` 通过
- [ ] `pnpm lint` 通过（零 warning）
- [ ] `pnpm build` 通过
- [ ] 在浏览器中实际操作过 happy path
- [ ] 测试过主要边界情况（空数据、加载中、失败状态）
- [ ] 没有 `console.log` 残留
- [ ] 没有硬编码的密钥或 URL

---

## 5. Git 与版本控制

### 5.1 分支策略（Trunk-Based Development）

```
main（受保护，只能通过 PR 合入）
 ├── feat/add-task-drag-drop
 ├── fix/focus-timer-pause-bug
 ├── refactor/store-split
 └── chore/upgrade-msw-v3
```

规则：
- **feature 分支生命周期 ≤ 2 天**，越短越好
- 超过 2 天的特性用 **Feature Flag** 分段合入
- 禁止 long-lived 分支（develop、staging 分支）
- 合入后立即删除 feature 分支

### 5.2 Commit 规范（Conventional Commits）

```
<type>(<scope>): <subject>

[可选 body]

[可选 footer]
```

**类型（type）**：

| Type | 用途 | 触发版本 |
|---|---|---|
| `feat` | 新功能 | MINOR |
| `fix` | Bug 修复 | PATCH |
| `refactor` | 重构（不影响功能） | — |
| `perf` | 性能优化 | PATCH |
| `style` | 样式/格式（不影响逻辑） | — |
| `test` | 测试 | — |
| `docs` | 文档 | — |
| `chore` | 工程配置、依赖 | — |
| `ci` | CI/CD 变更 | — |
| `revert` | 回滚 | — |

**作用域（scope）**（本项目）：

`today` · `matrix` · `focus` · `settings` · `auth` · `store` · `api` · `ci` · `deps`

**示例**：
```
feat(today): add conviction percentage display on task card
fix(focus): timer not resuming after browser tab switch
refactor(store): split task store into tasks and today slices
chore(deps): upgrade msw to 2.8.0
ci: add bundle size report to build summary
```

**规则**：
- subject 用英文，**动词开头**，**不加句号**
- subject 不超过 72 字符
- 一个 commit 只做一件事
- **禁止**：`update`, `fix bug`, `WIP`, `temp`, `test123`

### 5.3 Commit 粒度

```
✅ 正确粒度：
  feat(matrix): add QuadrantGrid component
  feat(matrix): wire QuadrantGrid to task store
  feat(matrix): add ClassifyDialog for AI classification

❌ 太粗：
  feat: implement matrix screen

❌ 太细：
  fix: typo in variable name
  fix: add missing semicolon
  fix: revert last change
```

---

## 6. CI/CD 与工程化

### 6.1 流水线架构

```
PR 阶段（每次 push 自动触发）
  ├── lint          并行
  ├── type-check    并行
  └── build ───────（依赖上两个通过）
        └── ci-success gate（branch protection 的唯一检查点）

合入 main 后
  └── deploy → GitHub Pages（production environment）
```

### 6.2 CI 失败处理原则

- **CI 失败 = 最高优先级**，必须在 30 分钟内修复或 revert
- **不能用 `// @ts-ignore` 或 `/* eslint-disable */` 绕过 CI**
- 修复 CI 失败的 commit 格式：`fix(ci): resolve type error in TaskRow`

### 6.3 部署原则

- **main 分支始终是可部署状态**（永远不 break main）
- 部署失败立即 revert，不在生产环境 hotfix
- 每次部署自动记录：commit SHA、部署人、时间

### 6.4 依赖管理

- 依赖版本通过 **Dependabot** 自动升级（每周一）
- 升级 PR 必须通过 CI 才能合入
- **禁止**手动修改 `pnpm-lock.yaml`
- 新增依赖前评估：包大小、维护状态、许可证

---

## 7. Code Review 标准

### 7.1 Author 的责任

提 PR 前：
- PR 描述清楚变更内容和原因（填写 PR 模板）
- 关联对应的 Issue
- 自测通过，CI 绿
- 标注需要 Reviewer 重点关注的地方

PR 大小：
- **单个 PR 的文件改动 ≤ 400 行**（不含自动生成）
- 超过 400 行必须拆分

### 7.2 Reviewer 的责任

Review 重点（按优先级）：

1. **正确性**：逻辑是否正确，边界情况是否处理
2. **安全性**：是否有 XSS、敏感信息泄露、权限漏洞
3. **可维护性**：命名是否清晰，是否遵循既有模式
4. **性能**：是否有明显的性能问题
5. **测试**：逻辑是否可验证

**Review 用语规范**：

| 前缀 | 含义 |
|---|---|
| `[MUST]` | 必须修改，否则不能合入 |
| `[SHOULD]` | 强烈建议，需回复说明 |
| `[NIT]` | 小建议，可忽略 |
| `[Q]` | 提问，不一定需要改 |
| `[PRAISE]` | 值得肯定的写法 |

**Review SLA**：工作日内 24 小时内完成 Review。

### 7.3 合入标准

- CI 全绿（`CI Passed` status check）
- 至少 1 人 Approve
- 没有未解决的 `[MUST]` 评论
- 分支与 main 同步（up to date）

---

## 8. 安全与隐私

### 8.1 绝对禁止

- 提交任何密钥、token、密码到 Git（即使是测试用的）
- 在前端代码里硬编码后端 URL（用环境变量）
- 在 `console.log` 里输出用户数据或 API Key
- 在注释里留下废弃的密钥

### 8.2 API Key 处理

```typescript
// ❌ 绝对不行
const API_KEY = 'sk-xxxxx'

// ✅ 通过环境变量（只在服务端）
const API_KEY = process.env.OPENAI_API_KEY

// ✅ 前端展示时永远 mask
api_key_masked: '••••••••' + key.slice(-4)
```

### 8.3 用户数据

- 最小化收集，不收集不需要的数据
- 本地存储的数据（localStorage）不存储敏感信息
- API 请求不在 URL query string 里传密码或 token

### 8.4 依赖安全

- 合并 Dependabot 的安全更新 PR 优先级最高
- 新增 npm 包前检查是否有已知 CVE

---

## 9. 性能基准

### 9.1 前端性能目标

| 指标 | 目标 |
|---|---|
| 首屏可交互时间 (TTI) | < 2s (3G 网络) |
| JS Bundle 大小 | < 300KB gzipped |
| CSS Bundle 大小 | < 50KB gzipped |
| 操作响应时间（点击→反馈） | < 100ms |
| 动画帧率 | 60fps |

当前状态（2026-05）：JS `70.7KB` gzip · CSS `7.0KB` gzip ✅

### 9.2 性能预算执行

- CI 的 build job 会输出 bundle size
- 如果 PR 导致 bundle 增大超过 **20KB gzip**，需要在 PR 描述中说明原因

---

## 10. 文档规范

### 10.1 文档位置

| 文档类型 | 位置 |
|---|---|
| 需求/产品文档 | `docs/PRD.md` |
| 用户故事/用例 | `docs/UCD.md` |
| 工程实践（本文） | `docs/ENGINEERING_PRACTICES.md` |
| API 合约 | `api/openapi.yaml` |
| 变更记录 | `CHANGELOG.md`（待建立） |

### 10.2 API 文档同步

**任何涉及 API 变更的 PR，必须同步更新 `api/openapi.yaml`。**

这包括：新增接口、修改字段、变更请求/响应结构、修改状态码。

### 10.3 本文档更新规则

当引入新规范时，在本文件对应章节追加，格式：

```markdown
> **[YYYY-MM-DD 新增]** 规范内容描述
```

---

## 11. 本项目专项约定

### 11.1 技术栈决策记录

| 决策 | 选择 | 原因 |
|---|---|---|
| 构建工具 | Vite | 开发启动快，GitHub Pages 部署简单 |
| 状态管理 | Zustand | 比 Redux 轻量，API 简洁，DevTools 支持好 |
| Mock 层 | MSW 2.x | Service Worker 级别拦截，与真实 fetch 行为一致，切换后端零改动 |
| 路由 | React Router v6 | 标准，与 GitHub Pages hash/history 模式兼容 |
| 样式 | CSS Modules + CSS Variables | 无额外运行时，Token 系统支持动态主题 |
| 类型 | TypeScript strict mode | 最大程度类型安全 |

### 11.2 目录结构约定

```
src/
├── types/          # 全局类型定义（api.ts, ui.ts）
├── lib/            # 工具库（api client, i18n）
├── mocks/          # MSW mock 层（Phase 1，上线后删除）
├── store/          # Zustand stores（一个领域一个文件）
├── styles/         # 全局样式（只有 tokens.css）
├── components/
│   ├── shell/      # 布局壳（Sidebar, Topbar）
│   ├── common/     # 复用 UI 原子（Btn, Input, Chip）
│   └── ai/         # AI 相关展示组件
├── screens/        # 页面级组件（每个 screen 一个目录）
└── modals/         # 全局 Modal（QuickCreate 等）
```

**新增文件的命名规则**：
- 组件：`PascalCase.tsx` + `PascalCase.module.css`
- Store：`camelCase.ts`
- 工具函数：`camelCase.ts`
- 类型文件：`camelCase.ts`

### 11.3 国际化约定

- 所有用户可见的字符串必须走 `t('key')` 函数
- 新增字符串在 `src/lib/i18n.ts` 的 `en` 和 `zh` 两个对象同步添加
- Key 命名：`{screen}_{element}_{state}`，例如 `today_empty_title`

### 11.4 API 合约约定

- 所有网络请求统一走 `src/lib/api/` 下的模块，**禁止在组件/store 外直接调用 `fetch`**
- Mock handler 的响应结构必须与 `api/openapi.yaml` 一致
- 新增接口：先在 `openapi.yaml` 定义 → 再写 mock handler → 再写 API client

### 11.5 分支命名规范

```
feat/<简短描述>        # 新功能
fix/<简短描述>         # Bug 修复
refactor/<简短描述>    # 重构
chore/<简短描述>       # 工程配置
docs/<简短描述>        # 文档

示例：
feat/matrix-drag-drop
fix/focus-timer-safari
refactor/today-card-split
chore/upgrade-zustand-v5
docs/update-api-spec
```

---

## 附录：常用检查命令

```bash
# 日常开发
pnpm dev                # 启动开发服务器（含 MSW mock）
pnpm type-check         # TypeScript 检查
pnpm lint               # ESLint 检查
pnpm build              # 生产构建（type-check + vite build）

# PR 前自检（一键）
pnpm type-check && pnpm lint && pnpm build && echo "✅ Ready to PR"
```

---

*最后更新：2026-05-14*
*维护者：@lumoryx*
