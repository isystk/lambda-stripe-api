import { type Mail } from '..'

const midtermCancel: Mail = {
  subject: () => 'Notification of Completion of Cancellation Procedures',
  // @ts-ignore
  bodyText: ({ name }) => `Dear ${name}
We are pleased to inform you that we have completed the cancellation procedure.
We look forward to serving you again.
`,
}

export { midtermCancel }
