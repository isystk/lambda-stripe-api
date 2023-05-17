🌙 stripe-subscription-api
====

![GitHub issues](https://img.shields.io/github/issues/isystk/stripe-subscription-api)
![GitHub forks](https://img.shields.io/github/forks/isystk/stripe-subscription-api)
![GitHub stars](https://img.shields.io/github/stars/isystk/stripe-subscription-api)
![GitHub license](https://img.shields.io/github/license/isystk/stripe-subscription-api)

## 📗 プロジェクトの概要

Lambda(Node.js)でStripeのサブスクリプションを利用する為のサンプルアプリケーションです。
API経由でサブスクリプションの登録・解約・契約中かどうかの判別をすることが出来ます。
SAM を利用しているので、コマンドひとつでAWSに反映出来るようにしています。
また、ローカル環境では、Dockerを利用することで模擬的な環境を再現しています。
動作確認用に、サンプルのフロントアプリ（Next.js）も用意しました。

## 🌐 Demo

![デモ画面](./demo.png "デモ画面")

- ランディングページ
- 購入画面
- 解約画面

## 📦 ディレクトリ構造

```
.
├── README.md
├── backend（Lambda バックエンドモジュール）
│   ├── dist
│   ├── jest.config.ts
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   ├── tests
│   └── tsconfig.json
├── dc.sh（Docker起動用シェルスクリプト）
├── demo.png
├── docker（Docker）
│   ├── console 
│   ├── docker-compose.yml
│   └── dynamodb
├── frontend（Next.js フロントモジュール）
│   ├── jest.config.js
│   ├── next-env.d.ts
│   ├── next.config.js
│   ├── node_modules
│   ├── out
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   ├── src
│   ├── tailwind.config.js
│   ├── tsconfig.jest.json
│   └── yarn.lock
├── layers（Lambda用レイヤーモジュール）
│   └── app-layer
├── samconfig.toml
├── schema
│   ├── data
│   └── posts.json
├── task
│   └── env.json.example
└── template.yaml

```

## 🔧 事前準備

※ この環境を利用する為には、事前にdocker、docker-composeが動作する状態であることが前提条件です。
(Windowsの場合は、以下を参考に「WSL」と「Docker Desktop for Windows」を用意してください)

### WSLのインストール（Windowsの場合）
参考
https://docs.microsoft.com/ja-jp/windows/wsl/install

WSLでUbuntuを起動する
```
# 初回起動時に、ユーザ名とパスワードが聞かれます。
# 何も入力せずにEnterを押すとroot ユーザーで利用できるようになるので、rootユーザーとして設定します。

# 初めにライブラリを最新化します。
$ apt update

# 日本語に対応しておきます。
$ apt -y install language-pack-ja
$ update-locale LANG=ja_JP.UTF8
$ apt -y install manpages-ja manpages-ja-dev
```

### Docker Desktop for Windows のインストール（Windowsの場合）

https://docs.docker.com/docker-for-windows/install/
```
↓コマンドプロンプトでバージョンが表示されればOK
docker --version
```

### WSL2から、Docker for Windows を利用できるようにする（Windowsの場合）
参考
```
１．通知領域から、dockerのアイコンを右クリックして、Settingを選択
２．Generalの「Expose daemon on tcp://localhost:2375 without TLS」のチェックを入れます。
３．Resourcesの「WSL INTEGRATION」から、"Ubuntu" をスイッチをONにします。

WSL 側のルートを Docker for Windows に合わせるように WSL のマウント設定を行います。
$ vi /etc/wsl.conf
---
[automount]
root = /
options = "metadata"
---

以下のように Cドライブのパスが"/mnt/c/"→"/c/" に変更されていれば正常です。
$ cd /c/Users/USER/github/stripe-subscription-api
$ pwd
/c/Users/USER/github/stripe-subscription-api

# WSL 上にDockerとDocker Composeをインストールする。
$ apt install docker
$ apt install docker-compose

これでWSLからWindows側にインストールしたDockerが利用できるようになります。
```

## 💬 開発環境の構築

### 各種デーモンを起動する

```
# 初期化してDocker用のネットワークを作成する
$ ./dc.sh init
$ docker network create lambda-local

# Dockerの各種デーモンを起動する
$ ./dc.sh start
```

| デーモン | 概要  | URL |
|:-----|:-----|:-----|
| DynamoDB | AWSが提供するNoSQLデータベースサービスで、高可用性・可変性が特徴的なクラウドデータベースです | |
| DynamoDBAdmin | DynamoDBのWebベースの管理ツールで、データの可視化や簡単な操作が可能です          | http://localhost:8001/ |
| console | AWS-CLIコマンドが利用できます  | |
| mailhog  | ダミーのメールサーバーです。実際にはメールは送信されず、送信されたメールはブラウザで閲覧できます  | http://localhost:8025/  |


### バックエンド（Lambda）

```
# コンソールにログインする
$ ./dc.sh console login

# DynamoDBにテーブルを作成する
> aws dynamodb create-table --cli-input-json file://schema/posts.json --endpoint-url http://dynamodb:8000  --billing-mode PAY_PER_REQUEST
> aws dynamodb list-tables  --endpoint-url http://dynamodb:8000 

(テーブルを削除する場合)
> aws dynamodb delete-table --table-name stripe_subscription_api_posts --endpoint-url http://dynamodb:8000

$ cd backend
# Envファイルをコピーして必要に応じて変更する
$ cp .env.example .env
$ npm install
# ビルドして起動する
$ npm run build
$ npm run start

# 動作確認
# 製品(サブクスリプション)と含まれるプランの一覧を取得する
$ curl http://127.0.0.1:3000/product
$ curl "http://127.0.0.1:3000/product?productId=prod_xxxxx"

# 契約処理（サブスクリプションを作成します）
$ curl -X POST -H "Content-Type: application/json" http://127.0.0.1:3000/payment -d '{ "userKey": "12345" , "paymentMethod": "pm_xxxxxx", email": "test@test.com", "planId": "price_xxxxx" }'
# アクティブチェック（サブスクリプションが有効かどうかを確認します）
$ curl -X POST -H "Content-Type: application/json" http://127.0.0.1:3000/active-check -d '{ "productId": "prod_xxxxxx" , "userKey": "12345" }'
# 解約リクエスト（解約ページのURLをメールで送信します） 
$ curl -X POST -H "Content-Type: application/json" http://127.0.0.1:3000/cancel-request -d '{ "productId": "prod_xxxxxx" ,"email": "test@test.com" }'
# 解約処理（サブスクリプションを解約します） 
$ curl -X POST -H "Content-Type: application/json" http://127.0.0.1:3000/cancel -d '{ "productId": "prod_xxxxxx" ,"cancelToken": "xxxxxxxxxx" }'
```

### フロントエンド（Next.js）

```
$ cd frontend
# Envファイルをコピーして必要に応じて変更する
$ cp .env.example .env

$ npm install
# ビルドして起動する
$ npm run dev

# テストの実行
$ npm run test

# コードチェック
$ npm run fix

# Storybookの起動
$ npm run storybook
```


## 🖊️ SAM-CLIの使い方

事前準備
```
# SAM CLI をインストールする
$ pip install aws-sam-cli

# ESModuleでビルドできるようにする
$ npm install -g esbuild

# AWSコンソールから、IAM ユーザーを用意してください。
----
ユーザ名：「lambda-user」
アクセス権限：
「AdministratorAccess」
----

# AWSにアクセスする為の設定を作成する
$ aws configure --profile lambda-user
AWS Access Key ID [None]: xxxxxxxxxx
AWS Secret Access Key [None]: xxxxxxxxxx
Default region name [None]: ap-northeast-1
Default output format [None]: json
```

SAMを利用してローカルでAPIを起動する
```
# ビルドを実行する（.aws-samディレクトリに生成される）
$ sam build
$ sam local start-api --env-vars task/env.json --docker-network lambda-local
```

本番環境（AWS） にデプロイする
```
# AWSに反映する
$ sam deploy --config-env stg

# （AWSから削除する場合）
$ sam delete --stack-name stripe-subscription-api --profile lambda-user
```


## 🎨 参考

| プロジェクト                                              | 概要                         |
|:----------------------------------------------------|:---------------------------|
| [Stripe API reference](https://stripe.com/docs/api) | Stripe の API reference です  |
| [Next.js - Docs](https://nextjs.org/docs)           | Next.js の 公式ドキュメント です      |
| [Tailwind CSS - Docs](https://tailwindcss.com/docs) | Tailwind CSS の 公式ドキュメント です |


## 🎫 Licence

[MIT](https://github.com/isystk/stripe-subscription-api/blob/master/LICENSE)

## 👀 Author

[isystk](https://github.com/isystk)
