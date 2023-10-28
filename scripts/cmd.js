import setupI18n from "./setup-i18n.js"
import convertAlias from "./convert-alias.js"

const OPERATIONS = {
  PREBUILD: "prebuild",
  SETUP_i18n: "setup-i18n",
  CONVERT_ALIAS: "convert-alias",
}

const COMMANDS_MAPPER = new Map([
  [OPERATIONS.SETUP_i18n, "setup i18n ..."],
  [OPERATIONS.CONVERT_ALIAS, "convert alias ..."],
])

process.argv.forEach((val, index) => {
  if (index < 2) {
    return
  }
  switch (val) {
    case OPERATIONS.SETUP_i18n:
      setupI18n.run();
      break;
    case OPERATIONS.CONVERT_ALIAS:
      convertAlias.run();
      break;
    case OPERATIONS.PREBUILD:
      setupI18n.run();
      convertAlias.run();
      break;
  }
})