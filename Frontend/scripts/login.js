let name = document.querySelector("#name");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let sign_btn = document.querySelector(".sign_btn");
sign_btn.addEventListener("click", () => {
    let obj = {
        email: email.value,
        password: password.value,
    };
    console.log(obj);
    sign_fun(obj);
});
let sign_fun = async (obj) => {
    try {
        let res = await fetch("http://localhost:4040/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });

        let data = await res.json();
        console.log(data);
        alert(data.msg);
        if(data.msg==='user logged in'){
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshtoken", data.refreshtoken);
            localStorage.setItem('user',obj.email);
            window.location.href='chat.html';
        }
        else{
            alert('Something went wrong. Please check your credentials again..!');
        }
        
    } catch (error) {
        console.log(error);
        alert("error");
    }
};

  //github Oauth
  // let github_btn = document.querySelector(".git");
  // //  console.log(github_btn)
  // github_btn.addEventListener("click", () => {
  //   // console.log("tarun");

  //   let get_userDetails = async () => {
  //     try {
  //       let res = await fetch("http://localhost:4040/users/auth/github/", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         // body: JSON.stringify(obj),
  //       });
  //       let data = await res.json();
  //        console.log(data)
  //       alert("data");
  //     } catch (error) {
  //       console.log(error);
  //       alert("error");
  //     }
  //   };
  //   // get_userDetails();
  // });