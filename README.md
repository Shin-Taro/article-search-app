# Qiitaの記事検索アプリ
QiitaAPIv2を利用した記事検索アプリです。  
React開発の個人練習用として作りました。
## Feature
* ユーザーログイン機能(Googleログイン or 匿名ログイン)
  * 匿名ログインでも全機能利用可能
* キーワード検索でQiitaの記事を一覧表示
* 検索キーワードをpresetとして保存可能
## Main specifications
* フロントはReactでSPAとして開発
* firebaseでHosting
* 認証はfirebase Authentication
* ユーザー情報、ユーザーごとのpreset情報はfirestoreにて管理
## Deploying
<https://react-customizeqiita-pwa.web.app/>
## Note
v1.0 レスポンシブ非対応
