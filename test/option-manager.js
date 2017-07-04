import OptionManager from '../src/option-manager'
import test from 'ava'
import path from 'path'

function resolve (...paths) {
  return path.join(__dirname, ...paths)
}

const CASES = [
{
  d: 'normal rc file, prior to .ngxrc',
  // cwd
  c: resolve('rc'),
  // options
  o: {},
  // expect
  e: {
    src: resolve('rc', 'foo'),
    dest: resolve('rc', 'bar'),
    preset: resolve('rc', 'baz'),
    entry: 'qux'
  },
  // error
  err: false,
  only: false
},
{
  d: '.ngxrc.js file',
  c: resolve('rcjs'),
  o: {
    env: 'production'
  },
  e: {
    src: resolve('rcjs', 'foo'),
    dest: resolve('rcjs', 'bar'),
    preset: resolve('rcjs', 'baz'),
    entry: 'qux'
  }
},
{
  d: 'package.json ngx field',
  c: resolve('pkg'),
  o: {
    env: 'production'
  },
  e: {
    src: resolve('pkg', 'foo'),
    dest: resolve('pkg', 'bar'),
    preset: resolve('pkg', 'baz'),
    entry: 'qux'
  }
},
{
  d: 'rc not found',
  c: resolve('nowhere'),
  err: '.ngxrc not found'
}
]


CASES.forEach(({
  d,
  c,
  o,
  e,
  err,
  only
}) => {

  const _test = only
    ? test.only
    : test

  _test(d, async t => {
    let result
    try {
      result = await new OptionManager({
        cwd: c,
        options: o
      }).get()

    } catch (e) {
      if (!err) {
        console.error('fail', e.stack || e)
        t.fail('should not fail')
        return
      }

      t.is(e.message, err, 'error message not matched')
      return
    }

    if (err) {
      t.fail('should fail')
    }

    t.deepEqual(result, e, 'result not match')
  })
})
