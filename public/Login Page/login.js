document.getElementById('loginform').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    }
    const login = await fetch('/permission-check');
    const res = await fetch('/agentlogin/agentLoginData', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if(result.success){
        sessionStorage.setItem("agentCurrentlyLoggedIn",data.username)
        alert("Login successful")
        sessionStorage.setItem("agentLoggedIn","true");
        window.location.href = '/listing'
    }else{
        alert("Invalid credentials")
    }
})