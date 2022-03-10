import { getCurrentInstance } from '@vue/runtime-core'

enum language {
    chinese = 'zh',
    english = 'en',
  }

export {
    language
}

export function useLanguage() {
    const { proxy }: any = getCurrentInstance()

    function changeLanguage(type: language) {
        proxy.$i18n.locale = type
        localStorage.setItem('crush-docs-language',type)
    }

    return {
        changeLanguage,
        language,
    }
}
