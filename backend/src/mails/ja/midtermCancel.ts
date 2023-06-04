import { type Mail } from '..'

const midtermCancel: Mail = {
  subject: () => '解約手続き完了のお知らせ',
  // @ts-ignore
  bodyText: ({ name }) => `${name}様
解約手続きが完了しましたのでご案内申し上げます。
またのご利用をお待ちしております。
`,
}

export { midtermCancel }
