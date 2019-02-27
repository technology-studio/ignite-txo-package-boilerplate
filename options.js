/**
 * The questions to ask during the install process.
 */
const questions = [
  {
    name: 'access',
    message: 'How should a package be published? (access)',
    type: 'list',
    choices: ['public', 'private']
  },
  {
    name: 'repository',
    message: 'What repository should be used? (repository)',
    type: 'list',
    choices: ['https://github.com/technology-studio/', 'https://bitbucket.org/technology-studio/']
  },
  {
    name: 'react',
    message: 'Does package use react? (react)',
    type: 'confirm'
  }
]

const registryQuestion = {
  name: 'registry',
  message: 'What registry should be used? (registry)',
  type: 'input'
}

module.exports = {
  questions,
  registryQuestion,
}
