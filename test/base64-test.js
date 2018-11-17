const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const B64 = require('../');

describe('base64 encode/decode', () => {
  test('B64.encode() with string', () => {
    expect(B64.encode('allex')).toBe('YWxsZXg=');
    expect(B64.decode('YWxsZXg=')).toBe('allex');
  });
  test('B64.encode() with urlSafe output', () => {
    expect(B64.encode('allex', true)).toBe('YWxsZXg');
    expect(B64.decode('YWxsZXg')).toBe('allex');
  })
});
