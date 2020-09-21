import {config} from "./config.mjs"
firebase.initializeApp(config)
firebase.analytics()

import {HbGithub} from "./hb-github.mjs"
customElements.define("hb-github", HbGithub)

const github = document.querySelector("hb-github")
github.addEventListener("sponsorship", event => {
    if (event.detail.isSponsor) document.querySelector("section").style.display = "block"
})