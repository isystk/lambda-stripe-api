🌙 stripe-subscription-api
====

![GitHub issues](https://img.shields.io/github/issues/isystk/stripe-subscription-api)
![GitHub forks](https://img.shields.io/github/forks/isystk/stripe-subscription-api)
![GitHub stars](https://img.shields.io/github/stars/isystk/stripe-subscription-api)
![GitHub license](https://img.shields.io/github/license/isystk/stripe-subscription-api)

## 📗 プロジェクトの概要

Lambda(Node.js)でStripeのサブスクリプションを管理する為のサンプルです。
API経由でサブスクリプションの登録・解約・契約中かどうかの判別が出来ます。
SAM を利用して管理しているので、コマンドひとつでインフラを構築出来るようにしています。
また、Dockerを利用することでローカル環境でも実装・テストが出来るようにしています。

## 🌐 Demo

![デモ画面](./demo.png "デモ画面")

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
│   ├── awscli
│   ├── docker-compose.yml
│   └── dynamodb
├── dynamodb-admin.png
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

## 🔧 開発環境の構築

IAM ユーザーを用意する
```
ユーザ名：「lambda-user」
アクセス権限：
「AdministratorAccess」
```

SAM CLI をインストールする
```
$ pip install aws-sam-cli
```

AWSにアクセスする為の設定を作成する
```
$ aws configure --profile lambda-user 
AWS Access Key ID [None]: xxxxxxxxxx
AWS Secret Access Key [None]: xxxxxxxxxx
Default region name [None]: ap-northeast-1
Default output format [None]: json
```

## 🖊️ Docker 操作用シェルスクリプトの使い方

```
Usage:
  dc.sh [command] [<options>]

Options:
  stats|st                 Dockerコンテナの状態を表示します。
  init                     Dockerコンテナ・イメージ・生成ファイルの状態を初期化します。
  start                    すべてのDaemonを起動します。
  stop                     すべてのDaemonを停止します。
  --version, -v     バージョンを表示します。
  --help, -h        ヘルプを表示します。
```

## 💬 使い方

### バックエンド（Lambda）

ローカルでAPIを起動する
```
# 事前準備
$ ./dc.sh init
$ docker network create lambda-local

# Dockerを起動する
$ ./dc.sh start

# DynamoDBにテーブルを作成する
$ ./dc.sh aws local
> aws dynamodb create-table --cli-input-json file://schema/posts.json --endpoint-url http://dynamodb:8000  --billing-mode PAY_PER_REQUEST
> aws dynamodb list-tables  --endpoint-url http://dynamodb:8000 

(テーブルを削除する場合)
> aws dynamodb delete-table --table-name stripe_subscription_api_posts --endpoint-url http://dynamodb:8000

# ESModuleでビルドできるようにする
$ npm install -g esbuild 
# SAMでアプリをビルドしてからAPIを起動する
$ sam build
$ sam local start-api --env-vars task/env.json --docker-network lambda-local

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

本番環境（AWS） にデプロイする
```
# ビルドを実行する（.aws-samディレクトリに生成される）
$ sam build
# AWSに反映する
$ sam deploy --config-env stg

# AWSから、DynamoDB、Lambda&APIGatewayを削除する
$ sam delete --stack-name stripe-subscription-api --profile lambda-user
```
### フロントエンド（Next.js）

```
$ cd frontend

# アプリを起動
$ npm install
$ npm run dev

# テストの実行
$ npm run test

# コードチェック
$ npm run fix

# Storybookの起動
$ npm run storybook
```

### DynamoDBAdmin
DynamoDBに接続してデータの参照や編集が可能です。
Dockerを起動後に以下のURLにアクセスすると利用可能です。

http://localhost:8001/


### mailhog
ダミーのメールサーバーです。実際にはメールは送信されず、送信されたメールはブラウザで閲覧できます。
Dockerを起動後に以下のURLにアクセスすると利用可能です。

http://localhost:8025/

## 🎨 参考

| プロジェクト| 概要|
| :---------------------------------------| :-------------------------------|
| [AWS SAM CLI 再入門 2021.08](https://qiita.com/hayao_k/items/7827c3778a23c514e196)| AWS SAM CLI 再入門 2021.08|
| [aws-sam-cliでLambda,DynamoDBのサーバーレスアプリケーション開発に入門してみる](https://qiita.com/umeneri/items/6fb3f7560f4a878f6dfd)| aws-sam-cliでLambda,DynamoDBのサーバーレスアプリケーション開発に入門してみる |
| [Lambda Layers をnode.js(SAM)で試してみる](https://qiita.com/monamu/items/96d63dd2151a8ab7e6cf)| Lambda Layers をnode.js(SAM)で試してみる |
| [serverless-expressでAPI GatewayからLambdaを実行する](https://zenn.dev/yuta_saito/articles/8b543a1957c375593ee5)| serverless-expressでAPI GatewayからLambdaを実行する |


## 🎫 Licence

[MIT](https://github.com/isystk/stripe-subscription-api/blob/master/LICENSE)

## 👀 Author

[isystk](https://github.com/isystk)
