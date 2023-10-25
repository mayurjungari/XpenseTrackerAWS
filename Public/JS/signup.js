function SubmitSignUp(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    axios.post('/signup', {
        name: name,
        email: email,
        password: password
    })
    .then( (response) =>{
        if(response.status===409)
        alert('email already exhist')
    else alert('sign Up succesfully')
       window.localStorage.href='/'
    })
    .catch(function (error) {
        console.log(error);
        alert('An error occurred. Please try again.');
    });
}