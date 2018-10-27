/**
 * The questions to ask during the install process.
 */
const questions = [
  {
    name: 'organization',
    message: 'What kind of package are you going to generate?',
    type: 'list',
    choices: ['txo', 'txo-peer-dep']
  },
]

module.exports = {
  questions,
}
