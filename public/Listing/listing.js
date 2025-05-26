function query(e) {
    return document.querySelector(e);
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log("yes");

        const loginCheck = await fetch('/permission-check');
        const respo = await loginCheck.json();
        const isLoggedIn = respo.ifLoggedIn === "true";

        const response = await fetch(isLoggedIn ? `/listing/fetch-property-private` : `/listing/fetch-property`, {
            credentials: 'include'
        });

        const properties = await response.json();
        const container = document.getElementById("property-listing");
        const propertyFilter = query('#propertytype');
        const availableFilter = query('#availableon');
        const contactUser = query('#contactuser');
        const allProperties = query('#allproperties');
        const everyone = query('#everyone');
        function renderProperties() {
            const selectedType = propertyFilter.value.toLowerCase();
            const selectedAvailability = availableFilter.value.toLowerCase();

            container.innerHTML = "";

            for (const prop of properties) {
                if (!prop.stillavailable) continue;

                const typeMatch = selectedType === "all" || prop.type.toLowerCase() === selectedType;
                const availabilityMatch = selectedAvailability === "all" || prop.availableon.toLowerCase() === selectedAvailability;

                if (!typeMatch || !availabilityMatch) continue;

                const propertycard = document.createElement('div');
                propertycard.className = "property-card";
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
                                ${isLoggedIn ? "Click here to call owner" : "Click here to call now"}
                            </button>
                            <button type="button" class="callbtn ${isLoggedIn ? "" : "hidden"}" id="soldstatus">Property Sold</button>
                        </div>
                    </div>
                `;

                propertycard.querySelector('#callbtn').addEventListener('click', () => {
                    const number = isLoggedIn ? prop.mobileno : "9669399568";
                    window.location.href = `tel:+91${number}`;
                });

                if (isLoggedIn) {
                    propertycard.querySelector('#soldstatus').addEventListener('dblclick', async () => {
                        try {
                            const re = await fetch(`/listing/mark-sold/${prop._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ stillavailable: false })
                            });

                            if (re.ok) {
                                alert(`Property marked as sold!`);
                                propertycard.remove();
                            } else {
                                alert("Failed to mark property as sold.");
                            }
                        } catch (err) {
                            console.log(err);
                            alert("Something went wrong.");
                        }
                    });
                }

                container.appendChild(propertycard);
            }
        }

        renderProperties();
        propertyFilter.addEventListener("change", renderProperties);
        availableFilter.addEventListener("change", renderProperties);

        if (isLoggedIn) {
            query(".nav-text").style.display = "none";
            query('.add-btn').classList.remove('hidden');
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
            everyone.classList.remove('hidden')
            contactUser.classList.remove('hidden');
            allProperties.classList.remove('hidden');
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
            if (isLoggedIn) {
                everyone.classList.remove('hidden')
                contactUser.classList.remove('hidden');
                allProperties.classList.remove('hidden');

            } else {
                everyone.classList.add('hidden');
                contactUser.classList.add('hidden');
                allProperties.classList.add('hidden');
                query('.add-btn').classList.add('hidden');


            }

        })

    } catch (err) {
        console.log("Error loading properties", err);
    }
});
query('.addbtn').addEventListener('click', () => {
    window.location.href = '/listing/add-property'
});
