import { type Mail } from '..'

const payment: Mail = {
  subject: () => 'ご登録ありがとうございます',
  // @ts-ignore
  bodyText: ({ name, currentPeriodEnd }) => `${name}様
この度は、ご利用いただき、誠にありがとうございます。
会員登録が完了しました。
----
現在の有効期限： ～${currentPeriodEnd}
----
お客様の会員資格はキャンセルされるまで毎月自動で更新し、毎月更新日に会費が請求されます。
`,
}

export { payment }
