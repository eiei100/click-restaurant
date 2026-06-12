// --- 1. ゲームの状態（データ）を１つにまとめる ---
const gameState = {
    money: 0,                // 現在の売上（所持金・買い物で減る）
    mps: 0,                  // 毎秒の売上
    seasonMoney: 0,          // この周回（今シーズン）で稼いだ合計売上（買い物で減らない）
    totalMoney: 0,           // 全ての周での通算売上（ゲーム開始からの全累計）
    buyAmount: 1,            // 一括購入モード（x1, x10, x100）
    prestigeChips: 0,        // 所持している天界の調味料
    prestigeMultiplier: 1.0, // 現在の売上倍率（転生ボーナス）
    comfort: 0,              // お店の現在の「合計快適度」
    bgmEnabled: true,        // 🌟【追加】BGMのON/OFF状態の初期値（これで起動時も安心！）
    reviewMultiplier: 1.0    // 🌟【新登場】グルメアプリの星評価バフ（最初は等倍の1.0からスタート！）
};


// --- 2-1. 施設一覧（3週間じっくり遊べる超長期やり込みブレーキ版） ---
const facilities = [
    { id: 'flyer', name: '手書きのチラシ', cost: 15, mpsValue: 0.1, count: 0, totalEarned: 0, desc: '近所の電柱に貼ったビラ。たまに物好きな人が見にくる。' },
    { id: 'board', name: '店先の看板板', cost: 100, mpsValue: 1, count: 0, totalEarned: 0, desc: 'チョークでメニューを書いた板。少しだけお店っぽくなった。' },
    { id: 'sns', name: 'お店のSNSアカウント', cost: 1100, mpsValue: 8, count: 0, totalEarned: 0, desc: '「本日オープン！」の写真に、身内から3つのいいねがついた。' },
    { id: 'bike', name: 'ボロいママチャリ', cost: 12000, mpsValue: 47, count: 0, totalEarned: 0, desc: '立ち漕ぎで近所にデリバリー。ブレーキをかけるとキィキィ鳴る。' },
    { id: 'worker', name: '見習いバイト', cost: 130000, mpsValue: 260, count: 0, totalEarned: 0, desc: '時給が安くて元気がいい。お皿洗いや注文取りを頑張るぞ。' },
    { id: 'oven', name: '自動高速オーブン', cost: 1400000, mpsValue: 1400, count: 0, totalEarned: 0, desc: '最新テクノロジーで作られたオーブン。ピザも一瞬で焼き上がる。' },
    { id: 'chef', name: 'ベテラン料理長', cost: 20000000, mpsValue: 7800, count: 0, totalEarned: 0, desc: '元三ツ星レストランのシェフ。彼の作るまかないは絶品。' },
    { id: 'car', name: '高級デリバリーカー', cost: 330000000, mpsValue: 44000, count: 0, totalEarned: 0, desc: '金ピカの配達車。どんなに遠くても温かいまま料理を届ける。' },
    { id: 'drone', name: 'ドローン配達網', cost: 5100000000, mpsValue: 260000, count: 0, totalEarned: 0, desc: '空からピザが降ってくる時代。カラスの襲撃対策もバッチリ。' },
    { id: 'neon', name: '巨大ネオン看板', cost: 75000000000, mpsValue: 1600000, count: 0, totalEarned: 0, desc: '宇宙からも見える明るさ。夜間のお客さんが100倍に増えた。' },
    // 🛑【ここから地獄の超強烈ブレーキ！】1円の生産力を得るための「コスト比率」を劇的に悪くします。
    { id: 'factory', name: '地下食品工場', cost: 1100000000000, mpsValue: 5000000, count: 0, totalEarned: 0, desc: '24時間ノンストップで食材を加工する、秘密の巨大地下迷宮。' },
    { id: 'fridge', name: '超次元冷蔵庫', cost: 14000000000000, mpsValue: 22000000, count: 0, totalEarned: 0, desc: '中が四次元空間につながっており、無限に食材を新鮮保存できる。' },
    { id: 'lab', name: 'ピザ研究所', cost: 170000000000000, mpsValue: 95000000, count: 0, totalEarned: 0, desc: '白衣を着た科学者たちが、一番美味しくなる分子構造を研究中。' },
    { id: 'brain', name: '脳波注文システム', cost: 2100000000000000, mpsValue: 380000000, count: 0, totalEarned: 0, desc: '食べたいと思った瞬間、すでに目の前に料理が届いている。' },
    { id: 'alchemy', name: '錬金術調理鍋', cost: 26000000000000000, mpsValue: 1500000000, count: 0, totalEarned: 0, desc: 'ただの水と小麦粉から、最高級 of 黄金スープを錬成する。' },
    { id: 'elevator', name: '美食の軌道エレベーター', cost: 310000000000000000, mpsValue: 5800000000, count: 0, totalEarned: 0, desc: '地上で作った料理を、そのまま宇宙ステーションへ直行デリバリー。' },
    { id: 'moon', name: '月面トマト農場', cost: 3800000000000000000, mpsValue: 22000000000, count: 0, totalEarned: 0, desc: '宇宙放射線を浴びて、信じられないほど甘くなった特大トマト。' },
    { id: 'wormhole', name: 'ワームホール配送便', cost: 45000000000000000000, mpsValue: 81000000000, count: 0, totalEarned: 0, desc: '空間を折りたたんで配達。配達時間は驚異のマイナス1秒（過去に届く）。' },
    { id: 'parallel', name: '並行世界レストラン', cost: 540000000000000000000, mpsValue: 300000000000, count: 0, totalEarned: 0, desc: '別の世界の自分たちにも店を経営させ、売上をこの世界に集約する。' },
    { id: 'universe', name: '全知全能のレストラン', cost: 6400000000000000000000, mpsValue: 1100000000000, count: 0, totalEarned: 0, desc: 'この宇宙そのものが一つの巨大なレストランとなった。売上はもはや概念。' }
];





// --- 2-2. ランク一覧（何日もじっくり遊ばせる長期戦ビルド） ---
const restaurantRanks = [
    { threshold: 0,          name: 'ランク1: 賑やかな夜の屋台',        img: 'rank1.png' },
    { threshold: 1000,       name: 'ランク2: 行列のできる下町食堂',    img: 'rank2.png' },    // 開始30分〜1時間程度の壁
    { threshold: 50000,      name: 'ランク3: 駅前のモダンカフェ',      img: 'rank3.png' },    // 数時間しっかり遊んだ壁
    { threshold: 10000000,   name: 'ランク4: 憧れの老舗高級ホテル',    img: 'rank4.png' },    // 1日目の夜に到達する壁
    { threshold: 2e9,        name: 'ランク5: 地上200階の空中レストラン', img: 'rank5.png' },  // 2日目、しっかり放置して超える壁
    { threshold: 5e11,       name: 'ランク6: 豪華客船の洋上メインダイニング', img: 'rank6.png' }, // 3日目、ここで本家仕様の「1兆円の転生」が見えてくる！
    { threshold: 1e14,       name: 'ランク7: 月面ドーム・ファーストフード店', img: 'rank7.png' }, // 転生を1〜2回挟んでようやく到達できる宇宙の壁
    { threshold: 5e16,       name: 'ランク8: 銀河縦断美食クルーズ超特急',  img: 'rank8.png' },  // 転生を数回重ねて進む銀河の壁
    { threshold: 1e19,       name: 'ランク9: 超次元ブラックホール異界食堂', img: 'rank9.png' }, // 完全にゲームを極め始めた人向けの異世界の壁
    { threshold: 1e22,       name: 'ランク10: 全知全能の全宇宙満腹聖殿',  img: 'rank10.png' } // 2週間〜1ヶ月やり込んで到達する神の領域
];



// --- 2-3. 店舗設備（快適度）アイテムのデータ ---
const comfortItems = [
    { id: 'plant', name: '観葉植物', cost: 1000000, comfortValue: 5, count: 0, visual: '🌳', description: '店内に緑をプラス。空気が美味しくなり、少しだけ落ち着く空間になる。' }, // 100万
    { id: 'terrace', name: 'テラス席', cost: 50000000, comfortValue: 15, count: 0, visual: '🪑', description: '天気の良い日に最高な外の特等席。開放感があって、お客さんにも大人気。' }, // 5000万
    // 🌟【新登場！】中盤の大きな目標になるBGM解放アイテム
    { id: 'bgm_cafe', name: 'オシャレなカフェBGM', cost: 150000000, comfortValue: 20, count: 0, visual: '🎵', description: 'お店の雰囲気をガラッと変える新BGMを解放。これを目当てに来るお客さんも。' }, // 1億5000万
    { id: 'fountain', name: '癒しの噴水', cost: 10000000000, comfortValue: 50, count: 0, visual: '⛲', description: '水のせせらぎが響く美しい噴水。お店の格式がグッと跳ね上がる。' }, // 100億
    { id: 'parking', name: '広々とした駐車場', cost: 2500000000000, comfortValue: 150, count: 0, visual: '🚗', description: '遠方からのお客さんも車でサクッと来店できるように。大繁盛の予感。' }, // 2.5兆
    { id: 'interior', name: '高級な内装デザイン', cost: 8500000000000000, comfortValue: 500, count: 0, visual: '✨', description: '一流のデザイナーが手がけた最高級の内装。もはやただの食堂ではない。' } // 8500兆
    
];




// --- 3-1. HTMLのパーツ（要素）を取得 ---
const moneyEl = document.getElementById('money');
const mpsEl = document.getElementById('mps');
const totalMoneyEl = document.getElementById('total-money'); // 累計売上の表示場所を取得
const mainClickBtn = document.getElementById('main-click-btn');
const shopArea = document.getElementById('shop-area'); // 空っぽにしたショップの箱
const tooltipEl = document.getElementById('tooltip'); // 【追加】自作ポップアップの箱を取得！
const rankEl = document.getElementById('restaurant-rank');     // ランク名を表示する場所
const visualEl = document.getElementById('restaurant-visual'); // レストランの画像を表示する場所

// --- 3-2. クリックを強化するための道具
// =================================================================
// 🍳 【新登場】手動クリック強化アイテム（全20種・究極のやり込みデータ）
// =================================================================
const upgrades = [
    // --- 【序盤】固定値アップ（5種） ---
    { id: 'up_pan', name: 'テフロン加工のフライパン', cost: 500, bought: false, desc: '食材がくっつかない優れもの。クリックの売上が恒久的に【 ＋5円 】！' },
    { id: 'up_knife', name: '職人のマイ包丁', cost: 5000, bought: false, desc: '驚異の切れ味で仕込みが爆速に。クリックの売上が恒久的に【 ＋50円 】！' },
    { id: 'up_timer', name: '高級デジタルキッチンタイマー', cost: 35000, bought: false, desc: '1秒の狂いもなく調理。クリックの売上が恒久的に【 ＋300円 】！' },
    { id: 'up_glove', name: '耐熱極厚オーブンミトン', cost: 180000, bought: false, desc: '焼きたての熱々鉄板を素早く回収。クリックの売上が恒久的に【 ＋1,500円 】！' },
    { id: 'up_scale', name: '0.1g単位の精密キッチンスケール', cost: 950000, bought: false, desc: '完璧な黄金比率で調合。クリックの売上が恒久的に【 ＋8,000円 】！' },

    // --- 【中盤】自動の売上（MPS）がクリック力に流れ込む％上乗せ（5種） ---
    { id: 'up_cutter', name: '全自動超音波ピザカッター', cost: 6000000, bought: false, desc: '現在の「毎秒の売上（MPS）」の【 1% 】がそのままクリック力に上乗せされる！' },
    { id: 'up_tong', name: 'オーナーの金のトング', cost: 45000000, bought: false, desc: '現在の「毎秒の売上（MPS）」の【 2% 】がそのままクリック力に上乗せされる！' },
    { id: 'up_scooter', name: 'ニトロ搭載マッハスクーター', cost: 380000000, bought: false, desc: '現在の「毎秒の売上（MPS）」の【 3% 】がそのままクリック力に上乗せされる！' },
    { id: 'up_tablet', name: '全席AI注文タッチパネル', cost: 2900000000, bought: false, desc: '現在の「毎秒の売上（MPS）」の【 4% 】がそのままクリック力に上乗せされる！' },
    { id: 'up_uniform', name: '特注のハイテク厨房服', cost: 22000000000, bought: false, desc: '現在の「毎秒の売上（MPS）」の【 5% 】がそのままクリック力に上乗せされる！' },

    // --- 【終盤】クリック力をさらに何倍にも膨らませる掛け算バフ（5種） ---
    { id: 'up_fork', name: '神話の黄金フォーク', cost: 180000000000, bought: false, desc: '美食を虜にするフォーク。これまでの合計クリック力が【 2倍 】になる！' },
    { id: 'up_spice', name: '幻のスパイス「マサラ・オメガ」', cost: 1500000000000, bought: false, desc: '一口で脳がハジける。これまでの合計クリック力が【 3倍 】になる！' },
    { id: 'up_apron', name: '時空を超える伝説のエプロン', cost: 12000000000000, bought: false, desc: '手さばきが光速を超える。これまでの合計クリック力が【 4倍 】になる！' },
    { id: 'up_recipe', name: '禁断の異世界レシピ本', cost: 98000000000000, bought: false, desc: '神の領域 of 味を再現。これまでの合計クリック力が【 5倍 】になる！' },
    { id: 'up_water', name: '高次元の始祖水', cost: 850000000000000, bought: false, desc: 'すべての料理が奇跡に変わる。これまでの合計クリック力が【 10倍 】になる！' },

    // --- 【地獄・宇宙次元】最強の道具（5種） ---
    { id: 'up_quantum', name: '量子もつれオートフライヤー', cost: 7700000000000000, bought: false, desc: '全並行世界のクリック力を集中。現在のMPSの【 10% 】がクリック力に加算！' },
    { id: 'up_gravity', name: '重力制御型超特大鍋', cost: 69000000000000000, bought: false, desc: 'ブラックホールの圧力で旨味を凝縮。合計クリック力が【 20倍 】になる！' },
    { id: 'up_star', name: '恒星エネルギー調理炉', cost: 580000000000000000, bought: false, desc: '太陽の熱でじっくり直火焼き。現在のMPS의【 25% 】がクリック力に加算！' },
    { id: 'up_matrix', name: '因果律書き換えスプーン', cost: 4800000000000000000, bought: false, desc: '「売れた」という事実を宇宙に直接書き込む。合計クリック力が【 50倍 】に！' },
    { id: 'up_infinity', name: '無限無限無限ピザピール', cost: 39000000000000000000, bought: false, desc: 'すべての料理ゲームの頂点へ。合計クリック力が【 100倍 】になる！' }
];

// 🌟 画像ファイル名のマッピング（img/upgrades/ 内に保存してください）
const upgradeImages = {
    up_pan: 'pan.png', up_knife: 'knife.png', up_timer: 'timer.png', up_glove: 'glove.png', up_scale: 'scale.png',
    up_cutter: 'cutter.png', up_tong: 'tong.png', up_scooter: 'scooter.png', up_tablet: 'tablet.png', up_uniform: 'uniform.png',
    up_fork: 'fork.png', up_spice: 'spice.png', up_apron: 'apron.png', up_recipe: 'recipe.png', up_water: 'water.png',
    up_quantum: 'quantum.png', up_gravity: 'gravity.png', up_star: 'star.png', up_matrix: 'matrix.png', up_infinity: 'infinity.png'
};

// 🌟【新規追加：完全ガード】背景タップリセットの仕組みをシステム全体で1回だけ登録
function initUpgradeShopGlobalListener() {
    if (window.isUpgradeShopListenerInitialized) return;

    document.addEventListener('pointerup', (e) => {
        // 💡【安全ガード】タップされた要素がすでにDOMから消滅している場合は処理しない（エフェクト消滅時のエラー防止）
        if (!e.target || !document.body.contains(e.target)) return;

        // メインボタンやエフェクトを触っている時は処理をスキップ（安全ガード）
        if (e.target.closest('#main-click-btn') || e.target.closest('.click-pop-effect') || e.target.closest('.click-effect') || e.target.closest('#coin-effect')) {
            return;
        }
        
        // タップされた場所が道具ボタン（またはその中身の画像など）ではない時
        if (!e.target.closest('.upgrade-btn')) {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.classList.add('hidden');
                delete tooltip.dataset.activeId; // 💡裏でのデータ更新追従との紐付けを完全にクリーンアップ
            }
            
            // 画面上にあるすべての道具ボタンの選択状態を安全にリセット
            document.querySelectorAll('.upgrade-btn.active-touch').forEach(btn => {
                btn.classList.remove('active-touch');
            });
        }
    }, { passive: true });

    window.isUpgradeShopListenerInitialized = true;
}


// 🌟【完全版・バグ全消滅】道具ショップ（商品棚）を生成・追加するメイン関数
function renderUpgradesShop() {
    const upgradeArea = document.getElementById('shop-area-upgrades');
    if (!upgradeArea) return;

    // グローバルリスナーを確実に1回だけ初期化
    initUpgradeShopGlobalListener();

    upgrades.forEach(up => {
        let btn = document.getElementById(`up-btn-${up.id}`);

        // 出現条件を満たしていないなら画面から消して終了
        if (!isUpgradeUnlocked(up)) {
            if (btn) btn.remove();
            return;
        }

        // =================================================================
        // 💡 ツールチップに最新テキストを流し込んで左側の壁に固定する処理
        // =================================================================
        function showUpgradeTooltip() {
            const tooltip = document.getElementById('tooltip');
            if (!tooltip) return;
            
            // 常に呼び出された時点の最新の価格・説明を反映
            tooltip.innerHTML = `<strong>${up.name}</strong><br>
                                 <span style="color:#f1c40f;">価格: ${typeof formatNumber === 'function' ? formatNumber(up.cost) : up.cost} 円</span><br>
                                 <p style="margin:5px 0 0 0; font-size:12px; color:#bdc3c7;">${up.desc}</p>`;
            
            tooltip.classList.remove('hidden');
            
            // dataset を使って「現在どのボタンのツールチップを開いているか」のIDを記録
            tooltip.dataset.activeId = up.id;
            
            const btnRect = btn.getBoundingClientRect();
            const containerRect = document.getElementById('game-container').getBoundingClientRect();
            const rightPanelRect = document.getElementById('right-panel').getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect(); 
            
            tooltip.style.left = `${rightPanelRect.left - containerRect.left - tooltipRect.width - 10}px`;
            tooltip.style.top = `${btnRect.top - containerRect.top}px`;
        }

        // 🌟【重複作成のガード＆データ更新】
        if (btn) {
            // お金が足りるかどうかに応じてクラスをリアルタイムに切り替え
            btn.classList.toggle('can-buy', gameState.money >= up.cost);

            // PCホバー/スマホ選択問わず、このボタンのツールチップが開かれているなら最新情報で再描画
            const tooltip = document.getElementById('tooltip');
            if (tooltip && !tooltip.classList.contains('hidden') && tooltip.dataset.activeId === String(up.id)) {
                showUpgradeTooltip();
            }
            return; 
        }

        // ボタンの新規生成
        btn = document.createElement('button');
        btn.className = `upgrade-btn ${gameState.money >= up.cost ? 'can-buy' : ''}`;
        btn.id = `up-btn-${up.id}`; 
        
        const imgFileName = upgradeImages[up.id] || 'default.png';
        btn.innerHTML = `<img src="img/upgrades/${imgFileName}" class="upgrade-icon-img" alt="${up.name}" onerror="this.src='img/upgrades/default.png';">`;

        // 💻 PC用：マウスが乗った瞬側に説明を出す
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active-touch')) {
                btn.classList.add('active-touch'); // データ更新追従のために選択状態にする
                showUpgradeTooltip();
            }
        });

        // 💻 PC用：マウスが離れたらツールチップを隠す
        btn.addEventListener('mouseleave', (e) => {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.classList.add('hidden');
                delete tooltip.dataset.activeId; // 紐付け解除
            }
            
            // 🌟【タッチ暴発ガード】スマホの誤作動なら離脱スルー
            if (e.pointerType === 'touch' || matchMedia('(pointer: coarse)').matches) {
                return; 
            }
            
            btn.classList.remove('active-touch'); 
        });

        // 📱 スマホ＆PC共通：クリック（タップ）したときの処理
        btn.addEventListener('click', (e) => {
            const isTouch = e.pointerType === 'touch' || matchMedia('(pointer: coarse)').matches;

            if (isTouch) {
                // =================================================================
                // 📱 スマホ（タッチ）の場合：2ステップ購入（選択 → 購入）
                // =================================================================
                if (!btn.classList.contains('active-touch')) {
                    const allUpBtns = upgradeArea.querySelectorAll('.upgrade-btn');
                    allUpBtns.forEach(b => b.classList.remove('active-touch'));

                    btn.classList.add('active-touch');
                    showUpgradeTooltip();
                    
                    e.stopPropagation(); 
                    return; 
                }
            }

            // =================================================================
            // 💰 実際の購入処理（PCの1クリック目、またはスマホの2タップ目で実行）
            // =================================================================
            if (gameState.money >= up.cost) {
                gameState.money -= up.cost;
                up.bought = true; 

                const tooltip = document.getElementById('tooltip');
                if (tooltip) {
                    tooltip.classList.add('hidden');
                    delete tooltip.dataset.activeId;
                }

                btn.classList.remove('active-touch'); 
                btn.remove(); 
                
                // 💡 画面更新（この中で次のショップ棚の再レンダリングを呼び出すのが最も安全）
                if (typeof updateDisplay === 'function') updateDisplay(); 
            } else {
                // 💡 お金が足りない場合の処理
                btn.classList.remove('active-touch');
                const tooltip = document.getElementById('tooltip');
                if (tooltip) {
                    tooltip.classList.add('hidden');
                    delete tooltip.dataset.activeId;
                }
            }
        });

        // 商品棚の末尾に追加
        upgradeArea.appendChild(btn);
    });
}

// =================================================================
// 🍳 道具（アップグレード）の出現（アンロック）条件チェック関数
// =================================================================
// 💡 この関数が renderUpgradesShop から呼び出されるため、確実にファイル内に記述しておきます
function isUpgradeUnlocked(up) {
    if (!up) return false;
    if (up.bought) return false; // 💡 すでに購入済みのものはショップに出さない（本家仕様）
    
    // コストの40%の売上（今世の累計売上）を達成したらショップに出現
    return gameState.seasonMoney >= up.cost * 0.4; 
}



// 🌟 ショップの3つのタブ（施設・店舗設備・道具）の切り替えイベントの全初期化
function initShopTabs() {
    const tabs = [
        { btnId: 'tab-facilities', areaId: 'shop-area-facilities' },
        { btnId: 'tab-comfort', areaId: 'shop-area-comfort' },
        { btnId: 'tab-upgrades', areaId: 'shop-area-upgrades' }
    ];

    tabs.forEach(tab => {
        const btn = document.getElementById(tab.btnId);
        if (!btn) return;

        btn.addEventListener('click', () => {
            tabs.forEach(t => {
                document.getElementById(t.btnId)?.classList.remove('active');
                document.getElementById(t.areaId)?.classList.add('hidden');
            });

            document.getElementById(tab.btnId).classList.add('active');
            document.getElementById(tab.areaId).classList.remove('hidden');

            // 道具タブが開かれた瞬間に最新のショップを描画
            if (tab.btnId === 'tab-upgrades') {
                renderUpgradesShop();
            }
        });
    });
}

// =================================================================
// 📖 【エラー修正版】獲得アイテム図鑑ポップアップの制御 ＆ リアルタイム生成システム
// =================================================================

// 💡 重複エラーを避けるため、図鑑専用の判定関数名に変更
const isCollectionTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

// 🌟 図鑑の画面（グリッド棚）をリアルタイムに組み立てる関数
function renderCollectionDatabase() {
    const gridArea = document.getElementById('collection-grid-area');
    if (!gridArea) return;

    gridArea.innerHTML = ''; // 一度中身を真っさらにリセット

    // 全20種類の道具データをループ処理
    upgrades.forEach(up => {
        const box = document.createElement('div');
        box.className = 'collection-item-box';
        
        const imgFileName = upgradeImages[up.id] || 'default.png';

        // 🌟【分岐処理】すでに購入済みのコレクションか、まだ見ぬ未獲得アイテムか
        if (up.bought) {
            // ① 購入済み：カラーで綺麗にドット絵画像を表示
            box.innerHTML = `<img src="img/upgrades/${imgFileName}" class="upgrade-icon-img" alt="${up.name}" onerror="this.src='img/upgrades/default.png';">`;
        } else {
            // ② 未獲得：シルエット画像は出さず、中央に「？」を表示して隠す！
            box.classList.add('not-owned-yet');
            box.innerHTML = `<span class="question-mark">？</span>`;
        }

        // =================================================================
        // 💡 ツールチップの位置計算（全デバイス共通：常にアイテムの真上に配置）
        // =================================================================
        function showCollectionTooltip() {
            const tooltip = document.getElementById('tooltip');
            if (!tooltip) return;

            if (up.bought) {
                tooltip.innerHTML = `<strong>📖 【獲得済み】${up.name}</strong><br><p style="margin:5px 0 0 0; font-size:12px; color:#bdc3c7;">${up.desc}</p>`;
            } else {
                tooltip.innerHTML = `<strong>🔒 未獲得の道具</strong><br><span style="color:#e74c3c;">価格: ${typeof formatNumber === 'function' ? formatNumber(up.cost) : up.cost} 円</span><br><p style="margin:5px 0 0 0; font-size:12px; color:#95a5a6;">この周回でまだ購入していない秘密の道具です。お金を貯めてショップにアンロックされたら手に入れよう！</p>`;
            }
            
            // 先に非表示クラスを解除し、幅・高さのレイアウト計算ができる状態にする
            tooltip.classList.remove('hidden');

            // 📐【完全ズーム耐性計算】要素の位置とサイズをリアルタイム計測
            const boxRect = box.getBoundingClientRect();
            const containerRect = document.getElementById('game-container').getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            // 💡 アイテムの左右中央の位置にツールチップのセンターを合わせる計算
            const targetLeft = boxRect.left - containerRect.left + (boxRect.width / 2) - (tooltipRect.width / 2);
            
            // 🛡️ 画面（ゲームコンテナ）の左右端から絶対にはみ出さない安全ガード（余白10px）
            const maxLeft = containerRect.width - tooltipRect.width - 10;
            tooltip.style.left = `${Math.max(10, Math.min(targetLeft, maxLeft))}px`;
            
            // 💡 アイテムの少し上（隙間8px）にピッタリ配置
            tooltip.style.top = `${boxRect.top - containerRect.top - tooltipRect.height - 8}px`;

            // 🔴 ツールチップの重なり順を最前面へ引き上げる！
            tooltip.style.zIndex = "999999";
        }

        // 💻 PC用：ホバー時にツールチップを表示
        box.addEventListener('mouseenter', () => {
            if (isCollectionTouchDevice()) return; 
            if (!box.classList.contains('active-touch')) {
                showCollectionTooltip();
            }
        });

        // 💻 PC用：マウスが離れたら隠す
        box.addEventListener('mouseleave', (e) => {
            if (isCollectionTouchDevice() || e.pointerType === 'touch') return; 
            
            const tooltip = document.getElementById('tooltip');
            if (tooltip) tooltip.classList.add('hidden');
            box.classList.remove('active-touch');
        });

        // 📱 スマホ用：タップでツールチップを表示（ショップと操作感を完全同期）
        box.addEventListener('click', (e) => {
            if (!box.classList.contains('active-touch')) {
                const allBoxes = gridArea.querySelectorAll('.collection-item-box');
                allBoxes.forEach(b => b.classList.remove('active-touch'));

                box.classList.add('active-touch');
                showCollectionTooltip();
                e.stopPropagation(); // 背景リセットの暴発を防ぐ
            }
        });

        gridArea.appendChild(box);
    });
}


// 💡 イベントの重複登録（二重発火）を防ぐための安全ガード用フラグ
let isCollectionEventsInitialized = false;

// 🌟 図鑑ポップアップの「開く」「閉じる」ボタンのクリックイベントを登録する関数
function initCollectionModalEvents() {
    if (isCollectionEventsInitialized) return; // 既に登録済みなら処理を完全スキップ

    const openBtn = document.getElementById('collection-btn');
    const closeXBtn = document.getElementById('close-collection-btn');
    const closeBotBtn = document.getElementById('collection-close-bottom-btn');
    const modal = document.getElementById('collection-modal');

    if (!openBtn || !modal) return;

    // 「図鑑」ボタンが押されたとき
    openBtn.addEventListener('click', () => {
        renderCollectionDatabase();
        modal.classList.remove('hidden');
    });

    // 共通のクローズ処理
    const closeModal = () => {
        modal.classList.add('hidden');
        const tooltip = document.getElementById('tooltip');
        if (tooltip) tooltip.classList.add('hidden');
        
        // スマホ用の選択状態もまとめて綺麗にリセット
        document.querySelectorAll('.collection-item-box.active-touch').forEach(b => b.classList.remove('active-touch'));
    };

    if (closeXBtn) closeXBtn.addEventListener('click', closeModal);
    if (closeBotBtn) closeBotBtn.addEventListener('click', closeModal);

    // 📱💻 【ここを大きく変更！】アイテム以外の場所（薄暗い背景など）をクリック・タップしたら図鑑を閉じる
    modal.addEventListener('pointerup', (e) => {
        // クリックした場所が「アイテムボックス」でも「図鑑の白いメイン枠（modal-content）」でもない場合
        if (!e.target.closest('.collection-item-box') && !e.target.closest('.modal-content')) {
            closeModal(); // 💡 図鑑を安全に閉じる
        }
    }, { passive: true });

    isCollectionEventsInitialized = true; // 初回登録完了の印を立てる
}


// --- 4-1. 画面表示を最新のデータに更新する関数（完全連動・バグ根絶版） ---
function updateDisplay() {
    // 🌟 グローバル要素の安全チェック（エラーガードを追加）
    const mEl = document.getElementById('money');
    const mpsEl = document.getElementById('mps');
    const smEl = document.getElementById('season-money'); // 🌟【新登場！】今世の売上
    const tmEl = document.getElementById('total-money');

    if (mEl)  mEl.textContent = formatNumber(gameState.money);
    if (mpsEl) mpsEl.textContent = formatNumber(gameState.mps);
    if (smEl)  smEl.textContent = formatNumber(gameState.seasonMoney); // 🌟【追加】リアルタイム更新
    if (tmEl)  tmEl.textContent = formatNumber(gameState.totalMoney);

    // 1. 施設（スタッフなど）の解放・グレーアウト処理
    facilities.forEach((facility) => {
        const buyInfo = calculateMultiBuy(facility.cost, gameState.buyAmount);

        const costEl = document.getElementById(`cost-${facility.id}`);
        if (costEl) {
            costEl.textContent = formatNumber(buyInfo.totalCost);
        }

        const btnEl = document.getElementById(`buy-${facility.id}-btn`);
        const nameEl = document.getElementById(`name-${facility.id}`);

        if (btnEl) {
            const hideThreshold = facility.cost * 0.1;   
            const revealThreshold = facility.cost * 0.8; 

            const isInitialFacility = facility.id === 'flyer';
            const isSecondFacility = facility.id === 'board';

            // 🌟 【第1段階：完全アンロック】条件クリア、または既に1個以上所持
            if (gameState.seasonMoney >= revealThreshold || facility.count > 0) {
                if (nameEl) nameEl.textContent = facility.name; 

                btnEl.classList.remove('locked-facility');
                btnEl.style.display = "block"; 

                btnEl.disabled = gameState.money < buyInfo.totalCost;
            } 
            // 🌟 【第2段階：シルエット出現】10%〜80%の間（未所持）
            else if (gameState.seasonMoney >= hideThreshold || isInitialFacility || isSecondFacility) {
                if (nameEl) nameEl.textContent = "？？？"; 

                btnEl.classList.add('locked-facility');
                btnEl.style.display = "block"; 
                btnEl.disabled = true;        
            } 
            // 🌟 【第3段階：完全隠蔽】10%未満
            else {
                btnEl.style.display = "none";  
            }
        }
    });

    // 4-2-0. 【快適度】店舗設備の購入判定と売り切れロックの処理
    comfortItems.forEach((item) => {
        const btnEl = document.getElementById(`buy-${item.id}-btn`);
        if (!btnEl) return; 

        const nameEl = document.getElementById(`name-${item.id}`);

        // 🌟 パターン1：すでに購入済み（count が 1）の場合
        if (item.count > 0) {
            btnEl.disabled = true; 

            if (nameEl) {
                // 🌟【バグ対策】すでに✅がついている場合は重ねてつけない
                if (!nameEl.textContent.startsWith('✅')) {
                    nameEl.textContent = `✅ ${item.name}`;
                }
            }
            
            btnEl.classList.add('comfort-sold');
            btnEl.classList.remove('locked-facility');
        }
        // 🌟 パターン2：まだ買っていない未導入の場合
        else {
            const isShortOfMoney = gameState.money < item.cost;
            btnEl.disabled = isShortOfMoney;

            btnEl.classList.remove('comfort-sold');

            if (nameEl) {
                // 🌟【バグ対策】もし転生リセットなどで名前が✅のままなら、元の名前に戻す
                if (nameEl.textContent.startsWith('✅')) {
                    nameEl.textContent = item.name;
                }
            }

            if (isShortOfMoney) {
                btnEl.classList.add('locked-facility');
            } else {
                btnEl.classList.remove('locked-facility');
            }
        }
    });

    // お店の自動進化チェック
    if (typeof checkRestaurantEvolution === 'function') {
        checkRestaurantEvolution();
    }

    // =================================================================
    // 🍳 【合体！】道具（アップグレード）ショップの購入制限・出現リアルタイム更新
    // =================================================================
    // 💡 施設購入時や毎秒のタイマーでこの updateDisplay が実行されたとき、
    // 道具タブ内のボタンのグレーアウトや、新しい道具の出現条件を自動で完全同期させます。
    if (typeof renderUpgradesShop === 'function') {
        renderUpgradesShop();
    }
}



// --- 4-2-1 お店の進化をチェックして画面を更新する関数 ---
let lastAppliedRankName = ""; // 🌟 最後に画面に適用したランク名を記憶する変数（バグ・重さ対策）

function checkRestaurantEvolution() {
    // 画面要素を安全に取得（もし外で定義しているならこの2行は消してもOKですが、あると安全です）
    const rankEl = document.getElementById('restaurant-rank');
    const visualEl = document.getElementById('restaurant-visual');

    // ランクデータを上から順番に見て、条件をクリアしている「一番高いランク」を探す
    let currentRank = restaurantRanks[0];

    restaurantRanks.forEach((rank) => {
        if (gameState.seasonMoney >= rank.threshold) {
            currentRank = rank;
        }
    });

    // 🌟【最重要】前回適用したランクと「名前」が違う時だけ、画面を書き換える
    if (lastAppliedRankName !== currentRank.name) {
        
        // 1. 画面の文字を書き換える
        if (rankEl) {
            rankEl.textContent = currentRank.name;
        }
        
        // 2. 画像のパスを作って書き換える
        if (visualEl) {
            const nextSrc = `img/restaurant/${currentRank.img}`;
            visualEl.src = nextSrc;
        }

        // 3. 進化ログを出す（本当に進化した瞬間だけ1回だけ流れます！）
        console.log(`🏪 お店が進化しました！現在の外観: ${currentRank.name}`);

        // 今のランク名を保存して、次回からこの中身をスキップさせる
        lastAppliedRankName = currentRank.name;
    }
}



// --- 🌟【新機能】24時間現実時間リンク「背景 ＆ BGM」システム ---

// 🎵 BGM用のオーディオプレイヤーを1つ用意（グローバル変数）
let bgmAudio = new Audio();
bgmAudio.loop = true;          // ループ再生を有効にする
bgmAudio.volume = 0.3;         // 音量（0.0 〜 1.0 で調整してね。0.3は30%）

let currentBgmPath = "";       // いま流れている（流そうとしている）曲のパスを記憶

document.addEventListener("DOMContentLoaded", () => {
    console.log("📢 背景＆BGMシステム：ページ読み込みを検知しました！");
    
    // 1. ページが開いた瞬間に背景とBGMの曲をセット
    updateTimeBasedSystem();

    // 2. その後は1分（60000ミリ秒）ごとに自動チェック
    setInterval(updateTimeBasedSystem, 60000);

    // 🚨【重要】ブラウザの音再生ブロックを解除する仕掛け
    // プレイヤーが画面のどこかを初めてクリックした瞬間に音楽をスタートさせます
    const startAudioPlay = () => {
        bgmAudio.play()
            .then(() => {
                console.log("🎵 ブラウザのロック解除！BGMの再生に成功しました。");
                // 1回再生できたらこのクリックイベントは不要なので消す（重さ対策）
                document.removeEventListener('click', startAudioPlay);
            })
            .catch((error) => {
                console.warn("⚠️ まだ画面の操作が足りないため、音の再生がブロックされました:", error);
            });
    };
    document.addEventListener('click', startAudioPlay);
});

function updateTimeBasedSystem() {
    const stageEl = document.getElementById('restaurant-stage');
    
    if (!stageEl) {
        console.error("❌ エラー：HTMLの中に 'restaurant-stage' というIDの箱が見つかりません！");
        return;
    }

    const currentHour = new Date().getHours();
    
    // 初期値（昼）
    let bgImage = "img/background/bg_day.png"; 
    let bgmMusic = "audio/bgm_day.mp3"; 

    // 時間帯による分岐（6:00〜15:59 / 16:00〜18:59 / それ以外）
    if (currentHour >= 6 && currentHour < 16) {
        bgImage = "img/background/bg_day.png";
        bgmMusic = "audio/bgm_day.mp3";
    } else if (currentHour >= 16 && currentHour < 19) {
        bgImage = "img/background/bg_evening.png";
        bgmMusic = "audio/bgm_evening.mp3";
    } else {
        bgImage = "img/background/bg_night.png";
        bgmMusic = "audio/bgm_night.mp3";
    }

    // 🖼️ 1. 背景画像の切り替え処理
    stageEl.style.setProperty('--current-bg', `url("${bgImage}")`);
    stageEl.style.backgroundImage = `url("${bgImage}")`;

    // 🎵 2. BGMの切り替え処理
    // いま流れている曲と「違う曲」に変化した時だけ、曲のファイルを読み込み直す（重さ・チカチカ対策）
    if (currentBgmPath !== bgmMusic) {
        console.log(`🕒 時間が変化しました（${currentHour}時）。BGMを切り替えます: ${bgmMusic}`);
        
        currentBgmPath = bgmMusic;
        
        // 再生中なら一度止める
        const isPlaying = !bgmAudio.paused;
        bgmAudio.src = bgmMusic;
        
        // もともと音が鳴っていた状態（またはロック解除後）なら、そのまま新しい曲を再生する
        if (isPlaying) {
            bgmAudio.play().catch(e => console.log("🎵 ロック未解除のため次のクリック時に再生します"));
        }
    }
}




// --- 4-3 指定した数（1, 10, 100）を一括購入したときの「合計コスト」と「最終価格」を計算する関数 ---
function calculateMultiBuy(baseCost, amount) {
    let totalCost = 0;
    let tempCost = baseCost;

    // 指定された回数だけ、インフレする価格をシミュレーションして足していく
    for (let i = 0; i < amount; i++) {
        totalCost += tempCost;
        tempCost = Math.ceil(tempCost * 1.15); // 1個買うごとに1.15倍
    }

    // 合計コストと、次に買う時の1個の価格をセットにして返す
    return {
        totalCost: totalCost,
        nextCost: tempCost
    };
}

// --- 4-4 ラジオボタンの切り替えを感知して、購入モードを変更する処理 ---
// 画面上の「name="buy-amount"」がついたラジオボタンを全て取得
const buyAmountRadios = document.querySelectorAll('input[name="buy-amount"]');

buyAmountRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
        // クリックされたボタンの value（1, 10, 100）を数値にしてgameStateに保存
        gameState.buyAmount = parseInt(e.target.value);
        // 購入数が変わったので、ショップの価格表示やボタンの有効化を一斉に更新！
        updateDisplay();
    });
});

// --- 4-5 どんな超巨大数字でも海外ゲーム風の単位（K, M, B, T...）に自動変換する関数 ---
function formatNumber(num) {
    // 🌟【安全装置】もし数字以外が入ってきたら強制的に "0" を返す
    if (num === undefined || num === null || isNaN(num)) return "0";

    // 🌟【重要】1,000未満の小さい数字なら、小数点の端数（0.1 など）をそのまま残して綺麗に見せる
    if (num < 1000) {
        // 小数点以下2桁までに丸めつつ、無駄な末尾の「.00」などはparseFloatで消す
        return parseFloat(num.toFixed(2)).toString();
    }

    // 1,000以上の場合は、これまで通り整数にしてから単位をつけます
    const value = Math.floor(num);

    // 海外ゲームお馴染みの単位リスト
    const units = [
        { value: 1e3,  name: "K" },  // Thousand
        { value: 1e6,  name: "M" },  // Million
        { value: 1e9,  name: "B" },  // Billion
        { value: 1e12, name: "T" },  // Trillion
        { value: 1e15, name: "Qa" }, // Quadrillion
        { value: 1e18, name: "Qi" }, // Quintillion
        { value: 1e21, name: "Sx" }, // Sextillion
        { value: 1e24, name: "Sp" }, // Septillion
        { value: 1e27, name: "Oc" }, // Octillion
        { value: 1e30, name: "No" }, // Nonillion
        { value: 1e33, name: "Dc" }  // Decillion
    ];

    // リストの「下（大きい単位）」から順番にチェックしていく
    for (let i = units.length - 1; i >= 0; i--) {
        if (value >= units[i].value) {
            let formatted = (value / units[i].value).toFixed(2);
            formatted = parseFloat(formatted).toString();
            return formatted + " " + units[i].name;
        }
    }

    return value.toString();
}


// --- 5-1. 料理を作るボタン（メインクリック）を押した時（ランダム料理＆金額＆道具完全同期ビルド） ---

const foodImages = ['img/egg.png', 'img/burger.png', 'img/pizza.png', 'img/sushi.png'];

if (mainClickBtn) {
    mainClickBtn.addEventListener('click', (e) => {
        // 💥 1クリックの基本パワーは「1円」
        let baseClickPower = 1;

        // 【本家仕様】雇ったスタッフ（施設）の総数が自分のクリック力になる！
        let totalFacilityCount = 0;
        if (typeof facilities !== 'undefined') {
            facilities.forEach(f => totalFacilityCount += f.count);
        }
        let facilityBonus = totalFacilityCount * 0.1; // スタッフ1人につき +0.1円

        // =================================================================
        // 🍳 道具（アップグレード）の効果を計算にリアルタイム介入させる
        // =================================================================
        let upgradeMpsBonus = 0;   // MPS（自動秒給）から流れ込むボーナス
        let upgradeMultiplier = 1; // 道具による「クリック力〇倍」の掛け算バフ合計

        if (typeof upgrades !== 'undefined') {
            upgrades.forEach(up => {
                if (!up.bought) return; 

                // ①【序盤】固定値アップ
                if (up.id === 'up_pan') baseClickPower += 5;
                if (up.id === 'up_knife') baseClickPower += 50;
                if (up.id === 'up_timer') baseClickPower += 300;
                if (up.id === 'up_glove') baseClickPower += 1500;
                if (up.id === 'up_scale') baseClickPower += 8000;

                // ②【中盤・地獄・宇宙次元】毎秒の売上（MPS）の％がクリック力に上乗せ
                if (up.id === 'up_cutter')  upgradeMpsBonus += (gameState.mps || 0) * 0.01;
                if (up.id === 'up_tong')    upgradeMpsBonus += (gameState.mps || 0) * 0.02;
                if (up.id === 'up_scooter') upgradeMpsBonus += (gameState.mps || 0) * 0.03;
                if (up.id === 'up_tablet')  upgradeMpsBonus += (gameState.mps || 0) * 0.04;
                if (up.id === 'up_uniform') upgradeMpsBonus += (gameState.mps || 0) * 0.05;
                if (up.id === 'up_quantum') upgradeMpsBonus += (gameState.mps || 0) * 0.10;
                if (up.id === 'up_star')    upgradeMpsBonus += (gameState.mps || 0) * 0.25;

                // ③【終盤・宇宙次元】これまでの合計クリック力をさらに〇倍にする掛け算バフ
                if (up.id === 'up_fork')    upgradeMultiplier *= 2;
                if (up.id === 'up_spice')   upgradeMultiplier *= 3;
                if (up.id === 'up_apron')   upgradeMultiplier *= 4;
                if (up.id === 'up_recipe')  upgradeMultiplier *= 5;
                if (up.id === 'up_water')   upgradeMultiplier *= 10;
                if (up.id === 'up_gravity') upgradeMultiplier *= 20;
                if (up.id === 'up_matrix')  upgradeMultiplier *= 50;
                if (up.id === 'up_infinity') upgradeMultiplier *= 100;
            });
        }

        // 【バフの乗算】転生倍率 ＆ グルメアプリの星評価バフをすべて掛け算！
        const activeReviewBuff = gameState.reviewMultiplier || 1.0;
        const totalMultiplier = (gameState.prestigeMultiplier || 1.0) * activeReviewBuff * upgradeMultiplier;

        // 🌟 最終的な1クリックの稼ぎ（（基本値 ＋ スタッフボナ ＋ 道具MPSボナ） × 全体倍率）
        const clickProfit = Math.floor((baseClickPower + facilityBonus + upgradeMpsBonus) * totalMultiplier);

        // 各種売上データにプラスする
        gameState.money += clickProfit;
        gameState.seasonMoney += clickProfit; 
        gameState.totalMoney += clickProfit;  

        // 🌟【位置ズレ完全防止・完全修正ビルド】
        // マウスや指がタップした「ボタン内の正確な絶対座標」をブレなく一発で割り出します
        const clickArea = document.getElementById('click-area');
        if (clickArea) {
            // 💡 クライアント座標（画面上の絶対位置）から、親ボックス（#click-area）の位置を引き算することで、
            // どれだけ画面がズーム縮小・拡大されていても、指の真下の座標を100%正確にミリ単位で特定します！
            const areaRect = clickArea.getBoundingClientRect();
            const targetX = e.clientX - areaRect.left;
            const targetY = e.clientY - areaRect.top;

            // 💸 ① 金額の文字を生成して配置
            const popEl = document.createElement('div');
            popEl.className = 'click-pop-effect';
            popEl.textContent = `+${formatNumber(clickProfit)}`;
            
            // 🌟 割り出したX, Y座標をピタッと代入
            popEl.style.left = `${targetX}px`;
            popEl.style.top = `${targetY}px`;
            clickArea.appendChild(popEl);

            // 🍕 ② あなた作のランダム料理画像システム
            const randomImgSrc = foodImages[Math.floor(Math.random() * foodImages.length)];
            
            const imgPopEl = document.createElement('img');
            imgPopEl.className = 'click-effect';
            imgPopEl.src = randomImgSrc; 
            imgPopEl.alt = '料理';
            
            // 🌟 画像も完全に同じ指の真芯（X, Y）にセット！
            // CSS側の「margin-left: -16px; margin-top: -16px;」と連動して、画像のド真ん中が指の芯に重なります。
            imgPopEl.style.left = `${targetX}px`;
            imgPopEl.style.top = `${targetY}px`; 
            clickArea.appendChild(imgPopEl);

            // ⏱️ メモリ対策：0.8秒後に自動消去
            setTimeout(() => {
                popEl.remove();
                imgPopEl.remove();
            }, 800);
        }


        // 手動クリックの数字だけはその場ですぐ最新にする
        const mEl = document.getElementById('money');
        const smEl = document.getElementById('season-money');
        const tmEl = document.getElementById('total-money');

        if (mEl)  mEl.textContent = formatNumber(gameState.money);
        if (smEl) smEl.textContent = formatNumber(gameState.seasonMoney);
        if (tmEl) tmEl.textContent = formatNumber(gameState.totalMoney);
    });
}



// --- 5-2. 客の来店ミニアニメーション演出（完全同期・ズレゼロ版） ---
const GUEST_IMAGES = [
    "img/guest/guest1.png",
    "img/guest/guest2.png",
    "img/guest/guest3.png",
    "img/guest/guest4.png",
    "img/guest/guest5.png",
    "img/guest/guest6.png"
];

let lastGuestIndex = -1;
let coinTimeoutId = null; // 🌟 タイマーのダブり防止用

document.addEventListener("DOMContentLoaded", () => {
    const guestEl = document.getElementById('live-guest');
    if (!guestEl) return;

    // 🌟 1人目のお客さんを選んでアニメーションを開始
    changeNextGuest(guestEl);
    guestEl.classList.add('start-animation');

    // 🌟 ズレ防止：アニメーションの「開始時」と「ループ時」に、お会計タイマーを仕掛ける
    setupCoinTiming();
    guestEl.addEventListener('animationiteration', () => {
        changeNextGuest(guestEl); // 次の客へ画像切り替え
        setupCoinTiming();        // お会計タイマーを再セット
    });
});

// 🎯 お客さんがお会計を済ませて、店から出てきた瞬間（4.8秒後）を正確に狙い撃つ関数
function setupCoinTiming() {
    if (coinTimeoutId) clearTimeout(coinTimeoutId); // 古いタイマーを破棄

    // 全体7.2秒の66.7%（店から出てくる瞬間）は「4800ミリ秒後」です（7200ms × 0.667 ≒ 4800ms）
    coinTimeoutId = setTimeout(() => {
        addGuestRevenue();
    }, 4800); 
}


// お客さんがお会計したときに売上を増やす関数（💰と金額の完全連結版）
function addGuestRevenue() {
    const baseRevenue = 5; 
    const guestProfit = baseRevenue + Math.floor(gameState.seasonMoney * 0.001); 

    gameState.money += guestProfit;
    gameState.seasonMoney += guestProfit;
    gameState.totalMoney += guestProfit;

    // 💰と金額を完全にドッキングしてエフェクトに流し込む
    const coinEffectEl = document.getElementById('coin-effect');
    if (coinEffectEl) {
        coinEffectEl.textContent = `💰 +${formatNumber(guestProfit)}`;
        
        // 🌟 アニメーションクラスを一度消して、すぐ付け直すことで「今」エフェクトを発生させる
        coinEffectEl.classList.remove('show-coin');
        void coinEffectEl.offsetWidth; // 魔法の一行（ブラウザにリセットを強制認識させる）
        coinEffectEl.classList.add('show-coin');
    }

    // 画面の表示を最新データに書き換える
    const moneyEl = document.getElementById('money');
    const seasonMoneyEl = document.getElementById('season-money'); // 🌟【新登場！】今世の売上要素
    const totalMoneyEl = document.getElementById('total-money');
    
    if (moneyEl) {
        moneyEl.textContent = formatNumber(gameState.money); 
    }
    if (seasonMoneyEl) {
        seasonMoneyEl.textContent = formatNumber(gameState.seasonMoney); // 🌟【追加】今世の売上もピコピコ動かす！
    }
    if (totalMoneyEl) {
        totalMoneyEl.textContent = formatNumber(gameState.totalMoney);
    }
}


// 次のお客さんをランダムに決定する関数（<img>タグ完全対応版）
function changeNextGuest(guestEl) {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * GUEST_IMAGES.length);
    } while (randomIndex === lastGuestIndex && GUEST_IMAGES.length > 1);
    lastGuestIndex = randomIndex;
    const nextGuest = GUEST_IMAGES[randomIndex];
    
    // 🌟 CSS変数ではなく、HTMLの<img>タグの「src」を直接書き換える
    guestEl.src = nextGuest;
}




// --- 6. ショップのボタンを自動生成する関数 ---
function createShop() {
    // ボタンを追加する場所（shop-area）をここでしっかり取得
    const shopArea = document.getElementById('shop-area-facilities');
    if (!shopArea) return;

    facilities.forEach((facility) => {
        const btn = document.createElement('button');
        btn.className = 'shop-btn';
        btn.id = `buy-${facility.id}-btn`;

        // 修正前: id="${facility.id}-name" / id="${facility.id}-cost"
        // 修正後: id="name-${facility.id}" / id="cost-${facility.id}" に変更
        btn.innerHTML = `<span id="name-${facility.id}">???</span>（コスト: <span id="cost-${facility.id}">${facility.cost}</span> 円)`; 


        // マウスを乗せた時（ホバー時）の処理
        btn.addEventListener('mouseenter', () => {
            const isLocked = btn.classList.contains('locked-facility');
            
            // 🌟 まず最初に空のテキストを用意する
            let tooltipText = "";

            // 🌟 【第1パターン】まだアンロックされていない（？？？）の場合
            if (isLocked) {
                tooltipText += `【 ？？？ 】\n`;
                tooltipText += `所持数: ${formatNumber(facility.count)} 体\n`;
                tooltipText += `------------------------\n`;
                tooltipText += `効果: ？？？？？\n`;
            }  
            // 🌟 【第2パターン】すでに解禁されている通常の場合
            else {
                const totalFacilityMps = facility.count * facility.mpsValue;
                const mpsPercent = gameState.mps > 0 ? Math.round((totalFacilityMps / gameState.mps) * 100) : 0;

                tooltipText += `【${facility.name}】\n`;
                tooltipText += `所持数: ${formatNumber(facility.count)} 体\n`;
                tooltipText += `説明: ${facility.description || facility.desc}\n`;

                if (facility.count > 0) {
                    tooltipText += `------------------------\n`;
                    tooltipText += `1体あたりの能力: 毎秒 ${formatNumber(facility.mpsValue)} 円\n`;
                    tooltipText += `合計の生産力: 毎秒 ${formatNumber(totalFacilityMps)} 円 (全体の ${mpsPercent}%)\n`;
                    tooltipText += `これまでの累計売上: ${formatNumber(Math.floor(facility.totalEarned))} 円`;
                }
            }

                // 🌟 出来上がったテキストを画面のツールチップに流し込む（ここは共通）
            tooltipEl.textContent = tooltipText;
            tooltipEl.classList.remove('hidden');

            // =================================================================
            // 💡【完全ズーム耐性版】タブの拡大縮小でも絶対にズレない位置計算に上書き
            // =================================================================
            const btnRect = btn.getBoundingClientRect();
            const containerRect = document.getElementById('game-container').getBoundingClientRect();
            const rightPanelRect = document.getElementById('right-panel').getBoundingClientRect();
            const tooltipRect = tooltipEl.getBoundingClientRect(); // 🌟 ツールチップ自身の現在の幅をリアルタイム取得
            
            // 🌟 右列パネルの左端（rightPanelRect.left）を基準にして、ツールチップの横幅分だけ左にぴったり密着！
            // 💡 最後の「- 10」を調整することで、ショップの壁とのスキマ（余白）を自由に微調整できます
            tooltipEl.style.left = `${rightPanelRect.left - containerRect.left - tooltipRect.width - 10}px`;
            
            // 🌟 高さもボタンのトップの位置に完全に合わせる
            tooltipEl.style.top = `${btnRect.top - containerRect.top}px`;
        });



        // マウスがボタンから離れた時
        btn.addEventListener('mouseleave', () => {
            tooltipEl.classList.add('hidden');
        });

        // クリックされた時の処理
        btn.addEventListener('click', () => {
            if (btn.classList.contains('locked-facility')) return;
            const buyInfo = calculateMultiBuy(facility.cost, gameState.buyAmount);

            if (gameState.money >= buyInfo.totalCost) {
                gameState.money -= buyInfo.totalCost;
                facility.count += gameState.buyAmount;
                gameState.mps += facility.mpsValue * gameState.buyAmount;
                facility.cost = buyInfo.nextCost;

                updateDisplay();
                btn.dispatchEvent(new Event('mouseenter'));
            }
        });

        // ボタンをHTMLの箱に追加
        shopArea.appendChild(btn);
    });
}

// 6-2. ショップのタブ切り替え機能 ---
function setupShopTabs() {
    // 画面のボタンと、中身の2つの箱（コンテナ）を取得
    const tabFac = document.getElementById('tab-facilities');
    const tabCom = document.getElementById('tab-comfort');
    const areaFac = document.getElementById('shop-area-facilities');
    const areaCom = document.getElementById('shop-area-comfort');

    // もし要素が足りなければエラーを防ぐためにここで終わる
    if (!tabFac || !tabCom || !areaFac || !areaCom) return;

    // 「施設」タブがクリックされた時の処理
    tabFac.addEventListener('click', () => {
        tabFac.classList.add('active'); // 施設ボタンを緑色にする
        tabCom.classList.remove('active'); // 店舗設備ボタンの緑色を消す
        areaFac.classList.remove('hidden'); // 施設ショップを表示する
        areaCom.classList.add('hidden'); // 店舗設備ショップを隠す
    });

    // 「店舗設備」タグがクリックされた時の処理
    tabCom.addEventListener('click', () => {
        tabCom.classList.add('active'); // たんぽ設備ボタンを緑色にする
        tabFac.classList.remove('active'); // 施設ボタンの緑色を消す
        areaCom.classList.remove('hidden'); // 店舗設備ショップを表示する
        areaFac.classList.add('hidden'); // 施設ショップを隠す
    });
}

// --- 6-3. 店舗設備（快適度）ショップのボタンを自動生成する関数 ---
function createComfortShop(){
    const shopArea = document.getElementById('shop-area-comfort');
    if (!shopArea) return;

    comfortItems.forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'shop-btn';
        btn.id = `buy-${item.id}-btn`;

        // 最初から（？？？）を一切かけず、本名とコストを公開
        btn.innerHTML = `<span id="name-${item.id}">${item.name}</span>（コスト: <span id="cost-${item.id}">${formatNumber(item.cost)}</span> 円)`;

        // マウスを乗せた時（ホバー時）の処理
        btn.addEventListener('mouseenter', () => {
            let tooltipText = "";
            const tooltipEl = document.getElementById('tooltip'); // 🌟 安全のために要素をここで再取得
            if (!tooltipEl) return;

            tooltipText += `【 ${item.name} 】\n`;
            tooltipText += `状態: ${item.count > 0 ? '導入済み（売り切れ）' : '未導入'}\n`;
            tooltipText += `説明: ${item.description}\n`;
            tooltipText += `------------------------\n`;
            tooltipText += `この設備の快適度: +${item.comfortValue}\n`;

            tooltipEl.textContent = tooltipText;
            tooltipEl.classList.remove('hidden');

            const btnRect = btn.getBoundingClientRect();
            const containerRect = document.getElementById('game-container').getBoundingClientRect();
            tooltipEl.style.left = `${btnRect.left - containerRect.left - 260}px`;
            tooltipEl.style.top = `${btnRect.top - containerRect.top}px`;
        });

        // マウスがボタンから離れた時
        btn.addEventListener('mouseleave', () => {
            const tooltipEl = document.getElementById('tooltip');
            if (tooltipEl) tooltipEl.classList.add('hidden');
        });

        // クリックされた時の処理
        btn.addEventListener('click', () => {
            if (btn.classList.contains('locked-facility') || item.count > 0) return;

            if (gameState.money >= item.cost) {
                gameState.money -= item.cost;
                item.count = 1; // 1（導入済み）にして売り切れ状態にする

                // 🌟【最重要】購入した瞬間に、快適度・星の数・売上の星バフを即座に再計算！
                if (typeof updateRestaurantReview === 'function') {
                    updateRestaurantReview();
                }

                // 画面の文字（売上や✅マーク）を最新データに書き換える
                updateDisplay();
                
                // ツールチップ内の状態表示を「未導入」から「導入済み」に即座に更新
                btn.dispatchEvent(new Event('mouseenter'));
            }
        });

        // ボタンを店舗設備用の箱に追加
        shopArea.appendChild(btn);
    });
}


// 6-4 . レビュー欄
// =================================================================
// ⭐ グルメアプリ風・レビューシステム（GitHub Pages対応・JSON読み込み版）
// =================================================================

let REVIEW_DATABASE = null;  // 🌟 初期状態は空っぽにしておき、後からJSONを読み込む
let lastAppliedStarRank = 0; 

// 🎯 起動時に外部のJSONファイルを自動でダウンロードしてくる関数
async function loadReviewDatabase() {
    try {
        // GitHub Pagesでもパスがズレないように相対パスでJSONを取得
        const response = await fetch('data/reviews.json');
        if (!response.ok) throw new Error("レビューデータの取得に失敗しました");
        
        REVIEW_DATABASE = await response.json();
        console.log("📋 外部レビューデータの読み込みが完了しました！");
        
        // データを読み込み終わったら、一度星評価を計算して初期化する
        updateRestaurantReview();
    } catch (error) {
        console.error("❌ レビューの読み込みエラー:", error);
    }
}

// 💡 快適度をチェックしてレビューと星評価バフを更新する関数
function updateRestaurantReview() {
    // 🌟 まだJSONの読み込みが終わっていない場合は、バグ防止のために一度処理をスキップする
    if (!REVIEW_DATABASE) return;

    let totalComfort = 0;
    if (typeof comfortItems !== 'undefined') {
        comfortItems.forEach(item => {
            if (item.count > 0) {
                totalComfort += item.comfortValue * item.count;
            }
        });
    }
    gameState.comfort = totalComfort;

    // 快適度による星の判定
    let starRank = 1;
    if (totalComfort >= 740)      starRank = 5;
    else if (totalComfort >= 90)  starRank = 4;
    else if (totalComfort >= 20)  starRank = 3;
    else if (totalComfort >= 5)   starRank = 2;
    else                          starRank = 1;

    // JSONから引っ張ってきたデータを使ってバフを適用
    const reviewData = REVIEW_DATABASE[starRank];
    if (reviewData) {
        gameState.reviewMultiplier = reviewData.multiplier;
    }

    // 🌟【最重要！】星ランクが変動した瞬間（または起動時）、左列の看板の見た目も即座に書き換える！
    if (lastAppliedStarRank !== starRank) {
        console.log(`⭐ レストランの評価が更新されました！現在のスコア: 星${starRank}`);
        
        // 📋 モーダルではなく、画面にずっと出ている「左側の看板」の中身を取得
        // （もし不要な場合はHTMLに追加しなくてもエラーを吐かないよう安全に処理します）
        const boardStarsEl = document.getElementById('review-stars');
        const boardTextEl = document.getElementById('review-text');
        const boardBuffEl = document.getElementById('review-buff-text');

        // 1. 画面の看板の星（⭐）の数を最新にする
        if (boardStarsEl && reviewData) {
            boardStarsEl.textContent = reviewData.stars;
        }

        // 2. 画面の看板のバフ倍率テキスト（売上+〇〇%）を最新にする
        if (boardBuffEl && reviewData) {
            const percent = Math.round((reviewData.multiplier - 1) * 100);
            boardBuffEl.textContent = percent > 0 ? `(レビュー効果: 全体売上 +${percent}%)` : `(レビュー効果: 売上等倍)`;
        }

        // 3. 看板に出ている直近レビュー文を、新しい星のリストからランダムで1つ選んで上書きする！
        if (boardTextEl && reviewData && reviewData.comments && reviewData.comments.length > 0) {
            const randomIndex = Math.floor(Math.random() * reviewData.comments.length);
            boardTextEl.textContent = reviewData.comments[randomIndex];
        }

        lastAppliedStarRank = starRank;
    }
}


// 📋 口コミ一覧モーダルの開閉ロジック
const reviewSignboard = document.getElementById('review-signboard');
const reviewModal = document.getElementById('review-modal');
const closeReviewBtn = document.getElementById('close-review-btn');

if (reviewSignboard && reviewModal) {
    reviewSignboard.addEventListener('click', (e) => {
        e.stopPropagation(); 

        // 🌟 まだJSONデータが無い、またはエラーだった場合は開かせない安全装置
        if (!REVIEW_DATABASE) {
            alert("口コミデータを読み込み中です。少々お待ちください。");
            return;
        }

        const currentStarRank = lastAppliedStarRank || 1;
        const reviewData = REVIEW_DATABASE[currentStarRank];

        const modalStars = document.getElementById('modal-total-stars');
        const modalBuff = document.getElementById('modal-buff-text');
        
        if (modalStars && reviewData) modalStars.textContent = reviewData.stars;
        if (modalBuff && reviewData) {
            const percent = Math.round((reviewData.multiplier - 1) * 100);
            modalBuff.textContent = percent > 0 ? `(レビューバフ: 全体売上 +${percent}%)` : `(レビューバフ: 売上等倍)`;
        }

        const listContainer = document.getElementById('modal-review-list');
        if (listContainer) {
            listContainer.innerHTML = ""; // 一度リセットして空にする

            // 🌟【修正】1から増やすのではなく、今の星の数（currentStarRank）から1に向かってカウントダウンする！
            // これにより、今の最新の星の口コミが自動的に一番てっぺん（最上部）に大集結します。
            for (let i = currentStarRank; i >= 1; i--) {
                if (REVIEW_DATABASE[i]) {
                    REVIEW_DATABASE[i].comments.forEach(comment => {
                        const card = document.createElement('div');
                        card.className = "single-review-card";
                        card.innerHTML = `<span style="color:#f1c40f;">${REVIEW_DATABASE[i].stars}</span><br>${comment}`;
                        listContainer.appendChild(card);
                    });
                }
            }
        }


        reviewModal.classList.remove('hidden');
    });
}

// 閉じるボタン
if (closeReviewBtn && reviewModal) {
    closeReviewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        reviewModal.classList.add('hidden');
    });
}

// 背景クリックで閉じる設定
window.addEventListener('click', (e) => {
    if (e.target === reviewModal) {
        reviewModal.classList.add('hidden');
    }
});

// 6-5. バツ印での追加
// 🌟 右上の×（バツ）印ボタンを押したときも口コミ画面を閉じる
// 🌟 右上の×（バツ）印ボタン（スマホとPC両対応版）
const closeReviewXBtn = document.getElementById('close-review-x-btn');
if (closeReviewXBtn) {
    // 💡 'click' の代わりに 'pointerdown' を使うことで、スマホの画面タッチにゼロ秒で反応します！
    closeReviewXBtn.addEventListener('pointerdown', () => {
        const reviewModal = document.getElementById('review-modal');
        if (reviewModal) {
            reviewModal.classList.add('hidden');
        }
    });
}



// =================================================================
// 📡 本家風・ティッカーニュース速報（1周ごとに確実に切り替わる完全版）
// =================================================================

let LOADED_NEWS_DATA = null; // 初期状態は空っぽにしておき、後からJSONを読み込む

// 🎯 起動時に外部のニュースJSONファイルを自動でダウンロードしてくる関数（変更なし）
async function loadNewsDatabase() {
    try {
        const response = await fetch('data/news.json');
        if (!response.ok) throw new Error("ニュースデータの取得に失敗しました");
        
        const json = await response.json();
        LOADED_NEWS_DATA = json.base_jokes; 
        console.log("📡 外部ニュースデータの読み込みが完了しました！");
        
        // 読み込みが終わったら、最初のニュースを1発即座に流す
        updateTickerNews();
    } catch (error) {
        console.error("❌ ニュースの読み込みエラー:", error);
        LOADED_NEWS_DATA = ["【速報】レストラン、本日も元気に営業中！🍳"];
        updateTickerNews();
    }
}

// 🎯 今のゲームの状態に応じて流すニュースを1つ選んで切り替える関数
function updateTickerNews() {
    const tickerTextEl = document.getElementById('news-ticker-text');
    if (!tickerTextEl) return;

    // まだJSONデータのロードが終わっていない場合は、バグ防止のために一度処理をスキップ
    if (!LOADED_NEWS_DATA) return;

    // JSONから引っ張ってきた大量のジョークニュースをプールに入れる
    let newsPool = [...LOADED_NEWS_DATA];

    // 🌟【ゲーム連動の仕掛け】数値を見てニュースを確率で追加
    if (gameState && gameState.money >= 1000000) {
        newsPool.push(`【経済】謎のレストラン経営者、現在の資産が 【 ${formatNumber(gameState.money)} 円 】 を突破。国家予算を超えるのも時間の問題か。`);
    }
    if (gameState && gameState.comfort >= 5) {
        newsPool.push(`【口コミ】グルメアプリでのレストランの噂が拡散中。「観葉植物があるだけでパイプ椅子の冷たさが和らぐ」との声。`);
    }
    if (gameState && gameState.comfort >= 90) {
        newsPool.push(`【観光】店内に設置された「癒しの噴水」がパワースポットとして地方紙に掲載される。硬貨を投げ入れる人が続出。`);
    }
    if (gameState && gameState.prestigeChips > 0) {
        newsPool.push(`【神話】この世界に「天界の調味料」を隠し持つシェフが存在するとの目撃情報。1個につき生産力力が1%上がるという超自然現象。`);
    }

    // プールした大量のニュースの中から、ランダムで1つをピンポイントで選ぶ
    const randomIndex = Math.floor(Math.random() * newsPool.length);
    const selectedNews = newsPool[randomIndex];

    // 🌟【セキュリティ対策】リンクの有無で安全に切り替え
    if (selectedNews.includes('<a') && selectedNews.includes('</a>')) {
        tickerTextEl.innerHTML = selectedNews;
    } else {
        tickerTextEl.textContent = selectedNews;
    }
    
    // 🌟【バグの全消去】一度古いセンサー（イベントリスナー）を完全にリセット
    tickerTextEl.removeEventListener('animationiteration', updateTickerNews);

    // アニメーションを最初（右端）からきれいにリスタートさせる処理
    tickerTextEl.style.animation = 'none';
    void tickerTextEl.offsetWidth; // 魔法の一行
    tickerTextEl.style.animation = 'textScrollMarquee 25s linear infinite';

    // 🌟【最重要！】アニメーションが上書きされた「今」、改めて次の切り替えセンサーをがっちり貼り直す！
    // これにより、文字が左外側に消え去る（1周する）たびに、全自動でこの関数が再発火して中身がガラッと変わります
    tickerTextEl.addEventListener('animationiteration', updateTickerNews);
}


// --- 7. 自動生産（メインループ・完全連動＆超軽量版） ---

// お金の計算（100ミリ秒ごと ＝ 1秒間に10回）
setInterval(() => {
    if (gameState.mps > 0) {
        // 🌟【重要】転生倍率だけでなく、レビューの星評価バフ（reviewMultiplier）も計算にガッチャンコ！
        const activeReviewBuff = gameState.reviewMultiplier || 1.0;
        const totalMultiplier = (gameState.prestigeMultiplier || 1.0) * activeReviewBuff;

        // 1回（0.1秒間）の合計売上を計算
        const tickEarned = (gameState.mps * totalMultiplier) / 10;
        
        gameState.money += tickEarned;
        gameState.seasonMoney += tickEarned; 
        gameState.totalMoney += tickEarned;  

        // 施設ごとの累計売上も、バフをかけた状態で10分して記録
        facilities.forEach((facility) => {
            if (facility.count > 0) {
                const facilityTickEarned = ((facility.mpsValue * facility.count) * totalMultiplier) / 10;
                facility.totalEarned += facilityTickEarned;
            }
        });

        // 🌟 代わりに、一番上の数字（所持金など）だけを超高速で滑らかに書き換えます
        const mEl = document.getElementById('money');
        const smEl = document.getElementById('season-money'); // 🌟【新登場！】今世の売上の箱
        const tmEl = document.getElementById('total-money');

        if (mEl)  mEl.textContent = formatNumber(gameState.money);
        if (smEl) smEl.textContent = formatNumber(gameState.seasonMoney); // 🌟【追加】0.1秒ごとに滑らかにピコピコ動かす！
        if (tmEl) tmEl.textContent = formatNumber(gameState.totalMoney);

        // =================================================================
        // 🌟【チカチカ防止修正】重い再描画は廃止し、ボタンのグレーアウト判定だけを高速同期！
        // =================================================================
        // 画像タグ自体の作り直し（消去＆生成）をここでやめ、
        // 「所持金が足りるか足りないか」のdisabled属性だけを0.1秒単位で無音切り替えします。
        if (typeof updateUpgradeButtonsReadyState === 'function') {
            updateUpgradeButtonsReadyState();
        }
    }
}, 100);

// 🌟 ショップの見た目の更新（1000ミリ秒ごと ＝ 1秒間に1回）
// 重いHTMLの書き換え（？？？の判定や、道具の新規アンロック出現など）は、1秒に1回で十分に間に合います！
setInterval(() => {
    updateDisplay();
    
    // 🌟【ここを修正】新しい道具をショップの棚に並べる重い処理は、1秒に1回のここに引っ越し！
    if (typeof renderUpgradesShop === 'function') {
        renderUpgradesShop();
    }
}, 1000);



// --- 8. 🌟【チカチカ＆1発購入バグ完全修正版】画面にある道具ボタンの明るさ（disabled）だけを高速で書き換える関数 ---
function updateUpgradeButtonsReadyState() {
    const upgradeArea = document.getElementById('shop-area-upgrades');
    if (!upgradeArea) return;

    // 現在画面に並んでいるすべての道具ボタン（.upgrade-btn）を取得
    const buttons = upgradeArea.querySelectorAll('.upgrade-btn');
    
    // 現在ショップに並んでいる（アンロックされている）道具の配列を抽出
    const visibleUpgrades = upgrades.filter(up => isUpgradeUnlocked(up));
    
    buttons.forEach((btn, index) => {
        const up = visibleUpgrades[index];
        if (up) {
            // =================================================================
            // 🌟【超重要バグ修正ガード】
            // スマホで今まさにタップされて説明表示中（active-touch）のボタンなら、
            // 0.1秒ループによる disabled の上書きを完全にストップ（スキップ）させます！
            // これにより、スマホの2ステップ目のタップが初期化されず、2回目で確実に購入が発火します。
            // =================================================================
            if (btn.classList.contains('active-touch')) {
                return; 
            }

            // 💡 画像データには一切触れず、買えるか買えないかの状態（disabled）だけを高速上書き！
            btn.disabled = gameState.money < up.cost;
        }
    });
}




// --- 9. 最初の一歩 ---
// ゲームが起動した瞬間に、最初の画面を0円の状態で表示する
updateDisplay();

// --- 10. 設定・転生モーダルの開閉処理（BGM連動バグ対策＆親切設計版） ---
const settingsBtn = document.getElementById('setting-btn');
const ascendBtn = document.getElementById('ascend-btn');
const settingsModal = document.getElementById('settings-modal');
const ascendModal = document.getElementById('ascend-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const closeAscendBtn = document.getElementById('close-ascend-btn');

// ⚙️ 設定画面を開く
if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 🌟 BGMの初回クリック処理とケンカしないように連鎖を止める！
        settingsModal.classList.remove('hidden');
    });
}

// ⚙️ 設定画面を閉じる
if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsModal.classList.add('hidden');
    });
}

// 🌌 転生画面を開く
if (ascendBtn && ascendModal) {
    ascendBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 🌟 連鎖を止める！
        ascendModal.classList.remove('hidden');
    });
}

// 🌌 転生画面を閉じる
if (closeAscendBtn && ascendModal) {
    closeAscendBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        ascendModal.classList.add('hidden');
    });
}

// 🔲【親切設計】ポップアップの外側（黒い背景部分）をクリックしても閉じられるようにする
window.addEventListener('click', (e) => {
    // クリックされた場所が「設定モーダルの背景そのもの」なら隠す
    if (e.target === settingsModal) {
        settingsModal.classList.add('hidden');
    }
    // クリックされた場所が「転生モーダルの背景そのもの」なら隠す
    if (e.target === ascendModal) {
        ascendModal.classList.add('hidden');
    }
});

// --- 10-2. BGMのON/OFF（ミュート）切り替えシステム ---
const bgmToggleBtn = document.getElementById('bgm-toggle-btn');

// ゲームデータ（gameState）の中に「BGMがONかどうか」を記録する場所がなければ、初期値としてON(true)を作る
if (gameState.bgmEnabled === undefined) {
    gameState.bgmEnabled = true;
}

if (bgmToggleBtn) {
    // 💡 起動時に、セーブデータから引き継いだ音量状態をボタンの見た目に反映させる
    updateBgmButtonDisplay();

    bgmToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 🌟 これまでのボタン同様、イベントの連鎖バグをがっちりブロック！

        // ONならOFFに、OFFならONにひっくり返す
        gameState.bgmEnabled = !gameState.bgmEnabled;

        // 実際のラジカセ（bgmAudio）のミュート状態を切り替える
        if (bgmAudio) {
            bgmAudio.muted = !gameState.bgmEnabled;
            
            // 💡 もし「ミュート解除」されて、かつ曲が止まっていたら安全のために再生を試みる
            if (gameState.bgmEnabled && bgmAudio.paused && typeof currentBgmPath !== 'undefined' && currentBgmPath) {
                bgmAudio.play().catch(err => console.log("🎵 クリックによるロック解除待ちです"));
            }
        }

        // ボタンの文字と色を最新の状態に書き換える
        updateBgmButtonDisplay();
        
        console.log(`🎵 BGMの設定を変更しました: ${gameState.bgmEnabled ? "ON" : "OFF"}`);
    });
}

// BGMボタンの文字と見た目（CSSクラス）を切り替える専用の関数
function updateBgmButtonDisplay() {
    if (!bgmToggleBtn) return;
    
    if (gameState.bgmEnabled) {
        bgmToggleBtn.textContent = "🔊 BGM: ON";
        // 🌟【改善】直接styleを触るのではなく、CSSのクラスを付け替える
        bgmToggleBtn.classList.remove('bgm-off');
        bgmToggleBtn.classList.add('bgm-on');
    } else {
        bgmToggleBtn.textContent = "🔇 BGM: OFF";
        // 🌟【改善】クラスを付け替える
        bgmToggleBtn.classList.remove('bgm-on');
        bgmToggleBtn.classList.add('bgm-off');
    }
}




// --- 11. 転生（プレステージ）の計算とリセット処理（3週間長期戦ビルド・完全連動版） ---

// 🌟【重要】エラーガード！関数を動かすために必要な変数をここで確実に定義します
const currentChipsEl = document.getElementById('current-chips');
const incomingChipsEl = document.getElementById('incoming-chips');
const doAscendBtn = document.getElementById('do-ascend-btn');

if (typeof doAscendBtn !== 'undefined' && doAscendBtn) {
    doAscendBtn.addEventListener('click', () => {
        const totalEarnedChips = calculateTotalChips(gameState.seasonMoney);
        const newChips = Math.max(0, totalEarnedChips - (gameState.prestigeChips || 0));

        const confirmAscend = confirm(`本当に転生しますか？\n「天界の調味料」を +${formatNumber(newChips)} 個獲得し、お店を最初からやり直します。`);

        if (confirmAscend) {
            // 1. 純増分をこれまでのチップに加算
            gameState.prestigeChips = (gameState.prestigeChips || 0) + newChips;
            
            // 【本家仕様】永久売上倍率は「1個につき +1%（0.01）の足し算」
            gameState.prestigeMultiplier = 1.0 + (gameState.prestigeChips * 0.01);

            // 2. 🌟リロードさせず、データだけをその場で初期状態に戻す！
            gameState.money = 0;
            gameState.mps = 0;
            gameState.seasonMoney = 0; // 今世の売上をゼロにリセット！

            // 3. すべての施設を所持数0・正しい初期価格にリセット！
            const defaultCosts = {
                flyer: 15, board: 100, sns: 1100, bike: 12000, worker: 130000,
                oven: 1400000, chef: 20000000, car: 330000000, drone: 5100000000, neon: 75000000000,
                factory: 1100000000000, fridge: 14000000000000, lab: 170000000000000, brain: 2100000000000000,
                alchemy: 26000000000000000, elevator: 310000000000000000, moon: 3800000000000000000,
                wormhole: 45000000000000000000, parallel: 540000000000000000000, universe: 6400000000000000000000
            };

            if (typeof facilities !== 'undefined') {
                facilities.forEach(f => {
                    f.count = 0;
                    f.totalEarned = 0;
                    f.cost = defaultCosts[f.id] || f.cost;
                });
            }

            // 4. 店舗設備（快適度アイテム）も転生時に初期化
            if (typeof comfortItems !== 'undefined') {
                comfortItems.forEach(c => {
                    c.count = 0;
                });
            }

            // =================================================================
            // 🍳 道具（アップグレード）の購入状態をリセット！
            // =================================================================
            if (typeof upgrades !== 'undefined') {
                upgrades.forEach(up => {
                    up.bought = false;
                });
            }

            // 5. 古いショップボタンを一度消去して真っさらにする！
            const facilitiesArea = document.getElementById('shop-area-facilities');
            const comfortArea = document.getElementById('shop-area-comfort');
            const upgradesArea = document.getElementById('shop-area-upgrades'); 
            
            if (facilitiesArea) facilitiesArea.innerHTML = "";
            if (comfortArea) comfortArea.innerHTML = "";
            if (upgradesArea) upgradesArea.innerHTML = "";   

            // 正しい長期戦初期価格データをもとに、ショップのボタンをきれいに再生成！
            if (typeof createShop === 'function') createShop();    
            if (typeof createComfortShop === 'function') createComfortShop(); 
            
            // 道具ショップも真っさらな状態（最初は売上0円なのでボタンなし）で再描画！
            if (typeof renderUpgradesShop === 'function') renderUpgradesShop();

            // 6. グルメアプリの星とレビューを初期の星1に叩き落として再計算！
            if (typeof updateRestaurantReview === 'function') {
                if (typeof lastAppliedStarRank !== 'undefined') lastAppliedStarRank = 0; 
                updateRestaurantReview();
            }

            // 7. お店の外観画像も初期のランク1に強制引き戻し！
            if (typeof checkRestaurantEvolution === "function") {
                if (typeof lastAppliedRankName !== 'undefined') lastAppliedRankName = "";
                checkRestaurantEvolution();
            }

            // 8. 転生モーダルを閉じ、メインUIを更新し、真っさらになった現在の状態をセーブ！
            if (ascendModal) ascendModal.classList.add('hidden');
            if (typeof updateDisplay === 'function') updateDisplay();
            if (typeof saveGame === 'function') saveGame(); 

            alert(`🌌 転生に成功しました！\n天界 of 調味料の力で、あなたのレストランの新しい歴史が始まります。\n現在の永久売上倍率: ${gameState.prestigeMultiplier.toFixed(2)} 倍`);
        }
    });
}



// --- 12. ⚠️ 設定画面のデータ完全消去（リセット）システム ---
const resetGameBtn = document.getElementById('reset-game-btn');

if (resetGameBtn) {
    resetGameBtn.addEventListener('click', () => {
        // 1回目の警告確認
        const confirmFirst = confirm("⚠️ 最終警告 ⚠️\nこれまでの現在の所持金、スタッフ、通算売上、および【天界の調味料（転生データ）】も含む、すべてのデータを完全に削除して最初からやり直しますか？");

        if (confirmFirst) {
            // 2回目の念押し確認
            const confirmSecond = confirm("本当に、本当に消去しますよ？\nこの操作は絶対に取り消すことができません。よろしいですか？");

            if (confirmSecond) {
                // 💡 修正ポイント1：ページが閉じる・切り替わる瞬間のセーブイベントを解除
                window.removeEventListener('beforeunload', saveGame);
                window.removeEventListener('unload', saveGame);

                // 💡 修正ポイント2：【60秒自動セーブタイマーの強制破壊】
                // ブラウザで動いているすべての setInterval / setTimeout タイマーを完全に停止させます
                const highestId = setInterval(";");
                for (let i = 0; i <= highestId; i++) {
                    clearInterval(i);
                    clearTimeout(i);
                }

                // 💡 修正ポイント3：ローカルストレージ（ブラウザのデータ）を完全に削除
                localStorage.removeItem('clickRestaurantSave');
                localStorage.clear(); 

                // 💡 修正ポイント4：最後の悪あがきでセーブされないよう、saveGame関数自体を「何もしない関数」へ上書きして無効化
                saveGame = function() {
                    console.log("セーブ機能はリセットのため完全に無効化されています。");
                };

                // すべてのデータ、タイマー、セーブ機能を完全に消滅させた状態で、ページを強制リロードする
                location.reload();
            }
        }
    });
}


// --- 13-1. 💾 自動セーブ機能（LocalStorage） ---
// 【保存】現在のゲームデータをブラウザのメモリに書き込む関数
function saveGame() {
    const saveData = {
        gameState: gameState,
        // 施設データは現在のインフレ価格、購入数、施設ごとの累計売上をセットで保存
        facilities: facilities.map(f => ({
            id: f.id,
            cost: f.cost,
            count: f.count,
            totalEarned: f.totalEarned
        })),
        // 🌟【新登場】店舗設備（快適度）の購入状態（count）をセーブデータに追加！
        comfortItems: comfortItems.map(c => ({
            id: c.id,
            count: c.count
        })),
        // =================================================================
        // 🍳 【ここを追加】道具（アップグレード）の購入状態（bought）を保存！
        // =================================================================
        // 各道具が購入済み（true）か未購入（false）かのフラグを配列にまとめて、
        // 施設や快適度データと同じように安全にローカルストレージへ保存します。
        upgrades: upgrades.map(u => ({
            id: u.id,
            bought: u.bought
        })),
        // 🌟【新機能】保存した瞬間の「時間（タイムスタンプ）」を記録！
        saveTime: Date.now()
    };
    // ブラウザに「clickRestaurantSave」という名前で保存
    localStorage.setItem('clickRestaurantSave', JSON.stringify(saveData));
    console.log("ゲームが自動セーブされました。");
}


// --- 13-2.【ロード】ページを開いた時に、保存されたデータを自動で引き継ぐ関数
function loadGame() {
    const rawData = localStorage.getItem('clickRestaurantSave');
    
    // 🌟【重要】セーブデータが無い新規プレイ（または全消去後）の安全対策
    if (!rawData) {
        if (!gameState.prestigeMultiplier) gameState.prestigeMultiplier = 1.0;
        if (gameState.bgmEnabled === undefined) gameState.bgmEnabled = true; // 初回BGMを強制ONにする
        if (!gameState.prestigeChips) gameState.prestigeChips = 0;
        if (!gameState.seasonMoney) gameState.seasonMoney = 0;
        if (!gameState.comfort) gameState.comfort = 0;
        return;
    }

    try {
        const saveData = JSON.parse(rawData);

        // 1. 基本ステータス（所持金、今シーズンの売上、通算売上、転生チップ、倍率）を復元
        Object.assign(gameState, saveData.gameState);

        // 🌟 ロードしたBGM設定を実際のラジカセに即座に分からせる
        if (typeof bgmAudio !== 'undefined' && bgmAudio) {
            bgmAudio.muted = !gameState.bgmEnabled;
        }
        gameState.buyAmount = 1; // バグ防止のため、一括購入モードは1に戻す

        // 安全対策：もし古いデータに転生データや快適度データが無かった場合は初期値を入れる
        if (gameState.bgmEnabled === undefined) gameState.bgmEnabled = true; // 過去データ救済用
        if (!gameState.prestigeChips) gameState.prestigeChips = 0;
        if (!gameState.prestigeMultiplier) gameState.prestigeMultiplier = 1.0;
        if (!gameState.seasonMoney) gameState.seasonMoney = gameState.money; // 初回移行用
        if (!gameState.comfort) gameState.comfort = 0; // 快適度変数の安全対策

        // 2. ショップの各施設の状態を復元
        saveData.facilities.forEach(savedFacility => {
            const facility = facilities.find(f => f.id === savedFacility.id);
            if (facility) {
                facility.cost = savedFacility.cost;
                facility.count = savedFacility.count;
                facility.totalEarned = savedFacility.totalEarned || 0;
            }
        });

        // 店舗設備（快適度）の購入状態をデータから復元！
        if (saveData.comfortItems) {
            saveData.comfortItems.forEach(savedComfort => {
                const item = comfortItems.find(c => c.id === savedComfort.id);
                if (item) {
                    item.count = savedComfort.count; // 1（導入済み）か 0 を復元
                }
            });
        }

        // =================================================================
        // 🍳 【ここを追加】道具（アップグレード）の購入状態をデータから復元！
        // =================================================================
        // セーブデータ内に道具の記録があれば、ゲーム開始時に購入フラグを復元します。
        // これにより、リロードしても買ったフライパンや包丁の効果が最初から継続します。
        if (saveData.upgrades) {
            saveData.upgrades.forEach(savedUp => {
                const up = upgrades.find(u => u.id === savedUp.id);
                if (up) {
                    up.bought = savedUp.bought || false;
                }
            });
        }

        // 🌟 復元が完了した最新の状態で、道具のショップ棚を正しく再描画する
        if (typeof renderUpgradesShop === 'function') {
            renderUpgradesShop();
        }

        // 3. オフラインボーナスの計算
        if (saveData.saveTime && gameState.mps > 0) {
            const now = Date.now();
            let passedSeconds = Math.floor((now - saveData.saveTime) / 1000);

            // 🌟 ここを追加：上限を24時間（86400秒）に制限する
            passedSeconds = Math.min(passedSeconds, 86400); 

            // 【リロード対策】1分以上（60秒以上）離れていた場合だけボーナスを支給する
            if (passedSeconds >= 60) {
                const offlineEarnings = Math.floor(passedSeconds * gameState.mps * 0.3);

                gameState.money += offlineEarnings;
                gameState.seasonMoney += offlineEarnings;
                if (!isNaN(gameState.totalMoney)) {
                    gameState.totalMoney += offlineEarnings;
                }

                setTimeout(() => {
                    alert(`おかえりなさい！\nあなたが離れていた ${formatSeconds(passedSeconds)} の間に、スタッフたちが 【 ${formatNumber(offlineEarnings)} 円 】 の売上（オフライン30%ボーナス）を稼いでくれました！💰`);
                }, 500);
            }
        }
    } catch (e) {
        console.error("セーブデータの読み込みに失敗しました", e);
    }
}



// --- 【便利機能】秒数を「〇時間〇分〇秒」の読みやすい文字に変換する関数 ---
function formatSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let result = "";
    if (hours > 0) result += `${hours}時間`;
    if (minutes > 0 || hours > 0) result += `${minutes}分`;
    result += `${seconds}秒`;
    return result;
}

// クッキークリッカー仕様：60秒（60000ミリ秒）ごとに自動セーブを実行する
setInterval(saveGame, 60000);

// タブが閉じられる、または裏側に隠れた瞬間に「確実に」セーブを成功させる最新の書き方
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        saveGame();
    }
});

// =================================================================
// 🏁 ゲーム起動時の全自動スタート処理（完全共存・ダブルJSON＆チラつき防止版）
// =================================================================

// 💡 window.onload から addEventListener に変更し、BGMや背景システムと100%共存させます！
window.addEventListener('load', async () => { 
    console.log("🏁 ゲーム起動：すべての初期化処理を開始します。");

    // 🌟【最優先・その1】外部の大量レビューJSONデータをバックグラウンドでダウンロード開始！
    if (typeof loadReviewDatabase === 'function') {
        // await をつけることで、レビューデータが届くまで次の処理を綺麗に待機させます
        await loadReviewDatabase();
    }

    // 🌟【最優先・その2】外部のシュールな電報ニュースJSONデータをダウンロード開始！
    if (typeof loadNewsDatabase === 'function') {
        // 同じく await でニュースのロード完了をがっちり待ちます
        await loadNewsDatabase();
    }

    // ① 過去のデータを読み込む（ロード）
    if (typeof loadGame === 'function') loadGame();      

    // 🌟【新設】ロードした売上（seasonMoney）に合わせて、お店の外観を即座に計算してチラつきを防ぐ！
    if (typeof checkRestaurantEvolution === 'function') {
        if (typeof lastAppliedRankName !== 'undefined') lastAppliedRankName = ""; // 記憶をリセット
        checkRestaurantEvolution();
    }

    // 🌟【新設】ロードした快適度（comfort）に合わせて、レビューの星評価とバフを即座に計算・復元する！
    if (typeof updateRestaurantReview === 'function') {
        if (typeof lastAppliedStarRank !== 'undefined') lastAppliedStarRank = 0; // 記憶をリセット
        updateRestaurantReview();
    }

    // 🌟【新設】ロードしたゲームの数値をもとに、最初のティッカーニュースを画面最上部に流す！
    if (typeof updateTickerNews === 'function') {
        updateTickerNews();
    }

    // ②〜④ ショップやUIの組み立て
    if (typeof createShop === 'function') createShop();    
    if (typeof createComfortShop === 'function') createComfortShop(); 
    if (typeof setupShopTabs === 'function') setupShopTabs(); 
    
    // =================================================================
    // 🍳 道具ショップ ＆ 📖 アイテム図鑑の初期化
    // =================================================================
    // 🌟【新設】ショップが組み上がる前に、背景タップで説明を安全に閉じる仕組みをがっちり起動！
    if (typeof initUpgradeShopGlobalListener === 'function') {
        initUpgradeShopGlobalListener();
    }

    // 🌟【新設】ゲーム起動時に、図鑑ポップアップを開閉するイベントをカチッと登録！
    if (typeof initCollectionModalEvents === 'function') {
        initCollectionModalEvents();
    }

    // 現在の所持金や売上条件に合わせた「本家風の四角いボタン（商品棚）」を初期生成します。
    if (typeof renderUpgradesShop === 'function') renderUpgradesShop();
    
    // ⑤ 画面表示を最新データに更新する
    if (typeof updateDisplay === 'function') updateDisplay(); 

    // 🌟 保険用の初期セーブは、すべての画面の準備と初期値のセットが「完全に完了した最後」に実行する
    saveGame(); 
});
