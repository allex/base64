/*
 * Encapsulation of Allex's base64.js library for std base64 and urlsafe-base64
 *
 * @author Allex Wang
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('')
const charCode = String.fromCharCode

// alphabet dic (lazy init)
let alphabetDic = null

const toUtf8 = s => {
  let position = -1
  const len = s.length
  let chr
  const buffer = []
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7f]*$/.test(s)) {
    while (++position < len) buffer.push(s.charCodeAt(position))
  } else {
    while (++position < len) {
      chr = s.charCodeAt(position)
      if (chr < 128) buffer.push(chr)
      else if (chr < 2048) buffer.push((chr >> 6) | 192, (chr & 63) | 128)
      else buffer.push((chr >> 12) | 224, ((chr >> 6) & 63) | 128, (chr & 63) | 128)
    }
  }
  return buffer
}

const fromUtf8 = s => {
  const buffer = []
  const enc = new Array(4)
  let position = -1
  let len
  if (!alphabetDic) {
    len = alphabet.length
    alphabetDic = {}
    while (++position < len) alphabetDic[alphabet[position]] = position
    position = -1
  }
  len = s.length
  while (++position < len) {
    enc[0] = alphabetDic[s.charAt(position)]
    enc[1] = alphabetDic[s.charAt(++position)]
    buffer.push((enc[0] << 2) | (enc[1] >> 4))
    enc[2] = alphabetDic[s.charAt(++position)]
    if (enc[2] === 64) break
    buffer.push(((enc[1] & 15) << 4) | (enc[2] >> 2))
    enc[3] = alphabetDic[s.charAt(++position)]
    if (enc[3] === 64) break
    buffer.push(((enc[2] & 3) << 6) | enc[3])
  }
  return buffer
}

const _encode = s => {
  const buffer = toUtf8(s)
  const len = buffer.length
  let nan0
  let nan1
  let nan2
  const enc = new Array(4)
  let result = ''
  let position = -1
  while (++position < len) {
    nan0 = buffer[position]
    nan1 = buffer[++position]
    enc[0] = nan0 >> 2
    enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4)
    if (isNaN(nan1)) enc[2] = enc[3] = 64
    else {
      nan2 = buffer[++position]
      enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6)
      enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63
    }
    result += alphabet[enc[0]] + alphabet[enc[1]] + alphabet[enc[2]] + alphabet[enc[3]]
  }
  return result
}

const _decode = s => {
  s = s.replace(/\s/g, '')

  if (s.length % 4) throw new Error('InvalidLengthError: decode failed: The string to be decoded is not the correct length for a base64 encoded string.')
  if (/[^A-Za-z0-9+/=\s]/g.test(s)) throw new Error('InvalidCharacterError: decode failed: The string contains characters invalid in a base64 encoded string.')

  const buffer = fromUtf8(s)
  const len = buffer.length

  let position = 0
  let result = ''

  while (position < len) {
    if (buffer[position] < 128) result += charCode(buffer[position++])
    else if (buffer[position] > 191 && buffer[position] < 224) result += charCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63))
    else result += charCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63))
  }
  return result
}

const encode = (u, urisafe) => {
  return !urisafe
    ? _encode(String(u))
    : _encode(String(u))
      .replace(/[+\/]/g, m0 => (m0 === '+' ? '-' : '_'))
      .replace(/=/g, '')
}

const encodeURI = u => encode(u, true)

const decode = a => {
  a = String(a)
  // Pad out with standard base64 required padding characters
  const pad = a.length % 4
  if (pad) {
    a += Array(5 - pad).join('=')
  }
  return _decode(
    a.replace(/[-_]/g, m0 => (m0 === '-' ? '+' : '/'))
      .replace(/[^A-Za-z0-9=\+\/]/g, '')
  )
}

export {
  encode,
  decode,
  encodeURI,
  toUtf8,
  fromUtf8,
}
