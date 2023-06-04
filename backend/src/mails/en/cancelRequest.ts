import { type Mail } from '..'

const cancelRequest: Mail = {
  subject: () => 'Information on cancellation procedures',
  // @ts-ignore
  bodyText: ({ name, cancelUrl }) => `Dear ${name}
Thank you for using our service.
Please cancel your subscription from the following URL.

${cancelUrl}
`,
}

export { cancelRequest }
