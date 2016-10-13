export default function buildDefaultConfig (opts) {
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
