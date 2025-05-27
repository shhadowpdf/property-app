
document.getElementById("add-form").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const response = await fetch('/listing/property-count')
    const result = await response.json();
    const count = result.count;
    const login = await fetch('/permission-check');
    const respon = await login.json();
    const isLoggedIn = respon.ifLoggedIn === "true";
    if (isLoggedIn){
        const formData = new FormData(e.target);
        const data = {
            number: count+1,
            type: formData.get('propertytype'),
            bedrooms: formData.get('bedrooms'),
            furnished: formData.get('furnished') === "Yes",
            locality: formData.get('locality'),
            sqfeet: formData.get('sqfeet'),
            totalprice: `${formData.get('totalprice')} ${formData.get('money')}`,
            availableon: formData.get('availableOn'),
            ownername: formData.get('ownername'),
            mobileno: formData.get('ownernumber'),
            address: formData.get('Address'),
            addedby: sessionStorage.getItem("agentCurrentlyLoggedIn")
        }

        const respo = await fetch('/listing/add-property',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        const resultt = await respo.json();
        alert(resultt.message);
        e.target.reset();
        window.location.href = '/listing'
    }else{
        alert("You are not logged in or you dont have permission.")
    }
});