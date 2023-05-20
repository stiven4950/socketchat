const miFormulario = document.querySelector("form");
const url = "http://localhost:8080/api/auth/";


function handleCredentialResponse(response) {
    // console.log("Token:", response.credential)
    const body = { id_token: response.credential }
    fetch(url + "google", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then(resp => resp.json())
        .then(data => {
            const { token, usuario } = data;

            localStorage.setItem("token", token);
            localStorage.setItem("email", usuario.correo);
            window.location = "chat.html";
        })
        .catch(console.warn);
}

const buttonSingnout = document.getElementById("google_signout")
buttonSingnout.onclick = () => {
    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem("email"), done => {
        localStorage.clear();
        location.reload();
    });
}

miFormulario.addEventListener("submit", e => {
    e.preventDefault();
    const formData = {};

    for (let el of miFormulario) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + "login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
    })
        .then(res => res.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.log(err);
            }
            localStorage.setItem("token", token);
            window.location = "chat.html";
        })
        .catch(console.log);

})