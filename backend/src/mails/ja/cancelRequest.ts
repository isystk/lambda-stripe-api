import { type Mail } from '..'

const cancelRequest: Mail = {
  subject: () => '解約手続きのご案内',
  // @ts-ignore
  bodyText: ({ name, cancelUrl }) => `${name}様
いつもご利用頂きありがとうございます。
お手数ですが以下のURLからご契約のプランの解約手続きをお願い致します。

${cancelUrl}
`,
}

export { cancelRequest }
