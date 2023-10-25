
function resetPassword(event)
{
    event.preventDefault();
    const currentUrl = window.location.href;

    // Parse the URL to extract the parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Access the 'uuid' parameter value
    const uuid = urlParams.get('uuid');

    // Display the 'uuid' value in the console
   
    
}