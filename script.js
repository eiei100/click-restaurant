// --- 1. ゲームの状態（データ）を１つにまとめる ---
const gameState = {
    money: 0, // 現在の売上（所持金・買い物で減る）
    mps: 0, // 毎秒の売上
    seasonMoney: 0, // 【追加】この周回（今シーズン）で稼いだ合計売上（買い物で減らない）
    totalMoney: 0, // 全ての周での通算売上（ゲーム開始からの全累計）
    buyAmount: 1,
    prestigeChips: 0, // 所持している天界の調味料
    prestigeMultiplier: 1.0, // 現在の売上倍率
    comfort: 0 // 🌟【追加】お店の現在の「合計快適度」（これをもとに客が増えたりレビューが良くなる！）
};

// 2-1. 施設一覧
const facilities = [
    { id: 'flyer', name: '手書きのチラシ', cost: 15, mpsValue: 1, count: 0, totalEarned: 0, desc: '近所の電柱に貼ったビラ。たまに物好きな人が見にくる。' },
    { id: 'board', name: '店先の看板板', cost: 100, mpsValue: 4, count: 0, totalEarned: 0, desc: 'チョークでメニューを書いた板。少しだけお店っぽくなった。' },
    { id: 'sns', name: 'お店のSNSアカウント', cost: 1100, mpsValue: 32, count: 0, totalEarned: 0, desc: '「本日オープン！」の写真に、身内から3つのいいねがついた。' },
    { id: 'bike', name: 'ボロいママチャリ', cost: 12000, mpsValue: 260, count: 0, totalEarned: 0, desc: '立ち漕ぎで近所にデリバリー。ブレーキをかけるとキィキィ鳴る。' },
    { id: 'worker', name: '見習いバイト', cost: 130000, mpsValue: 1400, count: 0, totalEarned: 0, desc: '時給が安くて元気がいい。お皿洗いや注文取りを頑張るぞ。' },
    { id: 'oven', name: '自動高速オーブン', cost: 1400000, mpsValue: 7800, count: 0, totalEarned: 0, desc: '最新テクノロジーで作られたオーブン。ピザも一瞬で焼き上がる。' },
    { id: 'chef', name: 'ベテラン料理長', cost: 20000000, mpsValue: 44000, count: 0, totalEarned: 0, desc: '元三ツ星レストランのシェフ。彼の作るまかないは絶品。' },
    { id: 'car', name: '高級デリバリーカー', cost: 330000000, mpsValue: 260000, count: 0, totalEarned: 0, desc: '金ピカの配達車。どんなに遠くても温かいまま料理を届ける。' },
    { id: 'drone', name: 'ドローン配達網', cost: 5100000000, mpsValue: 1600000, count: 0, totalEarned: 0, desc: '空からピザが降ってくる時代。カラスの襲撃対策もバッチリ。' },
    { id: 'neon', name: '巨大ネオン看板', cost: 75000000000, mpsValue: 10000000, count: 0, totalEarned: 0, desc: '宇宙からも見える明るさ。夜間のお客さんが100倍に増えた。' },
    { id: 'factory', name: '地下食品工場', cost: 1100000000000, mpsValue: 65000000, count: 0, totalEarned: 0, desc: '24時間ノンストップで食材を加工する、秘密の巨大地下迷宮。' },
    { id: 'fridge', name: '超次元冷蔵庫', cost: 14000000000000, mpsValue: 430000000, count: 0, totalEarned: 0, desc: '中が四次元空間につながっており、無限に食材を新鮮保存できる。' },
    { id: 'lab', name: 'ピザ研究所', cost: 170000000000000, mpsValue: 2900000000, count: 0, totalEarned: 0, desc: '白衣を着た科学者たちが、一番美味しくなる分子構造を研究中。' },
    { id: 'brain', name: '脳波注文システム', cost: 2100000000000000, mpsValue: 21000000000, count: 0, totalEarned: 0, desc: '食べたいと思った瞬間、すでに目の前に料理が届いている。' },
    { id: 'alchemy', name: '錬金術調理鍋', cost: 26000000000000000, mpsValue: 150000000000, count: 0, totalEarned: 0, desc: 'ただの水と小麦粉から、最高級の黄金スープを錬成する。' },
    { id: 'elevator', name: '美食の軌道エレベーター', cost: 310000000000000000, mpsValue: 1100000000000, count: 0, totalEarned: 0, desc: '地上で作った料理を、そのまま宇宙ステーションへ直行デリバリー。' },
    { id: 'moon', name: '月面トマト農場', cost: 3800000000000000000, mpsValue: 8300000000000, count: 0, totalEarned: 0, desc: '宇宙放射線を浴びて、信じられないほど甘くなった特大トマト。' },
    { id: 'wormhole', name: 'ワームホール配送便', cost: 45000000000000000000, mpsValue: 64000000000000, count: 0, totalEarned: 0, desc: '空間を折りたたんで配達。配達時間は驚異のマイナス1秒（過去に届く）。' },
    { id: 'parallel', name: '並行世界レストラン', cost: 540000000000000000000, mpsValue: 510000000000000, count: 0, totalEarned: 0, desc: '別の世界の自分たちにも店を経営させ、売上をこの世界に集約する。' },
    { id: 'universe', name: '全知全能のレストラン', cost: 6400000000000000000000, mpsValue: 4200000000000000, count: 0, totalEarned: 0, desc: 'この宇宙そのものが一つの巨大なレストランとなった。売上はもはや概念。' }
];



// 2-2. ランク一覧
const restaurantRanks = [
    { threshold: 0, name: 'ランク1: 賑やかな夜の屋台', visual: '🎪' },
    { threshold: 500, name: 'ランク2: 行列のできる下町食堂', visual: '🏪' }, // 街のお店へ
    { threshold: 50000, name: 'ランク3: 駅前のモダンカフェ', visual: '☕' },
    { threshold: 2000000, name: 'ランク4: 憧れの老舗高級ホテル', visual: '🏰' }, // 豪華なお城へ
    { threshold: 100000000, name: 'ランク5: 地上200階の空中レストラン', visual: '🏙️' }, // 超高層ビル
    { threshold: 5000000000, name: 'ランク6: 豪華客船の洋上メインダイニング', visual: '🚢' }, // 巨大船
    { threshold: 1e12, name: 'ランク7: 月面ドーム・ファーストフード店', visual: '🛸' }, // UFO・宇宙基地風
    { threshold: 1e15, name: 'ランク8: 銀河縦断美食クルーズ超特急', visual: '🚀' }, // 宇宙船
    { threshold: 1e18, name: 'ランク9: 超次元ブラックホール異界食堂', visual: '🌀' }, // 次元迷宮
    { threshold: 1e21, name: 'ランク10: 全知全能の全宇宙満腹聖殿', visual: '🌌' } // 銀河そのもの
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




// --- 3. HTMLのパーツ（要素）を取得 ---
const moneyEl = document.getElementById('money');
const mpsEl = document.getElementById('mps');
const totalMoneyEl = document.getElementById('total-money'); // 累計売上の表示場所を取得
const mainClickBtn = document.getElementById('main-click-btn');
const shopArea = document.getElementById('shop-area'); // 空っぽにしたショップの箱
const tooltipEl = document.getElementById('tooltip'); // 【追加】自作ポップアップの箱を取得！
const rankEl = document.getElementById('restaurant-rank');     // ランク名を表示する場所
const visualEl = document.getElementById('restaurant-visual'); // 絵文字を表示する場所


// --- 4-1. 画面表示を最新のデータに更新する関数 ---
function updateDisplay() {
    moneyEl.textContent = formatNumber(gameState.money);
    mpsEl.textContent = formatNumber(gameState.mps);
    totalMoneyEl.textContent = formatNumber(gameState.totalMoney);

    facilities.forEach((facility) => {
        const buyInfo = calculateMultiBuy(facility.cost, gameState.buyAmount);

        const costEl = document.getElementById(`cost-${facility.id}`);
        if (costEl) {
            costEl.textContent = formatNumber(buyInfo.totalCost);
        }

        const btnEl = document.getElementById(`buy-${facility.id}-btn`);
        const nameEl = document.getElementById(`name-${facility.id}`);

        if (btnEl) {
    // 2つの境界線（しきい値）を計算
    const hideThreshold = facility.cost * 0.1;   // 10%のライン
    const revealThreshold = facility.cost * 0.8; // 80%のライン

    // 【最優先】初期施設、またはすでに1個以上持っている場合は、無条件で「シルエット」にする！
    const isInitialFacility = facility.id === 'flyer';
    const isSecondFacility = facility.id === 'board';

    // 🌟 【第1段階：完全アンロック】条件を満たしている、または最高資金が50%を超えた場合
    if (gameState.seasonMoney >= revealThreshold || facility.count > 0) {
        if (nameEl) nameEl.textContent = facility.name; // 本当の名前を見せる

        btnEl.classList.remove('locked-facility');
        btnEl.style.display = "block"; // ショップに表示

        // お金（所持金）が足りるかどうかでグレーアウトを切り替え
        btnEl.disabled = gameState.money < buyInfo.totalCost;
    } 
    // 🌟 【第2段階：シルエット出現】10%〜80%の間の場合（まだ買ってない）
    else if (gameState.seasonMoney >= hideThreshold || isInitialFacility || isSecondFacility) {
        if (nameEl) nameEl.textContent = "？？？"; // 名前を隠す

        btnEl.classList.add('locked-facility');
        btnEl.style.display = "block"; 
        btnEl.disabled = true;        // まだ買えないので絶対に押せない
    } 
    // 🌟 【第3段階：完全隠蔽】10%未満の場合（お金が全然足りない）
    else {
        btnEl.style.display = "none";  // 存在自体をショップから消して隠す
    }
}

    });

    // 【快適度】店舗設備の購入判定と売り切れロックの処理
    comfortItems.forEach((item) => {
        const btnEl = document.getElementById(`buy-${item.id}-btn`);
        if (!btnEl) return; // ボタンが見つからなければスキップ

        // 🌟 パターン1：すでに購入済み（count が 1）の場合
        if (item.count > 0) {
            btnEl.disabled = true; // ２度と押せないようにロック

            const nameEl = document.getElementById(`name-${item.id}`);
            if (nameEl) {
                // 🌟 名前のはじめに「✅」を自動でくっつけて、売り切れ看板にする！
                nameEl.textContent = `✅ ${item.name}`;
            }
            
            // 🌟【新登場】ゴールド枠のデザインクラスを付与し、ロック用クラスは外す
            btnEl.classList.add('comfort-sold');
            btnEl.classList.remove('locked-facility');
        }
        // 🌟 パターン2：まだ買っていない未導入の場合
        else {
            // 所持金（money）がコストより少なければグレーアウト（disabled）
            const isShortOfMoney = gameState.money < item.cost;
            btnEl.disabled = isShortOfMoney;

            // 買ったとき用のゴールドクラスは事前に外しておく
            btnEl.classList.remove('comfort-sold');

            // お金が足りないときはロック用の外観（クラス）を付け、足りたら外して光らせる！
            if (isShortOfMoney) {
                btnEl.classList.add('locked-facility');
            } else {
                btnEl.classList.remove('locked-facility');
            }
        }
    });


    checkRestaurantEvolution();
}


// --- 4-2 お店の進化をチェックして画面を更新する関数 ---
function checkRestaurantEvolution() {
    // ランクデータを上から順番に見て、条件をクリアしている「一番高いランク」を探す
    let currentRank = restaurantRanks[0];

    restaurantRanks.forEach((rank) => {
        // 累計売上（totalMoney）を基準にチェック
        if (gameState.totalMoney >= rank.threshold) {
            currentRank = rank;
        }
    });

    // 画面の文字と絵文字を、決定したランクのものに書き換える
    rankEl.textContent = currentRank.name;
    visualEl.textContent = currentRank.visual;
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
    const value = Math.floor(num);

    // 1,000未満ならそのままの数字を返す
    if (value < 1000) return value;

    // 海外ゲームお馴染みの単位リスト（3桁=1,000倍ごとに名前が変わります）
    const units = [
        { value: 1e3,  name: "K" },  // Thousand (千)
        { value: 1e6,  name: "M" },  // Million (百万)
        { value: 1e9,  name: "B" },  // Billion (十億)
        { value: 1e12, name: "T" },  // Trillion (一兆)
        { value: 1e15, name: "Qa" }, // Quadrillion
        { value: 1e18, name: "Qi" }, // Quintillion
        { value: 1e21, name: "Sx" }, // Sextillion
        { value: 1e24, name: "Sp" }, // Septillion
        { value: 1e27, name: "Oc" }, // Octillion
        { value: 1e30, name: "No" }, // Nonillion
        { value: 1e33, name: "Dc" }  // Decillion...（将来ここをいくらでも増やせます！）
    ];

    // リストの「下（大きい単位）」から順番にチェックしていく
    for (let i = units.length -1; i >= 0; i--) {
        if (value >= units[i].value) {
            // その単位で割り算をして、小数点以下2桁まで綺麗に出す（例：1.50 M）
            return (value / units[i].value).toFixed(2) + " " + units[i].name;
        }
    }
}

// --- 5-1. 料理を作るボタン（メインクリック）を押した時 ---
mainClickBtn.addEventListener('click', () => {
    const clickEarned = 1 * (gameState.prestigeMultiplier || 1.0);
    gameState.money += clickEarned;
    gameState.seasonMoney += clickEarned; // 【追加】この周回の合計にプラス
    gameState.totalMoney += clickEarned;  // 全ての周の通算にプラス
    updateDisplay();
});

// --- 5-2. 客の来店ミニアニメーション演出（完全同期＆ダブり防止版） ---
const GUEST_IMAGES = [
    "img/guest/guest1.png",
    "img/guest/guest2.png",
    "img/guest/guest3.png",
    "img/guest/guest4.png",
    "img/guest/guest5.png",
    "img/guest/guest6.png"
];

// 直前に登場した画像のインデックスを記録する変数（ダブり防止用）
let lastGuestIndex = -1;

document.addEventListener("DOMContentLoaded", () => {
    const guestEl = document.getElementById('live-guest');
    if (!guestEl) return;

    // 🌟 1人目のお客さんを選んでアニメーションを開始
    changeNextGuest(guestEl);
    guestEl.classList.add('start-animation');

    // 💡 タイマーは完全廃止！
    // CSSのアニメーションが「1周終わって最初に戻った瞬間（animationiteration）」を検知する
    guestEl.addEventListener('animationiteration', () => {
        // 次の周回のために、画面外（スタート地点）にいるこの瞬間に画像を切り替える！
        changeNextGuest(guestEl);
    });
});

// 次のお客さんを「絶対に前回と違う人」からランダムに決定する関数
function changeNextGuest(guestEl) {
    let randomIndex;
    
    // 画像が2種類以上あれば、前回と同じ画像が選ばれないようにループさせる
    do {
        randomIndex = Math.floor(Math.random() * GUEST_IMAGES.length);
    } while (randomIndex === lastGuestIndex && GUEST_IMAGES.length > 1);

    // 今回選ばれた番号を保存
    lastGuestIndex = randomIndex;

    const nextGuest = GUEST_IMAGES[randomIndex];
    guestEl.style.setProperty('--guest-img', `url("${nextGuest}")`);
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

            const btnRect = btn.getBoundingClientRect();
            const containerRect = document.getElementById('game-container').getBoundingClientRect();
            
            tooltipEl.style.left = `${btnRect.left - containerRect.left - 260}px`;
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

// --- 6-3. 店舗設備（快適度）ショップのボタンを自動生成する関数
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

            // ロックはかけずに最初から全部見せる
            // 🌟【大改造】ロック用の説明はすべて廃止！最初からワクワクする説明を読めるようにします
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
            tooltipEl.classList.add('hidden');
        });

        // クリックされた時の処理
        btn.addEventListener('click', () => {
            if (btn.classList.contains('locked-facility') || item.count > 0) return;

            if (gameState.money >= item.cost) {
                gameState.money -= item.cost;
                item.count = 1;
                gameState.comfort += item.comfortValue;

                if (item.id === 'bgm_cafe') {
                    console.log("【イベント】カフェBGMが開放されました！");
                }

                updateDisplay();
                btn.dispatchEvent(new Event('mouseenter'));
            }
        });

        // ボタンを店舗設備用の箱に追加
        shopArea.appendChild(btn);
    });
}

// --- 7. 自動生産（メインループ） ---
// お金の計算（100ミリ秒ごと ＝ 1秒間に10回）
setInterval(() => {
    if (gameState.mps > 0) {
        const tickEarned = (gameState.mps * (gameState.prestigeMultiplier || 1.0)) / 10;
        gameState.money += tickEarned;
        gameState.seasonMoney += tickEarned; 
        gameState.totalMoney += tickEarned;  

        facilities.forEach((facility) => {
            if (facility.count > 0) {
                const facilityTickEarned = ((facility.mpsValue * facility.count) * (gameState.prestigeMultiplier || 1.0)) / 10;
                facility.totalEarned += facilityTickEarned;
            }
        });

        // 🌟【重要！】ここにあった updateDisplay(); を削除しました！
        // 代わりに、一番上の数字（所持金など）だけを超高速で書き換えます
        moneyEl.textContent = formatNumber(gameState.money);
        totalMoneyEl.textContent = formatNumber(gameState.totalMoney);
    }
}, 100);

// 🌟【新登場】ショップの見た目の更新（1000ミリ秒ごと ＝ 1秒間に1回）
// 重いHTMLの書き換え（？？？の判定やグレーアウトなど）は、1秒に1回で十分に間に合います！
setInterval(() => {
    updateDisplay();
}, 1000);



// --- 8. 最初の一歩 ---
// ゲームが起動した瞬間に、最初の画面を0円の状態で表示する
updateDisplay();

// --- 9-1. クリックエフェクト（料理の飛び出しシステム） ---
const foodImages = ['img/egg.png', 'img/burger.png', 'img/pizza.png', 'img/sushi.png'];

mainClickBtn.addEventListener('click', (e) => {
    const randomImgSrc = foodImages[Math.floor(Math.random() * foodImages.length)];

    // 画像要素（img）を作り出す
    const effect = document.createElement('img');
    effect.className = 'click-effect';
    effect.src = randomImgSrc; // 画像の場所をセット

    // 配置する
    effect.style.left = `${e.pageX - 16}px`;
    effect.style.top = `${e.pageY -16}px`;

    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 800);
});

// --- 10. 設定・転生モーダルの開閉処理 ---
const settingsBtn = document.getElementById('setting-btn');
const ascendBtn = document.getElementById('ascend-btn');
const settingsModal = document.getElementById('settings-modal');
const ascendModal = document.getElementById('ascend-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const closeAscendBtn = document.getElementById('close-ascend-btn');

// 設定画面を開く
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

// 設定画面を閉じる
closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

// 転生画面を開く
ascendBtn.addEventListener('click', () => {
    ascendModal.classList.remove('hidden');
});

// 転生画面を閉じる
closeAscendBtn.addEventListener('click', () => {
    ascendModal.classList.add('hidden');
});

// --- 11. 転生（プレステージ）の計算とリセット処理 ---
const currentChipsEl = document.getElementById('current-chips');
const incomingChipsEl = document.getElementById('incoming-chips');
const doAscendBtn = document.getElementById('do-ascend-btn');

// 【計算】「この周回で稼いだ売上」から転生時にもらえるポイントを計算する数式
// 例: 通算売上1万で10個、4万で20個、といった具合にルート（平方根）を使ってインフレさせる
function calculateTotalChips(money) {
    if (money < 10000) return 0; // 最低でも通算1万以上稼がないと転生できません
    return Math.floor(Math.sqrt(money / 100)); // 100で割った値をルートして、小数点以下を切り捨て
}

// 転生モーダル（画面）が開かれた瞬間に、ポイントの表示を計算して書き換える処理
ascendBtn.addEventListener('click', () => {
    const totalEarnedChips = calculateTotalChips(gameState.seasonMoney);
    // 今回の周回だけで新しく取得できるポイント
    // *すでに獲得済みの prestigeChips より多く稼いで初めて追加ポイントがもらえます
        // 【修正】これまでに獲得したチップ（prestigeChips）を引いて、純粋な「追加分」を計算する
    const newChips = Math.max(0, totalEarnedChips - (gameState.prestigeChips || 0));

    if (currentChipsEl) currentChipsEl.textContent = formatNumber(gameState.prestigeChips || 0);
    if (incomingChipsEl) incomingChipsEl.textContent = formatNumber(newChips);

    // 1ポイントでももらえるなら、実行ボタンを押せるようにする
    if (doAscendBtn) {
        if (newChips > 0) {
            doAscendBtn.disabled = false;
            doAscendBtn.style.opacity = "1";
            doAscendBtn.style.cursor = "pointer";
        } else {
            doAscendBtn.disabled = true;
            doAscendBtn.style.opacity = "0.5";
            doAscendBtn.style.cursor = "not-allowed";
        }
    }
});

if (doAscendBtn) {
    doAscendBtn.addEventListener('click', () => {
        const totalEarnedChips = calculateTotalChips(gameState.seasonMoney);
        const newChips = Math.max(0, totalEarnedChips - (gameState.prestigeChips || 0));

        const confirmAscend = confirm(`本当に転生しますか？\n「天界の調味料」を +${formatNumber(newChips)} 個獲得し、お店を最初からやり直します。`);

        if (confirmAscend) {
            // 1. 今回の純増分（newChips）だけを、これまでの所持チップに加算する！
            gameState.prestigeChips = (gameState.prestigeChips || 0) + newChips;
            // 新しい合計チップ数をもとに、永久売上倍率を計算（1個につき+1%永久アップ）
            gameState.prestigeMultiplier = 1.0 + (gameState.prestigeChips * 0.01);

            // 2. ゲームの状況を初期化（通算売上と、今引き継いだ転生はデータは残す！）
            gameState.money = 0;
            gameState.mps = 0;
            gameState.seasonMoney = 0; // この周回で稼いだ売上をゼロにリセット！

            // 3. すべての施設を所持数0・初期価格にリセット
            const defaultCosts = {
                flyer: 15, board: 100, sns: 1100, bike: 12000, worker: 130000,
                oven: 1400000, chef: 20000000, car: 330000000, drone: 5100000000, neon: 75000000000,
                factory: 1100000000000, fridge: 14000000000000, lab: 170000000000000, brain: 2100000000000000,
                alchemy: 26000000000000000, elevator: 310000000000000000, moon: 3800000000000000000,
                wormhole: 45000000000000000000, parallel: 540000000000000000000, universe: 6400000000000000000000
            };

            facilities.forEach(f => {
                f.count = 0;
                f.totalEarned = 0;
                f.cost = defaultCosts[f.id] || f.cost;
            })

            ascendModal.classList.add('hidden');
            updateDisplay();

            alert(`転生に成功しました！現在の永久売上倍率: ${gameState.prestigeMultiplier.toFixed(2)} 倍`);

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
            //2回目の念押し確認
            const confirmSecond = confirm("本当に、本当に消去しますよ？\nこの操作は絶対に取り消すことができません。よろしいですか？");

            if (confirmSecond) {
                // 【超重要】リロード時の自動セーブ見張りを、力尽くで削除（解除）する！
                window.removeEventListener('beforeunload', saveGame);
                // 自動セーブ機能で使う保存用キー（clickRestaurantSave）をブラウザから完全に削除
                localStorage.removeItem('clickRestaurantSave');

                // ページを強制的に再読み込み（リロード）して、完全に初期状態（0円）からスタートさせる
                location.reload();
            }
        }
    });
}

// --- 13. 💾 自動セーブ機能（LocalStorage） ---
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
        // 🌟【新機能】保存した瞬間の「時間（タイムスタンプ）」を記録！
        saveTime: Date.now()
    };
    // ブラウザに「clickRestaurantSave」という名前で保存
    localStorage.setItem('clickRestaurantSave', JSON.stringify(saveData));
    console.log("ゲームが自動セーブされました。");
}

// 【ロード】ページを開いた時に、保存されたデータを自動で引き継ぐ関数
function loadGame() {
    const rawData = localStorage.getItem('clickRestaurantSave');
    if (!rawData) {
        // セーブデータが無い新規プレイでも、転生倍率を確実に 1.0（等倍）にしておく
        if (!gameState.prestigeMultiplier) gameState.prestigeMultiplier = 1.0;
        return;
    }

    try {
        const saveData = JSON.parse(rawData);

        // 1. 基本ステータス（所持金、今シーズンの売上、通算売上、転生チップ、倍率）を復元
        Object.assign(gameState, saveData.gameState);
        gameState.buyAmount = 1; // バグ防止のため、一括購入モードは1に戻す

        // 安全対策：もし古いデータに転生データや快適度データが無かった場合は初期値を入れる
        if (!gameState.prestigeChips) gameState.prestigeChips = 0;
        if (!gameState.prestigeMultiplier) gameState.prestigeMultiplier = 1.0;
        if (!gameState.seasonMoney) gameState.seasonMoney = gameState.money; // 初回移行用
        if (!gameState.comfort) gameState.comfort = 0; // 🌟快適度変数の安全対策

        // 2. ショップの各施設の状態を復元
        saveData.facilities.forEach(savedFacility => {
            const facility = facilities.find(f => f.id === savedFacility.id);
            if (facility) {
                facility.cost = savedFacility.cost;
                facility.count = savedFacility.count;
                facility.totalEarned = savedFacility.totalEarned || 0;
            }
        });

        // 🌟【新登場】店舗設備（快適度）の購入状態をデータから復元！
        if (saveData.comfortItems) {
            saveData.comfortItems.forEach(savedComfort => {
                const item = comfortItems.find(c => c.id === savedComfort.id);
                if (item) {
                    item.count = savedComfort.count; // 1（導入済み）か 0 を復元
                }
            });
        }

        // 3. オフラインボーナスの計算
        // 前回のセーブデータがあり、かつ毎秒の売上（mps）が1円以上の場合のみ計算する
        if (saveData.saveTime && gameState.mps > 0) {
            const now = Date.now();
            // 離れていた時間を「秒数」にする（ミリ秒を1000で割る）
            const passedSeconds = Math.floor((now - saveData.saveTime) / 1000);

            // 【リロード対策】1分以上（60秒以上）離れていた場合だけボーナスを支給する
            if (passedSeconds >= 60) {
                // オフライン中の売上 = 離れていた秒数 * 毎秒の売上
                const offlineEarnings = Math.floor(passedSeconds * gameState.mps * 0.3);

                // 各種データにプラスする
                gameState.money += offlineEarnings;
                gameState.seasonMoney += offlineEarnings;
                gameState.totalMoney += offlineEarnings;

                // 画面を開いた瞬間にパッとポップアップでお知らせする！
                // （少しだけ時間差をあけて出すと安全に表示される）
                setTimeout(() => {
                    alert(`おかえりなさい！\nあなたが離れていた ${formatSeconds(passedSeconds)} の間に、スタッフたちが 【 ${formatNumber(offlineEarnings)} 円 】 の売上（オフライン30%ボーナス）を稼いでくれました！💰`);
                }, 500);
            }
        }
    } catch (e) {
        console.error("セーブデータの読み込みに失敗しました", e);
    }
}


// 【便利機能】秒数を「〇時間〇分〇秒」の読みやすい文字に変換する関数
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

// ユーザーがタブを閉じる、またはリロードする直前に強制セーブ
window.addEventListener('beforeunload', saveGame);

// =================================================================
// 🏁 ゲーム起動時の全自動スタート処理（一番安全な形）
// =================================================================

// 💡 画面（HTML）が完全に出来上がってから、中身を実行しなさいという命令！
window.onload = function() {
    loadGame();      // ① 過去のデータを思い出す（ロード）
    createShop();    // ② ショップのボタンを画面に安全に量産する（生成）
    createComfortShop(); // 🌟【追加】店舗設備ショップを生成
    setupShopTabs(); // 🌟【追加】タブを動かすための命令をここに滑り込ませる！
    updateDisplay(); // ③ 量産されたボタンに対して、初めて「ID:1を表示しろ！」と命令する（画面更新）
};

