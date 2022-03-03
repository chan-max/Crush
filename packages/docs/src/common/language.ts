import { getCurrentInstance } from '@vue/runtime-core'

enum language {
    chinese = 'zh',
    english = 'en',
  }

export function useLanguage() {
    const { proxy }: any = getCurrentInstance()
    function changeLanguage(type: language) {
        proxy.$i18n.locale = type
    }
    return {
        changeLanguage,
        language,
    }
}
