import express from 'express'
import { checkAuth } from '../utils/session'
import { product } from '../actions/product/product'
import { payment } from '../actions/product/payment'
import { cancelRequest } from '../actions/product/cancelRequest'
import { cancelConfirm } from '../actions/product/cancelConfirm'
import { cancel } from '../actions/product/cancel'
import { activeCheck } from '../actions/product/activeCheck'
import { subscriber } from '../actions/product/subscriber'
import { subscriberTrend } from '../actions/product/subscriberTrend'
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
router.post('/subscriber', checkAuth, subscriber)
router.post('/subscriberTrend', checkAuth, subscriberTrend)

export { router }
