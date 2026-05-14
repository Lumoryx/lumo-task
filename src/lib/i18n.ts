import { Language } from '../types/ui'

export const translations = {
  en: {
    // Navigation
    nav_today: 'Today',
    nav_matrix: 'Matrix',
    nav_focus: 'Focus',
    nav_settings: 'Settings',

    // Today screen
    today_title: 'Today',
    today_date: 'Your day, your focus.',
    today_empty_title: "What's on your mind?",
    today_empty_sub: 'Type a task, and Lumo will classify it for you.',
    today_recommend_label: 'Lumo recommends',
    today_not_now: 'Not Now',
    today_start_focus: 'Start Focus',
    today_mark_done: 'Mark Done',
    today_conviction: 'conviction',
    today_in_progress: 'In progress',
    today_session_active: 'Focus session running',
    today_resume: 'Resume',
    today_end_session: 'End Session',

    // Matrix screen
    matrix_title: 'Matrix',
    q1_label: 'Urgent & Important',
    q2_label: 'Not Urgent, Important',
    q3_label: 'Urgent, Not Important',
    q4_label: 'Neither',
    unclassified_label: 'Unclassified',
    classify_all: 'Classify All',
    add_task: 'Add Task',
    classify_confirm_title: 'AI Classification Results',
    classify_confirm_sub: 'Review and accept the suggested quadrants',
    classify_accept_all: 'Accept All',
    classify_cancel: 'Cancel',

    // Focus screen
    focus_title: 'Focus',
    focus_pomodoro: 'Pomodoro',
    focus_break: 'Short Break',
    focus_long_break: 'Long Break',
    focus_start: 'Start',
    focus_pause: 'Pause',
    focus_skip: 'Skip',
    focus_abandon: 'Abandon',
    focus_complete: 'Complete',
    settlement_title: 'Session complete!',
    settlement_pomos: 'Pomodoros completed',
    settlement_actual_mins: 'Time spent',
    settlement_next: 'Next task',
    settlement_done: 'Done for now',

    // Settings
    settings_title: 'Settings',
    settings_ai: 'AI',
    settings_appearance: 'Appearance',
    settings_sync: 'Sync',
    settings_privacy: 'Privacy',
    settings_account: 'Account',

    // AI settings
    ai_provider: 'Provider',
    ai_api_key: 'API Key',
    ai_model: 'Model',
    ai_test: 'Test Connection',
    ai_test_ok: 'Connection successful',
    ai_test_fail: 'Connection failed',

    // Appearance settings
    appearance_accent: 'Accent Color',
    appearance_language: 'Language',
    appearance_density: 'Density',
    appearance_reduced_motion: 'Reduce Motion',
    accent_green: 'Lumo Green',
    accent_violet: 'Violet',
    accent_coral: 'Coral',
    accent_gold: 'Gold',
    density_compact: 'Compact',
    density_default: 'Default',
    density_spacious: 'Spacious',

    // Task card
    task_due: 'Due',
    task_pomos: 'Pomos',
    task_mins: 'min',
    task_edit: 'Edit',
    task_delete: 'Delete',
    task_move: 'Move to',
    task_today_toggle: 'Add to Today',
    task_complete: 'Complete',

    // Quick create
    quick_create_title: 'New Task',
    quick_create_placeholder: 'What needs to be done?',
    quick_create_quadrant: 'Quadrant',
    quick_create_priority: 'Priority',
    quick_create_due: 'Due Date',
    quick_create_pomos: 'Est. Pomodoros',
    quick_create_save: 'Create Task',
    quick_create_cancel: 'Cancel',

    // Parse confirm
    parse_confirm_title: 'AI Parsed Your Task',
    parse_confirm_sub: 'Review and adjust before creating',
    parse_accept: 'Create Task',
    parse_edit: 'Edit',

    // Auth
    auth_login: 'Sign In',
    auth_register: 'Create Account',
    auth_email: 'Email',
    auth_password: 'Password',
    auth_name: 'Your Name',
    auth_confirm_password: 'Confirm Password',
    auth_no_account: 'Don\'t have an account?',
    auth_has_account: 'Already have an account?',
    auth_sign_up: 'Sign Up',
    auth_sign_in: 'Sign In',
    auth_continue_guest: 'Continue as Guest',

    // Onboarding
    onboarding_title: 'Welcome to Lumo',
    onboarding_sub: 'AI-powered task management for deep work',
    onboarding_step1: 'Choose your accent',
    onboarding_step2: 'Set up AI (optional)',
    onboarding_step3: "You're all set",
    onboarding_next: 'Continue',
    onboarding_finish: 'Start Using Lumo',
    onboarding_skip: 'Skip',

    // Common
    cancel: 'Cancel',
    save: 'Save',
    done: 'Done',
    loading: 'Loading…',
    error: 'Something went wrong',
    retry: 'Retry',
    search: 'Search tasks…',
    no_tasks: 'No tasks here',
  },
  zh: {
    // Navigation
    nav_today: '今日',
    nav_matrix: '四象限',
    nav_focus: '专注',
    nav_settings: '设置',

    // Today screen
    today_title: '今日',
    today_date: '你的一天，专注于此。',
    today_empty_title: '你在想什么？',
    today_empty_sub: '输入一个任务，Lumo 会为你分类。',
    today_recommend_label: 'Lumo 推荐',
    today_not_now: '暂时不',
    today_start_focus: '开始专注',
    today_mark_done: '标记完成',
    today_conviction: '置信度',
    today_in_progress: '进行中',
    today_session_active: '专注会话运行中',
    today_resume: '继续',
    today_end_session: '结束会话',

    // Matrix screen
    matrix_title: '四象限',
    q1_label: '紧急且重要',
    q2_label: '不紧急但重要',
    q3_label: '紧急但不重要',
    q4_label: '既不紧急也不重要',
    unclassified_label: '未分类',
    classify_all: '全部分类',
    add_task: '添加任务',
    classify_confirm_title: 'AI 分类结果',
    classify_confirm_sub: '查看并接受建议的象限',
    classify_accept_all: '全部接受',
    classify_cancel: '取消',

    // Focus screen
    focus_title: '专注',
    focus_pomodoro: '番茄钟',
    focus_break: '短休息',
    focus_long_break: '长休息',
    focus_start: '开始',
    focus_pause: '暂停',
    focus_skip: '跳过',
    focus_abandon: '放弃',
    focus_complete: '完成',
    settlement_title: '会话完成！',
    settlement_pomos: '完成番茄数',
    settlement_actual_mins: '专注时长',
    settlement_next: '下一个任务',
    settlement_done: '暂时结束',

    // Settings
    settings_title: '设置',
    settings_ai: 'AI',
    settings_appearance: '外观',
    settings_sync: '同步',
    settings_privacy: '隐私',
    settings_account: '账户',

    // AI settings
    ai_provider: '服务商',
    ai_api_key: 'API 密钥',
    ai_model: '模型',
    ai_test: '测试连接',
    ai_test_ok: '连接成功',
    ai_test_fail: '连接失败',

    // Appearance settings
    appearance_accent: '强调色',
    appearance_language: '语言',
    appearance_density: '密度',
    appearance_reduced_motion: '减少动效',
    accent_green: 'Lumo 绿',
    accent_violet: '紫罗兰',
    accent_coral: '珊瑚',
    accent_gold: '金色',
    density_compact: '紧凑',
    density_default: '默认',
    density_spacious: '宽松',

    // Task card
    task_due: '截止',
    task_pomos: '番茄',
    task_mins: '分钟',
    task_edit: '编辑',
    task_delete: '删除',
    task_move: '移动到',
    task_today_toggle: '加入今日',
    task_complete: '完成',

    // Quick create
    quick_create_title: '新建任务',
    quick_create_placeholder: '需要做什么？',
    quick_create_quadrant: '象限',
    quick_create_priority: '优先级',
    quick_create_due: '截止日期',
    quick_create_pomos: '预计番茄数',
    quick_create_save: '创建任务',
    quick_create_cancel: '取消',

    // Parse confirm
    parse_confirm_title: 'AI 解析了你的任务',
    parse_confirm_sub: '创建前请确认',
    parse_accept: '创建任务',
    parse_edit: '编辑',

    // Auth
    auth_login: '登录',
    auth_register: '创建账户',
    auth_email: '邮箱',
    auth_password: '密码',
    auth_name: '你的名字',
    auth_confirm_password: '确认密码',
    auth_no_account: '还没有账户？',
    auth_has_account: '已有账户？',
    auth_sign_up: '注册',
    auth_sign_in: '登录',
    auth_continue_guest: '以访客身份继续',

    // Onboarding
    onboarding_title: '欢迎使用 Lumo',
    onboarding_sub: 'AI 驱动的深度工作任务管理',
    onboarding_step1: '选择强调色',
    onboarding_step2: '设置 AI（可选）',
    onboarding_step3: '一切就绪',
    onboarding_next: '继续',
    onboarding_finish: '开始使用 Lumo',
    onboarding_skip: '跳过',

    // Common
    cancel: '取消',
    save: '保存',
    done: '完成',
    loading: '加载中…',
    error: '出错了',
    retry: '重试',
    search: '搜索任务…',
    no_tasks: '这里没有任务',
  },
} as const

export type TranslationKey = keyof typeof translations.en

let currentLang: Language = 'en'

export function setLanguage(lang: Language) {
  currentLang = lang
}

export function t(key: TranslationKey): string {
  return (translations[currentLang] as Record<string, string>)[key] ?? translations.en[key] ?? key
}

export function useCurrentLang() {
  return currentLang
}
