/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2020-08-12T13:08:91+02:00
 * @Copyright: Technology Studio
 * @flow
**/

export const templates = [
  { template: '__tests__/Setup.js.ejs', target: '__tests__/Setup.js' },
  { template: '.gitignore.ejs', target: '.gitignore' },
  { template: 'package.json.ejs', target: 'package.json' },
  { template: 'README.md.ejs', target: 'README.md' }
]

export const getPackageTemplates = (packageRelativePath) => [
  { template: 'packages/root-index.js.ejs', target: `${packageRelativePath}/index.js` },
  { template: 'packages/index.js.ejs', target: `${packageRelativePath}/src/index.js` },
  { template: 'packages/.yarnrc.ejs', target: `${packageRelativePath}/.yarnrc` },
  { template: 'packages/.npmignore.ejs', target: `${packageRelativePath}/.npmignore` },
  { template: 'packages/package.json.ejs', target: `${packageRelativePath}/package.json` },
  { template: 'packages/index.d.ts.ejs', target: `${packageRelativePath}/index.d.ts` },
]