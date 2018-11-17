# @allex/base64

Lightweight performance optimized base64 library by Allex

## Usage

```sh
yarn add @allex/base64 -D
```

```js
import { encode, decode } from '@allex/base64'

describe('base64 encode/decode', () => {
  test('B64.encode() with string', () => {
    expect(encode('allex')).toBe('YWxsZXg=');
    expect(decode('YWxsZXg=')).toBe('allex');
  });
  test('encode() with urlSafe output', () => {
    expect(encode('allex', true)).toBe('YWxsZXg');
    expect(decode('YWxsZXg')).toBe('allex');
  })
});
```

## License

[MIT](http://opensource.org/licenses/MIT)
