import { type Mail } from '..'

const payment: Mail = {
  subject: () => 'Thank you for registering',
  // @ts-ignore
  bodyText: ({ name, currentPeriodEnd }) => `${name} sir
Thank you very much for your interest in our services.
Your membership registration has been completed.
----
Current expiration date： ～${currentPeriodEnd}
----
Your membership will automatically renew each month until cancelled, 
and you will be billed for the membership fee on the monthly renewal date.
`,
}

export { payment }
