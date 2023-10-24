import setupI18n from "./setup-i18n.js"

const OPERATIONS = {
  SETUP_i18n: "setup-i18n",
}

const COMMANDS_MAPPER = new Map([
  [OPERATIONS.SETUP_i18n, "设置 i18n ..."],
])

const WORK_ON_BUILD = [
  OPERATIONS.SETUP_i18n
]

process.argv.forEach((val, index) => {
  if (index < 2) {
    return
  }
  if (WORK_ON_BUILD.includes(val) && process.env.NODE_ENV !== "production") {
    return;
  }
  console.log(COMMANDS_MAPPER.get(val));
  switch (val) {
    case OPERATIONS.SETUP_i18n: setupI18n.run()
  }
})