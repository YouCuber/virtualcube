# サーバー分離の試験（Cloud Run・無料枠）

F2LアナライザのDBをサーバー側にだけ置き、答えだけを返す試験一式（2026-11-15）。

## 中身
- `server.js` — Node標準機能だけの小さなサーバー。DB（db-fr.json、2,056件）を読み込んで待つ。
  - `GET /` 試験ページ
  - `GET /api/lookup?key=<状態キー>` その状態の候補だけをJSONで返す（DB全体は外に出ない）
  - `GET /health` 生存確認
- `Dockerfile` — コンテナの設計図（node:20-slim + 上記2ファイル）。
- ローカル確認済み（ボクのVMで node 実行 → lookup が F2L 37 の候補を返した）。

## 置く手順（あっぱーのGoogleアカウントで）
1. Google Cloud でプロジェクトを作り、課金を有効にする（無料枠内でも登録は必要）。
2. このフォルダで:
   `gcloud run deploy f2l-test --source . --region asia-northeast1 --allow-unauthenticated`
   （--source 方式ならコンテナはGoogle側で組み立てられるので、手元のDockerは不要）
3. 表示されたURL（*.run.app）を開くと試験ページが出る。

## 次の段階（まだ作っていない）
- 検索もサーバー側に置く
- Googleログイン＋メンバー一覧との照合（門番）
- 予算アラート設定
