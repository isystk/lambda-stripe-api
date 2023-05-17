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

  /* 認証 */
  Login: [ENDPOINT_URL, '/login'].join(''),
  LoginCheck: [ENDPOINT_URL, '/login-check'].join(''),
  Logout: [ENDPOINT_URL, '/logout'].join(''),
}
