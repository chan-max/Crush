import {
    createI18n,
} from 'vue-i18n'
import messages from './index'

const language = (navigator.language || 'zh').toLowerCase()

const i18n = createI18n({
    fallbackFormat: 'en',
    globalInjection: true,
    legacy: false,
    literals: true,
    // locale: language.split('-')[0] || 'zh',
    locale: 'en',
    messages,
})

export default i18n