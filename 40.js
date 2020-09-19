import {config} from "./config.mjs"
firebase.initializeApp(config)
firebase.analytics()

import {HbGithub} from "./hb-github.mjs"
customElements.define("hb-github", HbGithub)