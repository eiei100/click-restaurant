// --- 1. ゲームの状態（データ）を１つにまとめる ---
const gameState = {
    money: 0, // 現在の売上（所持金）
    mps: 0, // 毎秒の売上（Money Per Secound）
    workerCount: 0, // バイトの数
    workerCost: 15, // バイトの価格
    workerMpsValue: 1 //バイト1人の生産量
};

// --- 2. HTMLのパーツ（要素）を取得 ---
const moneyEl = document.getElementById('money');
const mpsEl = document.getElementById('mps');
const mainClickBtn = document.getElementById('main-click-btn');
const buyWorkerBtn = document.getElementById('buy-worker-btn');
const workerCostEl = document.getElementById('worker-cost');

// --- 3. 画面表示を最新のデータに更新する関数 ---
function updateDisplay() {
    // 売上と毎秒の売上を画面に表示（小数点以下は切り捨て）
    moneyEl.textContent = Math.floor(gameState.money);
    mpsEl.textContent = gameState.mps;

    // バイトの価格を画面に表示
    workerCostEl.textContent = gameState.workerCost;

    // お金が足りる時だけ、バイト募集ボタンのdisabled（無効化）を解除する
    buyWorkerBtn.disabled = gameState.money < gameState.workerCost;
}

// --- 4. 料理を作るボタン（メインクリック）を押した時 ---
mainClickBtn.addEventListener('click', () => {
    gameState.money += 1; // 売上を1円増やす
    updateDisplay(); // 画面を更新する
});

// --- 5. バイトを雇うボタンを押した時 ---
buyWorkerBtn.addEventListener('click', () => {
    // 念の為、本当にお金が足りるかチェック
    if (gameState.money >= gameState.workerCost){
        gameState.money -= gameState.workerCost; // お金を支払う
        gameState.workerCount += 1; // バイトを1人増やす
        gameState.mps += gameState.workerMpsValue; // 毎秒の売上を増やす

        // 次のバイトの価格を1.15倍にする（本家クッキークリッカー風のインフレ）
        gameState.workerCost = Math.ceil(gameState.workerCost * 1.15);

        updateDisplay(); // 画面を更新する
    }
});

// --- 6. 自動生産（メインループ） ---
// 1秒間に10回（100ミリ秒ごと）計算して、スムーズにお金を増やす
setInterval(() => {
    if (gameState.mps > 0) {
        gameState.money += gameState.mps / 10; //10分の1の売上を足す
        updateDisplay(); // 画面を更新する
    }
}, 100);

// --- 7. 最初の一歩 ---
// ゲームが起動した瞬間に、最初の画面を0円の状態で表示する
updateDisplay();