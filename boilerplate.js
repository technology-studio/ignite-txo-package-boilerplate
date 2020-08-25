/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-12-27T09:23:04+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

'use strict'; // eslint-disable-line

const options = require('./options')

/* function deepPrint (data, returnOutput) {
  var output = ''

  if (Array.isArray(data) || typeof data === 'object') {
    for (var i in data) {
      output += i + ' : ' + deepPrint(data[i], true) + '\n'
    }
  } else {
    output += data
  }
  if (returnOutput && returnOutput === true) {
    return output
  } else {
    console.log(output)
  }
} */

function getTechnologyStudioString () {
  return '' +
    ' _________________ ___  ______  __   ____  _______  __  ____________  _____  ________ \n' +
    '/_  __/ __/ ___/ // / |/ / __ \\/ /  / __ \\/ ___/\\ \\/ / / __/_  __/ / / / _ \\/  _/ __ \\\n' +
    ' / / / _// /__/ _  /    / /_/ / /__/ /_/ / (_ /  \\  / _\\ \\  / / / /_/ / // // // /_/ /\n' +
    '/_/ /___/\\___/_//_/_/|_/\\____/____/\\____/\\___/   /_/ /___/ /_/  \\____/____/___/\\____/ \n'
}

/**
 * Let's install.
 *
 * @param {any} context - The gluegun context.
 */
async function install (context) {
  const {
    filesystem,
    parameters,
    ignite,
    print,
    system,
    strings,
    prompt,
  } = context
  const { colors } = print
  const { red, yellow, bold, gray } = colors
  const { upperFirst, kebabCase } = strings

  const name = parameters.third
  var packageName = kebabCase(name)
  const fullname = upperFirst(packageName.replace(/-/g, ' '))

  const perfStart = (new Date()).getTime()

  // HACK:  we need to simulate react-native init, to prevent ignite cleanup our files
  filesystem.dir(name)
  process.chdir(name)
  // end of HACK

  const boilerplateVersion = filesystem.read(`${ignite.ignitePluginPath()}/package.json`, 'json').version

  print.info(gray(getTechnologyStudioString()))
  const spinner = print
    .spin(`using the ${gray(bold('TECHNOLOGY STUDIO'))} public package boilerplate v${boilerplateVersion}`)
    .succeed()

  const questions = options.questions.filter(({ name }) => !parameters.options[name] )

  const questionAnswers = await prompt.ask(questions)

  const answers = {
    ...parameters.options,
    ...questionAnswers
  }

  const registry = answers.access === 'private' && !parameters.options.registry
    ? await prompt.ask(options.registryQuestion)
    : parameters.options.registry


  const templateProps = {
    fullname,
    packageName,
    license: answers.access === 'public' ? 'MIT': 'UNLICENSED',
    registry,
    ...answers
  }

  const selectedLanguage = answers.language
  const boilerplatePath = `boilerplate/${selectedLanguage}`

  spinner.text = '▸ copying files'
  spinner.start()
  filesystem.copy(`${__dirname}/boilerplate/common`, `${process.cwd()}`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.copy(`${__dirname}/${boilerplatePath}`, `${process.cwd()}`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  spinner.stop()
  spinner.succeed(`files copied`)

  // generate some templates
  spinner.text = '▸ generating files'
  spinner.start()
  const templates = require(`./boilerplate.${selectedLanguage}`).templates

  await ignite.copyBatch(context, templates, templateProps, {
    quiet: true,
    directory: `${ignite.ignitePluginPath()}/${boilerplatePath}`
  })

  const ignitePackage = async(organization) => {
    const packageRelativePath = `packages/@${organization}/${packageName}`
    const packageTemplates = require(`./boilerplate.${selectedLanguage}`).getPackageTemplates(packageRelativePath)
    await ignite.copyBatch(context, packageTemplates, {
      ...templateProps,
      organization,
    }, {
      quiet: true,
      directory: `${ignite.ignitePluginPath()}/${boilerplatePath}`
    })
    if (selectedLanguage === 'es6') {
      await system.run(`cd ${packageRelativePath} && ln -s ../../../babel.config.js`)
    }
  }

  await ignitePackage('txo')
  await ignitePackage('txo-peer-dep')

  spinner.stop()
  spinner.succeed(`files generated`)

  spinner.text = `▸ installing packages`
  spinner.start()
  await system.spawn('yarn', { stdio: 'ignore' })
  spinner.stop()
  spinner.succeed(`packages installed`)

  // pass long the debug flag if we're running in that mode
  const debugFlag = parameters.options.debug ? '--debug' : ''

  // git configuration
  const gitExists = filesystem.exists('./.git')
  if (!gitExists && !parameters.options['skip-git'] && system.which('git')) {
    // initial git
    const spinner = print.spin('configuring git')

    const huskyCmd = `&& node node_modules/husky/husky install .`
    await system.run(`git init . && git add . && git commit -m "Initial commit." ${huskyCmd}`)

    spinner.succeed(`configured git`)
  }

  // HACK: we need to remove node_modules, because ignite copies files one by one and it takes too long afrer final success message.
  filesystem.remove('node_modules')
  // end of HACK

  const perfDuration = parseInt(((new Date()).getTime() - perfStart) / 10) / 100
  spinner.succeed(`ignited package ${yellow(packageName)} in ${perfDuration}s`)

  const successMessage = `
    ${red('Ignite CLI')} ignited package ${yellow(packageName)} in ${gray(`${perfDuration}s`)}

    To get started:

      cd ${name}
      yarn
      ignite --help

    ${bold('Now get cooking! 🍽')}
  `
  print.info(successMessage)
}

module.exports = {
  install
}
