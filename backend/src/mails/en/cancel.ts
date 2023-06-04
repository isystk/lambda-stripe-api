import { type Mail } from '..'

const cancel: Mail = {
  subject: () => 'Notification of Completion of Cancellation Procedures',
  // @ts-ignore
  bodyText: ({ name }) => `Dear ${name}
We are pleased to inform you that we have completed the cancellation procedure.
You can continue to use our service until the expiration of your term.
We look forward to serving you again.
`,
}

export { cancel }
