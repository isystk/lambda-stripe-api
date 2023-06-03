import express from 'express'
import { checkAuth } from '../utils/session'
import { product } from '../actions/product/product'
import { payment } from '../actions/product/payment'
import { cancelRequest } from '../actions/product/cancelRequest'
import { cancelConfirm } from '../actions/product/cancelConfirm'
import { cancel } from '../actions/product/cancel'
import { activeCheck } from '../actions/product/activeCheck'
import { subscriber } from '../actions/admin/subscriber'
import { subscriberTrend } from '../actions/admin/subscriberTrend'
import { adminCancel } from '../actions/admin/cancel'
import { login } from '../actions/auth/login'
import { loginCheck } from '../actions/auth/loginCheck'
import { logout } from '../actions/auth/logout'

const router = express.Router()

/* Public */
router.get('/product', product)
router.post('/payment', payment)
router.post('/cancel-request', cancelRequest)
router.post('/cancel-confirm', cancelConfirm)
router.post('/cancel', cancel)
router.post('/active-check', activeCheck)

/* Auth */
router.post('/login', login)
router.post('/login-check', loginCheck)
router.post('/logout', logout)

/* Private */
router.post('/admin/subscriber', checkAuth, subscriber)
router.post('/admin/subscriberTrend', checkAuth, subscriberTrend)
router.post('/admin/cancel', checkAuth, adminCancel)

export { router }
