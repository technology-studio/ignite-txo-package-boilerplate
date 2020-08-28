/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2020-08-12T13:08:91+02:00
 * @Copyright: Technology Studio
 * @flow
**/

exports.templates = [
  { template: '__tests__/Setup.ts.ejs', target: '__tests__/Setup.ts' },
  { template: '.gitignore.ejs', target: '.gitignore' },
  { template: 'package.json.ejs', target: 'package.json' },
  { template: 'README.md.ejs', target: 'README.md' }
]

exports.getPackageTemplates = (packageRelativePath) => [
  { template: 'packages/index.ts.ejs', target: `${packageRelativePath}/src/index.ts` },
  { template: 'packages/.yarnrc.ejs', target: `${packageRelativePath}/.yarnrc` },
  { template: 'packages/.npmignore.ejs', target: `${packageRelativePath}/.npmignore` },
  { template: 'packages/package.json.ejs', target: `${packageRelativePath}/package.json` },
  { template: 'packages/tsconfig.json', target: `${packageRelativePath}/tsconfig.json` },
]