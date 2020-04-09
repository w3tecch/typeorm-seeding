import * as chalk from 'chalk'

/**
 * Prints the error to the console
 */
export const printError = (message: string, error?: any) => {
  // tslint:disable-next-line
  console.log('\n❌ ', chalk.red(message))
  if (error) {
    // tslint:disable-next-line
    console.error(error)
  }
}
