// DOM要素の取得
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const brushSizeDisplay = document.getElementById('brushSizeDisplay');
const clearBtn = document.getElementById('clearBtn');
const eraserBtn = document.getElementById('eraserBtn');
const penBtn = document.getElementById('penBtn');
const savePNG = document.getElementById('savePNG');
const saveJPG = document.getElementById('saveJPG');

// 描画状態の管理
let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;

// キャンバスの初期化
function initCanvas() {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

// ブラシサイズ表示の更新
function updateBrushSizeDisplay() {
    brushSizeDisplay.textContent = brushSize.value;
}

// 描画開始
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

// 描画中
function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    
    if (isErasing) {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = colorPicker.value;
    }
    
    ctx.lineWidth = brushSize.value;
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

// 描画終了
function stopDrawing() {
    isDrawing = false;
}

// キャンバスをクリア
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 消しゴムモードの切り替え
function toggleEraserMode() {
    isErasing = true;
    canvas.style.cursor = 'grab';
    eraserBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a52)';
    penBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
}

// ペンモードの切り替え
function togglePenMode() {
    isErasing = false;
    canvas.style.cursor = 'crosshair';
    penBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a52)';
    eraserBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
}

// PNG形式で保存
function savePNGImage() {
    const link = document.createElement('a');
    link.download = `my-drawing-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// JPG形式で保存
function saveJPGImage() {
    // JPG用に白い背景を追加
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    // 白い背景を描画
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // 元の絵を重ねる
    tempCtx.drawImage(canvas, 0, 0);
    
    const link = document.createElement('a');
    link.download = `my-drawing-${new Date().getTime()}.jpg`;
    link.href = tempCanvas.toDataURL('image/jpeg', 0.9);
    link.click();
}

// タッチイベントをマウスイベントに変換
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
}

// イベントリスナーの設定
function setupEventListeners() {
    // ブラシサイズ変更
    brushSize.addEventListener('input', updateBrushSizeDisplay);

    // マウスイベント
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // タッチイベント（スマートフォン対応）
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // ボタンイベント
    clearBtn.addEventListener('click', clearCanvas);
    eraserBtn.addEventListener('click', toggleEraserMode);
    penBtn.addEventListener('click', togglePenMode);
    savePNG.addEventListener('click', savePNGImage);
    saveJPG.addEventListener('click', saveJPGImage);
}

// アプリケーションの初期化
function initApp() {
    initCanvas();
    setupEventListeners();
    // 初期状態でペンモードを設定
    togglePenMode();
}

// DOMが読み込まれたら初期化
document.addEventListener('DOMContentLoaded', initApp);