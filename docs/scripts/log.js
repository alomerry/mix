import chalk from "chalk"

const debug = true;

function Log(msg) {
  console.log(msg);
}

function Debug(msg) {
  if (debug) {
    console.log(msg);
  }
}

function Warn(msg) {
  return chalk.yellow(msg)
}

function WarnBg(msg) {
  return chalk.bgYellowBright(msg)
}

function Error(msg) {
  return chalk.red(msg)
}

function ErrorBg(msg) {
  return chalk.bgRed(msg)
}

function Success(msg) {
  return chalk.green(msg)
}

function SuccessBg(msg) {
  return chalk.bgGreenBright(msg)
}

function Bold(msg) {
  return chalk.bold(msg)
}

function UnderlineBold(msg) {
  return chalk.bold(chalk.underline(msg))
}

function ItalicBold(msg) {
  return chalk.bold(chalk.italic(msg))
}

function Blue(msg) {
  return chalk.blueBright(msg)
}

function Path(msg) {
  return chalk.dim(chalk.magentaBright(msg))
}

function File(msg) {
  return chalk.dim(chalk.bgCyanBright(msg))
}

export default {
  Debug, Log,
  Blue,
  Warn, WarnBg,
  Error, ErrorBg,
  Success, SuccessBg,
  Bold, UnderlineBold, ItalicBold,
  Path, File,
}
