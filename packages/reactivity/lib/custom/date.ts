import { emptyObject, isUndefined } from "@crush/common"
import { Ref } from "../ref"


export function useDate(value?: number | string): any
export function useDate(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): any
export function useDate(...dateArgs: []) {
    return new DateRef(new Date(...dateArgs))
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
var quarter = ['spring', 'summer', 'autumn', 'winter']

class DateRef extends Ref {
    constructor(date: Date) {
        super(date, { sensitive: true })
    }

    clone() {
        return useDate(this._value) // _value 不会收集依赖
    }

    get(key: string) {
        return Reflect.get(this, key).call(this)
    }

    

    year(setYear?: number | string) {
        if (isUndefined(setYear)) {
            // getter
            return this.value.getFullYear()
        } else {
            // 不应该收集依赖
            this._value.setFullYear(Number(setYear))
            // use sensitive force trigger
            this.value = this.value
            return this
        }
    }

    month(setMonth?: number | string) {
        if (isUndefined(setMonth)) {
            // getter
            return this.value.getMonth() + 1
        } else {
            // 不应该收集依赖
            this._value.setMonth(Number(setMonth) - 1)
            // use sensitive force trigger
            this.value = this.value
            return this
        }
    }

    

    // monthday
    date(setDate?: number | string) {
        if (isUndefined(setDate)) {
            // getter
            return this.value.getDate()
        } else {
            // 不应该收集依赖
            this._value.setDate(Number(setDate))
            // use sensitive force trigger
            this.value = this.value
            return this
        }
    }

    // weekday
    day(setDay?: string | number) {
        if (isUndefined(setDay)) {
            // getter
            return this.value.getDay()
        } else {
            debugger
        }
    }

    hour(setHour?: string | number) {
        if (isUndefined(setHour)) {
            // getter
            return this.value.getHours()
        } else {
            // 不应该收集依赖
            this._value.setHours(Number(setHour))
            // use sensitive force trigger
            this.value = this.value
            return this
        }
    }

    minute(setMinutes?: string | number) {
        if (isUndefined(setMinutes)) {
            // getter
            return this.value.getMinutes()
        } else {
            // 不应该收集依赖
            this._value.setMinutes(Number(setMinutes))
            // use sensitive force trigger
            this.value = this.value
            return this
        }
    }

    second(setSecond?: string | number) {
        if (isUndefined(setSecond)) {
            // getter
            return this.value.getSeconds()
        } else {
            // 不应该收集依赖
            this._value.setSeconds(Number(setSecond))
            // use sensitive force trigger
            this.value = this.value
            return this
        }
    }

    milliSecond(setMilliseconds?: number | string) {
        if (isUndefined(setMilliseconds)) {
            // getter
            return this.value.getMilliseconds()
        } else {
            // 不应该收集依赖
            this._value.setMilliseconds(Number(setMilliseconds))
            // use sensitive force trigger
            this.value = this.value
            return this
        }
    }

    format(template: string, customKeywords: any = emptyObject) {
        let w = customKeywords.weekdays || weekdays
        let m = customKeywords.months || months
        return template.replace(dateFormatRE, (capture: string) => {
            switch (capture) {
                case DateFormatter.YEAR:
                    return this.year()
                case DateFormatter.YEAR_2D:
                    return String(this.year()).slice(2)
                case DateFormatter.MONTH:
                    return this.month()
                case DateFormatter.MONTH_2D:
                    return padZero(this.month())
                case DateFormatter.MONTH_SHORT_NAME:
                    return m[this.month() - 1].slice(0, 3)
                case DateFormatter.MONTH_FULL_NAME:
                    return m[this.month() - 1]
                case DateFormatter.DATE:
                    return this.date()
                case DateFormatter.DATE_2D:
                    return padZero(this.date())
                case DateFormatter.HOUR_12:
                    // 等于 12 应该是 12 点还是 0 点
                    var hour = this.hour()
                    return hour > 12 ? hour - 12 : hour
                case DateFormatter.HOUR_12_2D:
                    var hour = this.hour()
                    return padZero(hour > 12 ? hour - 12 : hour)
                case DateFormatter.HOUR_24:
                    return this.hour()
                case DateFormatter.HOUR_24_2D:
                    return padZero(this.hour())
                case DateFormatter.MINUTE:
                    return this.minute()
                case DateFormatter.MINUTE_2D:
                    return padZero(this.minute())
                case DateFormatter.SECOND:
                    return this.second()
                case DateFormatter.SECOND_2D:
                    return padZero(this.second())
                case DateFormatter.MILLISECOND:
                    return this.milliSecond()
                case DateFormatter.MILLISECOND_10:
                    return String(this.milliSecond()).slice(0, 2)
                case DateFormatter.MILLISECOND_100:
                    return String(this.milliSecond()).slice(0, 1)
                case DateFormatter.WEEKDAY:
                    return this.day()
                case DateFormatter.WEEKDAY_FULL_NAME:
                    return w[this.day()]
                case DateFormatter.WEEKDAY_SHORT_NAME:
                    return w[this.day()].slice(0, 3)
                default:
                    return '?'
            }
        })
    }
}




export const enum DateFormatter {
    YEAR = 'YYYY', // 2022
    YEAR_3D = 'YYY', // 022
    YEAR_2D = 'YY', // 22
    YEAR_1D = 'Y', // 2
    MONTH = 'M', // 1 ~ 12
    MONTH_2D = 'MM',
    MONTH_SHORT_NAME = 'MMM',
    MONTH_FULL_NAME = 'MMMM',
    DATE = 'D',
    DATE_2D = 'DD',
    HOUR_24 = 'H',
    HOUR_24_2D = 'HH',
    HOUR_12 = 'h',
    HOUR_12_2D = 'hh',
    MINUTE = 'm',
    MINUTE_2D = 'mm',
    SECOND = 's',
    SECOND_2D = 'ss',
    MILLISECOND_100 = 'S', // 取百位
    MILLISECOND_10 = 'SS', // 取百十位
    MILLISECOND = 'SSS', // 取个十百
    AM_PM_UPPERCASE = 'A',
    AM_PM_LOWERCASE = 'a',
    WEEKDAY = 'W',
    WEEKDAY_FULL_NAME = 'WWW',
    WEEKDAY_SHORT_NAME = 'WW'
}

export const dateFormatRE = /Y{1,4}|M{1,4}|D{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|S{1,3}|A|a|W{1,3}/g

function padZero(source: number | string, expectLength: number = 2) {
    // 期待长度一定要大于目标长度
    return '0'.repeat(expectLength - String(source).length) + source
}