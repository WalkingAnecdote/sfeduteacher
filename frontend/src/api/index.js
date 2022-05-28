import * as API_ROUTES from './config'
import {makeUrl, makeHeaders} from './helpers'

export const SIGNIN_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_SIGNIN])
export const SELF_USER_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_SELF])
