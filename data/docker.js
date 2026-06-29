// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["docker"] = {
  "meta": {
    "id": "docker",
    "name": "Docker",
    "color": "#2496ED",
    "source": "Docker CLI reference, local help, and official repository, 整理于 2026-06-29",
    "builtIn": false,
    "updatePolicy": "version-driven",
    "contentCheckedAt": "2026-06-29",
    "sourceCheckedAt": "2026-06-29",
    "sourceUrl": "https://docs.docker.com/reference/cli/docker/",
    "sourceTier": "official",
    "coverage": "核心命令、常用子命令与关键选项",
    "platforms": [
      "mac",
      "windows",
      "linux"
    ],
    "order": 999,
    "sources": [
      {
        "id": "docker-docs",
        "title": "Docker CLI reference",
        "kind": "official-doc",
        "maintainer": "Docker Inc.",
        "evidenceTier": "first-party",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ],
        "resolvedUrl": "https://docs.docker.com/reference/cli/docker/",
        "pageTitle": "Docker CLI | Docker Docs",
        "checkedAt": "2026-06-29",
        "url": "https://docs.docker.com/reference/cli/docker/",
        "lastVerifiedAt": "2026-06-29"
      }
    ],
    "verificationStatus": "model-knowledge"
  },
  "items": [
    {
      "cat": "flag",
      "cmd": "docker run",
      "en": "Run a container",
      "zh": "运行容器",
      "evidenceStatus": "unverified",
      "keywords": [
        "container",
        "run",
        "start",
        "image",
        "create"
      ],
      "examples": [
        {
          "value": "docker run hello-world",
          "description": "拉取 hello-world 镜像并创建容器，输出欢迎信息后退出。适合检查 Docker 引擎是否正常工作。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "验证 Docker 安装或测试镜像是否能正常启动",
          "goal": "使用官方 hello-world 镜像运行一个容器",
          "expected": "终端输出 Hello from Docker! 及说明段落",
          "prerequisites": "已登录 Docker Hub 或本地无该镜像时会自动拉取"
        }
      ],
      "id": "docker-run"
    },
    {
      "cat": "flag",
      "cmd": "docker run -d",
      "en": "Run container in detached mode",
      "zh": "后台运行容器",
      "context": "docker run",
      "evidenceStatus": "unverified",
      "keywords": [
        "container",
        "run",
        "detached",
        "background",
        "daemon"
      ],
      "examples": [
        {
          "value": "docker run -d --name my-nginx nginx:latest",
          "description": "使用 -d 让容器在后台运行并打印容器 ID，终端立即返回。同时用 --name 为容器命名便于后续管理。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "需要在后台持续运行服务，不阻塞终端",
          "goal": "以后台模式启动一个 Nginx 容器",
          "expected": "返回容器的完整 SHA256 ID，容器在后台运行",
          "prerequisites": "本地存在 nginx:latest 镜像或可访问 Docker Hub"
        }
      ],
      "id": "docker-run-detach"
    },
    {
      "cat": "flag",
      "cmd": "docker run -p",
      "en": "Publish container ports to host",
      "zh": "将容器端口发布到主机",
      "context": "docker run",
      "evidenceStatus": "unverified",
      "keywords": [
        "port",
        "publish",
        "expose",
        "mapping",
        "network"
      ],
      "examples": [
        {
          "value": "docker run -d -p 8080:80 nginx:latest",
          "description": "-p 8080:80 表示将宿主机的 8080 端口所有流量转发到容器内部的 80 端口。在主机上访问 http://localhost:8080 即可看到 Nginx 欢迎页。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "启动 Web 服务并让主机（或外部用户）能够访问容器内的端口",
          "goal": "将主机的 8080 端口映射到容器的 80 端口",
          "expected": "通过浏览器或 curl 访问 localhost:8080 时返回 Nginx 欢迎页面",
          "caveat": "主机端口可能已被占用；若被占用会直接报错，可更换数字调整。"
        }
      ],
      "id": "docker-run-publish"
    },
    {
      "cat": "flag",
      "cmd": "docker run -v",
      "en": "Mount a volume or bind mount",
      "zh": "挂载卷或绑定挂载",
      "context": "docker run",
      "evidenceStatus": "unverified",
      "keywords": [
        "volume",
        "mount",
        "bind",
        "data",
        "persistence"
      ],
      "examples": [
        {
          "value": "docker run -v \"$(pwd)\":/app alpine ls /app",
          "description": "-v 将当前工作目录绑定挂载至 /app，容器内列出 /app 的内容即为当前主机目录的文件。常用于开发场景实时共享代码。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "需要将主机目录映射到容器内部，实现数据持久化或开发时实时同步文件",
          "goal": "将当前目录挂载到容器的 /app 路径",
          "expected": "终端输出当前主机目录下的文件列表",
          "prerequisites": "在包含文件的目录下执行；Windows PowerShell/CMD 需要用 %cd% 替换 $(pwd)"
        }
      ],
      "id": "docker-run-volume"
    },
    {
      "cat": "flag",
      "cmd": "docker run --name",
      "en": "Assign a name to the container",
      "zh": "为容器指定名称",
      "context": "docker run",
      "evidenceStatus": "unverified",
      "keywords": [
        "name",
        "container",
        "id",
        "identify",
        "manage"
      ],
      "examples": [
        {
          "value": "docker run -d --name web nginx:latest",
          "description": "--name 给容器分配友好名称，后续可用 docker stop web 等命令通过名称进行操作。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "为避免使用系统生成的随机容器名，用易读的名称管理容器",
          "goal": "创建一个名为 web 的 Nginx 容器",
          "expected": "返回容器 ID，且 docker ps 的 NAMES 列显示 web",
          "caveat": "容器名称在同一 Docker 引擎上必须唯一；如果重名会报错，需要先删除已有容器或重命名。"
        }
      ],
      "id": "docker-run-name"
    },
    {
      "cat": "flag",
      "cmd": "docker run -e",
      "en": "Set environment variables",
      "zh": "设置环境变量",
      "context": "docker run",
      "evidenceStatus": "unverified",
      "keywords": [
        "env",
        "variable",
        "config",
        "environment",
        "run"
      ],
      "examples": [
        {
          "value": "docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=secret mysql:8",
          "description": "-e 将环境变量 MYSQL_ROOT_PASSWORD 传入容器，MySQL 镜像依据该变量初始化 root 密码。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "容器应用需要通过环境变量获取配置，如数据库连接信息",
          "goal": "启动 MySQL 容器并设置 root 密码",
          "expected": "容器成功启动，MySQL 开始接受连接",
          "caveat": "密码在命令中明文可见，可通过 --env-file 从文件读取以避免泄露。"
        }
      ],
      "id": "docker-run-env"
    },
    {
      "cat": "flag",
      "cmd": "docker run --rm",
      "en": "Automatically remove container on exit",
      "zh": "退出后自动删除容器",
      "context": "docker run",
      "evidenceStatus": "unverified",
      "keywords": [
        "remove",
        "cleanup",
        "temporary",
        "ephemeral",
        "container"
      ],
      "examples": [
        {
          "value": "docker run --rm alpine cat /etc/os-release",
          "description": "--rm 确保容器在命令执行完毕后立即被删除，避免积累大量已停止的测试容器。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "执行一次性命令或测试后不想残留已停止的容器",
          "goal": "临时输出系统版本信息并自动清理容器",
          "expected": "显示 Alpine 的 os-release 内容，且该容器不会出现在 docker ps -a 输出中",
          "caveat": "与 -d 一起使用时容器退出后仍会自动删除，但若容器仍在运行则不会删除；该选项不适用于需要保留容器进行故障排查的场景。；执行前先确认目标，必要时先备份或用预览/ dry-run 方式验证。",
          "warning": "这是高风险操作，执行前请确认目标、先备份或先使用预览/ dry-run 方式验证。"
        }
      ],
      "id": "docker-run-rm"
    },
    {
      "cat": "flag",
      "cmd": "docker build",
      "en": "Build an image from a Dockerfile",
      "zh": "基于 Dockerfile 构建镜像",
      "evidenceStatus": "unverified",
      "keywords": [
        "build",
        "image",
        "dockerfile",
        "context",
        "tag"
      ],
      "examples": [
        {
          "value": "docker build .",
          "description": "使用当前目录作为构建上下文，读取 Dockerfile 生成镜像。构建完成后可通过 docker images 查看未命名的 <none> 镜像。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "项目目录中含有 Dockerfile，需要构建成镜像以便运行或分发",
          "goal": "在当前目录下构建镜像",
          "expected": "逐层构建并输出每一层的指令和 ID，最后打印 Successfully built <image-id>",
          "prerequisites": "当前目录存在名为 Dockerfile 的文件"
        }
      ],
      "id": "docker-build"
    },
    {
      "cat": "flag",
      "cmd": "docker build -t",
      "en": "Tag the built image",
      "zh": "为构建的镜像添加标签",
      "context": "docker build",
      "evidenceStatus": "unverified",
      "keywords": [
        "tag",
        "name",
        "label",
        "build",
        "repository"
      ],
      "examples": [
        {
          "value": "docker build -t my-app:latest .",
          "description": "-t 将生成镜像命名为 my-app，标签为 latest，方便后续 docker run my-app:latest 直接使用。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "构建镜像后希望能用易读的名称（如 my-app:1.0）引用，而非仅靠镜像 ID",
          "goal": "构建并标记为 my-app:latest 镜像",
          "expected": "构建成功后可执行 docker images | grep my-app 看到对应镜像记录"
        }
      ],
      "id": "docker-build-tag"
    },
    {
      "cat": "flag",
      "cmd": "docker pull",
      "en": "Pull an image from a registry",
      "zh": "从仓库拉取镜像",
      "evidenceStatus": "unverified",
      "keywords": [
        "pull",
        "download",
        "registry",
        "image",
        "get"
      ],
      "examples": [
        {
          "value": "docker pull alpine:3.19",
          "description": "从默认 Docker Hub 仓库下载指定标签的 alpine 镜像。若本地已存在该层则会加速下载。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "部署或测试前需要提前获取某个特定版本的镜像，避免运行时等待",
          "goal": "拉取 Alpine Linux 3.19 镜像",
          "expected": "逐层下载并输出 Pull complete，最后显示 Digest 和 Status: Downloaded newer image",
          "caveat": "默认从 Docker Hub 拉取；若使用私有仓库需在镜像名中指定仓库地址。"
        }
      ],
      "id": "docker-pull"
    },
    {
      "cat": "flag",
      "cmd": "docker push",
      "en": "Push an image to a registry",
      "zh": "将镜像推送到注册中心",
      "evidenceStatus": "unverified",
      "keywords": [
        "push",
        "upload",
        "registry",
        "share",
        "publish"
      ],
      "examples": [
        {
          "value": "docker push myusername/my-image:latest",
          "description": "将本地已标记的镜像推送到远程注册中心的 myusername 命名空间下。推送前需通过 docker login 认证。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "本地构建完成的自定义镜像需要共享给团队或部署到生产环境",
          "goal": "推送 my-image:latest 到 Docker Hub",
          "expected": "输出分层上传进度，结束时显示 latest: digest: sha256:... size: ...",
          "prerequisites": "已使用 docker login 登录目标注册中心",
          "caveat": "镜像名称必须符合仓库格式；推送大量镜像前建议先使用 docker tag 确认标签。"
        }
      ],
      "id": "docker-push"
    },
    {
      "cat": "flag",
      "cmd": "docker ps",
      "en": "List running containers",
      "zh": "列出运行中的容器",
      "evidenceStatus": "unverified",
      "keywords": [
        "list",
        "ps",
        "running",
        "container",
        "status"
      ],
      "examples": [
        {
          "value": "docker ps",
          "description": "默认输出容器 ID、使用的镜像、启动命令、创建时间、状态、端口映射和名称。适合快速了解系统运行状态。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "查看当前哪些容器正处于运行状态及其基本信息",
          "goal": "查看所有运行中的容器 ID、名称、端口等",
          "expected": "表格显示所有状态为 Up 的容器信息，若无则返回空表头"
        }
      ],
      "id": "docker-ps"
    },
    {
      "cat": "flag",
      "cmd": "docker ps -a",
      "en": "List all containers (including stopped)",
      "zh": "列出所有容器（含已停止的）",
      "context": "docker ps",
      "evidenceStatus": "unverified",
      "keywords": [
        "all",
        "ps",
        "stopped",
        "history",
        "container"
      ],
      "examples": [
        {
          "value": "docker ps -a",
          "description": "-a 显示所有状态的容器，Exited (0) 等退出码可帮助诊断容器异常情况。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "需要排查已退出容器留下的日志，或清理旧容器前核查",
          "goal": "显示所有容器，包括已退出的容器",
          "expected": "包含 STATUS 列为 Exited 或其他状态的容器列表"
        }
      ],
      "id": "docker-ps-all"
    },
    {
      "cat": "flag",
      "cmd": "docker images",
      "en": "List images",
      "zh": "列出本机镜像",
      "evidenceStatus": "unverified",
      "keywords": [
        "images",
        "list",
        "repository",
        "tag",
        "size"
      ],
      "examples": [
        {
          "value": "docker images",
          "description": "输出 REPOSITORY, TAG, IMAGE ID, CREATED, SIZE 表格。可帮助决定是否需要清理或更新镜像。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "查看本地已有哪些镜像，是否已包含需要用到的版本",
          "goal": "列出所有本地镜像的仓库、标签和大小",
          "expected": "镜像列表，若无镜像则仅表头行"
        }
      ],
      "id": "docker-images"
    },
    {
      "cat": "flag",
      "cmd": "docker stop",
      "en": "Stop a running container",
      "zh": "停止运行中的容器",
      "evidenceStatus": "unverified",
      "keywords": [
        "stop",
        "graceful",
        "shutdown",
        "container",
        "halt"
      ],
      "examples": [
        {
          "value": "docker stop web",
          "description": "docker stop 发送 SIGTERM，等待超时后再发 SIGKILL，使容器有机会执行清理操作。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "需要停止某个服务容器以释放资源或进行维护",
          "goal": "优雅地停止名为 web 的容器",
          "expected": "终端输出容器名称（如 web），随后容器状态变为 Exited",
          "caveat": "若容器不响应 SIGTERM，可考虑使用 docker kill 立即终止，但建议先用 stop 保留数据完整性。"
        }
      ],
      "id": "docker-stop"
    },
    {
      "cat": "flag",
      "cmd": "docker start",
      "en": "Start a stopped container",
      "zh": "启动已停止的容器",
      "evidenceStatus": "unverified",
      "keywords": [
        "start",
        "stopped",
        "resume",
        "container",
        "begin"
      ],
      "examples": [
        {
          "value": "docker start web",
          "description": "使用容器原有配置（端口、卷挂载等）重新启动，保留之前的文件系统状态。适合恢复临时暂停的服务。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "之前停止的服务容器需要重新上线",
          "goal": "重新启动名为 web 的已停止容器",
          "expected": "输出容器名称（web），容器进入运行状态，可通过 docker ps 确认"
        }
      ],
      "id": "docker-start"
    },
    {
      "cat": "flag",
      "cmd": "docker restart",
      "en": "Restart a container",
      "zh": "重启容器",
      "evidenceStatus": "unverified",
      "keywords": [
        "restart",
        "reboot",
        "container",
        "cycle",
        "apply"
      ],
      "examples": [
        {
          "value": "docker restart web",
          "description": "等效于 docker stop 后执行 docker start，但简化操作。容器内进程重新启动，网络映射保持不变。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "应用配置文件更新后需要快速让容器重新加载配置",
          "goal": "重启名为 web 的容器以应用新的环境变量或卷内容",
          "expected": "输出 web，容器先停止再启动，状态最终为 Up",
          "caveat": "restart 会导致短暂的服务中断；若追求零停机建议采用滚动更新。；执行前先确认目标，必要时先备份或用预览/ dry-run 方式验证。",
          "warning": "这是高风险操作，执行前请确认目标、先备份或先使用预览/ dry-run 方式验证。"
        }
      ],
      "id": "docker-restart"
    },
    {
      "cat": "flag",
      "cmd": "docker rm",
      "en": "Remove containers",
      "zh": "删除容器",
      "evidenceStatus": "unverified",
      "keywords": [
        "remove",
        "delete",
        "container",
        "cleanup",
        "rm"
      ],
      "examples": [
        {
          "value": "docker rm test-container",
          "description": "删除指定容器；容器必须是已停止状态，否则需要加 -f 强制删除。常用于搭配 docker ps -a 查看后清理。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "测试完成后清理不再需要的已停止容器，释放存储空间",
          "goal": "删除一个名为 test-container 的已停止容器",
          "expected": "输出容器名称 test-container，执行后该容器不再显示于 docker ps -a 列表",
          "caveat": "已删除的容器数据（非卷数据）将不可恢复；删除前确认不需要日志或未备份的文件。",
          "warning": "这是高风险操作，执行前请确认目标、先备份或先使用预览/ dry-run 方式验证。"
        }
      ],
      "id": "docker-rm"
    },
    {
      "cat": "flag",
      "cmd": "docker rmi",
      "en": "Remove images",
      "zh": "删除镜像",
      "evidenceStatus": "unverified",
      "keywords": [
        "remove",
        "delete",
        "image",
        "rmi",
        "cleanup"
      ],
      "examples": [
        {
          "value": "docker rmi my-app:old",
          "description": "移除指定镜像；若该镜像正被某个容器使用（即便已停止）会报错，需先删除相关容器。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "老旧或不再使用的镜像占据磁盘空间，需要清理",
          "goal": "删除标记为 my-app:old 的镜像",
          "expected": "输出 Untagged: my-app:old 及各层删除信息",
          "caveat": "误删基础镜像可能导致其他依赖镜像出现 dangling 层，建议先 docker images 确认。"
        }
      ],
      "id": "docker-rmi"
    },
    {
      "cat": "flag",
      "cmd": "docker exec",
      "en": "Run a command in a running container",
      "zh": "在运行中的容器内执行命令",
      "evidenceStatus": "unverified",
      "keywords": [
        "execute",
        "command",
        "inside",
        "container",
        "debug"
      ],
      "examples": [
        {
          "value": "docker exec web ls /etc/nginx",
          "description": "执行一次性命令列出目录内容，无需进入交互式终端即可快速探测容器内部环境。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "需要检查容器内的文件系统或查看运行时状态，如查看某个配置文件",
          "goal": "在名为 web 的容器内列出 /etc/nginx 目录",
          "expected": "输出 /etc/nginx 下的文件列表，如 nginx.conf",
          "prerequisites": "目标容器处于运行状态"
        }
      ],
      "id": "docker-exec"
    },
    {
      "cat": "flag",
      "cmd": "docker exec -it",
      "en": "Open an interactive terminal inside container",
      "zh": "在容器内打开交互式终端",
      "context": "docker exec",
      "evidenceStatus": "unverified",
      "keywords": [
        "interactive",
        "tty",
        "shell",
        "exec",
        "terminal"
      ],
      "examples": [
        {
          "value": "docker exec -it web /bin/bash",
          "description": "-i 保持标准输入打开，-t 分配伪终端，组合后提供类似 ssh 的交互式体验。执行后用户的提示符将变为容器内的 shell。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "需要手动在容器内调试或修改文件，如进入正在运行的应用容器内部排查问题",
          "goal": "在名为 web 的容器中启动 bash 终端",
          "expected": "终端提示符变为 root@<container-id>:/# 或类似，可执行内建命令",
          "prerequisites": "目标容器已安装 /bin/bash，某些精简镜像可能只有 /bin/sh",
          "caveat": "退出终端（exit）时不会停止容器，仅仅是退出 exec 会话。"
        }
      ],
      "id": "docker-exec-it"
    },
    {
      "cat": "flag",
      "cmd": "docker logs",
      "en": "Fetch the logs of a container",
      "zh": "查看容器日志",
      "evidenceStatus": "unverified",
      "keywords": [
        "logs",
        "output",
        "stdout",
        "stderr",
        "troubleshoot"
      ],
      "examples": [
        {
          "value": "docker logs web",
          "description": "即时输出该容器启动至今收集到 stdout/stderr 的内容，适合快速审查应用日志。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "容器运行一段时间后需要检查其输出，以诊断错误或确认正常运行",
          "goal": "查看名为 web 容器的全部已有日志",
          "expected": "终端打印容器的历史日志（可能较多）",
          "caveat": "日志可能非常大量；若只想查看最近行数可结合 --tail 参数。"
        }
      ],
      "id": "docker-logs"
    },
    {
      "cat": "flag",
      "cmd": "docker logs -f",
      "en": "Follow container log output",
      "zh": "持续跟踪容器日志",
      "context": "docker logs",
      "evidenceStatus": "unverified",
      "keywords": [
        "follow",
        "stream",
        "logs",
        "monitor",
        "tail"
      ],
      "examples": [
        {
          "value": "docker logs -f web",
          "description": "-f (--follow) 让命令持续输出，当容器产生新内容时立即显示，直到手动 Ctrl+C 终止。常与 --tail 10 组合先看最近行再跟踪。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "需要实时查看正在运行的容器新产生的日志，类似 tail -f",
          "goal": "实时跟踪名为 web 的容器的日志输出",
          "expected": "新日志实时滚动显示，终止后返回命令提示符",
          "caveat": "需手动 Ctrl+C 退出；长时间跟踪可能占用终端。"
        }
      ],
      "id": "docker-logs-follow"
    },
    {
      "cat": "flag",
      "cmd": "docker compose up",
      "en": "Create and start services",
      "zh": "创建并启动 Compose 服务",
      "evidenceStatus": "unverified",
      "keywords": [
        "compose",
        "up",
        "stack",
        "services",
        "start"
      ],
      "examples": [
        {
          "value": "docker compose up",
          "description": "读取当前目录的 docker-compose.yml（或 compose.yaml），创建所需网络/卷，启动容器并输出聚合日志。Ctrl+C 可停止。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "项目中通过 docker-compose.yml 定义了一组服务，需要一键启动整个应用栈",
          "goal": "在包含 compose 文件的目录启动所有服务（附加日志）",
          "expected": "每个服务的启动日志输出，最后显示 Attaching to ... 并持续输出",
          "prerequisites": "当前目录存在 docker-compose.yml 并已安装 docker compose 插件",
          "caveat": "该命令会占用终端前台，若需后台运行可添加 -d。"
        }
      ],
      "id": "docker-compose-up"
    },
    {
      "cat": "flag",
      "cmd": "docker compose up -d",
      "en": "Start services in detached mode",
      "zh": "后台启动 Compose 服务",
      "context": "docker compose up",
      "evidenceStatus": "unverified",
      "keywords": [
        "compose",
        "detached",
        "background",
        "services",
        "up"
      ],
      "examples": [
        {
          "value": "docker compose up -d",
          "description": "在每个服务容器启动后立即返回终端，容器在后台持续运行。可用 docker compose ps 查看状态。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "生产环境或长期运行服务需要后台启动，不占用终端",
          "goal": "后台启动 compose 栈",
          "expected": "返回各容器的启动信息后回到命令提示符，服务在后台运行"
        }
      ],
      "id": "docker-compose-up-detach"
    },
    {
      "cat": "flag",
      "cmd": "docker compose down",
      "en": "Stop and remove containers, networks",
      "zh": "停止并移除 Compose 资源",
      "evidenceStatus": "unverified",
      "keywords": [
        "compose",
        "down",
        "stop",
        "cleanup",
        "remove"
      ],
      "examples": [
        {
          "value": "docker compose down",
          "description": "停止运行中的服务容器并删除它们，同时移除创建的默认网络。挂载的卷默认保留，除非加 -v。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "测试完成或需要彻底清理 Compose 启动的环境，包括网络",
          "goal": "停止并删除由 docker compose up 创建的所有容器和默认网络",
          "expected": "输出 Stopping ... Removing ... 过程，最后回到命令提示符",
          "caveat": "默认保留卷数据，若希望一并删除旧数据卷请使用 docker compose down -v，但会导致数据不可恢复。"
        }
      ],
      "id": "docker-compose-down"
    },
    {
      "cat": "flag",
      "cmd": "docker network ls",
      "en": "List networks",
      "zh": "列出网络",
      "evidenceStatus": "unverified",
      "keywords": [
        "network",
        "ls",
        "list",
        "bridge",
        "overlay"
      ],
      "examples": [
        {
          "value": "docker network ls",
          "description": "显示 NETWORK ID, NAME, DRIVER, SCOPE 信息，方便识别默认 bridge、host、none 和自定义网络。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "排查容器间网络通信问题或确认当前有哪些自定义网络",
          "goal": "列出当前 Docker 引擎上所有的网络",
          "expected": "表格列出所有网络，默认至少包含 bridge, host, none"
        }
      ],
      "id": "docker-network-ls"
    },
    {
      "cat": "flag",
      "cmd": "docker volume ls",
      "en": "List volumes",
      "zh": "列出卷",
      "evidenceStatus": "unverified",
      "keywords": [
        "volume",
        "ls",
        "list",
        "storage",
        "data"
      ],
      "examples": [
        {
          "value": "docker volume ls",
          "description": "输出 VOLUME NAME 和 DRIVER，辅助识别未使用的孤儿卷以执行清理。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "检查数据卷使用情况，或确认哪些命名卷可以安全清理",
          "goal": "列出系统中所有 Docker 数据卷",
          "expected": "卷列表，若无则仅表头"
        }
      ],
      "id": "docker-volume-ls"
    },
    {
      "cat": "flag",
      "cmd": "docker system prune",
      "en": "Remove unused data",
      "zh": "清理未使用的数据",
      "evidenceStatus": "unverified",
      "keywords": [
        "prune",
        "clean",
        "disk",
        "space",
        "dangling"
      ],
      "examples": [
        {
          "value": "docker system prune",
          "description": "删除所有已停止的容器、未使用的网络、dangling 镜像和悬空构建缓存。执行前会提示确认。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "Docker 磁盘占用过高，需要清理停止的容器、未使用的网络、悬空镜像和构建缓存",
          "goal": "一键清理不再需要的系统资源",
          "expected": "提示确认后会列出被删除的资源，并显示 reclaimed space 大小",
          "caveat": "默认只删除 dangling 镜像，不会删除任何容器使用的镜像。",
          "warning": "此操作不可逆，会删除停止的容器（其文件系统将丢失）。建议先运行 docker system df 查看空间使用。"
        }
      ],
      "id": "docker-system-prune"
    },
    {
      "cat": "flag",
      "cmd": "docker system prune -a",
      "en": "Remove all unused data (including images)",
      "zh": "清理所有未使用的数据（含未使用的镜像）",
      "context": "docker system prune",
      "evidenceStatus": "unverified",
      "keywords": [
        "prune",
        "all",
        "images",
        "disk",
        "aggressive"
      ],
      "examples": [
        {
          "value": "docker system prune -a",
          "description": "在默认 prune 基础上，额外删除所有未被至少一个容器使用的镜像（不仅仅是 dangling）。必须确认。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "希望彻底释放磁盘空间，包括所有未被任何容器引用的镜像",
          "goal": "删除所有未使用的镜像及停止的容器、网络",
          "expected": "删除大量镜像和容器，释放较大空间",
          "caveat": "若要同时删除所有未使用的卷，加 --volumes。",
          "warning": "会删除大量本地镜像，下次运行容器时需重新下载；执行前务必确认哪些镜像仍需保留。"
        }
      ],
      "id": "docker-system-prune-all"
    },
    {
      "cat": "flag",
      "cmd": "docker cp",
      "en": "Copy files between container and host",
      "zh": "在容器和主机之间复制文件",
      "evidenceStatus": "unverified",
      "keywords": [
        "copy",
        "file",
        "transfer",
        "host",
        "container"
      ],
      "examples": [
        {
          "value": "docker cp mycontainer:/app/output.txt ./output.txt",
          "description": "支持双向复制：容器到主机（如上）和主机到容器。容器不需要处于运行状态（已停止也可）。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "docker-docs"
          ],
          "scenario": "需要从容器中导出日志或配置文件到主机，或向容器内导入数据",
          "goal": "将容器内 /app/output.txt 复制到主机当前目录",
          "expected": "无输出表示成功，当前目录出现 output.txt",
          "prerequisites": "容器 ID 或名称已知，且主机路径有写入权限",
          "caveat": "复制目录时会平铺内容，谨慎使用以避免覆盖同名文件。"
        }
      ],
      "id": "docker-cp"
    }
  ]
};
