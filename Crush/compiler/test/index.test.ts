
import {
    typeOf
} from '../../common/dataType'



test('dataType', () => {
    expect(typeOf([])).toBe('array');
})