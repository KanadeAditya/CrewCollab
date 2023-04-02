
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
    sign_function(obj);
});
let sign_function = async (obj) => {
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
        window.location.href = "./login.html"
        // }
    } catch (error) {
        console.log(error);
        alert("error");
    }
};


///fake
let queryString = window.location.search.split("=")
let code=queryString[1]
const client_id = "ecf89f42afe601c8d613";
const client_secret = "1e2bdd5424e9abb53f7422c3017c11c66718da13";


console.log(code)
window.addEventListener("load",()=>{
if(code.length){
  gitDetails(code)
}
})

let gitDetails = async (code) => {
try {
  let res = await fetch(`http://localhost:4040/users/auth/github?code=${code}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
   
  });

  let obj = await res.json();
  console.log(obj);
  sign_fun(obj)
  
} catch (error) {
  console.log(error);
  alert("error");
}
};
// 


//sign up


let sign_fun = async (obj) => {
console.log(obj)
let newobj = {
"name" : obj.name,
"email" : obj.email,
"password" : obj.password
}
try {
  let res = await fetch("http://localhost:4040/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newobj),
  })

  let data = await res.json();
  console.log(data);
  login_fun(data.newuser,obj.password)
  alert(data.msg);
} catch (error) {
  console.log(error);
  alert("error");
}
};


//login
let login_fun = async (obj,pass) => {
let newobj = {
"email" : obj.email,
"password" : pass
}
console.log(newobj)
try {
  let res = await fetch("http://localhost:4040/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newobj),
  });

  let data = await res.json();
  console.log(data);
  alert(data.msg);
  //set token
  localStorage.setItem("token", data.token);
  localStorage.setItem("refreshtoken", data.refreshtoken);
} catch (error) {
  console.log(error);
  alert("error");
}
};