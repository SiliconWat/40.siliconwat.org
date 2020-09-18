const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: block;
        }
        ::slotted(img) {
            width: 50px;
        }
        ::slotted(button) {
            display: none;
        }
    </style>
    <slot></slot>
`

const QUERY = `{"query":
"query { \
    viewer { \
      sponsorshipsAsSponsor(first: 100) { \
        nodes { \
          tier { \
            id \
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

        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    connectedCallback() {
        const img = this.querySelector("img")
        const span = this.querySelector("span")
        const p = this.querySelector("p")
        const login = this.querySelector("button:nth-child(3)")
        const logout = this.querySelector("button:nth-child(4)")
        login.addEventListener("click", this.login)
        logout.addEventListener("click", this.logout)

        window.firebase.auth().onAuthStateChanged(user => {
            if (user) {
                login.style.display = "none"
                logout.style.display = "inline"
                const profile = user.providerData[0]
                img.src = profile.photoURL
                span.textContent = profile.displayName
            } else {
                login.style.display = "inline"
                logout.style.display = "none"
                img.src = ""
                span.textContent = ""
                p.textContent = ""
            }
        })

        window.firebase.auth().getRedirectResult()
        .then(result => fetch("https://api.github.com/graphql", {method: "POST", headers: {Authorization: `Bearer ${result.credential.accessToken}`}, body: QUERY})) //console.log(result.user)
        .then(response => response.json())
        .then(json => {
            console.log(json.data.viewer.sponsorshipsAsSponsor.nodes)
            if (json.data.viewer.sponsorshipsAsSponsor.nodes.some(sponorships => sponorships.tier.id === "MDEyOlNwb25zb3JzVGllcjQxODk1")) {
                window.location.href = "medium.html"
            } else {
                p.textContent = "Please donate to see 40..."
            }
        })
        .catch(error => p.textContent = error.message)
    }

    login(event) {
        const provider = new window.firebase.auth.GithubAuthProvider();
        window.firebase.auth().signInWithRedirect(provider);
    }

    logout(event) {
        window.firebase.auth().signOut()
        .then(() => console.log("signed out of github"))
        .catch(error => console.error(error.message));
    }
}