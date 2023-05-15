import { ENDPOINT_URL } from './index'

/**
 * BFF（バックエンドフォーフロントエンド）用の URL を作成する
 */

/** API のエンドポイント */
export const Api = {
  Product: [ENDPOINT_URL, '/product'].join(''),
  Payment: [ENDPOINT_URL, '/payment'].join(''),
  CancelRequest: [ENDPOINT_URL, '/cancel-request'].join(''),
  CancelConfirm: [ENDPOINT_URL, '/cancel-confirm'].join(''),
  Cancel: [ENDPOINT_URL, '/cancel'].join(''),
}
