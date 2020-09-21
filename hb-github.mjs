const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: block;
        }
        ::slotted(img) {
            width: 50px;
        }
        ::slotted(img, button) {
            display: none;
        }
    </style>
    <slot></slot>
`
// https://developer.github.com/v4/explorer/
const QUERY = `{"query":
"query { \
    viewer { \
      sponsorshipsAsSponsor(first: 100) { \
        nodes { \
          tier { \
            id \
            monthlyPriceInDollars \
            description \
          } \
        } \
      } \
    } \
  }" \
}`

export class HbGithub extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: "open"})
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.a = this.querySelector("a")
        this.img = this.querySelector("img")
        this.span = this.querySelector("span")
        this.loginButton = this.querySelector("button:nth-child(4)")
        this.logoutButton = this.querySelector("button:nth-child(5)")

        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    connectedCallback() {    
        this.a.href = this.getAttribute("success-page")
        this.loginButton.addEventListener("click", this.login)
        this.logoutButton.addEventListener("click", this.logout)

        window.firebase.auth().onAuthStateChanged(user => {
            this.a.style.display = "none"
            this.loginButton.style.display = "none"
            this.logoutButton.style.display = "none"
            if (user) {
                if (window.location.pathname !== this.getAttribute("success-page")) this.a.style.display = "inline"
                this.logoutButton.style.display = "inline"
                this.showProfile(user.providerData[0])
            } else {
                this.loginButton.style.display = "inline"
                this.hideProfile()
            }
            this.checkSponsorship()
        })

        window.firebase.auth().getRedirectResult()
        .then(result => fetch("https://api.github.com/graphql", {method: "POST", headers: {Authorization: `Bearer ${result.credential.accessToken}`}, body: QUERY})) //console.log(result.user)
        .then(response => response.json())
        .then(json => {
            //console.log(json.data.viewer.sponsorshipsAsSponsor.nodes)
            if (json.data.viewer.sponsorshipsAsSponsor.nodes.some(sponorships => sponorships.tier.id === this.getAttribute("tier-id"))) {
                localStorage.setItem("isSponsor", true)
                window.location.href = this.getAttribute("success-page")
            } else {
                localStorage.setItem("isSponsor", false)
                this.querySelector("p").textContent = "Please donate to see 40..."
            }
        })
        .catch(error => console.log(error.message))
    }

    login(event) {
        this.loginButton.disabled = true
        const provider = new window.firebase.auth.GithubAuthProvider()
        provider.addScope("user")
        provider.setCustomParameters({allow_signup: true})
        window.firebase.auth().signInWithRedirect(provider)
    }

    logout(event) {
        this.logoutButton.disabled = true
        localStorage.setItem("isSponsor", false)

        window.firebase.auth().signOut()
        .then(() => window.location.href = this.getAttribute("login-page"))
        .catch(error => console.error(error.message));
    }

    showProfile(profile) {
        this.img.src = profile.photoURL
        this.img.style.display = "inline"
        this.span.textContent = profile.displayName
    }

    hideProfile() {
        this.img.style.display = "none"
        this.span.textContent = ""
    }

    checkSponsorship() {
        this.dispatchEvent(new CustomEvent("sponsorship", {detail: {isSponsor: Boolean(localStorage.getItem("isSponsor"))}}))
        if (window.location.pathname === this.getAttribute("success-page") && localStorage.getItem("isSponsor") === "false")
            window.location.href = this.getAttribute("login-page")
    }
}