const opts = {
  lib: {
    colors: require('colors'),
    commander: require('commander'),
    prompt: require('prompt'),
    fs: require('fs'),
    path: require('path'),
    breeze: require('breeze')
  },
  pkg: require('../package.json'),
  helpers: {
    log: require('../helpers/log'),
    getGitRepo: require('../helpers/getGitRepo'),
    defaults: require('../helpers/defaults'),
    info: '[TrustOSS]'.green,
    warn: '[TrustOSS]'.yellow,
    danger: '[TrustOSS]'.red
  }
}
const lib = opts.lib
const helpers = opts.helpers

module.exports = function trustOSSlint (lintOpts) {
  const log = opts.helpers.log

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger

  log(info, 'Linting Repo')

  let flow = opts.lib.breeze()

  flow.then(next => next(checkDotFile(lintOpts, opts)))

  flow.when(results => results, (next, results) => next(dotfilePresent(results, opts)))

  flow.when(results => !results, (next, results) => next(dotfileAbsent(results, opts)))

  flow.then((next, results) => next(checkFiles(results, opts)))

  flow.then((next, results) => next(checkTags(results, opts)))

  flow.catch(() => {
    log(danger, arguments)
  })
}

function checkDotFile (data, opts) {
  const fs = opts.lib.fs
  const path = opts.lib.path

  const log = opts.helpers.log

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger
  return new Promise((resolve, reject) => {
    log(info, 'Checking Dotfile in', process.cwd())
    let docRoot = path.resolve(process.cwd(), './docs.json')
    log(info, docRoot)
    try {
      stats = fs.lstatSync(docRoot)
      if (!stats.isFile()) {
        throw new Error(docRoot + ' is not a file!')
      }
      fs.readFile(docRoot, 'utf8', (err, data) => {
        if (err) throw err
        log(info, data)
        let dotfile = JSON.parse(data)
        resolve(dotfile)
      })
    } catch (e) {
      log(warn, e)
      reject(false)
    }
  })
}
function dotfilePresent (data, opts) {
  const log = opts.helpers.log

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger
  return new Promise((resolve, reject) => {
    log(warn, 'Dotfile Present')
    resolve(data)
  })
}
function dotfileAbsent (data, opts) {
  const log = opts.helpers.log

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger
  return new Promise((resolve, reject) => {
    log(danger, 'Dotfile absent')
    var dotfile = helpers.defaults({}, opts)
    if (dotfile.assets === 'yes') {
      dotfile.assets = './.assets'
    } else {
      delete dotfile.assets
    }
    if (dotfile.governance === 'yes') {
      dotfile.governance = './.governance'
    } else {
      delete dotfile.governance
    }
    if (dotfile.civic === 'yes') {
      dotfile.civic = '../civic.json'
    } else {
      delete dotfile.civic
    }
    dotfile.contributing_location = 'CONTRIBUTING.md'
    dotfile.license_location = 'LICENSE.md'
    dotfile.changelog_location = 'CHANGELOG.md'
    dotfile.coc_location = 'CODEOFCONDUCT.md'
    dotfile.readme_location = '../README.md'
    resolve(dotfile)
  })
}
function checkFiles (data, opts) {
  const log = opts.helpers.log

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger
  log(info, 'Checking if files exist', data)
  const fileChecks = []

  const dataKeys = Object.keys(data)
  for (let i = 0; i < dataKeys.length; i++) {
    const thisKey = dataKeys[i]
    if (thisKey.indexOf('_location') < 0) continue
    fileChecks.push(checkFile(data.docroot, thisKey, data[thisKey], opts))
  }
  console.log(fileChecks)
  return Promise.all(fileChecks)
}
function checkFile (docRoot, docKey, filePath, opts) {
  const log = opts.helpers.log
  const lib = opts.lib
  const path = lib.path
  const fs = lib.fs

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger

  return new Promise((resolve, reject) => {
    const documentPath = path.resolve(lib.path.resolve(process.cwd(), docRoot), filePath)
    try {
      const stats = fs.lstatSync(documentPath)
      if (!stats.isFile()) {
        throw new Error(documentPath + ' is not a file!')
      }
      fs.readFile(documentPath, 'utf8', (err, data) => {
        if (err) throw err
        resolve(Object.assign({}, stats, {
          fileType: docKey.split('_')[0],
          contents:data
        }))
      })
    } catch (e) {
      log(warn, e)
      reject(false)
    }
  })
}

function checkTags (documents, opts) {
  const log = opts.helpers.log

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger

  log(info, documents)
  log(info, 'Scanning tags')
  log(info, 'comparing tag timestamp to last updated changelog')
  log(info, 'checking the rest of the files present')
}
