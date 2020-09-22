import {config} from "./config.mjs"
firebase.initializeApp(config)
firebase.analytics()

import {HbGithub} from "https://library.siliconwat.com/components/hb-github.mjs"
customElements.define("hb-github", HbGithub)

