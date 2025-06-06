function query(e) {
    return document.getElementById(e);
}
const pathSegments = window.location.pathname.split('/');
const id = pathSegments[pathSegments.length - 1];
document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault();
    const login = await fetch('/permission-check');
    const respon = await login.json();
    const isLoggedIn = respon.ifLoggedIn === "true";
    if (isLoggedIn) {
        const propertyData = await fetch(`/listing/fetch-property/${id}`);
        const property = await propertyData.json();
        const price = property.totalprice.split(' ').map(tag => tag.trim())
        query('propertytype').value = property.type;
        query('bedrooms').value = property.bedrooms;
        query('furnished').value = property.furnished ? "Yes" : "No";
        query('locality').value = property.locality;
        query('sqfeet').value = property.sqfeet;
        query('totalprice').value = price[0];
        query('money').value = price[1];
        query('availableOn').value = property.availableon;
        query('ownername').value = property.ownername;
        query('ownernumber').value = property.mobileno;
        query('Address').value = property.address;
    } else {
        alert("You are not logged in or you dont have permission.")
    }
})
document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const login = await fetch('/permission-check');
    const respon = await login.json();
    const isLoggedIn = respon.ifLoggedIn === "true";
    if (isLoggedIn) {
        const formData = new FormData(e.target);
        const data = {
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
        }
        const respo = await fetch(`/listing/edit-property/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        e.target.reset();
        const result = await respo.json();
        alert(result.message);
        window.location.href = '/listing'
    } else {
        alert("You are not logged in or you dont have permission.")
    }
});