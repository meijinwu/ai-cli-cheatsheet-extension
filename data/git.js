// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["git"] = {
  "meta": {
    "id": "git",
    "name": "Git",
    "color": "#F05032",
    "source": "Git 官方文档 (https://git-scm.com/docs) 整理于 2025-04-05",
    "builtIn": false,
    "sourceUrl": "https://git-scm.com/docs",
    "updatedAt": "2025-04-05",
    "coverage": "涵盖常用子命令及选项，共包含 77 条命令",
    "platforms": [
      "mac",
      "windows",
      "linux"
    ],
    "order": 999
  },
  "items": [
    {
      "cat": "slash",
      "cmd": "init",
      "en": "Initialize a new Git repository",
      "zh": "初始化一个新的 Git 仓库",
      "id": "git-init"
    },
    {
      "cat": "slash",
      "cmd": "clone",
      "en": "Clone a repository into a new directory",
      "zh": "克隆仓库到新目录",
      "id": "git-clone"
    },
    {
      "cat": "slash",
      "cmd": "add",
      "en": "Add file contents to the index",
      "zh": "将文件内容添加到暂存区",
      "id": "git-add"
    },
    {
      "cat": "slash",
      "cmd": "commit",
      "en": "Record changes to the repository",
      "zh": "记录仓库的更改",
      "id": "git-commit"
    },
    {
      "cat": "flag",
      "cmd": "commit -m",
      "en": "Commit with a message",
      "zh": "带提交说明的提交",
      "context": "commit",
      "id": "git-commit-m"
    },
    {
      "cat": "flag",
      "cmd": "commit --amend",
      "en": "Amend the last commit",
      "zh": "修改最后一次提交",
      "context": "commit",
      "id": "git-commit-amend"
    },
    {
      "cat": "flag",
      "cmd": "commit --amend --no-edit",
      "en": "Amend the last commit without changing its message",
      "zh": "修改最后一次提交但不更改提交信息",
      "context": "commit",
      "id": "git-commit-amend-no-edit"
    },
    {
      "cat": "slash",
      "cmd": "status",
      "en": "Show the working tree status",
      "zh": "显示工作区状态",
      "id": "git-status"
    },
    {
      "cat": "flag",
      "cmd": "status -s",
      "en": "Show status in short format",
      "zh": "以简短格式显示状态",
      "context": "status",
      "id": "git-status-s"
    },
    {
      "cat": "flag",
      "cmd": "status -b",
      "en": "Show branch information in short format",
      "zh": "以简短格式显示分支信息",
      "context": "status",
      "id": "git-status-b"
    },
    {
      "cat": "slash",
      "cmd": "diff",
      "en": "Show changes between commits, commit and working tree, etc.",
      "zh": "显示提交之间、提交与工作树等之间的更改",
      "id": "git-diff"
    },
    {
      "cat": "flag",
      "cmd": "diff --staged",
      "en": "Show changes between the index and the last commit",
      "zh": "显示暂存区与上次提交之间的更改",
      "context": "diff",
      "id": "git-diff-staged"
    },
    {
      "cat": "flag",
      "cmd": "diff HEAD",
      "en": "Show changes between the working tree and the last commit",
      "zh": "显示工作树与上次提交之间的更改",
      "context": "diff",
      "id": "git-diff-head"
    },
    {
      "cat": "slash",
      "cmd": "reset",
      "en": "Reset current HEAD to the specified state",
      "zh": "将当前 HEAD 重置到指定状态",
      "id": "git-reset"
    },
    {
      "cat": "flag",
      "cmd": "reset --soft HEAD~1",
      "en": "Undo the last commit, keeping changes staged",
      "zh": "撤销最后一次提交，保留更改在暂存区",
      "context": "reset",
      "id": "git-reset-soft"
    },
    {
      "cat": "flag",
      "cmd": "reset --hard",
      "en": "Reset index and working tree, discarding all changes",
      "zh": "重置索引和工作树，丢弃所有更改",
      "context": "reset",
      "id": "git-reset-hard"
    },
    {
      "cat": "flag",
      "cmd": "reset <file>",
      "en": "Unstage a file",
      "zh": "取消暂存文件",
      "context": "reset",
      "id": "git-reset-file"
    },
    {
      "cat": "slash",
      "cmd": "rm",
      "en": "Remove files from the working tree and from the index",
      "zh": "从工作树和索引中删除文件",
      "id": "git-rm"
    },
    {
      "cat": "flag",
      "cmd": "rm --cached",
      "en": "Remove files from the index only",
      "zh": "仅从索引中移除文件",
      "context": "rm",
      "id": "git-rm-cached"
    },
    {
      "cat": "slash",
      "cmd": "mv",
      "en": "Move or rename a file, a directory, or a symlink",
      "zh": "移动或重命名文件、目录或符号链接",
      "id": "git-mv"
    },
    {
      "cat": "slash",
      "cmd": "branch",
      "en": "List, create, or delete branches",
      "zh": "列出、创建或删除分支",
      "id": "git-branch"
    },
    {
      "cat": "flag",
      "cmd": "branch -d",
      "en": "Delete a branch",
      "zh": "删除分支",
      "context": "branch",
      "id": "git-branch-d"
    },
    {
      "cat": "flag",
      "cmd": "branch -a",
      "en": "List all branches (local and remote)",
      "zh": "列出所有分支（本地和远程）",
      "context": "branch",
      "id": "git-branch-a"
    },
    {
      "cat": "flag",
      "cmd": "branch -r",
      "en": "List remote-tracking branches",
      "zh": "列出远程跟踪分支",
      "context": "branch",
      "id": "git-branch-r"
    },
    {
      "cat": "slash",
      "cmd": "checkout",
      "en": "Switch branches or restore working tree files",
      "zh": "切换分支或恢复工作树文件",
      "id": "git-checkout"
    },
    {
      "cat": "flag",
      "cmd": "checkout -b",
      "en": "Create and switch to a new branch",
      "zh": "创建并切换到新分支",
      "context": "checkout",
      "id": "git-checkout-b"
    },
    {
      "cat": "flag",
      "cmd": "checkout -- <file>",
      "en": "Discard changes in working directory",
      "zh": "丢弃工作目录中对文件的更改",
      "context": "checkout",
      "id": "git-checkout-file"
    },
    {
      "cat": "slash",
      "cmd": "switch",
      "en": "Switch branches",
      "zh": "切换分支",
      "id": "git-switch"
    },
    {
      "cat": "flag",
      "cmd": "switch -c",
      "en": "Create and switch to a new branch",
      "zh": "创建并切换到新分支",
      "context": "switch",
      "id": "git-switch-c"
    },
    {
      "cat": "flag",
      "cmd": "switch -",
      "en": "Switch to the previous branch",
      "zh": "切换到上一个分支",
      "context": "switch",
      "id": "git-switch-dash"
    },
    {
      "cat": "slash",
      "cmd": "merge",
      "en": "Join two or more development histories together",
      "zh": "合并两个或更多的开发历史",
      "id": "git-merge"
    },
    {
      "cat": "flag",
      "cmd": "merge --no-ff",
      "en": "Create a merge commit even if a fast-forward is possible",
      "zh": "即使可以快进也创建合并提交",
      "context": "merge",
      "id": "git-merge-no-ff"
    },
    {
      "cat": "flag",
      "cmd": "merge --abort",
      "en": "Abort the current conflict resolution process",
      "zh": "中止当前的冲突解决过程",
      "context": "merge",
      "id": "git-merge-abort"
    },
    {
      "cat": "slash",
      "cmd": "rebase",
      "en": "Reapply commits on top of another base tip",
      "zh": "将提交重新应用到另一个基端",
      "id": "git-rebase"
    },
    {
      "cat": "flag",
      "cmd": "rebase -i",
      "en": "Interactive rebase",
      "zh": "交互式变基",
      "context": "rebase",
      "id": "git-rebase-i"
    },
    {
      "cat": "flag",
      "cmd": "rebase --continue",
      "en": "Continue the rebase after resolving conflicts",
      "zh": "解决冲突后继续变基",
      "context": "rebase",
      "id": "git-rebase-continue"
    },
    {
      "cat": "flag",
      "cmd": "rebase --abort",
      "en": "Abort the rebase and reset to the original branch",
      "zh": "中止变基并恢复到原始分支",
      "context": "rebase",
      "id": "git-rebase-abort"
    },
    {
      "cat": "slash",
      "cmd": "cherry-pick",
      "en": "Apply changes from existing commits",
      "zh": "应用现有提交的更改",
      "id": "git-cherry-pick"
    },
    {
      "cat": "flag",
      "cmd": "cherry-pick --continue",
      "en": "Continue cherry-pick after resolving conflicts",
      "zh": "解决冲突后继续拣选",
      "context": "cherry-pick",
      "id": "git-cherry-pick-continue"
    },
    {
      "cat": "flag",
      "cmd": "cherry-pick --abort",
      "en": "Abort the cherry-pick and return to previous state",
      "zh": "中止拣选并恢复到之前的状态",
      "context": "cherry-pick",
      "id": "git-cherry-pick-abort"
    },
    {
      "cat": "slash",
      "cmd": "stash",
      "en": "Stash changes in a dirty working directory",
      "zh": "储藏工作目录中的更改",
      "id": "git-stash"
    },
    {
      "cat": "flag",
      "cmd": "stash pop",
      "en": "Apply and remove the latest stash",
      "zh": "应用并移除最新的储藏",
      "context": "stash",
      "id": "git-stash-pop"
    },
    {
      "cat": "flag",
      "cmd": "stash list",
      "en": "List all stashes",
      "zh": "列出所有储藏",
      "context": "stash",
      "id": "git-stash-list"
    },
    {
      "cat": "flag",
      "cmd": "stash drop",
      "en": "Remove a single stash entry",
      "zh": "移除单个储藏条目",
      "context": "stash",
      "id": "git-stash-drop"
    },
    {
      "cat": "slash",
      "cmd": "remote",
      "en": "Manage set of tracked repositories",
      "zh": "管理跟踪的仓库集合",
      "id": "git-remote"
    },
    {
      "cat": "flag",
      "cmd": "remote -v",
      "en": "Show remote URLs",
      "zh": "显示远程仓库 URL",
      "context": "remote",
      "id": "git-remote-v"
    },
    {
      "cat": "flag",
      "cmd": "remote add",
      "en": "Add a new remote",
      "zh": "添加新的远程仓库",
      "context": "remote",
      "id": "git-remote-add"
    },
    {
      "cat": "flag",
      "cmd": "remote remove",
      "en": "Remove a remote",
      "zh": "移除远程仓库",
      "context": "remote",
      "id": "git-remote-remove"
    },
    {
      "cat": "slash",
      "cmd": "fetch",
      "en": "Download objects and refs from another repository",
      "zh": "从另一个仓库下载对象和引用",
      "id": "git-fetch"
    },
    {
      "cat": "flag",
      "cmd": "fetch --all",
      "en": "Fetch all remotes",
      "zh": "获取所有远程仓库的更新",
      "context": "fetch",
      "id": "git-fetch-all"
    },
    {
      "cat": "slash",
      "cmd": "pull",
      "en": "Fetch from and integrate with another repository",
      "zh": "从另一个仓库获取并整合",
      "id": "git-pull"
    },
    {
      "cat": "flag",
      "cmd": "pull --rebase",
      "en": "Fetch and rebase instead of merge",
      "zh": "获取后变基而不是合并",
      "context": "pull",
      "id": "git-pull-rebase"
    },
    {
      "cat": "slash",
      "cmd": "push",
      "en": "Update remote refs along with associated objects",
      "zh": "更新远程引用及相关对象",
      "id": "git-push"
    },
    {
      "cat": "flag",
      "cmd": "push -u",
      "en": "Push and set upstream tracking",
      "zh": "推送并设置上游跟踪",
      "context": "push",
      "id": "git-push-u"
    },
    {
      "cat": "flag",
      "cmd": "push --force",
      "en": "Force push, overwriting remote history",
      "zh": "强制推送，覆盖远程历史",
      "context": "push",
      "id": "git-push-force"
    },
    {
      "cat": "flag",
      "cmd": "push --force-with-lease",
      "en": "Force push, but only if remote ref is as expected",
      "zh": "强制推送，仅在远程引用符合预期时",
      "context": "push",
      "id": "git-push-force-with-lease"
    },
    {
      "cat": "slash",
      "cmd": "log",
      "en": "Show commit logs",
      "zh": "显示提交日志",
      "id": "git-log"
    },
    {
      "cat": "flag",
      "cmd": "log --oneline",
      "en": "Show each commit on a single line",
      "zh": "以单行显示每个提交",
      "context": "log",
      "id": "git-log-oneline"
    },
    {
      "cat": "flag",
      "cmd": "log --graph",
      "en": "Show commit history with an ASCII graph",
      "zh": "以 ASCII 图形显示提交历史",
      "context": "log",
      "id": "git-log-graph"
    },
    {
      "cat": "flag",
      "cmd": "log -p",
      "en": "Show patch output with commits",
      "zh": "显示提交的补丁输出",
      "context": "log",
      "id": "git-log-p"
    },
    {
      "cat": "flag",
      "cmd": "log --author",
      "en": "Filter commits by author",
      "zh": "按作者过滤提交",
      "context": "log",
      "id": "git-log-author"
    },
    {
      "cat": "slash",
      "cmd": "show",
      "en": "Show various types of objects",
      "zh": "显示各种类型的对象",
      "id": "git-show"
    },
    {
      "cat": "flag",
      "cmd": "show <commit>",
      "en": "Show details of a specific commit",
      "zh": "显示特定提交的详细信息",
      "context": "show",
      "id": "git-show-commit"
    },
    {
      "cat": "slash",
      "cmd": "tag",
      "en": "Create, list, delete or verify a tag object",
      "zh": "创建、列出、删除或验证标签对象",
      "id": "git-tag"
    },
    {
      "cat": "flag",
      "cmd": "tag -a",
      "en": "Create an annotated tag",
      "zh": "创建附注标签",
      "context": "tag",
      "id": "git-tag-a"
    },
    {
      "cat": "flag",
      "cmd": "tag -d",
      "en": "Delete a tag",
      "zh": "删除标签",
      "context": "tag",
      "id": "git-tag-d"
    },
    {
      "cat": "slash",
      "cmd": "blame",
      "en": "Show what revision and author last modified each line of a file",
      "zh": "显示文件每行的最后修改版本和作者",
      "id": "git-blame"
    },
    {
      "cat": "flag",
      "cmd": "blame -L",
      "en": "Annotate only the given line range",
      "zh": "仅注解给定的行范围",
      "context": "blame",
      "id": "git-blame-L"
    },
    {
      "cat": "slash",
      "cmd": "config",
      "en": "Get and set repository or global options",
      "zh": "获取和设置仓库或全局选项",
      "id": "git-config"
    },
    {
      "cat": "flag",
      "cmd": "config --global",
      "en": "Set a global configuration value",
      "zh": "设置全局配置值",
      "context": "config",
      "id": "git-config-global"
    },
    {
      "cat": "flag",
      "cmd": "config --list",
      "en": "List all current configuration",
      "zh": "列出所有当前配置",
      "context": "config",
      "id": "git-config-list"
    },
    {
      "cat": "slash",
      "cmd": "bisect",
      "en": "Use binary search to find the commit that introduced a bug",
      "zh": "使用二分查找找出引入错误的提交",
      "id": "git-bisect"
    },
    {
      "cat": "flag",
      "cmd": "bisect start",
      "en": "Start a bisect session",
      "zh": "开始二分查找会话",
      "context": "bisect",
      "id": "git-bisect-start"
    },
    {
      "cat": "slash",
      "cmd": "clean",
      "en": "Remove untracked files from the working tree",
      "zh": "从工作树中删除未跟踪的文件",
      "id": "git-clean"
    },
    {
      "cat": "flag",
      "cmd": "clean -n",
      "en": "Dry run: show what would be removed",
      "zh": "试运行：显示将要删除的内容",
      "context": "clean",
      "id": "git-clean-n"
    },
    {
      "cat": "slash",
      "cmd": "grep",
      "en": "Print lines matching a pattern",
      "zh": "打印匹配模式的行",
      "id": "git-grep"
    }
  ]
};
