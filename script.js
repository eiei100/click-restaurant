// --- 1. ゲームの状態（データ）を１つにまとめる ---
// --- 1. ゲームの状態（データ）を１つにまとめる ---
const gameState = {
    money: 0, // 現在の売上（所持金・買い物で減る）
    mps: 0, // 毎秒の売上
    seasonMoney: 0, // 【追加】この周回（今シーズン）で稼いだ合計売上（買い物で減らない）
    totalMoney: 0, // 全ての周での通算売上（ゲーム開始からの全累計）
    buyAmount: 1,
    prestigeChips: 0, // 所持している天界の調味料
    prestigeMultiplier: 1.0 // 現在の売上倍率
};


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




// --- 2-2. レストランの進化ランクデータ
const restaurantRanks = [
    { threshold: 0, name: 'ランク1: 小さな屋台', visual: '🎪' },
    { threshold: 100, name: 'ランク2: 下町のハンバーグ屋さん', visual: '🍔' },
    { threshold: 1000, name: 'ランク3: オシャレなモダンカフェ', visual: '☕' },
    { threshold: 10000, name: 'ランク4: 高級三ツ星フレンチ', visual: '🏰' },
    { threshold: 100000, name: 'ランク5: 宇宙デリバリーレストラン', visual: '🚀' }
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
    // 【修正】ただの Math.floor ではなく、今作った formatNumber を通して画面に出す！
    moneyEl.textContent = formatNumber(gameState.money);
    mpsEl.textContent = formatNumber(gameState.mps);
    totalMoneyEl.textContent = formatNumber(gameState.totalMoney);

    // すべての施設（ボタンと価格の文字）をループ処理で更新する
    facilities.forEach((facility) => {
        const buyInfo = calculateMultiBuy(facility.cost, gameState.buyAmount);

        const costEl = document.getElementById(`${facility.id}-cost`);
        if (costEl) {
            // 【修正】ショップの合計コストも「万」や「億」で表示する！
            costEl.textContent = formatNumber(buyInfo.totalCost);
        }

        const btnEl = document.getElementById(`buy-${facility.id}-btn`);
        if (btnEl) {
            btnEl.disabled = gameState.money < buyInfo.totalCost;
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

// --- 5. 料理を作るボタン（メインクリック）を押した時 ---
mainClickBtn.addEventListener('click', () => {
    const clickEarned = 1 * (gameState.prestigeMultiplier || 1.0);
    gameState.money += clickEarned;
    gameState.seasonMoney += clickEarned; // 【追加】この周回の合計にプラス
    gameState.totalMoney += clickEarned;  // 全ての周の通算にプラス
    updateDisplay();
});



// --- 6. ショップのボタンを自動生成する ---
// 施設データの配列（facilities）を1つずつループ処理する
facilities.forEach((facility) => {
    // 新しくボタンのHTML要素（<button></button>）を脳内で作成
    const btn = document.createElement('button');
    btn.className = 'shop-btn';
    btn.id = `buy-${facility.id}-btn`; // 例: buy-worker-btn

    // ボタンの中に文字を入れる（最初は価格などをセット、最初は1個分の文字を入れとく）
    btn.innerHTML = `${facility.name}（コスト: <span id="${facility.id}-cost">${facility.cost}</span> 円)`; 

    // マウスを乗せた時（ホバー時）の処理
    btn.addEventListener('mouseenter', () => {
        // この施設の合計Mpsを計算
        const totalFacilityMps = facility.count * facility.mpsValue;

        // 全体のMpsに対する割合（%）を計算
        const mpsPercent = gameState.mps > 0 ? Math.round((totalFacilityMps / gameState.mps) * 100) : 0;

        // ポップアップに出す文章のベースを作る
        let tooltipText = `【${facility.name}】\n`;
        tooltipText += `所持数: ${formatNumber(facility.count)} 体\n`;
        tooltipText += `説明: ${facility.desc}\n`;

        // 1体で持っている場合だけ、詳細な能力と貢献度を解放！
        if (facility.count > 0) {
            tooltipText += `------------------------\n`;
            // 能力や売上の数字を全て formatNumber で囲む！
            tooltipText += `1体あたりの能力: 毎秒 ${formatNumber(facility.mpsValue)} 円\n`;
            tooltipText += `合計の生産力: 毎秒 ${formatNumber(totalFacilityMps)} 円 (全体の ${mpsPercent}%)\n`;
            tooltipText += `これまでの累計売上: ${formatNumber(Math.floor(facility.totalEarned))} 円`;
        }

        // 【修正】ブラウザ標準のtitleではなく、自作の箱に文字を流し込んで表示！
        tooltipEl.textContent = tooltipText;
        tooltipEl.classList.remove('hidden'); // 非表示クラスを外してゼロ秒出現！

        // 一番外側の箱（game-container）を基準にした、ボタンの「絶対的な位置」を計算する
        const btnRect = btn.getBoundingClientRect();
        const containerRect = document.getElementById('game-container').getBoundingClientRect();
        
        // ボタンの左端から、ツールチップの横幅分（250px）と少しの隙間（10px）を引いた左側の位置にピタッと合わせる
        tooltipEl.style.left = `${btnRect.left - containerRect.left - 260}px`;
        // 縦の位置も、スクロールに関係なくボタンの高さにピタッと合わせる
        tooltipEl.style.top = `${btnRect.top - containerRect.top}px`;


    });

    // 【追加】マウスがボタンから離れた時（ホバーが外れた時）の処理
    btn.addEventListener('mouseleave', () => {
        tooltipEl.classList.add('hidden'); // 再び非表示クラスをつけて隠す！
    });

    // --- このボタンがクリックされた時の処理 ---
    btn.addEventListener('click', () => {
        // 現在のまとめ買い数に応じた合計コストと、購入後の次の価格を計算
        const buyInfo = calculateMultiBuy(facility.cost, gameState.buyAmount);

        // 合計コストに対してお金が足りるかチェック
        if (gameState.money >= buyInfo.totalCost) {
            gameState.money -= buyInfo.totalCost; // 合計コスト分のお金を支払う
            facility.count += gameState.buyAmount; // 選択した数（1, 10, 100）だけ一気に増やす！
            gameState.mps += facility.mpsValue * gameState.buyAmount; // 買った分一気に毎秒の売上を増やす！

            // 施設の価格を、シュミレーションした「買い終わった後の次の1個の価格」に戻す
            facility.cost = buyInfo.nextCost;

            updateDisplay(); // 画面を更新する
            
            // 【親切設計】買った瞬間にツールチップの中身（所持数や%）も即座に書き換える
            btn.dispatchEvent(new Event('mouseenter'));
        }
    });

    // ボタンをHTMLの空っぽの箱（shop-area）の中に追加する
    shopArea.appendChild(btn);
});

// --- 7. 自動生産（メインループ） ---
setInterval(() => {
    if (gameState.mps > 0) {
        const tickEarned = (gameState.mps * (gameState.prestigeMultiplier || 1.0)) / 10;
        gameState.money += tickEarned;
        gameState.seasonMoney += tickEarned; // 【追加】この周回の合計にプラス
        gameState.totalMoney += tickEarned;  // 全ての周の通算にプラス

        facilities.forEach((facility) => {
            if (facility.count > 0) {
                const facilityTickEarned = ((facility.mpsValue * facility.count) * (gameState.prestigeMultiplier || 1.0)) / 10;
                facility.totalEarned += facilityTickEarned;
            }
        });

        updateDisplay();
    }
}, 100);


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
                // 自動セーブ機能で使う保存用キー（clickRestaurantSave）をブラウザから完全に削除
                localStorage.removeItem('clickRestaurantSave');

                // ページを強制的に再読み込み（リロード）して、完全に初期状況（0円）からスタートさせる
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
        }))
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

        // 安全対策：もし古いデータに転生データが無かった場合は初期値を入れる
        if (!gameState.prestigeChips) gameState.prestigeChips = 0;
        if (!gameState.prestigeMultiplier) gameState.prestigeMultiplier = 1.0;
        if (!gameState.seasonMoney) gameState.seasonMoney = gameState.money; // 初回移行用

        // 2. ショップの各施設の状態を復元
        saveData.facilities.forEach(savedFacility => {
            const facility = facilities.find(f => f.id === savedFacility.id);
            if (facility) {
                facility.cost = savedFacility.cost;
                facility.count = savedFacility.count;
                facility.totalEarned = savedFacility.totalEarned || 0;
            }
        });
    } catch (e) {
        console.error("セーブデータの読み込みに失敗しました", e);
    }
}

// クッキークリッカー仕様：60秒（60000ミリ秒）ごとに自動セーブを実行する
setInterval(saveGame, 60000);

// ユーザーがタブを閉じる、またはリロードする直前に強制セーブ
window.addEventListener('beforeunload', () => {
    saveGame();
});

// ゲームが起動した瞬間にロードを行い、画面を最新にする
loadGame();
updateDisplay();