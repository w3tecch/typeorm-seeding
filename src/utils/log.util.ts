import chalk from 'chalk'

/**
 * Prints the error to the console
 */
export const printError = (message: string, error?: any) => {
  console.log('\n❌ ', chalk.red(message))
  if (error) {
    console.error(error)
  }
}

/**
 * Prints the warning to the console
 */
export const printWarning = (message: string, error?: any) => {
  console.log('\n🚨 ', chalk.yellow(message))
  if (error) {
    console.error(error)
  }
}
