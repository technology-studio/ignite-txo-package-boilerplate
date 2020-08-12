/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2020-08-12T13:08:91+02:00
 * @Copyright: Technology Studio
 * @flow
**/

export const templates = [
  { template: '.gitignore.ejs', target: '.gitignore' },
  { template: 'package.json.ejs', target: 'package.json' },
  { template: 'README.md.ejs', target: 'README.md' }
]

export const getPackageTemplates = (packageRelativePath) => [
  { template: 'packages/index.ts.ejs', target: `${packageRelativePath}/src/index.ts` },
  { template: 'packages/.yarnrc.ejs', target: `${packageRelativePath}/.yarnrc` },
  { template: 'packages/.npmignore.ejs', target: `${packageRelativePath}/.npmignore` },
  { template: 'packages/package.json.ejs', target: `${packageRelativePath}/package.json` },
  { template: 'packages/index.d.ts.ejs', target: `${packageRelativePath}/index.d.ts` },
]