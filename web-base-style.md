# Web Base Style

從 `index.html`（樣式定義於 `css/style.css` 的 `:root`）提取的基礎設計規範。

---

## 主要用色

| Token | 色碼 | 用途 |
| --- | --- | --- |
| `--shu` | `#B23A2A` | 主色（朱紅）：強調色、漢字標題、編號、focus 外框、裝飾線 |
| `--shu-light` | `#D0623F` | 主色亮版：深色區塊（底片條、Footer）中的強調色與 hover |

### 輔助色

| Token | 色碼 | 用途 |
| --- | --- | --- |
| `--muted` | `#6B655C` | 次要文字（簡介、說明段落） |
| `--faint` | `#9E978A` | 最淡文字（meta 標籤、dt） |
| `--card` | `#EAE4D8` | 圖片佔位底色 |
| `--line` | `#D8D0C2` | 分隔線 |
| `--dark-line` | `#3A3631` | 深色區分隔線 |
| `--dark-word` | `#2E2B27` | 深色區浮水印字 |
| `--dim` | `#6E685F` | 深色區次要文字 |
| `--dim-2` | `#8A8378` | 深色區 meta 文字 |
| `--sheet-text` | `#B8B0A2` | 底片條區塊文字 |

---

## 底色

| Token | 色碼 | 用途 |
| --- | --- | --- |
| `--bg` / `--cream` | `#F3EFE7` | 頁面主底色（米白；同 `<meta name="theme-color">`） |
| `--dark` | `#1F1D1A` | 深色區塊底色（底片條、Footer） |
| `--darker` | `#121110` | 深色按鈕 active 狀態 |

---

## 主要文字顏色

| Token | 色碼 | 用途 |
| --- | --- | --- |
| `--ink` | `#1F1D1A` | 淺底上的主要文字（`body` 預設） |
| `--cream` | `#F3EFE7` | 深底上的主要文字（Footer） |

---

## 字體

字體來源：Google Fonts（Inter、Montserrat、Lora、LINE Seed JP、Noto Sans TC、Noto Serif TC、Huninn＝jf open 粉圓）＋ jsDelivr（悠哉字體 `@chinese-fonts/yozai`）。

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Huninn&family=Inter:wght@400;500;700&family=LINE+Seed+JP:wght@400;700&family=Lora:wght@400;500;600;700&family=Montserrat:wght@400;500;600&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@chinese-fonts/yozai@3.0.0/dist/Yozai-Regular/result.css">
```

字體堆疊順序：英文 → 日文 → 繁體中文。

### 標題

- **Token**：`--f-serif`
- **字體**：`"Lora", "Noto Serif TC", serif`
- **字重**：400 / 500 / 600 / 700（標題多用 500）
- **特徵**：負字距（`-1px` ~ `-.03em`）、行高 1.05–1.45
- 用於：h1 / h2 / h3、品牌名、漢字裝飾、Statement、Email

### 內文

- **Token**：`--f-sans`
- **字體**：`"Inter", "LINE Seed JP", "Noto Sans TC", sans-serif`
- **字重**：400 / 500 / 700（連結、導覽列用 500）
- **行高**：1.5–1.7
- 用於：`body` 預設字體、段落、連結、導覽列

### 標籤

- **Token**：`--f-label`
- **字體**：`"Montserrat", "LINE Seed JP", "Noto Sans TC", sans-serif`
- **規格**：11–13px、`letter-spacing: 1.2px`；計數器加 `font-variant-numeric: tabular-nums`
- 用於：meta 標籤、編號、計數器

### 手寫

- **Token**：`--f-hand`
- **字體**：`"Yozai", "Noto Serif TC", serif`（悠哉字體）
- 用於：直書文字（光を待つ人／一期一会）、Footer Wordmark（ありがとう。）

### 圓體

- **Token**：`--f-round`
- **字體**：`"Huninn", "Noto Sans TC", sans-serif`（jf open 粉圓）
- 已定義、目前頁面未套用，預留給繁體中文內容

### 大小

#### 標題

| 元素 | 桌面 | 手機（≤ 899px） | 字重 / 行高 / 字距 |
| --- | --- | --- | --- |
| Hero 主標（`.line--2`） | `clamp(56px, 7.22vw, 104px)` | 64px | 500 / 1.05 / -.03em |
| Hero 副標（`.line--3`） | `clamp(24px, 2.64vw, 38px)` | 24px | 400 / 1.2 |
| Hero 前導（`.line--1`） | `clamp(20px, 1.8vw, 26px)` | — | 400 |
| 漢字大標（`.kanji`） | `clamp(56px, 8.33vw, 120px)` | 56px | — / 1 |
| Wordmark | `clamp(46px, 13.9vw, 200px)` | — | — / 1 |
| 姓名 h2（`.name-block`） | `clamp(48px, 5vw, 72px)` | — | 500 / 1.05 / -2px |
| 區塊 h2（`.titles`） | `clamp(26px, 3.6vw, 52px)` | 26px | 500 / 1.3 / -1px |
| Footer 標語（`.invite__headline`） | `clamp(30px, 3.33vw, 48px)` | — | 500 / 1.3 / -.8px |
| 選單連結 | 40px | — | 500 / — / -1px |
| Statement / Email | `clamp(21px, 1.95vw, 28px)` | — | — / 1.6 |
| 作品 h3（`.caption`） | 26px | 21px | 500 / 1.45 |
| 品牌名 | 20px | 18px | 600 |

#### 內文

| 元素 | 桌面 | 手機（≤ 899px） | 行高 |
| --- | --- | --- | --- |
| 副標說明（`.name-block p`） | 18px | 16px | — |
| Hero 簡介 | 17px | 16px | 1.7 |
| Footer 連結 | 17px | 16px | — |
| 一般段落 / 細項（`.works__sub`、`.detail dd`、`.toolkit p`） | 16px | 15px | 1.5–1.7 |
| 作品說明（`.caption p`） | 15px | 14px | 1.7 |
| 連結、導覽列（`.link-line`、`.lbl`） | 15px | — | — |
| 小字（`.fact dd`） | 14px | — | — |
| Meta / 編號（Mono） | 11–13px | 10–11px | — |

---

## 其他

| Token | 值 | 說明 |
| --- | --- | --- |
| `--maxw` | `1440px` | 內容最大寬度 |
| `--pad` | `64px` | 左右內距 |
| `--ease` | `cubic-bezier(.22, .61, .2, 1)` | 主要緩動 |
| `--ease-io` | `cubic-bezier(.65, .05, .25, 1)` | 進出場緩動 |
