import { type Mail } from '..'

const cancel: Mail = {
  subject: () => '解約手続き完了のお知らせ',
  // @ts-ignore
  bodyText: ({ name }) => `${name}様
解約手続きが完了しましたのでご案内申し上げます。
期間満了までは引き続きご利用頂けます。
またのご利用をお待ちしております。
`,
}

export { cancel }
