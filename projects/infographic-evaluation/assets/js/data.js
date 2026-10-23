/**
 * 茶米老師 NotebookLM 資訊圖表風格資料庫
 * 沃克資訊 黃信溢 (茶米老師) 授課內容完整彙整
 */

const INFOGRAPHIC_DATA = {
  // 核心 10 大 NotebookLM 資訊圖表風格
  coreStyles: [
    {
      id: "sketch-notes",
      name: "手繪筆記風",
      nameEn: "Hand-drawn / Sketch Notes",
      category: "教學與生活",
      badge: "最受歡迎",
      badgeColor: "amber",
      icon: "fa-pencil-ruler",
      description: "以細膩鉛筆素描或鋼筆墨線線條呈現，搭配手寫字體與草圖註記，營造專屬個人筆記與匠人手作的溫暖質感。",
      features: [
        "鉛筆與炭筆手繪線條質感",
        "生動箭頭與重點塗鴉外框",
        "文字具有自然手寫筆記感",
        "極適合料理食譜、工作筆記、學習心智圖"
      ],
      bestFor: ["料理食譜SOP", "讀書心得與筆記", "發明草圖與創意歷程", "手帳日誌整理"],
      recommendedFlow: "S型動線 / F型動線",
      aspectRatio: "直式 (3:4) 或 橫式 (16:9)",
      colorPalette: ["#3D3A37", "#EFE9E0", "#C86D51", "#7B8E78"],
      promptSnippet: "風格：手繪筆記風（Sketch Notes），採用細膩鉛筆與墨水線條，搭配手寫註記與素描插圖，版面留白自然，手作溫度感強烈。圖表文字繁體中文，指定 Noto Sans 字型，4K 高解析度輸出。",
      caseExample: "威靈頓牛排零失敗料理全攻略、咖啡手沖六步驟"
    },
    {
      id: "cute-kawaii",
      name: "可愛風",
      nameEn: "Cute / Kawaii Style",
      category: "生活與社群",
      badge: "親和力第一",
      badgeColor: "pink",
      icon: "fa-heart",
      description: "以圓潤討喜的Q版造型、柔和明亮的馬卡龍粉彩色調，消除嚴肅距離感，讓複雜或生硬的主題瞬間親民化。",
      features: [
        "圓角柔和形狀與可愛小表情",
        "高明度、低飽和馬卡龍配色",
        "生動萌趣的輔助小插圖",
        "消除閱讀壓迫感，吸睛度高"
      ],
      bestFor: ["親子家庭教育", "健康生活守則", "社群文宣引流", "新手入門教學"],
      recommendedFlow: "S型動線 / F型動線",
      aspectRatio: "正方形 (1:1) 或 直式 (9:16)",
      colorPalette: ["#FFB5A7", "#FCD5CE", "#F8EDEB", "#F9BEC7", "#4A4E69"],
      promptSnippet: "風格：可愛俏皮風（Cute Kawaii），圓潤邊角與Q版插圖，柔和溫暖粉彩配色，字體圓融討喜，層次分明無閱讀負擔。圖表文字繁體中文，指定 Noto Sans 字型，4K 高解析度輸出。",
      caseExample: "貓咪新手照顧手冊、幼兒早起好習慣集點卡"
    },
    {
      id: "professional-business",
      name: "專業商務風",
      nameEn: "Professional / Corporate Business",
      category: "職場與商業",
      badge: "商務首選",
      badgeColor: "blue",
      icon: "fa-briefcase",
      description: "專為企業決策與商業匯報量身打造，嚴謹的格線系統、俐落卡片排版、冷色調科技藍灰，彰顯無懈可擊的專業說服力。",
      features: [
        "模組化卡片 (Card-based) 與對齊格線",
        "低調沉穩的深藍、深灰與亮色點綴",
        "數據指標與百分比醒目排版",
        "直覺傳遞邏輯因果與戰略層次"
      ],
      bestFor: ["季度業務營收報告", "專案進度里程碑", "商業模式畫布 (BMC)", "組織架構與職能分配"],
      recommendedFlow: "F型動線 / Z型動線",
      aspectRatio: "橫式 (16:9)",
      colorPalette: ["#0F172A", "#1E293B", "#3B82F6", "#10B981", "#F8FAFC"],
      promptSnippet: "風格：專業商務風（Corporate Business），嚴謹網格對齊、俐落深藍灰高階科技感，卡片化模組設計，數據與關鍵指標加粗強化。圖表文字繁體中文，指定 Noto Sans 字型，4K 高解析度輸出。",
      caseExample: "2026年企業數位轉型關鍵指標、跨國市場拓展戰略"
    },
    {
      id: "scientific-experiment",
      name: "科學實驗風",
      nameEn: "Scientific & Infographic Method",
      category: "科普與教育",
      badge: "嚴謹邏輯",
      badgeColor: "indigo",
      icon: "fa-flask",
      description: "融入量杯、試管、化學鍵、座標軸、星系軌道等實驗室元素，以理性的視覺語言拆解物理化學反應與自然法則。",
      features: [
        "精準刻度線、解剖切面與實驗儀器",
        "變因對照與因果反應動線清晰",
        "嚴謹的學術數據標註與符號",
        "適合展現公式轉化與步驟反應"
      ],
      bestFor: ["理化實驗步驟解析", "天文星系與物理現象", "藥品機轉與生物循環", "科技原理拆解"],
      recommendedFlow: "F型動線 / S型動線",
      aspectRatio: "橫式 (16:9) 或 直式 (3:4)",
      colorPalette: ["#0C4A6E", "#0284C7", "#38BDF8", "#F0F9FF", "#0F172A"],
      promptSnippet: "風格：科學實驗風（Scientific Method），融入實驗室量杯、儀器線條與精確刻度指示，結構條理嚴密，突顯數據與反應流程。圖表文字繁體中文，指定 Noto Sans 字型，4K 高解析度輸出。",
      caseExample: "光合作用光反應與暗反應流程、咖啡萃取TDS濃度實驗"
    },
    {
      id: "anime-narrative",
      name: "動漫故事風",
      nameEn: "Anime & Manga Narrative",
      category: "故事與教學",
      badge: "強烈沉浸",
      badgeColor: "purple",
      icon: "fa-theater-masks",
      description: "自帶劇情主角與漫畫分鏡張力，透過分鏡框、對話氣泡與動態速度線，將知識點包裝成主角闖關冒險的精彩故事。",
      features: [
        "鮮明的核心主角帶領視覺動線",
        "漫畫式分鏡方框 (Comic Panels)",
        "對話泡泡與生動擬聲動作線條",
        "極高閱讀黏著度，老少咸宜"
      ],
      bestFor: ["校園安全防護宣導", "歷史重大事件重現", "新人入職闖關冒險", "反詐騙情境教育"],
      recommendedFlow: "Z型動線 / S型動線",
      aspectRatio: "直式 (3:4) 或 橫式 (16:9)",
      colorPalette: ["#581C87", "#7E22CE", "#A855F7", "#F3E8FF", "#F59E0B"],
      promptSnippet: "風格：動漫故事風（Anime Narrative），採漫畫多格分鏡與生動對話氣泡，設定故事主角串聯全程，帶出情境對話與關鍵知識轉折。圖表文字繁體中文，指定 Noto Sans 字型，4K 高解析度輸出。",
      caseExample: "防詐防身術新手三部曲、歷史戰役轉折關鍵回顧"
    },
    {
      id: "claymation-3d",
      name: "3D 黏土風",
      nameEn: "3D Claymation Style",
      category: "生活與社群",
      badge: "溫暖童趣",
      badgeColor: "yellow",
      icon: "fa-cube",
      description: "如定格動畫般的黏土手工雕塑質感，帶著微凹凸的手捏指紋痕跡與柔和打光，營造溫馨不生硬的立體視覺。",
      features: [
        "圓潤厚實的黏土材質立體感",
        "柔和自然頂部漫射光影",
        "視覺溫暖柔和，極具親和感",
        "能軟化任何枯燥艱澀的行政條例"
      ],
      bestFor: ["生活日常指南", "永續環保分類宣導", "幼教與社工專題", "社區營造與在地文創"],
      recommendedFlow: "S型動線 / F型動線",
      aspectRatio: "正方形 (1:1) 或 橫式 (16:9)",
      colorPalette: ["#D97706", "#F59E0B", "#FDE68A", "#78350F", "#FFFBEB"],
      promptSnippet: "風格：3D 黏土風（3D Claymation），手工捏製黏土立體模型質感，溫潤微光澤與柔和邊緣，色調溫馨純真，版面立體且活潑。圖表文字繁體中文，指定 Noto Sans 字型，4K 高解析度輸出。",
      caseExample: "家庭垃圾四分類綠色指引、台南巷弄古早味甜品巡禮"
    },
    {
      id: "editorial-newspaper",
      name: "社論新聞風",
      nameEn: "Editorial & Broadsheet News",
      category: "時事與分析",
      badge: "深度權威",
      badgeColor: "stone",
      icon: "fa-newspaper",
      description: "經典報紙與深度雜誌的排版美學，多欄對齊、大字頭條、雙線裝飾條與嚴謹引言，賦予內容無庸置疑的權威深度感。",
      features: [
        "報刊式多欄分割 (Columns) 與粗體頭條",
        "經典雙黑線分隔與重點引言方塊",
        "黑白灰基底搭配局部專屬警示紅或金",
        "適合深度論述與多方觀點並陳"
      ],
      bestFor: ["法規修訂與政策解讀", "國際時事重大專題", "爭議話題多方觀點分析", "產業白皮書摘要"],
      recommendedFlow: "F型動線 / Z型動線",
      aspectRatio: "直式 (3:4) 或 橫式 (16:9)",
      colorPalette: ["#18181B", "#27272A", "#71717A", "#DC2626", "#FAFAFA"],
      promptSnippet: "風格：社論新聞風（Editorial Newspaper），大字標題、雙欄或三欄報刊版型、優雅水平分割線條，排版嚴謹具權威新聞公信力。圖表文字繁體中文，指定 Noto Sans 字型，4K 高解析度輸出。",
      caseExample: "2026全球生成式AI治理規範白皮書速覽"
    },
    {
      id: "bento-instructional",
      name: "便當/教學步驟風",
      nameEn: "Bento Grid & Instructional Steps",
      category: "教學與SOP",
      badge: "結構王者",
      badgeColor: "emerald",
      icon: "fa-table-cells-large",
      description: "借鑑日式便當盒 (Bento Box) 與現代UI設計的矩形九宮格劃分，將複雜程序拆解為 Step 1, 2, 3，邏輯極致清晰。",
      features: [
        "大小不一但井然有序的圓角矩形格",
        "明確數字步驟 (Step 1, Step 2...) 標籤",
        "高對比色塊強調主次關鍵區域",
        "讓使用者一眼看懂操作流程與因果"
      ],
      bestFor: ["行政申請操作 SOP", "軟體功能操作秘笈", "設備故障排除檢查表", "快速上手指南 (Quick Start)"],
      recommendedFlow: "F型動線 / S型動線",
      aspectRatio: "直式 (9:16) 或 橫式 (16:9)",
      colorPalette: ["#065F46", "#059669", "#34D399", "#A7F3D0", "#ECFDF5"],
      promptSnippet: "風格：便當教學風（Bento Grid Instructional），採便當盒模組化網格佈局，帶編號步驟 Step 1-N，清晰指引箭頭與高對比狀態標記。圖表文字繁體中文，指定 Noto Sans 字型，4K 高解析度輸出。",
      caseExample: "教職員差旅報帳三步驟小幫手、遠端會議室設備五秒設定"
    },
    {
      id: "isometric-blocks",
      name: "積木立體風",
      nameEn: "Isometric Blocks / Brick Style",
      category: "導覽與空間",
      badge: "空間立體",
      badgeColor: "cyan",
      icon: "fa-cubes",
      description: "以 2.5D 等角透視 (Isometric) 積木模組堆疊，立體直觀地展現場域佈局、系統架構與空間流程，充滿探索趣味。",
      features: [
        "2.5D 等角透視 (Isometric 30度角)",
        "模組化樂高積木般的組合美學",
        "高度空間感，建築與路線一目了然",
        "適合空間地圖與系統資料流"
      ],
      bestFor: ["展覽會場動線地圖", "校園導覽與建築特色", "雲端伺服器架構拓撲圖", "文化觀光旅遊路徑"],
      recommendedFlow: "S型動線",
      aspectRatio: "橫式 (16:9) 或 正方形 (1:1)",
      colorPalette: ["#0E7490", "#06B6D4", "#67E8F9", "#CFFAFE", "#155E75"],
      promptSnippet: "風格：積木立體風（Isometric 3D Blocks），等角透視模組積木堆疊造型，展現微縮立體空間與模組聯網路線，視覺精緻具探索感。圖表文字繁體中文，指定 Noto Sans 字型，4K 高解析度輸出。",
      caseExample: "臺南古蹟美食地圖、學校智慧校園IoT設備佈局"
    },
    {
      id: "minimal-flat",
      name: "極簡扁平風",
      nameEn: "Modern Minimalist / Flat Design",
      category: "設計與美學",
      badge: "純粹洗練",
      badgeColor: "teal",
      icon: "fa-shapes",
      description: "崇尚「少即是多」，大面積留白、大膽單純色彩與幾何符號，去除所有裝飾雜訊，讓核心數據與觀點一秒直擊眼球。",
      features: [
        "極致乾淨的大面積呼吸留白空間",
        "大膽鮮明的純色色塊與精鍊幾何",
        "極高文字辨識度與簡約圖標",
        "視覺焦點極度集中，絕無干擾"
      ],
      bestFor: ["核心金句與願景理念", "單一重磅數據震撼宣告", "品牌調性風格定義", "概念思維模型"],
      recommendedFlow: "Z型動線 / F型動線",
      aspectRatio: "橫式 (16:9) 或 正方形 (1:1)",
      colorPalette: ["#134E4A", "#0D9488", "#2DD4BF", "#CCFBF1", "#111827"],
      promptSnippet: "風格：極簡扁平風（Modern Flat Minimalism），大面積極簡留白、純粹幾何造型與精煉色塊，無多餘漸層裝飾，文字訊息直截了當。圖表文字繁體中文，指定 Noto Sans 字型，4K 高解析度輸出。",
      caseExample: "ESG 永續發展三大核心支柱、學校辦學五大承諾"
    }
  ],

  // 茶米老師 NanoBana2 擴充 20 大視覺風格庫
  extendedStyles: [
    {
      id: "monochrome",
      name: "單色黑白",
      nameEn: "Monochrome, Black and white, High contrast",
      description: "純粹的黑白灰階，強調光影對比與人物神情，極具歷史厚重感與藝術張力。",
      tags: ["高對比", "光影", "經典"],
      color: "#27272A"
    },
    {
      id: "color-blocks",
      name: "色塊極簡",
      nameEn: "Color blocks, Flat design, Vibrant minimalism",
      description: "以大面積飽和色彩構成，簡約且具現代設計感，色塊分割明確。",
      tags: ["飽和色彩", "扁平設計", "俐落"],
      color: "#F97316"
    },
    {
      id: "fashion-runway",
      name: "伸展台時尚",
      nameEn: "Fashion runway, Couture, High fashion photography",
      description: "模仿頂尖時尚秀場攝影，具備專業燈光、名模氣質與高級訂製服裝氛圍。",
      tags: ["高級感", "聚光燈", "時尚"],
      color: "#EC4899"
    },
    {
      id: "retro-print",
      name: "復古印刷 / 普普風",
      nameEn: "Retro print, Halftone, Punk aesthetic, Pop art",
      description: "網點印刷質感，具強烈視覺衝擊與地下普普藝術風格，叛逆鮮豔。",
      tags: ["半色調網點", "普普藝術", "復古"],
      color: "#E11D48"
    },
    {
      id: "technicolor",
      name: "特藝彩色",
      nameEn: "Technicolor, Vintage film, High saturation",
      description: "模仿早期經典彩色電影膠卷技術，色彩濃郁、飽和度高，宛若經典好萊塢黃金年代。",
      tags: ["高飽和", "懷舊電影", "底片"],
      color: "#D97706"
    },
    {
      id: "gothic-clay",
      name: "哥德陶土",
      nameEn: "Gothic clay, Stop-motion style, Tim Burton aesthetic",
      description: "類似提姆波頓定格動畫中的泥偶質感，風格幽默微陰鬱且細節極其精緻。",
      tags: ["定格動畫", "泥偶", "提姆波頓"],
      color: "#475569"
    },
    {
      id: "dynamite",
      name: "Dynamite 爆破動作",
      nameEn: "Explosion, Action hero, Cinematic blast",
      description: "充滿動態爆炸效果與戲劇性煙火光影的動作片大片風格，張力滿點。",
      tags: ["爆炸特效", "電影張力", "動態"],
      color: "#EA580C"
    },
    {
      id: "salon-portrait",
      name: "沙龍寫真",
      nameEn: "Salon portrait, Elegant lighting, Studio photography",
      description: "簡潔優雅背景下的精緻人物特寫，強調柔光燈光雕刻與專業氣質。",
      tags: ["棚拍光影", "優雅", "人像"],
      color: "#6B7280"
    },
    {
      id: "pencil-sketch",
      name: "鉛筆素描",
      nameEn: "Pencil sketch, Hand-drawn, Graphite drawing",
      description: "以純粹鉛筆或炭筆線條呈現的手繪質感，排線細膩寫實，深淺分明。",
      tags: ["石墨線條", "手繪細節", "古典"],
      color: "#52525B"
    },
    {
      id: "cinematic-lighting",
      name: "電影氛圍劇照",
      nameEn: "Cinematic lighting, Movie still, Atmospheric",
      description: "具備好萊塢電影劇照的敘事感，注重寬幅比例與光影營造的情緒故事。",
      tags: ["電影光影", "故事敘事", "氛圍感"],
      color: "#1E3A8A"
    },
    {
      id: "steampunk",
      name: "蒸氣龐克",
      nameEn: "Steampunk, Clockwork, Victorian industrial",
      description: "結合十九世紀維多利亞時代美學與蒸氣動力機械齒輪的奇幻復古未來主義。",
      tags: ["黃銅齒輪", "維多利亞", "機械工業"],
      color: "#B45309"
    },
    {
      id: "sunrise-golden",
      name: "金色日出 / 晨曦",
      nameEn: "Sunrise, Golden hour, Warm glow, Backlit",
      description: "暖金色調的清晨逆光光影，充滿朝氣、希望與撫慰人心的溫馨感。",
      tags: ["黃金時刻", "溫暖逆光", "希望"],
      color: "#F59E0B"
    },
    {
      id: "mythical-warrior",
      name: "神話史詩戰士",
      nameEn: "Mythical warrior, Epic battle, Fantasy illustration",
      description: "宏大的史詩奇幻戰鬥場面，細節豐富的盔甲、魔幻法術與神話背景。",
      tags: ["史詩戰役", "奇幻插畫", "盔甲法術"],
      color: "#7C3AED"
    },
    {
      id: "surrealism",
      name: "超現實夢境",
      nameEn: "Surrealism, Dreamlike, Abstract portrait",
      description: "扭曲現實或達利夢境般的視覺呈現，打破空間物理法則，極具想像力。",
      tags: ["達利美學", "夢境抽象", "顛覆邏輯"],
      color: "#9333EA"
    },
    {
      id: "moody-shadows",
      name: "深沉暗影",
      nameEn: "Moody, Deep shadows, Dark interior",
      description: "色調偏暗沉穩，深邃陰影營造出一種冷靜、專注或略帶神秘的深層氣氛。",
      tags: ["低調幽暗", "深邃陰影", "神祕感"],
      color: "#18181B"
    },
    {
      id: "enamel-pin",
      name: "琺瑯別針徽章",
      nameEn: "Enamel pin style, Vector icon, Simplified",
      description: "類似金屬金邊徽章或貼紙的簡約向量化造型，線條俐落、光澤反光可愛。",
      tags: ["金屬金邊", "向量別針", "圖標化"],
      color: "#10B981"
    },
    {
      id: "cyborg-futuristic",
      name: "科幻生化人",
      nameEn: "Cyborg, Cybernetic, Futuristic robot",
      description: "結合精密發光機械零件與人類生物特徵的高科技未來科幻世界觀。",
      tags: ["機械義肢", "未來科幻", "賽博格"],
      color: "#06B6D4"
    },
    {
      id: "soft-portrait",
      name: "柔光寫真",
      nameEn: "Soft lighting, Pastel tones, Gentle focus",
      description: "柔和漫射的光線與淡雅粉彩色調，營造溫暖自然、細膩親切的人物寫真。",
      tags: ["柔和對焦", "淡彩粉調", "溫柔自然"],
      color: "#FB7185"
    },
    {
      id: "vintage-cartoon",
      name: "1930s 懷舊橡膠管卡通",
      nameEn: "Vintage cartoon, Rubber hose style, 1930s animation",
      description: "模仿 1930 年代早期迪士尼米老鼠卡通的橡膠管手臂、白手套與黑白膠卷感。",
      tags: ["橡膠管線條", "1930年代", "早期黑白卡通"],
      color: "#3F3F46"
    },
    {
      id: "oil-painting",
      name: "古典油畫",
      nameEn: "Oil painting, Textured brushstrokes, Fine art",
      description: "厚重的油彩堆疊筆觸與古典畫作光影，散發歐洲文藝復興的古典美學。",
      tags: ["厚塗筆觸", "古典畫風", "文藝復興"],
      color: "#92400E"
    }
  ],

  // 10 大簡報風格 (Presentation Styles)
  presentationStyles: [
    { name: "視覺敘事風格", nameEn: "Visual Storytelling", desc: "依賴高品質全版圖片與強烈情感連結，文字極少。畫面為講者語言的自然延伸。" },
    { name: "極簡禪意風格", nameEn: "Minimalist / Zen", desc: "強調大量留白、單純排版與極少文字，消除視覺雜訊，注意力聚焦於演講者本身。" },
    { name: "數據分析風格", nameEn: "Data-Driven / Analytical", desc: "以圖表、數據趨勢和邏輯推演為核心，以堅實量化證據建立強大說服力。" },
    { name: "互動對話風格", nameEn: "Interactive / Conversational", desc: "設計觀眾提問或投票環節，非線性結構可依現場熱烈反應靈活切換幻燈片。" },
    { name: "專業企業風格", nameEn: "Professional / Corporate", desc: "標準化範本與嚴謹結構，條列式重點排版，給人穩健可靠、品牌一致的商務印象。" },
    { name: "節奏速遞風格", nameEn: "PechaKucha / Ignite", desc: "嚴格時間限制與自動換頁（如每頁20秒），節奏緊湊明快，強迫講者精煉核心內容。" },
    { name: "幽默娛樂風格", nameEn: "Humorous / Entertaining", desc: "融入趣味笑話或迷因維持注意力，適合輕鬆分享或軟化過於沉重嚴肅的主題。" },
    { name: "學術教育風格", nameEn: "Academic / Educational", desc: "內容詳盡嚴謹，注重理論定義與文獻引用，旨在系統化傳授知識與複雜概念。" },
    { name: "啟發激勵風格", nameEn: "Inspirational / Motivational", desc: "充滿熱情與能量，結合親身奮鬥經歷，旨在激發深層情感共鳴並促使採取行動。" },
    { name: "資訊圖表風格", nameEn: "Infographic / Illustrated", desc: "將複雜多層次資訊轉化為易懂圖解，生動呈現抽象關聯與步驟流程。" }
  ],

  // 茶米老師核心三大視覺動線 (Visual Flows)
  visualFlows: [
    {
      id: "f-pattern",
      name: "F型動線 (順序閱讀)",
      nameEn: "F-Pattern (Top-Down Sequence)",
      icon: "fa-bars-staggered",
      rule: "由左至右、由上而下，水平掃描後垂直向下跳躍。",
      suitable: "適合結構嚴謹、條理分明、有先後次序的教學SOP、章節規定與標準清單。",
      flowDiagram: "標題 (全幅) ➔ 核心重點 ➔ 次要細節 ➔ 底部補充",
      userBehavior: "人類在閱讀文本密集內容時最天然的視線軌跡，效率最高、理解最快。",
      promptInject: "視覺動線：採用標準 F 型閱讀動線（由左至右、由上而下），首重頂部大標題與關鍵摘要，接著條列式依序展開，確保閱讀邏輯自然順暢。"
    },
    {
      id: "s-pattern",
      name: "S型動線 (路徑引導)",
      nameEn: "S-Pattern / Z-Path Curved",
      icon: "fa-route",
      rule: "如同蜿蜒河流或探索步道，視線呈 S 形穿梭前進，由引導線或箭頭串連。",
      suitable: "適合多步驟製作流程、歷程演進、成長歷程地圖、料理食譜秘笈與故事關卡。",
      flowDiagram: "起點 (左上) ➔ 右滑至步驟2 ➔ 拐回左側步驟3 ➔ 右滑至終點成果",
      userBehavior: "打破傳統條列式的沉悶，引領讀者像探險一般順著路線一口氣讀完。",
      promptInject: "視覺動線：採用 S 型路徑引導動線（蜿蜒探索式路線），以箭頭或連接線串聯各個步驟節點，生動引導視線穿梭，層層遞進直到最終成果。"
    },
    {
      id: "z-pattern",
      name: "Z型動線 (對抗比較)",
      nameEn: "Z-Pattern (Contrast & Balance)",
      icon: "fa-bolt",
      rule: "左上起點橫掃至右上，沿對角線切至左下，再橫掃至右下。",
      suitable: "適合對照比較（如 DO vs DON'T、傳統 vs AI、優缺點對比、雙角色 PK）。",
      flowDiagram: "左上(主角A) ➔ 右上(主角B) ➔ 對角穿透 ➔ 底部結論與抉擇建議",
      userBehavior: "視線在兩大陣營之間高速跳躍對比，快速建立差異認知與清晰結論。",
      promptInject: "視覺動線：採用 Z 型對抗比較動線，兩側形成鮮明對照（如優劣、傳統vs現代、規格比較），中間以對角線過渡，底部給出總結結論。"
    }
  ],

  // 茶米老師四大實戰心法 (Workflow Steps)
  workflowSteps: [
    {
      step: 1,
      title: "主題發想與資料收集",
      subtitle: "拒絕無腦直出，先確立邊界",
      icon: "fa-compass",
      content: "不要直接拿網路上未經整理的大雜燴硬丟進去生圖。先在 NotebookLM 新增筆記本，輸入主題關鍵字（例如威靈頓牛排各種食譜、三月瘋媽祖歷史），廣泛收集資料，建立豐富的素材池。"
    },
    {
      step: 2,
      title: "對話淬煉與記事轉來源",
      subtitle: "最關鍵的內部資料流轉法門",
      icon: "fa-arrows-spin",
      content: "在對話框中與 AI 深度對談（例如要求整理『在家零失敗不翻車食譜』），產出精煉內容後，點擊『儲存至記事』，再於右側記事面板點擊『轉換成來源』；或直接複製文字貼回『新增來源』。用精煉後的成果作為生圖的真正基石！"
    },
    {
      step: 3,
      title: "神級提示詞驅動工作室",
      subtitle: "不用手動按按鈕，提示詞直接召喚",
      icon: "fa-wand-magic-sparkles",
      content: "在對話框輸入茶米老師專屬神級 Prompt：『請你扮演資訊專家，根據資料自動分析並生成一張資訊圖表...』。精準指定三大動線 (F/S/Z)、設定繁體中文、Noto Sans 字型與 4K 輸出規格，讓 NotebookLM 自動驅動右側工作室完成生成！"
    },
    {
      step: 4,
      title: "Canva Magic Layers 拆圖後製",
      subtitle: "解鎖自由編輯與轉短影音的黑科技",
      icon: "fa-layer-group",
      content: "生成的圖文字不能改怎麼辦？切換 Canva 為英文版 (English US)，上傳生成的 PDF 或圖片，點選圖片選取『Magic Layers』！瞬間將 AI 圖片拆成可編輯文字、向量圖層與獨立背景，自由改字排版，還能加入動畫轉為 MP4 短影音！"
    }
  ],

  // YAML 結構化排版範本 (規格化控制風格)
  yamlTemplate: `此為 [資訊圖表風格分析] 格式框架，餵給 NotebookLM 作為來源，即可精準鎖定資訊圖表版面結構：

1. 全域設計規範 (Global Design Specifications)
global_design:
  atmosphere: "專業, 資訊豐富, 結構化, 溫暖手作"
  color_scheme:
    background: "#F9F8F4" # 溫潤淺米色底圖
    text: "#1A1A1A" # 深黑高辨識度內文
    accent: 
      - "#C0392B" # 警示紅 / 重點強調標籤
      - "#2980B9" # 穩定藍 / 核心步驟指引
    secondary: "#D5DBDB" # 灰色次要格線
  typography:
    heading: "Noto Sans TC Bold (粗黑體)" # 主標題強大衝擊力
    subheading: "Noto Sans TC Medium" # 次標題小節
    body: "Noto Sans TC Regular" # 內文好讀
  layout_rules:
    navigation: "S型動線蜿蜒引導 / 便當盒卡片劃分"
    layout_design:
      - "中心構圖" # 核心主視覺居中
      - "格線系統" # 2x3 或 3x3 圓角卡片
    decorative_elements: "箭頭引導線、步驟圓圈、小圖示裝飾"

2. 頁面構成要素規劃 (Content Planning)
structure:
  header:
    type: "標題區"
    elements: ["【主標題】大字居中", "副標題包含核心效益與難易度"]
  core_steps:
    type: "S型步驟歷程"
    step_1: "食材 / 前置準備清單"
    step_2: "核心關鍵技法拆解"
    step_3: "烘烤 / 執行溫控要點"
  risk_tips:
    type: "避坑防翻車指南"
    items: ["三大容易失誤點與即時補救法"]
  footer:
    type: "成果展示與美味評分"`
};

// 匯出全域變數
window.INFOGRAPHIC_DATA = INFOGRAPHIC_DATA;
