import * as API_ROUTES from './config'
import {makeUrl, makeHeaders} from './helpers'

export const SIGNIN_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_SIGNIN])
export const SELF_USER_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_SELF])
export const TEACHERS_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_TEACHERS])
export const GROUPS_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_GROUPS])
export const SUBJECTS_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_SUBJECTS])
export const STUDENTS_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_STUDENTS])
export const CHATS_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_CHATS])
export const SEMESTERS_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_SEMESTERS])
export const LESSONS_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_LESSONS])
export const ACTIVITIES_URL = makeUrl(API_ROUTES.API_BASE_URL, [API_ROUTES.API_PATH, API_ROUTES.API_ACTIVITIES])
