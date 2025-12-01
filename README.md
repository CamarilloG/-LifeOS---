# LifeOS - 你的个人全能生活操作系统

<div align="center">

![LifeOS Banner](https://via.placeholder.com/1200x300/6366f1/ffffff?text=LifeOS+%7C+Local-First+Personal+Operating+System)

**一个应用，替代你的 12 个 App。**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.5-orange)

[在线演示](https://your-demo-link.vercel.app) · [报告 Bug](https://github.com/yourusername/lifeos/issues) · [功能请求](https://github.com/yourusername/lifeos/issues)

</div>

---

## 📖 项目简介

**LifeOS** 是一款基于 **Local-First（本地优先）** 架构的个人生产力套件。它旨在解决现代数字生活中的"应用碎片化"问题。

我们没有开发 12 个独立的应用，而是将**专注、财务、学习、健康、生活规划**等高频场景无缝集成到一个统一的 PWA（渐进式 Web 应用）中。结合 Google **Gemini AI** 的强大能力，LifeOS 不仅是工具箱，更是你的第二大脑。

### ✨ 核心亮点

*   🔒 **隐私至上**：所有数据默认存储在本地（IndexedDB/LocalStorage），你的生活轨迹只属于你。
*   🤖 **AI 赋能**：内置 Gemini 2.5 模型，提供智能食谱生成、旅行规划等服务。
*   ⚡ **极致性能**：基于 React + Vite 构建，零后端延迟，秒级加载。
*   🎨 **现代设计**：精心打磨的 UI/UX，支持深色模式，媲美原生应用的流畅体验。

---

## 🧩 应用矩阵 (App Showcase)

LifeOS 包含 12 个精心设计的子模块，涵盖了效率、生活与智慧三大领域。

### 🚀 深度效率 (Productivity)

| 应用图标 | 应用名称 | 功能详解 |
| :---: | :--- | :--- |
| <div align="center"><span style="font-size: 40px">🍅</span></div> | **专注时钟**<br>*(FocusFlow)* | **不仅仅是倒计时。**<br>• **环形可视化计时**：支持全屏沉浸模式与动态网页标题。<br>• **白噪音矩阵**：内置雨声、森林、咖啡馆等环境音。<br>• **数据统计**：基于图表的专注时长趋势分析。<br>• **任务估时**：对比预估与实际番茄数，提升时间感知。 |
| <div align="center"><span style="font-size: 40px">🧠</span></div> | **记忆卡片**<br>*(Flashcards)* | **科学的间隔重复记忆系统。**<br>• **SM-2 算法**：内置 Anki 同款算法，根据遗忘曲线自动安排复习。<br>• **3D 翻转**：逼真的卡片交互体验。<br>• **智能队列**：自动筛选今日到期卡片，高效复习。 |
| <div align="center"><span style="font-size: 40px">📐</span></div> | **四象限**<br>*(Eisenhower)* | **艾森豪威尔矩阵任务管理。**<br>• **自动分流**：根据"紧急"与"重要"属性，自动将任务归类。<br>• **可视化优先级**：红(马上做)、蓝(计划做)、橙(授权做)、灰(不做)四色区分。 |
| <div align="center"><span style="font-size: 40px">🎓</span></div> | **课程计划**<br>*(Course)* | **学习进度可视化追踪。**<br>• **进度条激励**：直观展示每门课程的学习百分比。<br>• **章节管理**：简单的增减操作，快速记录学习状态。 |

### 🌈 智慧生活 (Lifestyle & Finance)

| 应用图标 | 应用名称 | 功能详解 |
| :---: | :--- | :--- |
| <div align="center"><span style="font-size: 40px">💰</span></div> | **简易记账**<br>*(Finance)* | **清晰的个人财务中心。**<br>• **资产仪表盘**：渐变卡片展示净值与收支概览。<br>• **预算预警**：设定月度预算，超支自动变色提醒。<br>• **多维图表**：饼图分析消费占比，条形图展示支出排行。 |
| <div align="center"><span style="font-size: 40px">⚖️</span></div> | **AA 分账**<br>*(FairSplit)* | **解决多人聚会算账难题。**<br>• **图论算法**：内置"最小债务路径"算法，自动简化多人转账关系（例如：A欠B，B欠C -> A直接给C）。<br>• **账单明细**：清晰记录谁付了款，为人均消费提供依据。 |
| <div align="center"><span style="font-size: 40px">😄</span></div> | **心情日记**<br>*(Mood)* | **情绪量化与可视化。**<br>• **情绪热力图**：GitHub 风格的月度情绪分布图，识别心理健康趋势。<br>• **快速记录**：大尺寸 Emoji 选择器，配合简短备注。 |
| <div align="center"><span style="font-size: 40px">🎬</span></div> | **书影清单**<br>*(Media)* | **个人文化消费记录。**<br>• **状态流转**：管理"待看"与"已看"清单。<br>• **五星评分**：记录对书籍和电影的个人评价。 |

### 🤖 AI 实验室 (AI Labs & Utilities)

| 应用图标 | 应用名称 | 功能详解 |
| :---: | :--- | :--- |
| <div align="center"><span style="font-size: 40px">🍳</span></div> | **AI 厨房**<br>*(ChefAI)* | **冰箱里的米其林大厨。**<br>• **智能生成**：输入冰箱剩余食材，AI 生成详细食谱（含热量、步骤）。<br>• **生态联动**：支持一键将食谱食材加入"购物清单"。<br>• **本地收藏**：保存你喜爱的 AI 食谱。 |
| <div align="center"><span style="font-size: 40px">✈️</span></div> | **旅行规划**<br>*(Travel)* | **说走就走的旅行助手。**<br>• **结构化行程**：输入目的地，生成精确到时段（早/中/晚）的 JSON 数据。<br>• **时间轴视图**：交互式 UI 展示每日活动、预算与推荐理由。<br>• **多日规划**：支持长途旅行安排。 |
| <div align="center"><span style="font-size: 40px">🛒</span></div> | **购物清单**<br>*(Groceries)* | **极简采购助手。**<br>• **交互体验**：支持点击划线完成，一键清理已购物品。<br>• **联动接收**：作为 AI 厨房的下游，自动接收采购需求。 |
| <div align="center"><span style="font-size: 40px">❤️</span></div> | **健康提醒**<br>*(Health)* | **办公族健康守护。**<br>• **喝水打卡**：大按钮快速记录饮水量。<br>• **久坐监测**：记录上次站立时间，防止长时间伏案。 |

---

## 🛠️ 技术栈

本项目基于最前沿的前端技术构建：

*   **框架**: [React 18](https://reactjs.org/)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **构建工具**: [Vite](https://vitejs.dev/)
*   **样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **AI SDK**: [Google GenAI SDK](https://ai.google.dev/)
*   **图表**: [Recharts](https://recharts.org/)
*   **图标**: [FontAwesome 6](https://fontawesome.com/)

---

## ⚡ 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/lifeos.git
cd lifeos
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

在项目根目录创建 `.env` 文件，并添加你的 Google Gemini API Key（用于 AI 功能）：

```env
API_KEY=your_google_gemini_api_key_here
```

### 4. 启动开发服务器

```bash
npm run dev
```

现在，打开浏览器访问 `http://localhost:5173` 即可体验。

---

## 📦 部署

本项目支持一键部署到 Vercel 或 Netlify。

1.  Fork 本仓库。
2.  在 Vercel 中导入项目。
3.  在 Vercel 的 Environment Variables 中添加 `API_KEY`。
4.  点击 Deploy。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！如果你有新的工具想法，请随时告诉我们。

---

Designed with ❤️ by LifeOS Team
