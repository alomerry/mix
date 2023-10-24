import setupI18n from "./setup-i18n.js"

const OPERATIONS = {
  SETUP_i18n: "setup-i18n",
}

const COMMANDS_MAPPER = new Map([
  [OPERATIONS.SETUP_i18n, "setup i18n ..."],
])

process.argv.forEach((val, index) => {
  if (index < 2) {
    return
  }
  console.log(COMMANDS_MAPPER.get(val));
  switch (val) {
    case OPERATIONS.SETUP_i18n: setupI18n.run()
  }
})