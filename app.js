/**
 * app.js – AGGRESSOR Chess Web App
 * ─────────────────────────────────────────────────────────────────────────────
 * Stockfish MultiPV + Aggression Override
 * Works offline (PWA), all platforms.
 */

'use strict';

// ── Constants ─────────────────────────────────────────────────────────────────
const PIECE_VALUES = { p:100, n:320, b:330, r:500, q:900 };

const GLYPHS = {
  wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
  bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟',
};

const DIFFICULTIES = {
  'Beginner':  { elo:600,  movetime:200,  multipv:5 },
  'Easy':      { elo:1000, movetime:400,  multipv:5 },
  'Medium':    { elo:1500, movetime:800,  multipv:6 },
  'Hard':      { elo:2000, movetime:1400, multipv:8 },
  'Expert':    { elo:2500, movetime:2500, multipv:8 },
  'Master':    { elo:3600, movetime:4000, multipv:10 },
};

let AGGRESSION_THRESHOLD = 45;   // centipawns (user-adjustable)
const AGGR_MIN_ADVANTAGE  = 25;  // minimum extra aggression to override

// ── State ─────────────────────────────────────────────────────────────────────
let game        = new Chess();
let flipped     = false;
let mode        = 'vs_ai';      // 'vs_ai' | 'vs_human'
let difficulty  = 'Medium';
let playstyle   = 'Aggressive';  // 'Aggressive' | 'Normal' | 'Passive'
let selected    = null;         // currently selected square ('e2' etc.)
let legalDests  = [];
let lastMove    = null;         // {from, to}
let thinking    = false;
let gameOver    = false;
let moveHistory = [];           // SAN strings
let engineReady = false;
let promotionPending = null;    // {from, to}
let capturedW   = [];           // pieces captured from white
let capturedB   = [];
let evalCp      = null;

// ── Stockfish Web Worker ───────────────────────────────────────────────────────
let stockfish = null;
let sfMultiPVLines = {};
let sfBestmoveCb  = null;

function initStockfish() {
  stockfish = new Worker('lib/stockfish.js');

  stockfish.onmessage = (e) => {
    const line = e.data;

    if (line === 'uciok') {
      stockfish.postMessage('isready');
      return;
    }
    if (line === 'readyok') {
      engineReady = true;
      document.querySelector('.badge-dot').classList.add('ready');
      document.getElementById('engine-label').textContent = 'Stockfish 10 ready';
      // If AI goes first (playing black vs user), kick engine
      maybeEngine();
      return;
    }

    // info depth ... multipv N score cp X pv <move> ...
    if (line.startsWith('info') && line.includes('score') && line.includes(' pv ')) {
      const parsed = parseInfo(line);
      if (parsed) sfMultiPVLines[parsed.multipv] = parsed;
    }

    if (line.startsWith('bestmove')) {
      if (sfBestmoveCb) {
        const cb = sfBestmoveCb;
        sfBestmoveCb = null;
        cb(Object.values(sfMultiPVLines));
        sfMultiPVLines = {};
      }
    }
  };

  stockfish.postMessage('uci');
}

function parseInfo(line) {
  const tokens = line.split(' ');
  let multipv = 1, cp = null, mate = null, pvStart = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === 'multipv')  multipv = parseInt(tokens[i+1]);
    if (tokens[i] === 'cp')       cp      = parseInt(tokens[i+1]);
    if (tokens[i] === 'mate')     mate    = parseInt(tokens[i+1]);
    if (tokens[i] === 'pv')       pvStart = i + 1;
  }
  if (pvStart < 0) return null;
  const move = tokens[pvStart];
  if (!move || move.length < 4) return null;
  const score = mate !== null ? (mate > 0 ? 100000 : -100000) : (cp ?? 0);
  return { multipv, score, cp, mate, move };
}

async function sfGetMoves(fen, cfg) {
  return new Promise((resolve) => {
    sfMultiPVLines = {};
    sfBestmoveCb = resolve;

    stockfish.postMessage(`setoption name MultiPV value ${cfg.multipv}`);
    if (cfg.elo < 3600) {
      stockfish.postMessage('setoption name UCI_LimitStrength value true');
      stockfish.postMessage(`setoption name UCI_Elo value ${cfg.elo}`);
    } else {
      stockfish.postMessage('setoption name UCI_LimitStrength value false');
    }
    stockfish.postMessage(`position fen ${fen}`);
    stockfish.postMessage(`go movetime ${cfg.movetime}`);
  });
}

// ── Style Scorer ──────────────────────────────────────────────────────────────
function styleScore(fen, uciMove) {
  const g      = new Chess(fen);
  const from   = uciMove.slice(0, 2);
  const to     = uciMove.slice(2, 4);
  const promo  = uciMove[4] || undefined;
  const piece  = g.get(from);
  const victim = g.get(to);

  let agg = 0;

  if (victim) {
    const vv = PIECE_VALUES[victim.type] || 0;
    const av = PIECE_VALUES[piece?.type] || 0;
    agg += vv / 8;
    if (av > vv) agg += 120;
  }

  const mv = g.move({ from, to, promotion: promo });
  if (!mv) return 0;

  if (g.in_check()) agg += 180;

  let ekFile = null, ekRank = null, mykFile = null, mykRank = null;
  const board = g.board();
  const moverColor = piece?.color;
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (p && p.type === 'k') {
        if (p.color !== moverColor) { ekFile = f; ekRank = r; }
        else { mykFile = f; mykRank = r; }
      }
    }
  }

  if (ekFile !== null) {
    const toFile = to.charCodeAt(0) - 97;
    const toRank = 8 - parseInt(to[1]);
    const dist   = Math.max(Math.abs(toFile - ekFile), Math.abs(toRank - ekRank));
    if (dist <= 2) agg += 60;

    const fromFile = from.charCodeAt(0) - 97;
    const fromRank = 8 - parseInt(from[1]);
    const distBefore = Math.max(Math.abs(fromFile - ekFile), Math.abs(fromRank - ekRank));
    agg += (distBefore - dist) * 15;

    if (piece && (piece.type === 'r' || piece.type === 'q')) {
      if (toFile === ekFile)                agg += 70;
      else if (Math.abs(toFile - ekFile) === 1) agg += 35;
    }
  }

  if (piece && piece.type === 'p') {
    const toRankNum = parseInt(to[1]);
    const advRank   = piece.color === 'w' ? toRankNum : 9 - toRankNum;
    if (advRank >= 5) agg += 25;
  }

  if (playstyle === 'Aggressive') return agg;

  let pas = 0;
  if (piece && piece.type === 'p') pas -= 50;

  if (mykFile !== null) {
    const toFile = to.charCodeAt(0) - 97;
    const toRank = 8 - parseInt(to[1]);
    const fromFile = from.charCodeAt(0) - 97;
    const fromRank = 8 - parseInt(from[1]);
    const my_d_to = Math.max(Math.abs(toFile - mykFile), Math.abs(toRank - mykRank));
    const my_d_from = Math.max(Math.abs(fromFile - mykFile), Math.abs(fromRank - mykRank));
    pas += (my_d_from - my_d_to) * 15;
    if (my_d_to <= 2) pas += 30;
  }
  
  pas -= Math.floor(agg / 2);
  
  return pas;
}

// ── Aggressor Engine (Stockfish + override) ───────────────────────────────────
async function getAggressorMove() {
  if (!engineReady) return null;

  const fen = game.fen();
  const cfg = DIFFICULTIES[difficulty];
  const candidates = await sfGetMoves(fen, cfg);

  if (!candidates.length) return null;
  candidates.sort((a, b) => b.score - a.score);

  const bestScore = candidates[0].score;
  const bestMove  = candidates[0].move;
  const threshold = AGGRESSION_THRESHOLD;

  // Filter pool within threshold
  const pool = candidates.filter(c => bestScore - c.score <= threshold);
  
  if (playstyle === 'Normal' || pool.length <= 1) return bestMove;

  // Score for playstyle
  const scored = pool.map(c => ({ ...c, styleScore: styleScore(fen, c.move) }));
  scored.sort((a, b) => b.styleScore - a.styleScore);

  const bestStyle = scored.find(s => s.move === bestMove)?.styleScore ?? 0;
  const topStyle  = scored[0];

  if (topStyle.styleScore >= bestStyle + AGGR_MIN_ADVANTAGE && topStyle.move !== bestMove) {
    console.log(`[AGGRESSOR] Override: ${topStyle.move} (style:${topStyle.styleScore}) vs SF: ${bestMove} (style:${bestStyle}), Δcp=${bestScore - topStyle.score}`);
    return topStyle.move;
  }
  return bestMove;
}

// ── Board Rendering ───────────────────────────────────────────────────────────
function renderBoard() {
  const grid = document.getElementById('board-grid');
  grid.innerHTML = '';

  const board = game.board();  // 8×8 array [rank8..rank1][fileA..fileH]
  const inCheck = game.in_check();
  const kingSq  = inCheck ? findKing(game.turn()) : null;

  for (let displayRow = 0; displayRow < 8; displayRow++) {
    for (let displayCol = 0; displayCol < 8; displayCol++) {
      const boardRow  = flipped ? 7 - displayRow : displayRow;
      const boardCol  = flipped ? 7 - displayCol : displayCol;
      const chessRank = 8 - boardRow;                      // 8..1
      const chessFile = String.fromCharCode(97 + boardCol); // a..h
      const sqName    = chessFile + chessRank;
      const cell      = board[boardRow][boardCol];          // chess.js board

      const div = document.createElement('div');
      div.className = 'sq ' + ((boardRow + boardCol) % 2 === 0 ? 'dark' : 'light');
      div.dataset.sq = sqName;

      // Highlights
      if (sqName === selected)        div.classList.add('selected');
      if (lastMove) {
        if (sqName === lastMove.from) div.classList.add('last-from');
        if (sqName === lastMove.to)   div.classList.add('last-to');
      }
      if (kingSq && sqName === kingSq) div.classList.add('check');
      if (legalDests.includes(sqName)) {
        div.classList.add('legal');
        if (cell) div.classList.add('has-piece');
      }

      // Piece
      if (cell) {
        const span = document.createElement('span');
        span.className = 'piece ' + (cell.color === 'w' ? 'white' : 'black');
        const key = cell.color + cell.type.toUpperCase();
        span.textContent = GLYPHS[key] || '?';
        div.appendChild(span);
      }

      div.addEventListener('click', () => onSquareClick(sqName));
      div.addEventListener('mouseenter', () => div.classList.add('hover'));
      div.addEventListener('mouseleave', () => div.classList.remove('hover'));
      grid.appendChild(div);
    }
  }
}

function findKing(color) {
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (p && p.type === 'k' && p.color === color) {
        const file = String.fromCharCode(97 + f);
        const rank = 8 - r;
        return file + rank;
      }
    }
  }
  return null;
}

function renderCoords() {
  const files = flipped ? 'hgfedcba' : 'abcdefgh';
  const fl = document.getElementById('file-labels');
  fl.innerHTML = '';
  [...files].forEach(f => {
    const s = document.createElement('span');
    s.textContent = f;
    fl.appendChild(s);
  });

  ['rank-labels-left','rank-labels-right'].forEach(id => {
    const el = document.getElementById(id);
    el.className = 'rank-label-col';
    el.innerHTML = '';
    const ranks = flipped ? '12345678' : '87654321';
    [...ranks].forEach(r => {
      const s = document.createElement('span');
      s.textContent = r;
      el.appendChild(s);
    });
  });
}

// ── User Interaction ──────────────────────────────────────────────────────────
function onSquareClick(sq) {
  if (thinking || gameOver) return;
  if (promotionPending) return;

  // In VS_AI mode, only allow player's color
  if (mode === 'vs_ai' && game.turn() !== 'w') return;  // player is white

  const piece = game.get(sq);

  if (selected === null) {
    // Select piece
    if (piece && piece.color === game.turn()) {
      selected    = sq;
      legalDests  = game.moves({ square: sq, verbose: true }).map(m => m.to);
    }
  } else {
    if (sq === selected) {
      // Deselect
      selected = null; legalDests = [];
    } else if (legalDests.includes(sq)) {
      // Move
      attemptMove(selected, sq);
    } else if (piece && piece.color === game.turn()) {
      // Switch selection
      selected   = sq;
      legalDests = game.moves({ square: sq, verbose: true }).map(m => m.to);
    } else {
      selected = null; legalDests = [];
    }
  }
  renderBoard();
}

function attemptMove(from, to) {
  // Check for pawn promotion
  const piece = game.get(from);
  const toRank = parseInt(to[1]);
  if (piece && piece.type === 'p' &&
      ((piece.color === 'w' && toRank === 8) ||
       (piece.color === 'b' && toRank === 1))) {
    showPromotion(from, to, piece.color);
    return;
  }
  executeMove(from, to);
}

function executeMove(from, to, promotion = 'q') {
  const mv = game.move({ from, to, promotion });
  if (!mv) return;

  // Track captures
  if (mv.captured) {
    if (mv.color === 'w') capturedB.push(mv.captured);
    else                   capturedW.push(mv.captured);
  }

  lastMove    = { from, to };
  selected    = null;
  legalDests  = [];
  promotionPending = null;

  moveHistory.push(mv.san);
  checkGameOver();
  updatePanel();
  renderBoard();

  if (!gameOver) {
    // Request evaluation update
    requestEval();
    maybeEngine();
  }
}

function showPromotion(from, to, color) {
  promotionPending = { from, to };
  const overlay = document.getElementById('promotion-overlay');
  const choices = document.getElementById('promo-choices');
  choices.innerHTML = '';
  const pieces = ['q','r','b','n'];
  const colorKey = color === 'w' ? 'w' : 'b';
  pieces.forEach(pt => {
    const btn = document.createElement('button');
    btn.className = 'promo-btn' + (color === 'b' ? ' black-piece' : '');
    const key = colorKey + pt.toUpperCase();
    btn.textContent = GLYPHS[key] || pt;
    btn.onclick = () => {
      overlay.classList.add('hidden');
      executeMove(from, to, pt);
    };
    choices.appendChild(btn);
  });
  overlay.classList.remove('hidden');
}

// ── Engine trigger ─────────────────────────────────────────────────────────────
function maybeEngine() {
  if (mode !== 'vs_ai') return;
  if (game.turn() === 'w') return;   // player is white
  if (!engineReady || thinking || gameOver) return;

  thinking = true;
  document.getElementById('turn-indicator').textContent = 'Engine thinking…';
  document.getElementById('board-grid').classList.add('thinking');

  getAggressorMove().then(uciMove => {
    thinking = false;
    document.getElementById('board-grid').classList.remove('thinking');
    if (uciMove && !gameOver) {
      const from  = uciMove.slice(0, 2);
      const to    = uciMove.slice(2, 4);
      const promo = uciMove[4] || 'q';
      executeMove(from, to, promo);
    }
  });
}

async function requestEval() {
  if (!engineReady) return;
  const fen  = game.fen();
  const info = await new Promise(resolve => {
    let got = null;
    const origCb = sfBestmoveCb;
    stockfish.postMessage(`position fen ${fen}`);
    stockfish.postMessage('go depth 12');
    sfBestmoveCb = (lines) => {
      if (origCb) origCb(lines);
      const best = lines.sort((a,b)=>b.score-a.score)[0];
      resolve(best);
    };
  });
  if (info) {
    evalCp = info.score;
    updateEvalBar();
  }
}

// ── Game State ────────────────────────────────────────────────────────────────
function checkGameOver() {
  if (game.game_over()) {
    gameOver = true;
    let title, msg;
    if (game.in_checkmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      title = '🏆 Checkmate!';
      msg   = `${winner} wins!`;
    } else if (game.in_stalemate()) {
      title = '🤝 Stalemate!';
      msg   = 'Draw – Stalemate';
    } else if (game.insufficient_material()) {
      title = '🤝 Draw';
      msg   = 'Insufficient material';
    } else if (game.in_threefold_repetition()) {
      title = '🤝 Draw';
      msg   = 'Threefold repetition';
    } else {
      title = '🤝 Draw';
      msg   = 'Game over';
    }
    document.getElementById('gameover-title').textContent = title;
    document.getElementById('gameover-msg').textContent   = msg;
    document.getElementById('gameover-overlay').classList.remove('hidden');
  }
}

function resetGame() {
  game     = new Chess();
  selected = null; legalDests = []; lastMove = null;
  thinking = false; gameOver = false;
  moveHistory = []; capturedW = []; capturedB = [];
  evalCp = null; promotionPending = null;

  document.getElementById('gameover-overlay').classList.add('hidden');
  document.getElementById('promotion-overlay').classList.add('hidden');
  document.getElementById('board-grid').classList.remove('thinking');

  if (stockfish) {
    stockfish.postMessage('stop');
    stockfish.postMessage('ucinewgame');
  }

  renderBoard();
  updatePanel();
  maybeEngine();
}

function undoMove() {
  if (thinking) return;
  game.undo();
  if (mode === 'vs_ai') game.undo();  // undo AI move too
  moveHistory.splice(mode === 'vs_ai' ? -2 : -1);
  lastMove = null; selected = null; legalDests = []; gameOver = false;
  document.getElementById('gameover-overlay').classList.add('hidden');
  renderBoard();
  updatePanel();
}

// ── Panel Updates ─────────────────────────────────────────────────────────────
function updatePanel() {
  // Turn indicator
  if (!gameOver && !thinking) {
    const color = game.turn() === 'w' ? 'White' : 'Black';
    const check = game.in_check() ? ' – Check!' : '';
    document.getElementById('turn-indicator').textContent = `${color} to move${check}`;
  }

  // Move list
  const ml = document.getElementById('move-list');
  ml.innerHTML = '';
  for (let i = 0; i < moveHistory.length; i += 2) {
    const row = document.createElement('div');
    row.className = 'move-row';
    const num = document.createElement('span'); num.className = 'move-num'; num.textContent = `${Math.floor(i/2)+1}.`;
    const wm  = document.createElement('span');
    wm.className = 'move-w' + (i === moveHistory.length - 1 ? ' move-current' : '');
    wm.textContent = moveHistory[i] || '';
    const bm  = document.createElement('span');
    bm.className = 'move-b' + (i+1 === moveHistory.length - 1 ? ' move-current' : '');
    bm.textContent = moveHistory[i+1] || '';
    row.appendChild(num); row.appendChild(wm); row.appendChild(bm);
    ml.appendChild(row);
  }
  ml.scrollTop = ml.scrollHeight;

  // Captured
  const cw = document.getElementById('captured-w');
  const cb = document.getElementById('captured-b');
  cw.innerHTML = '<span class="cap-label">White lost:</span>';
  cb.innerHTML = '<span class="cap-label">Black lost:</span>';
  capturedW.sort().forEach(pt => {
    const s = document.createElement('span'); s.textContent = GLYPHS['w'+pt.toUpperCase()]; cw.appendChild(s);
  });
  capturedB.sort().forEach(pt => {
    const s = document.createElement('span'); s.textContent = GLYPHS['b'+pt.toUpperCase()]; cb.appendChild(s);
  });

  updateEvalBar();
}

function updateEvalBar() {
  const fill  = document.getElementById('eval-bar-fill');
  const label = document.getElementById('eval-label');
  if (evalCp === null) { fill.style.width = '50%'; label.textContent = ''; return; }
  const clamped  = Math.max(-1000, Math.min(1000, evalCp));
  const fraction = 0.5 + clamped / 2000;
  fill.style.width = (fraction * 100).toFixed(1) + '%';
  label.textContent = clamped >= 0 ? `+${(clamped/100).toFixed(1)}` : `${(clamped/100).toFixed(1)}`;
}

// ── UI Setup ──────────────────────────────────────────────────────────────────
function setupDiffButtons() {
  const container = document.getElementById('diff-buttons');
  container.innerHTML = '';
  Object.keys(DIFFICULTIES).forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'diff-btn' + (name === difficulty ? ' active' : '');
    btn.textContent = name;
    btn.onclick = () => {
      difficulty = name;
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('engine-label').textContent =
        `Stockfish – ELO ~${DIFFICULTIES[name].elo}`;
    };
    container.appendChild(btn);
  });
}

function setupModeButtons() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.mode;
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      resetGame();
    });
  });
}

function setupActionButtons() {
  document.getElementById('btn-new').onclick  = resetGame;
  document.getElementById('btn-undo').onclick = undoMove;
  document.getElementById('btn-flip').onclick = () => {
    flipped = !flipped;
    renderBoard();
    renderCoords();
  };
  document.getElementById('btn-gameover-new').onclick = resetGame;

  // Threshold slider
  const slider = document.getElementById('threshold-slider');
  const val    = document.getElementById('threshold-val');
  slider.addEventListener('input', () => {
    AGGRESSION_THRESHOLD = parseInt(slider.value);
    val.textContent      = slider.value;
  });
}

function setupStyleButtons() {
  const container = document.getElementById('style-buttons');
  if (!container) return;
  container.innerHTML = '';
  container.style.display = 'grid';
  container.style.gridTemplateColumns = '1fr 1fr 1fr';
  container.style.gap = '5px';
  const styles = ['Aggressive', 'Normal', 'Passive'];
  styles.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'diff-btn' + (name === playstyle ? ' active' : '');
    btn.textContent = name;
    btn.onclick = () => {
      playstyle = name;
      container.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
    container.appendChild(btn);
  });
}

// ── PWA Install ───────────────────────────────────────────────────────────────
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('install-wrap').style.display = 'flex';
  document.getElementById('btn-install').onclick = () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      document.getElementById('install-wrap').style.display = 'none';
    });
  };
});

// ── Service Worker ────────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            const msg = document.createElement('div');
            msg.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#5a9bff;color:#06091a;padding:12px 24px;border-radius:10px;font-weight:600;cursor:pointer;z-index:9999;';
            msg.textContent = '🔄 Update available – Click to refresh';
            msg.onclick = () => { newSW.postMessage({ type: 'SKIP_WAITING' }); location.reload(); };
            document.body.appendChild(msg);
          }
        });
      });
    });
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setupDiffButtons();
  setupStyleButtons();
  setupModeButtons();
  setupActionButtons();
  renderCoords();
  renderBoard();
  updatePanel();
  initStockfish();
});
