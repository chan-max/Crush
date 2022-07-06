export declare function useDate(value?: number | string): any;
export declare function useDate(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): any;
export declare const enum DateFormatter {
    YEAR = "YYYY",
    YEAR_3D = "YYY",
    YEAR_2D = "YY",
    YEAR_1D = "Y",
    MONTH = "M",
    MONTH_2D = "MM",
    MONTH_SHORT_NAME = "MMM",
    MONTH_FULL_NAME = "MMMM",
    DATE = "D",
    DATE_2D = "DD",
    HOUR_24 = "H",
    HOUR_24_2D = "HH",
    HOUR_12 = "h",
    HOUR_12_2D = "hh",
    MINUTE = "m",
    MINUTE_2D = "mm",
    SECOND = "s",
    SECOND_2D = "ss",
    MILLISECOND_100 = "S",
    MILLISECOND_10 = "SS",
    MILLISECOND = "SSS",
    AM_PM_UPPERCASE = "A",
    AM_PM_LOWERCASE = "a",
    WEEKDAY = "W",
    WEEKDAY_FULL_NAME = "WWW",
    WEEKDAY_SHORT_NAME = "WW"
}
export declare const dateFormatRE: RegExp;
