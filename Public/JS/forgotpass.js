async function forgot (event)
{
    event.preventDefault();
    const obj={
        email:document.getElementById('email').value,
    }
  
await axios.post('password/forgotpassword', obj)
  .then(response => {
    if(response.status==200) alert('Reset Link sent on Registered Email')
    
  
  })
  .catch(error => {
    alert('used registered Mail')
    console.log(error);
  });
}