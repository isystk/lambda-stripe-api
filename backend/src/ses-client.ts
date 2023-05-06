import AWS from 'aws-sdk'

const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS ?? ''

class SesClient {
  private ses
  constructor() {
    AWS.config.update({ region: 'ap-northeast-1' })
    this.ses = new AWS.SES({ apiVersion: '2010-12-01' })
  }

  async mailSend(
    fromEmail: string = MAIL_FROM_ADDRESS,
    toEmail: string,
    subject: string,
    bodyText: string
  ) {
    const params = {
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Body: {
          Text: {
            Data: bodyText,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: fromEmail,
    }

    const result = await this.ses.sendEmail(params).promise()
    console.log(result)
  }
}

export { SesClient }
