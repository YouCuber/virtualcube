// 試験用サーバー: DBはサーバー側にだけ置き、答えだけを返す（2026-11-15）
// 使い方: node server.js （PORT環境変数があればそれを使う。Cloud Runは自動で入れてくれる）
const http = require('http');
const fs = require('fs');
const db = JSON.parse(fs.readFileSync(__dirname + '/db-fr.json', 'utf8'));
const nKeys = Object.keys(db).length;

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  if (u.pathname === '/api/lookup') {
    const key = u.searchParams.get('key') || '';
    const e = db[key];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (!e) return res.end(JSON.stringify({ found: false, key }));
    // 返すのはその状態の答えだけ。DB全体は外に出ない
    return res.end(JSON.stringify({ found: true, key, depth: e.depth, sols: e.sols }));
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>サーバー分離の試験</h1><p>DB（' + nKeys + '件）はサーバーの中だけにあるよ。</p>' +
    '<p>試し: <a href="/api/lookup?key=FR%7CBL,BR,FL%7Cc5t0%7Ce10f1">F2L 37 の状態を引く</a></p>');
});
const port = process.env.PORT || 8080;
server.listen(port, () => console.log('listening on ' + port + ' / DB ' + nKeys + ' keys'));
