document.addEventListener("DOMContentLoaded", async () => {
    function query(e) {
        return document.querySelector(e)
    }

    const loginCheck = await fetch('/permission-check');
    const respo = await loginCheck.json();
    const isLoggedIn = respo.ifLoggedIn === "true";
    
    if (isLoggedIn) {
        query('.nav-text').style.display = "none";
        try {
            console.log("yes1");

            const response = await fetch(`/listing/fetch-property-private`, {
                credentials: 'include'
            });

            const properties = await response.json();
            const container = document.getElementById("property-listing");
            const propertyFilter = query('#propertytype');
            const availableFilter = query('#availableon');

            function renderProperties() {
                const selectedType = propertyFilter.value.toLowerCase();
                const selectedAvailability = availableFilter.value.toLowerCase();

                container.innerHTML = "";

                for (const prop of properties) {


                    const typeMatch = selectedType === "all" || prop.type.toLowerCase() === selectedType;
                    const availabilityMatch = selectedAvailability === "all" || prop.availableon.toLowerCase() === selectedAvailability;

                    if (!typeMatch || !availabilityMatch) continue;

                    const propertycard = document.createElement('div');
                    propertycard.className = "property-card";
                    if (!prop.stillavailable) { propertycard.classList.add('sold'); }
                    propertycard.innerHTML = `
                    <div class="${prop.type.toLowerCase()}">
                        <p>${prop.availableon}</p>
                    </div>
                    <div class="property-card-content">
                        <p class="id">Property ID: ${prop.number}</p>
                        <p class="locality">${prop.locality}, Gwalior</p>
                        <p class="type">${prop.type}</p>
                        <p class="price">₹ ${prop.totalprice}</p>
                        <div class="property-info">
                            <div class="bedroom-info">
                                ${["plots", "commercial"].includes(prop.type.toLowerCase())
                            ? `<img src="../Resource/bed-solid.svg" alt="" /> <p class="bedrooms">Not for ${prop.type}</p>`
                            : `<img src="../Resource/bed-solid.svg" alt="" />
                                    <p class="bedrooms">${prop.bedrooms} ${prop.furnished === true ? "Furnished" : "Unfurnished"}</p>`}
                            </div>
                            <div class="sqft-info">
                                <img src="../Resource/arrows-to-dot-solid.svg" alt="" />
                                <p class="area">${prop.sqfeet} sq.ft</p>
                            </div>
                        </div>
                        <div class="agent-content ${isLoggedIn ? "" : "hidden"}">
                            <p>Name: ${prop.ownername}</p>
                            <p>Complete Address: ${prop.address}</p>
                            <p>Phone Number: ${prop.mobileno}</p>
                            <p>Added By: ${prop.addedby}</p>
                        </div>
                        <div class="call-btn">
                            <button type="button" class="callbtn" id="callbtn">
                               Click here to call owner
                            </button>
                        </div>
                    </div>
                `;

                    propertycard.querySelector('#callbtn').addEventListener('click', () => {
                        window.location.href = `tel:+91${prop.mobileno}`;
                    });



                    container.appendChild(propertycard);
                }
            }

            renderProperties();
            propertyFilter.addEventListener("change", renderProperties);
            availableFilter.addEventListener("change", renderProperties);
            const everyone = query('#everyone');
            everyone.classList.remove('hidden');
            const logoutbtn = query('.agentlogin');
            logoutbtn.innerText = "Logout";
            logoutbtn.addEventListener('click', async () => {
                try {
                    const logout = await fetch('/logout', {
                        method: 'POST'
                    });
                    if (logout.ok) {
                        alert('Logged out successfully!');
                        window.location.href = '/listing'
                    } else {
                        alert('Failed to log out.');
                        console.log("FAILED");
                        window.location.href = '/listing'
                    }
                } catch (err) {
                    console.log(err);
                    alert("Failed to log out due to some internal error.")

                }
            });


        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("User is not logged in");
        query("#everyone").innerText = "YOU ARE NOT LOGGED IN";
        query("#everyone").classList.remove("hidden")
        query('#allproperties').classList.add('hidden');
        query('#contactuser').classList.add('hidden');         
    }
        const menuToggle = document.getElementById("menuToggle");
        query("*").style.transition = "filter 0.3s ease";
        const blur1 = query("header");
        const blur2 = query(".nav-text");
        const blur3 = query("#property-listing")
        const blur4 = query(".filter-bar")
        const navOption = document.querySelectorAll(".nav-options a");
        const navBar = query(".nav-options");

        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = navBar.style.opacity === "1";
            if (!isVisible) {
                navBar.style.opacity = "1";
                navBar.style.pointerEvents = "auto";
                blur1.style.filter = "";
                blur1.style.backgroundColor = "#fff"
                blur3.style.filter = "blur(20px)";
                blur4.style.filter = "blur(20px)"
                blur3.style.backgroundColor = "#fff"
                blur2.style.filter = "blur(20px)";
                menuToggle.style.filter = "none";
                navBar.style.filter = "none"
                menuToggle.style.color = "#121212"
                navOption.forEach(option => {
                    option.style.color = "#121212";
                    option.style.borderColor = "#121212"
                })


            } else {
                blur1.style.filter = "none";
                blur1.style.backgroundColor = ""
                blur3.style.backgroundColor = ""
                blur2.style.filter = "none";
                blur3.style.filter = "none";
                blur4.style.filter = "none"
                blur3.style.backgroundColor = ""
                blur1.style.backgroundColor = ""
                navBar.style.opacity = "0";
                navBar.style.pointerEvents = "none";
                menuToggle.style.color = ""
            }
               

        })
})