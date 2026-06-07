// --- 1. ゲームの状態（データ）を１つにまとめる ---
const gameState = {
    money: 0, // 現在の売上（所持金）
    mps: 0, // 毎秒の売上（Money Per Second）
};

// --- 2. 施設のデータリスト（配列） ---
const facilities = [
    { 
        id: 'worker', 
        name: '見習いバイト', 
        cost: 15, 
        mpsValue: 1, 
        count: 0,
        totalEarned: 0, // 今までこの施設が累計で稼いだ金額
        desc: '時給が安くて元気がいい。お皿洗いや注文取りを頑張るぞ。' 
    },
    { 
        id: 'oven', 
        name: '自動高速オーブン', 
        cost: 100, 
        mpsValue: 8, 
        count: 0,
        totalEarned: 0,
        desc: '最新テクノロジーで作られたオーブン。ピザも一瞬で焼き上がる。' 
    },
    { 
        id: 'chef', 
        name: 'ベテラン料理長', 
        cost: 1100, 
        mpsValue: 47, 
        count: 0,
        totalEarned: 0,
        desc: '元三ツ星レストランのシェフ。彼の作るまかないは絶品。' 
    },
    { 
        id: 'car', 
        name: '高級デリバリーカー', 
        cost: 12000, 
        mpsValue: 260, 
        count: 0,
        totalEarned: 0,
        desc: '金ピカの配達車。どんなに遠くても温かいまま料理を届ける。' 
    }
];

// --- 3. HTMLのパーツ（要素）を取得 ---
const moneyEl = document.getElementById('money');
const mpsEl = document.getElementById('mps');
const mainClickBtn = document.getElementById('main-click-btn');
const shopArea = document.getElementById('shop-area'); // 空っぽにしたショップの箱
const tooltipEl = document.getElementById('tooltip'); // 【追加】自作ポップアップの箱を取得！

// --- 4. 画面表示を最新のデータに更新する関数 ---
function updateDisplay() {
    // 売上と毎秒の売上を画面に表示（小数点以下は切り捨て）
    moneyEl.textContent = Math.floor(gameState.money);
    mpsEl.textContent = gameState.mps;

    // すべての施設（ボタンと価格の文字）をループ処理で更新する
    facilities.forEach((facility) => {
        // 各施設の価格を表示している <span> を探して取得
        const costEl = document.getElementById(`${facility.id}-cost`);
        if (costEl) {
            costEl.textContent = facility.cost;
        }

        // 各施設のボタン自体を取得
        const btnEl = document.getElementById(`buy-${facility.id}-btn`);
        if (btnEl) {
            // お金が足りない時だけ、そのボタンをdisabled（無効化）にする
            btnEl.disabled = gameState.money < facility.cost;
        }
    });
}

// --- 5. 料理を作るボタン（メインクリック）を押した時 ---
mainClickBtn.addEventListener('click', () => {
    gameState.money += 1; // 売上を1円増やす
    updateDisplay(); // 画面を更新する
});

// --- 6. ショップのボタンを自動生成する ---
// 施設データの配列（facilities）を1つずつループ処理する
facilities.forEach((facility) => {
    // 新しくボタンのHTML要素（<button></button>）を脳内で作成
    const btn = document.createElement('button');
    btn.className = 'shop-btn';
    btn.id = `buy-${facility.id}-btn`; // 例: buy-worker-btn

    // ボタンの中に文字を入れる（最初は価格などをセット）
    btn.innerHTML = `${facility.name}を雇う（コスト: <span id="${facility.id}-cost">${facility.cost}</span> 円)`; 

    // 【大改造】マウスを乗せた時（ホバー時）の処理
    btn.addEventListener('mouseenter', () => {
        // この施設の合計Mpsを計算
        const totalFacilityMps = facility.count * facility.mpsValue;

        // 全体のMpsに対する割合（%）を計算
        const mpsPercent = gameState.mps > 0 ? Math.round((totalFacilityMps / gameState.mps) * 100) : 0;

        // ポップアップに出す文章のベースを作る
        let tooltipText = `【${facility.name}】\n`;
        tooltipText += `所持数: ${facility.count} 体\n`;
        tooltipText += `説明: ${facility.desc}\n`;

        // 1体で持っている場合だけ、詳細な能力と貢献度を解放！
        if (facility.count > 0) {
            tooltipText += `------------------------\n`;
            tooltipText += `1体あたりの能力: 毎秒 ${facility.mpsValue} 円\n`;
            tooltipText += `合計の生産力: 毎秒 ${totalFacilityMps} 円 (全体の ${mpsPercent}%)\n`;
            tooltipText += `これまでの累計売上: ${Math.floor(facility.totalEarned)} 円`;
        }

        // 【修正】ブラウザ標準のtitleではなく、自作の箱に文字を流し込んで表示！
        tooltipEl.textContent = tooltipText;
        tooltipEl.classList.remove('hidden'); // 非表示クラスを外してゼロ秒出現！
        // 【追加】マウスが乗ったボタンの縦の位置に合わせて、ツールチップの高さをピタッと合わせる
        tooltipEl.style.top = `${btn.offsetTop}px`;

    });

    // 【追加】マウスがボタンから離れた時（ホバーが外れた時）の処理
    btn.addEventListener('mouseleave', () => {
        tooltipEl.classList.add('hidden'); // 再び非表示クラスをつけて隠す！
    });

    // --- このボタンがクリックされた時の処理 ---
    btn.addEventListener('click', () => {
        // お金が足りるかチェック
        if (gameState.money >= facility.cost) {
            gameState.money -= facility.cost; // お金を支払う
            facility.count += 1; // その施設を1つ増やす
            gameState.mps += facility.mpsValue; // 毎秒の売上（全体）を増やす

            // 次の価格を1.15倍にする（インフレ）
            facility.cost = Math.ceil(facility.cost * 1.15);

            updateDisplay(); // 画面を更新する
            
            // 【親切設計】買った瞬間にツールチップの中身（所持数や%）も即座に書き換える
            btn.dispatchEvent(new Event('mouseenter'));
        }
    });

    // ボタンをHTMLの空っぽの箱（shop-area）の中に追加する
    shopArea.appendChild(btn);
});

// --- 7. 自動生産（メインループ） ---
// 1秒間に10回（100ミリ秒ごと）計算して、スムーズお金を増やす
setInterval(() => {
    if (gameState.mps > 0) {
        // 1回（0.1秒）あたりに増える全体の売上
        const tickEarned = gameState.mps / 10;
        gameState.money += tickEarned;

        // それぞれの施設が「この0.1秒でいくら稼いだか」を個別に累計していく
        facilities.forEach((facility) => {
            if (facility.count > 0) {
                // （この施設の1体あたりの能力 * 所持数） / 10
                const facilityTickEarned = (facility.mpsValue * facility.count) / 10;
                facility.totalEarned += facilityTickEarned;
            }
        });

        updateDisplay(); // 画面を更新する
    }
}, 100);

// --- 8. 最初の一歩 ---
// ゲームが起動した瞬間に、最初の画面を0円の状態で表示する
updateDisplay();
