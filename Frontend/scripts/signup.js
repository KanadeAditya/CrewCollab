
let name = document.querySelector("#name");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let sign_btn = document.querySelector(".sign_btn");
sign_btn.addEventListener("click", () => {
    let obj = {
        name: name.value,
        email: email.value,
        password: password.value,
    };
    console.log(obj);
    sign_fun(obj);
});
let sign_fun = async (obj) => {
    try {
        let res = await fetch("http://localhost:4040/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        })
        // if(res) {
        let data = await res.json();
        console.log(data);
        alert(data.msg);
        window.location.href = "login.html"
        // }
    } catch (error) {
        console.log(error);
        alert("error");
    }
};


