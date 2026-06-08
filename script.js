// --- 1. ゲームの状態（データ）を１つにまとめる ---
const gameState = {
    money: 0, // 現在の売上（所持金）
    mps: 0, // 毎秒の売上（Money Per Second）
    totalMoney: 0, // これまでに稼いだ累計売上（買い物しても絶対に減らない！）
    buyAmount: 1 // 現在のまとめ買いモード（最初は1個ずつ）
};

// --- 2-1. 施設のデータリスト（配列） ---
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
    // 売上と毎秒の売上を画面に表示（小数点以下は切り捨て）
    moneyEl.textContent = Math.floor(gameState.money);
    mpsEl.textContent = gameState.mps;
    totalMoneyEl.textContent = Math.floor(gameState.totalMoney); // 累計売上を画面に出す！

    // すべての施設（ボタンと価格の文字）をループ処理で更新する
    facilities.forEach((facility) => {
        // 現在のまとめ買い数（1, 10, 100）に応じた合計コストを一括計算！
        const buyInfo = calculateMultiBuy(facility.cost, gameState.buyAmount);

        // 各施設の価格を表示している <span> を探して取得
        const costEl = document.getElementById(`${facility.id}-cost`);
        if (costEl) {
            costEl.textContent = buyInfo.totalCost; // 単品価格ではなく、合計コストを表示！
        }

        // 各施設のボタン自体を取得
        const btnEl = document.getElementById(`buy-${facility.id}-btn`);
        if (btnEl) {
            // 合計コストに対してお金が足りない時だけ、そのボタンをdisabled（無効化）にする
            btnEl.disabled = gameState.money < buyInfo.totalCost;
        }
    });

    // お店の進化も一緒にチェックする
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

// --- 5. 料理を作るボタン（メインクリック）を押した時 ---
mainClickBtn.addEventListener('click', () => {
    gameState.money += 1; // 売上を1円増やす
    gameState.totalMoney += 1; // 累計売上にも1円プラス
    updateDisplay(); // 画面を更新する
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
// 1秒間に10回（100ミリ秒ごと）計算して、スムーズお金を増やす
setInterval(() => {
    if (gameState.mps > 0) {
        // 1回（0.1秒）あたりに増える全体の売上
        const tickEarned = gameState.mps / 10;
        gameState.money += tickEarned;
        gameState.totalMoney += tickEarned; // 累計売上にも自動生産分をプラス

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
