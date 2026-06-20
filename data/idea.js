// 数据来源：JetBrains 官方文档 jetbrains.com/help/idea/mastering-keyboard-shortcuts.html，整理于 2026-06
// ⚠️ IntelliJ IDEA 快捷键因操作系统（macOS/Win/Linux）和键位方案（Default/macOS/Vim/Emacs）不同而差异显著
// 本表仅收录 macOS 默认键位方案（IntelliJ IDEA Keymap）下的常用子集；Windows/Linux 差异在 zh 字段括号内注明
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["idea"] = {
  meta: {
    id: "idea",
    name: "IntelliJ IDEA",
    color: "#F59E0B",
    source: "官方文档 jetbrains.com/help/idea，整理于 2026-06（⚠️ 仅收录 macOS 默认键位方案常用子集，完整列表请查官方 Keymap Reference）",
    sourceUrl: "https://www.jetbrains.com/help/idea/mastering-keyboard-shortcuts.html",
    updatedAt: "2026-06-20",
    coverage: "macOS 默认键位常用子集，Windows/Linux 差异见条目说明",
    platforms: ["mac", "windows", "linux"],
    builtIn: true,
    order: 6
  },
  items: [
    // ===== 全局搜索 Global Search =====
    {cat:"shortcut", cmd:"Double Shift", en:"Search Everywhere", zh:"全局搜索——文件名、类、方法、IDE 动作均可（最常用入口）（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Cmd+Shift+A", platformCmds:{mac:"Cmd+Shift+A",windows:"Ctrl+Shift+A",linux:"Ctrl+Shift+A"}, en:"Find Action", zh:"搜索 IDE 命令/动作，相当于命令面板（Win/Linux 为 Ctrl+Shift+A）"},
    {cat:"shortcut", cmd:"Cmd+O", platformCmds:{mac:"Cmd+O",windows:"Ctrl+N",linux:"Ctrl+N"}, en:"Go to Class", zh:"按名称跳转到类（支持驼峰缩写模糊搜索）（Win/Linux 为 Ctrl+N）"},
    {cat:"shortcut", cmd:"Cmd+Shift+O", platformCmds:{mac:"Cmd+Shift+O",windows:"Ctrl+Shift+N",linux:"Ctrl+Shift+N"}, en:"Go to File", zh:"按名称跳转到任意文件（Win/Linux 为 Ctrl+Shift+N）"},
    {cat:"shortcut", cmd:"Cmd+Alt+O", platformCmds:{mac:"Cmd+Alt+O",windows:"Ctrl+Alt+Shift+N",linux:"Ctrl+Alt+Shift+N"}, en:"Go to Symbol", zh:"跳转到任意符号（方法、变量、字段等）（Win/Linux 为 Ctrl+Alt+Shift+N）"},
    {cat:"shortcut", cmd:"Cmd+E", platformCmds:{mac:"Cmd+E",windows:"Ctrl+E",linux:"Ctrl+E"}, en:"Recent Files", zh:"查看最近打开的文件列表并快速切换（Win/Linux 为 Ctrl+E）"},
    {cat:"shortcut", cmd:"Cmd+Shift+E", en:"Recent Locations", zh:"查看最近浏览过的代码位置（Win/Linux 为 Ctrl+Shift+E）"},
    {cat:"shortcut", cmd:"Ctrl+Tab", en:"Switcher", zh:"快速切换打开的文件和工具窗口（Win/Linux 相同）"},

    // ===== 代码导航 Code Navigation =====
    {cat:"shortcut", cmd:"Cmd+B", en:"Go to Declaration or Usages", zh:"跳转到声明处；已在声明处时则查找所有引用（Win/Linux 为 Ctrl+B）"},
    {cat:"shortcut", cmd:"Cmd+Alt+B", en:"Go to Implementations", zh:"跳转到接口/抽象方法的具体实现类或方法（Win/Linux 为 Ctrl+Alt+B）"},
    {cat:"shortcut", cmd:"Cmd+U", en:"Go to Super Method/Class", zh:"跳转到父类方法或父接口（Win/Linux 为 Ctrl+U）"},
    {cat:"shortcut", cmd:"Ctrl+H", en:"Type Hierarchy", zh:"查看当前类的继承层级树（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Alt+F7", en:"Find Usages", zh:"查找当前符号在整个项目中的所有使用位置（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Cmd+F7", en:"Highlight Usages in File", zh:"高亮当前符号在本文件中的所有引用（Win/Linux 为 Ctrl+F7）"},
    {cat:"shortcut", cmd:"Cmd+F12", en:"File Structure Popup", zh:"弹出当前文件的成员列表（方法、字段），可快速跳转（Win/Linux 为 Ctrl+F12）"},
    {cat:"shortcut", cmd:"Cmd+[", en:"Navigate Back", zh:"返回上一个光标位置（跨文件）（Win/Linux 为 Ctrl+Alt+Left）"},
    {cat:"shortcut", cmd:"Cmd+]", en:"Navigate Forward", zh:"前进到下一个光标位置（Win/Linux 为 Ctrl+Alt+Right）"},
    {cat:"shortcut", cmd:"F2", en:"Next Highlighted Error/Warning", zh:"跳到当前文件下一个错误或警告（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Shift+F2", en:"Previous Highlighted Error/Warning", zh:"跳到当前文件上一个错误或警告（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Alt+F1", en:"Select In...", zh:"在各工具窗口/文件树中定位当前文件（Win/Linux 相同）"},

    // ===== 代码补全 Code Completion =====
    {cat:"shortcut", cmd:"Ctrl+Space", en:"Basic Code Completion", zh:"触发基础代码补全（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Ctrl+Shift+Space", en:"Smart Type Completion", zh:"按预期类型过滤的智能代码补全（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Cmd+Shift+Enter", en:"Complete Current Statement", zh:"补全当前语句——自动加分号、括号并换行到下一行（Win/Linux 为 Ctrl+Shift+Enter）"},
    {cat:"shortcut", cmd:"Cmd+P", en:"Parameter Info", zh:"弹出当前方法调用的参数签名提示（Win/Linux 为 Ctrl+P）"},
    {cat:"shortcut", cmd:"Ctrl+J", en:"Insert Live Template", zh:"插入预定义代码片段（Live Template）（Win/Linux 相同）"},

    // ===== 快速修复与文档 Quick Fix & Docs =====
    {cat:"shortcut", cmd:"Alt+Enter", en:"Show Intention Actions / Quick Fix", zh:"显示可用的快速修复和意图动作（导入类、修改代码等）——最常用（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Cmd+Q", en:"Quick Documentation", zh:"弹出当前符号的快速文档（不跳转到文档页）（Win/Linux 为 Ctrl+Q）"},
    {cat:"shortcut", cmd:"Cmd+Shift+I", en:"Quick Definition Lookup", zh:"内联预览声明/定义，无需跳转（Win/Linux 为 Ctrl+Shift+I）"},

    // ===== 查找与替换 Find & Replace =====
    {cat:"shortcut", cmd:"Cmd+F", en:"Find in File", zh:"在当前文件内查找（Win/Linux 为 Ctrl+F）"},
    {cat:"shortcut", cmd:"Cmd+R", en:"Replace in File", zh:"在当前文件内查找并替换（Win/Linux 为 Ctrl+R）"},
    {cat:"shortcut", cmd:"Cmd+Shift+F", en:"Find in Files (Path)", zh:"在整个项目或指定目录下查找字符串（Win/Linux 为 Ctrl+Shift+F）"},
    {cat:"shortcut", cmd:"Cmd+Shift+R", en:"Replace in Files (Path)", zh:"在整个项目或指定目录下替换字符串（Win/Linux 为 Ctrl+Shift+R）"},
    {cat:"shortcut", cmd:"Cmd+F3", en:"Find Next Occurrence", zh:"跳到下一个搜索结果（Win/Linux 为 F3）"},
    {cat:"shortcut", cmd:"Shift+F3", en:"Find Previous Occurrence", zh:"跳到上一个搜索结果（Win/Linux 相同）"},

    // ===== 编辑操作 Editing =====
    {cat:"shortcut", cmd:"Cmd+D", en:"Duplicate Line/Selection", zh:"复制当前行（或选中内容）并插入到下方（Win/Linux 为 Ctrl+D）"},
    {cat:"shortcut", cmd:"Cmd+Backspace", en:"Delete Line", zh:"删除当前整行（Win/Linux 为 Ctrl+Y）"},
    {cat:"shortcut", cmd:"Alt+Shift+Up", en:"Move Line Up", zh:"将当前行上移一行（Win/Linux 为 Alt+Shift+Up，相同）"},
    {cat:"shortcut", cmd:"Alt+Shift+Down", en:"Move Line Down", zh:"将当前行下移一行（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Cmd+Shift+Up", en:"Move Statement Up", zh:"将当前代码块/方法整体上移（Win/Linux 为 Ctrl+Shift+Up）"},
    {cat:"shortcut", cmd:"Cmd+Shift+Down", en:"Move Statement Down", zh:"将当前代码块/方法整体下移（Win/Linux 为 Ctrl+Shift+Down）"},
    {cat:"shortcut", cmd:"Cmd+/", en:"Comment/Uncomment Line", zh:"行注释或取消注释（Win/Linux 为 Ctrl+/）"},
    {cat:"shortcut", cmd:"Cmd+Shift+/", en:"Comment/Uncomment Block", zh:"块注释或取消注释（Win/Linux 为 Ctrl+Shift+/）"},
    {cat:"shortcut", cmd:"Cmd+Shift+U", en:"Toggle Case", zh:"切换选中文本的大/小写（Win/Linux 为 Ctrl+Shift+U）"},
    {cat:"shortcut", cmd:"Option+Up", en:"Extend Selection", zh:"按语法结构逐级向外扩展选区（Win/Linux 为 Ctrl+W）"},
    {cat:"shortcut", cmd:"Option+Down", en:"Shrink Selection", zh:"按语法结构逐级向内收缩选区（Win/Linux 为 Ctrl+Shift+W）"},
    {cat:"shortcut", cmd:"Cmd+Alt+L", en:"Reformat Code", zh:"按代码风格格式化当前文件或选区（Win/Linux 为 Ctrl+Alt+L）"},
    {cat:"shortcut", cmd:"Ctrl+Alt+O", en:"Optimize Imports", zh:"自动整理并删除未使用的 import（Win/Linux 相同）"},

    // ===== 代码生成 Code Generation =====
    {cat:"shortcut", cmd:"Cmd+N", en:"Generate Code", zh:"生成代码——构造函数、getter/setter、equals/hashCode 等（Win/Linux 为 Alt+Insert）"},
    {cat:"shortcut", cmd:"Ctrl+O", en:"Override Methods", zh:"选择并重写父类方法（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Ctrl+I", en:"Implement Methods", zh:"选择并实现接口方法（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Cmd+Alt+T", en:"Surround With", zh:"用代码结构包裹选中内容（try-catch、if、for 等）（Win/Linux 为 Ctrl+Alt+T）"},

    // ===== 重构 Refactoring =====
    {cat:"shortcut", cmd:"Shift+F6", en:"Rename", zh:"安全重命名——变量/方法/类，自动更新所有引用（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Ctrl+T", en:"Refactor This...", zh:"弹出重构菜单，选择具体的重构操作（Win/Linux 为 Ctrl+Alt+Shift+T）"},
    {cat:"shortcut", cmd:"Cmd+F6", en:"Change Signature", zh:"修改方法签名（参数名称、类型、顺序）（Win/Linux 为 Ctrl+F6）"},
    {cat:"shortcut", cmd:"Cmd+Alt+M", en:"Extract Method", zh:"将选中代码提取为独立方法（Win/Linux 为 Ctrl+Alt+M）"},
    {cat:"shortcut", cmd:"Cmd+Alt+V", en:"Extract Variable", zh:"将选中表达式提取为局部变量（Win/Linux 为 Ctrl+Alt+V）"},
    {cat:"shortcut", cmd:"Cmd+Alt+F", en:"Extract Field", zh:"将选中表达式提取为类字段（Win/Linux 为 Ctrl+Alt+F）"},
    {cat:"shortcut", cmd:"Cmd+Alt+C", en:"Extract Constant", zh:"将选中表达式提取为常量（Win/Linux 为 Ctrl+Alt+C）"},
    {cat:"shortcut", cmd:"F6", en:"Move", zh:"将类或文件移动到其他包/目录（Win/Linux 相同）"},

    // ===== 运行与调试 Run & Debug =====
    {cat:"shortcut", cmd:"Ctrl+R", en:"Run", zh:"运行当前或上次运行的配置（Win/Linux 为 Shift+F10）"},
    {cat:"shortcut", cmd:"Ctrl+D", en:"Debug", zh:"以调试模式运行当前或上次的配置（Win/Linux 为 Shift+F9）"},
    {cat:"shortcut", cmd:"Ctrl+Shift+R", en:"Run Context Configuration", zh:"运行光标所在的测试方法或当前文件（Win/Linux 为 Ctrl+Shift+F10）"},
    {cat:"shortcut", cmd:"Ctrl+Shift+D", en:"Debug Context Configuration", zh:"调试光标所在的测试方法或当前文件（Win/Linux 为 Ctrl+Shift+F9）"},
    {cat:"shortcut", cmd:"Cmd+F2", en:"Stop Process", zh:"停止当前正在运行的进程（Win/Linux 为 Ctrl+F2）"},
    {cat:"shortcut", cmd:"Cmd+F8", en:"Toggle Line Breakpoint", zh:"在当前行添加或移除断点（Win/Linux 为 Ctrl+F8）"},
    {cat:"shortcut", cmd:"Cmd+Shift+F8", en:"View Breakpoints", zh:"查看和管理所有断点（Win/Linux 为 Ctrl+Shift+F8）"},
    {cat:"shortcut", cmd:"F9", en:"Resume Program", zh:"继续执行直到下一个断点（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"F8", en:"Step Over", zh:"单步跳过——执行当前行，不进入方法内部（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"F7", en:"Step Into", zh:"单步进入——进入当前行调用的方法内部（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Shift+F7", en:"Smart Step Into", zh:"智能单步进入——弹出菜单选择要进入的具体方法（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Shift+F8", en:"Step Out", zh:"跳出当前方法，返回调用处（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Alt+F9", en:"Run to Cursor", zh:"直接运行到光标所在行（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Alt+F8", en:"Evaluate Expression", zh:"调试暂停时计算任意表达式的值（Win/Linux 相同）"},

    // ===== VCS / Git =====
    {cat:"shortcut", cmd:"Cmd+K", en:"Commit", zh:"打开 Commit 对话框，填写提交信息并提交（Win/Linux 为 Ctrl+K）"},
    {cat:"shortcut", cmd:"Cmd+T", en:"Update Project (Pull)", zh:"从远端拉取最新代码（等同于 git pull）（Win/Linux 为 Ctrl+T）"},
    {cat:"shortcut", cmd:"Cmd+Shift+K", en:"Push Commits", zh:"将本地提交推送到远端（Win/Linux 为 Ctrl+Shift+K）"},
    {cat:"shortcut", cmd:"Alt+`", en:"VCS Operations Popup", zh:"打开 VCS 快捷菜单，显示所有 Git 操作（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Cmd+Alt+Z", en:"Revert Changes in File", zh:"撤销当前文件的所有未提交变更（Win/Linux 为 Ctrl+Alt+Z）"},

    // ===== 工具窗口 Tool Windows =====
    {cat:"shortcut", cmd:"Cmd+1", en:"Project Tool Window", zh:"打开/聚焦项目文件树面板（Win/Linux 为 Alt+1）"},
    {cat:"shortcut", cmd:"Cmd+4", en:"Run Tool Window", zh:"打开/聚焦运行输出面板（Win/Linux 为 Alt+4）"},
    {cat:"shortcut", cmd:"Cmd+5", en:"Debug Tool Window", zh:"打开/聚焦调试面板（Win/Linux 为 Alt+5）"},
    {cat:"shortcut", cmd:"Cmd+9", en:"Git Tool Window", zh:"打开/聚焦 Git/版本控制面板（Win/Linux 为 Alt+9）"},
    {cat:"shortcut", cmd:"F12", en:"Open Last Tool Window", zh:"重新打开上次使用的工具窗口（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Esc", en:"Return Focus to Editor", zh:"将焦点从工具窗口返回到编辑器（Win/Linux 相同）"},
    {cat:"shortcut", cmd:"Shift+Esc", en:"Hide Tool Window", zh:"隐藏当前工具窗口并将焦点返回编辑器（Win/Linux 相同）"},
  ]
};
