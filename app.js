// ---------------- GLOBAL STATE ---------------- //
let currentRoute = 'login'; 
let userRole = null; // 'donor', 'ngo', or 'volunteer'

let appState = {
    donations: [
        // Seeded realistic initial data
        { id: 'DON-1', food: '50x Cooked Meals (Pasta)', desc: 'Prepared 30 mins ago. Needs enclosed delivery.', address: 'Grand Hotel Banquet, 12th St', destination: 'City Hope Center', status: 'ready_for_pickup', time: '2:00 PM', urgency: 'High Priority', type: 'Cooked Meals' },
        { id: 'DON-2', food: 'Bakery Surplus (Breads)', desc: 'Shelf-stable for 2 days. 2 large boxes.', address: 'Sunrise Bakery, West Ave', destination: 'Community Food Bank', status: 'ready_for_pickup', time: '4:30 PM', urgency: 'Standard', type: 'Bakery' },
        { id: 'DON-4', food: '20x Fresh Produce Boxes', desc: 'Fresh vegetables and fruits from local farm.', address: 'Green Valley Farms, North Rd', destination: 'Pending NGO Assignment', status: 'pending_ngo', time: 'ASAP', urgency: 'Standard', type: 'Fresh Produce' },
        { id: 'DON-3', food: '15 Pasta Trays', desc: '', address: 'Downtown Cafe', destination: 'Local Shelter', status: 'completed', time: 'Yesterday', urgency: 'Standard', type: 'Cooked Meals' }
    ]
};

// ---------------- ACTIONS ---------------- //

window.handleLogin = function() {
    const email = document.getElementById('login-email').value.toLowerCase();
    
    if (email.includes('donor')) {
        userRole = 'donor';
        navigate('dashboard');
    } else if (email.includes('ngo')) {
        userRole = 'ngo';
        navigate('ngo'); // Default view for NGO
    } else if (email.includes('volunteer')) {
        userRole = 'volunteer';
        navigate('volunteer'); // Default view for Volunteer
    } else {
        alert("Please use an email containing 'donor', 'ngo', or 'volunteer'.\\nExample: abcvolunteer@ecobite.com");
    }
}

window.handleLogout = function() {
    userRole = null;
    navigate('login');
}

window.submitDonation = function() {
    const foodType = document.getElementById('donate-type').value;
    const quantity = document.getElementById('donate-quantity').value;
    const desc = document.getElementById('donate-desc').value;
    const address = document.getElementById('donate-address').value;
    const time = document.getElementById('donate-time').value;
    
    if (!quantity || !address) {
        return alert("Please fill in quantity and an address.");
    }

    const newDonation = {
        id: 'DON-' + Math.floor(Math.random() * 10000),
        food: quantity + 'x ' + foodType,
        desc: desc || "Standard food drop-off.",
        address: address,
        destination: 'Pending NGO Assignment',
        status: 'pending_ngo', // Send straight to NGO dashboard!
        time: time || 'ASAP',
        urgency: 'High Priority', 
        type: foodType
    };
    
    appState.donations.push(newDonation);
    alert('Donation Successfully Added! It is now waiting for an NGO to accept on their dashboard.');
    navigate('dashboard');
}

window.approveDonationByNGO = function(id) {
    const donation = appState.donations.find(d => d.id === id);
    if (donation) {
        donation.status = 'ready_for_pickup'; // Now volunteers can see it!
        donation.destination = 'NGO Headquarters'; // Claimed by the NGO
        navigate('ngo'); // Re-render
    }
}

window.acceptTaskByVolunteer = function(id) {
    const donation = appState.donations.find(d => d.id === id);
    if (donation) {
        donation.status = 'in_transit'; 
        navigate('tracking'); 
    }
}

window.completeDelivery = function() {
    // Arbitrarily complete all transit
    appState.donations.forEach(d => {
        if(d.status === 'in_transit') d.status = 'completed';
    });
    alert("Delivery completed! Impact metrics updated.");
    navigate('volunteer');
}


// ---------------- ROUTING & RENDERING ---------------- //

window.navigate = function(route) {
    currentRoute = route;
    const appEl = document.getElementById('app');
    
    appEl.innerHTML = ''; 
    let content = '';
    
    if (route !== 'login') {
        content += renderTopNav();
    }
    
    const pageContainer = document.createElement('div');
    pageContainer.className = 'page-enter layout-container';
    if(route !== 'login') {
        pageContainer.style.paddingTop = '32px';
        pageContainer.style.paddingBottom = '64px';
    }

    switch(route) {
        case 'login': content += renderLogin(); break;
        case 'dashboard': pageContainer.innerHTML = renderDashboard(); content += pageContainer.outerHTML; break;
        case 'donate': pageContainer.innerHTML = renderDonate(); content += pageContainer.outerHTML; break;
        case 'volunteer': pageContainer.innerHTML = renderVolunteer(); content += pageContainer.outerHTML; break;
        case 'tracking': pageContainer.innerHTML = renderTracking(); content += pageContainer.outerHTML; break;
        case 'ngo': pageContainer.innerHTML = renderNGO(); content += pageContainer.outerHTML; break;
        case 'analytics': pageContainer.innerHTML = renderAnalytics(); content += pageContainer.outerHTML; break;
        default: content += renderDashboard();
    }
    
    appEl.innerHTML = content;
    
    if (window.lucide) {
        lucide.createIcons();
    }
    window.scrollTo(0, 0);
}

// ---------------- SCREENS ---------------- //

function renderTopNav() {
    let linksHtml = '';
    
    if (userRole === 'donor') {
        linksHtml += `<button class="nav-link ${currentRoute === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')">Donor Dashboard</button>`;
        linksHtml += `<button class="nav-link ${currentRoute === 'donate' ? 'active' : ''}" onclick="navigate('donate')">Donate Food</button>`;
    } else if (userRole === 'ngo') {
        linksHtml += `<button class="nav-link ${currentRoute === 'ngo' ? 'active' : ''}" onclick="navigate('ngo')">NGO Command Center</button>`;
    } else if (userRole === 'volunteer') {
        linksHtml += `<button class="nav-link ${currentRoute === 'volunteer' ? 'active' : ''}" onclick="navigate('volunteer')">Task Hub</button>`;
        linksHtml += `<button class="nav-link ${currentRoute === 'tracking' ? 'active' : ''}" onclick="navigate('tracking')">Live Tracking</button>`;
    }
    
    // Everyone sees Analytics
    linksHtml += `<button class="nav-link ${currentRoute === 'analytics' ? 'active' : ''}" onclick="navigate('analytics')">Global Impact</button>`;

    return `
        <nav class="top-nav">
            <div class="layout-container flex items-center justify-between">
                <div class="brand-logo" style="cursor:pointer;" onclick="navigate('${userRole === 'ngo' ? 'ngo' : userRole === 'volunteer' ? 'volunteer' : 'dashboard'}')">
                    <i data-lucide="leaf"></i> EcoBite <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: normal; margin-left: 8px; border: 1px solid var(--border); padding: 2px 6px; border-radius: 10px;">${userRole ? userRole.toUpperCase() : ''} VIEW</span>
                </div>
                <div class="nav-links">
                    ${linksHtml}
                    <div style="width: 1px; height: 24px; background: var(--border); margin: 0 8px;"></div>
                    <button class="btn btn-outline" style="padding: 8px; border-radius: 50%;"><i data-lucide="bell" style="width: 18px; height: 18px;"></i></button>
                    <button class="btn btn-outline" style="padding: 8px; border-radius: 50%; color: var(--danger); border-color: var(--danger);" onclick="handleLogout()" title="Log out"><i data-lucide="log-out" style="width: 18px; height: 18px;"></i></button>
                </div>
            </div>
        </nav>
    `;
}

// 1. Login Screen
function renderLogin() {
    return `
        <div class="login-grid">
            <!-- Left Branding Side -->
            <div style="background-color: var(--primary-light); padding: 48px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                <div class="brand-logo" style="font-size: 3rem; margin-bottom: 24px;">
                    <i data-lucide="leaf" style="width: 48px; height: 48px;"></i> EcoBite
                </div>
                <h1 style="font-size: 2.5rem; color: var(--primary-hover); margin-bottom: 16px; max-width: 80%;">Connecting Food Donors, NGOs and Volunteers</h1>
                <p class="text-muted text-lg" style="max-width: 70%;">A seamless ecosystem to reduce food waste and feed communities in need effectively.</p>
                
                <div style="margin-top: 48px; width: 100%; max-width: 340px; aspect-ratio: 1/1; flex-shrink: 0; border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden; position: relative; animation: fadeIn 0.8s ease-out;">
                    <img src="hero.png" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" alt="A beautiful glowing box of fresh food">
                </div>
            </div>
            
            <!-- Right Login Side -->
            <div style="padding: 48px; display: flex; flex-direction: column; justify-content: center; max-width: 500px; margin: 0 auto; width: 100%;">
                <h2 style="font-size: 2rem; margin-bottom: 8px;">Welcome Back</h2>
                <p class="text-muted mb-8 text-lg">Sign in to automatically route to your dashboard.</p>
                
                <div class="card bg-primary-light" style="background: var(--surface-hover); border: none; margin-bottom: 24px;">
                    <p class="text-sm font-semibold mb-2">Try entering an email containing:</p>
                    <ul class="text-sm text-muted" style="list-style-type: disc; padding-left: 16px;">
                        <li><strong>donor</strong> (e.g., abcdonor@ecobite.com)</li>
                        <li><strong>ngo</strong> (e.g., testngo@ecobite.com)</li>
                        <li><strong>volunteer</strong> (e.g., myvolunteer@ecobite.com)</li>
                    </ul>
                </div>
                
                <div class="flex flex-col gap-4 mb-6">
                    <div>
                        <label class="text-sm font-semibold mb-2" style="display: block;">Email Address</label>
                        <input type="email" id="login-email" class="input-field" placeholder="abcdonor@ecobite.com" value="abcdonor@ecobite.com">
                    </div>
                    <div>
                        <label class="text-sm font-semibold mb-2" style="display: block;">Password</label>
                        <input type="password" class="input-field" placeholder="••••••••" value="password123">
                    </div>
                </div>
                
                <button class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 1rem; padding: 14px;" onclick="handleLogin()">Sign In <i data-lucide="arrow-right"></i></button>
            </div>
        </div>
    `;
}

// 2. Home Dashboard (Donor)
function renderDashboard() {
    let completedDonations = appState.donations.filter(d => d.status === 'completed' || d.status === 'ready_for_pickup' || d.status === 'in_transit');
    let completedHtml = completedDonations.map(d => `
        <div class="card flex items-center justify-between" style="padding: 16px;">
            <div class="flex items-center gap-4">
                <div style="background: var(--surface-hover); padding: 12px; border-radius: var(--radius-sm);">
                    <i data-lucide="${d.type.includes('Produce') ? 'apple' : 'pizza'}" class="text-muted"></i>
                </div>
                <div>
                    <h4 style="font-size: 1rem;">${d.food}</h4>
                    <p class="text-sm text-muted">Donated • Status: <span style="text-transform: capitalize;">${d.status.replace(/_/g, ' ')}</span></p>
                </div>
            </div>
            <span class="badge badge-success"><i data-lucide="check" style="width:12px;"></i> Active</span>
        </div>
    `).join('');

    if(!completedHtml) completedHtml = '<p class="text-muted">No donations yet.</p>';

    return `
        <h1 class="mb-2">Donor Dashboard</h1>
        <p class="text-muted mb-8">Welcome back! Check your impact and nearby needs.</p>

        <div class="grid grid-cols-3 gap-6 mb-8">
            <div class="card flex flex-col items-center justify-center text-center" style="grid-column: span 1; background: var(--primary); color: white; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="navigate('donate')">
                <i data-lucide="package-plus" style="width: 48px; height: 48px; margin-bottom: 16px;"></i>
                <h2>Donate Food</h2>
                <p style="opacity: 0.9; margin-top: 8px;">Schedule a pickup for excess food</p>
            </div>
            
            <div class="card" style="grid-column: span 2; display: flex; gap: 24px;">
                <div class="flex-1">
                    <h3 class="mb-4">Local Impact Statistics</h3>
                    <p class="text-muted mb-2">Because of your donations, <strong>City Hope Center</strong> has fed 150 people!</p>
                    <div style="width: 100%; height: 12px; background: var(--surface-hover); border-radius: 6px; overflow: hidden; margin-bottom: 8px;">
                        <div style="width: 75%; height: 100%; background: var(--primary);"></div>
                    </div>
                    <p class="text-sm text-muted text-right">Goal: 200 Meals</p>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-6">
            <div>
                <h3 class="mb-4">Your Recent Activity</h3>
                <div class="flex flex-col gap-4">
                    ${completedHtml}
                </div>
            </div>
            
            <div>
                <h3 class="mb-4">Nearby NGOs Requesting Aid</h3>
                <div class="flex flex-col gap-4">
                    <div class="card flex justify-between items-center" style="padding: 16px; border-left: 4px solid var(--danger);">
                        <div>
                            <h4>City Hope Shelter</h4>
                            <p class="text-sm text-danger font-semibold">URGENT: Requires Hot meals • 1.2 miles away</p>
                        </div>
                        <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.75rem;" onclick="navigate('donate')">Respond</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 3. Donate Food Screen
function renderDonate() {
    return `
        <div class="flex items-center mb-6">
            <button class="btn btn-outline mr-4" onclick="navigate('dashboard')" style="padding: 8px;"><i data-lucide="arrow-left" style="width:16px;height:16px;"></i></button>
            <h1>Donate Food</h1>
        </div>
        
        <div class="grid grid-cols-3 gap-8">
            <div class="card" style="grid-column: span 2;">
                <h3 class="mb-4 text-xl">Donation Details</h3>
                
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="text-sm font-semibold mb-2" style="display: block;">Food Category</label>
                        <select id="donate-type" class="input-field">
                            <option value="Cooked Meals">Cooked Meals</option>
                            <option value="Fresh Produce">Fresh Produce</option>
                            <option value="Packaged/Canned">Packaged/Canned</option>
                            <option value="Bakery">Bakery</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-sm font-semibold mb-2" style="display: block;">Quantity / Amount</label>
                        <input id="donate-quantity" type="text" class="input-field" placeholder="e.g. 50 servings">
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="text-sm font-semibold mb-2" style="display: block;">Food Freshness Status / Description</label>
                    <textarea id="donate-desc" class="input-field" rows="3" placeholder="Prepared 2 hours ago. Needs to be consumed within 12 hours."></textarea>
                </div>
                
                <hr style="border: 0; border-top: 1px solid var(--border); margin: 24px 0;">
                
                <h3 class="mb-4 text-xl">Pickup Information</h3>
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div style="grid-column: span 2;">
                        <label class="text-sm font-semibold mb-2" style="display: block;">Pickup Address</label>
                        <input id="donate-address" type="text" class="input-field" value="123 Corporate Blvd, 4th Floor">
                    </div>
                    <div>
                        <label class="text-sm font-semibold mb-2" style="display: block;">Requested Pickup Time</label>
                        <input id="donate-time" type="time" class="input-field" value="14:30">
                    </div>
                </div>
                
                <div class="flex justify-end gap-4 mt-8">
                    <button class="btn btn-outline" onclick="navigate('dashboard')">Cancel</button>
                    <button class="btn btn-primary" onclick="submitDonation()">Submit Listing to NGOs <i data-lucide="send" style="width:16px;"></i></button>
                </div>
            </div>
            
            <div>
                <div class="card mb-6">
                    <h3 class="mb-4">How it works</h3>
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-3">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--primary); color: white; display:flex; align-items:center; justify-content:center; font-size: 12px;"><i data-lucide="check" style="width:12px;"></i></div>
                            <span class="font-semibold text-sm">Submit Details</span>
                        </div>
                        <div style="width: 2px; height: 16px; background: var(--border); margin-left: 11px;"></div>
                        <div class="flex items-center gap-3 opacity-50">
                            <div style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--text-muted); display:flex; align-items:center; justify-content:center; font-size: 12px;">2</div>
                            <span class="text-muted text-sm">NGO Claims Listing</span>
                        </div>
                        <div style="width: 2px; height: 16px; background: var(--border); margin-left: 11px;"></div>
                        <div class="flex items-center gap-3 opacity-50">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--surface-hover); color: var(--text-muted); display:flex; align-items:center; justify-content:center; font-size: 12px;">3</div>
                            <span class="text-muted text-sm">Volunteer Pickup</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 4. NGO Dashboard
function renderNGO() {
    let pendingDonations = appState.donations.filter(d => d.status === 'pending_ngo');
    let incomingDeliveries = appState.donations.filter(d => d.status === 'ready_for_pickup' || d.status === 'in_transit');
    
    let pendingTableRows = pendingDonations.map(d => `
        <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 16px 8px; font-weight: 500;">${d.food}</td>
            <td style="padding: 16px 8px; color: var(--text-muted); font-size: 0.8rem;">${d.address}</td>
            <td style="padding: 16px 8px;">
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="approveDonationByNGO('${d.id}')">Claim & Assign Volunteer</button>
            </td>
        </tr>
    `).join('');
    
    if(!pendingTableRows) pendingTableRows = '<tr><td colspan="3" style="padding: 16px; color: var(--text-muted); text-align: center;">No new pending donations in your area.</td></tr>';

    let incomingRows = incomingDeliveries.map(d => `
        <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px 8px; font-weight: 500;">${d.food}</td>
            <td style="padding: 12px 8px;"><span class="badge ${d.status === 'in_transit' ? 'badge-warning' : ''}">${d.status === 'in_transit' ? 'On Route' : 'Waiting for Volunteer'}</span></td>
        </tr>
    `).join('');
    if(!incomingRows) incomingRows = '<tr><td colspan="2" style="padding: 16px; color: var(--text-muted);">No incoming deliveries.</td></tr>';

    return `
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="mb-2">NGO Command Center</h1>
                <p class="text-muted">Manage incoming food requests and track assigned deliveries.</p>
            </div>
            <span class="badge badge-success" style="font-size: 1rem; padding: 8px 16px;">Live Data Active</span>
        </div>
        
        <div class="grid grid-cols-3 gap-6 mb-8">
            <div class="card" style="grid-column: span 2;">
                <h3 class="mb-4 text-warning flex items-center gap-2"><i data-lucide="bell"></i> Pending Donor Listings (Review & Claim)</h3>
                <p class="text-sm text-muted mb-4">Click "Claim" to instruct the system to recruit a volunteer for delivery to your NGO.</p>
                
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
                            <th style="padding: 12px 8px;">Food Offer</th>
                            <th style="padding: 12px 8px;">Pickup Location</th>
                            <th style="padding: 12px 8px;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pendingTableRows}
                    </tbody>
                </table>
            </div>
            
            <div class="card">
                <h3 class="mb-4 text-primary">Expected Arrivals</h3>
                 <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <tbody>
                        ${incomingRows}
                    </tbody>
                 </table>
                 <hr style="margin: 16px 0; border: 0; border-top: 1px solid var(--border);">
                 <p class="text-sm flex justify-between">Total Received This Week: <strong>450 lbs</strong></p>
                 <p class="text-sm flex justify-between">Meals Distributed: <strong>1,200</strong></p>
            </div>
        </div>
    `;
}

// 5. Volunteer Assignment Screen
function renderVolunteer() {
    let availableTasks = appState.donations.filter(d => d.status === 'ready_for_pickup');
    
    let tasksHtml = availableTasks.map(d => `
        <div class="card">
            <div class="flex justify-between items-start mb-4">
                <span class="badge ${d.urgency === 'High Priority' ? 'badge-danger' : 'badge-success'} flex items-center gap-1"><i data-lucide="clock" style="width:12px;"></i> ${d.urgency}</span>
            </div>
            <h3 class="mb-2 text-xl">${d.food}</h3>
            <p class="text-muted text-sm mb-6" style="line-height: 1.6;">${d.desc}</p>
            
            <div class="flex flex-col gap-4 mb-8 relative">
                <div style="position: absolute; left: 15px; top: 20px; bottom: 20px; width: 2px; border-left: 2px dashed var(--border);"></div>
                <div class="flex gap-4 items-center z-10" style="background: var(--surface);">
                    <div style="background: var(--surface-hover); border-radius: 50%; padding: 8px;"><i data-lucide="map-pin" class="text-muted" style="width:16px;"></i></div>
                    <div>
                        <p class="text-xs text-muted mb-1">PICKUP at ${d.time}</p>
                        <p class="text-sm font-semibold">${d.address}</p>
                    </div>
                </div>
                <div class="flex gap-4 items-center z-10" style="background: var(--surface);">
                    <div style="background: var(--primary-light); border-radius: 50%; padding: 8px; color: var(--primary);"><i data-lucide="flag" style="width:16px;"></i></div>
                    <div>
                        <p class="text-xs text-muted mb-1">DROPOFF (NGO)</p>
                        <p class="text-sm font-semibold">${d.destination}</p>
                    </div>
                </div>
            </div>
            
            <div class="flex gap-4">
                <button class="btn btn-primary flex-1" onclick="acceptTaskByVolunteer('${d.id}')">Accept Task & Start Nav</button>
            </div>
        </div>
    `).join('');
    
    if(!tasksHtml) tasksHtml = '<div class="card" style="grid-column: span 2; text-align: center; padding: 48px; color: var(--text-muted);"><i data-lucide="check-circle" style="width: 48px; height: 48px; margin-bottom: 16px;"></i><h3>No pickup tasks currently available.</h3><p>NGOs will assign tasks here automatically.</p></div>';

    return `
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="mb-2">Available Tasks</h1>
                <p class="text-muted">Pick up donations approved by NGOs and deliver them safely.</p>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-6">
            ${tasksHtml}
        </div>
    `;
}

// 6. Live Tracking Screen (Volunteer)
function renderTracking() {
    // Just find the boldest active delivery
    const activeTask = appState.donations.find(d => d.status === 'in_transit');
    
    if(!activeTask) {
        return `
            <div class="flex flex-col items-center justify-center text-center" style="height: 60vh;">
                <i data-lucide="navigation-off" style="width: 64px; height: 64px; color: var(--text-muted); margin-bottom: 24px;"></i>
                <h2>No active deliveries</h2>
                <p class="text-muted mb-8">Go to the Task Hub to accept a new delivery.</p>
                <button class="btn btn-primary" onclick="navigate('volunteer')">Back to Task Hub</button>
            </div>
        `;
    }

    return `
        <div class="flex items-center mb-6 justify-between">
            <div class="flex items-center">
                <button class="btn btn-outline mr-4" onclick="navigate('volunteer')" style="padding: 8px;"><i data-lucide="arrow-left" style="width:16px;height:16px;"></i></button>
                <h1>Live GPS En Route</h1>
            </div>
            <button class="btn btn-danger" style="background: var(--primary); color: white;" onclick="completeDelivery()">Simulate: Arrived at NGO <i data-lucide="check-circle-2"></i></button>
        </div>
        
        <div class="grid grid-cols-3 gap-6">
            <div class="card tracking-map-card" style="grid-column: span 2; padding: 0; overflow: hidden; height: 600px; display: flex; flex-direction: column;">
                <div style="flex: 1; background: #E2E8F0; position: relative;">
                    <div style="position: absolute; inset:0; display:flex; align-items:center; justify-content:center; flex-direction: column; color: var(--text-muted); opacity: 0.8; font-weight: 600;">
                        <i data-lucide="map" style="width:64px; height:64px; margin-bottom: 16px;"></i>
                        [ Interactive Map UI (Prototype) ]
                    </div>
                    <svg style="position: absolute; inset: 0; width: 100%; height: 100%;" preserveAspectRatio="none" viewBox="0 0 100 100">
                         <path d="M20,80 Q40,40 80,20" stroke="var(--primary)" stroke-width="2" fill="none" stroke-dasharray="4" />
                         <circle cx="20" cy="80" r="3" fill="var(--surface)" stroke="var(--text-muted)" stroke-width="1.5" />
                         <circle cx="80" cy="20" r="3" fill="var(--surface)" stroke="var(--primary)" stroke-width="1.5" />
                         <circle cx="50" cy="48" r="4" fill="var(--primary)">
                            <animate attributeName="cx" values="20;80" dur="4s" repeatCount="indefinite" />
                            <animate attributeName="cy" values="80;20" dur="4s" repeatCount="indefinite" />
                         </circle>
                    </svg>
                </div>
            </div>
            
            <div class="flex flex-col gap-6">
                <!-- Data from activeTask -->
                <div class="card">
                    <h3 class="flex items-center gap-2 mb-4"><i data-lucide="navigation" class="text-primary"></i> GPS Navigating</h3>
                    <p class="text-sm font-semibold mb-1">Delivering: ${activeTask.food}</p>
                    <p class="text-sm text-muted mb-4">To: ${activeTask.destination}</p>
                    
                    <div style="background: var(--surface-hover); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 24px;">
                        <p class="text-sm font-semibold mb-1">Food Freshness Timer</p>
                        <div class="flex items-center justify-between mb-2">
                            <div style="width: 80%; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
                                <div style="width: 75%; height: 100%; background: var(--success);"></div>
                            </div>
                            <span class="text-xs font-semibold text-success">Good</span>
                        </div>
                    </div>
                    
                    <h4 class="mb-4">Task Tracking Status</h4>
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-3">
                            <i data-lucide="check-circle-2" class="text-primary"></i><span class="text-sm font-semibold">Pickup Complete</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <i data-lucide="clock" class="text-warning"></i><span class="text-sm font-semibold">On the Way (Simulated)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 7. Impact / Analytics Screen (Unchanged functionally, added flex-shrink fix)
function renderAnalytics() {
    return `
        <h1 class="mb-2">Global Impact & Analytics</h1>
        <p class="text-muted mb-8">Transparency in our mission. See the change happening in real-time.</p>
        
        <div class="grid grid-cols-3 gap-6 mb-8">
            <div class="card text-center" style="padding: 32px 24px;">
                <div style="background: var(--primary-light); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--primary);">
                    <i data-lucide="utensils" style="width: 32px; height: 32px;"></i>
                </div>
                <h2 style="font-size: 2.5rem; margin-bottom: 8px;">1.2M</h2>
                <p class="text-muted font-semibold">Total Meals Delivered</p>
            </div>
            
            <div class="card text-center" style="padding: 32px 24px;">
                <div style="background: #E0F2FE; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #0284C7;">
                    <i data-lucide="trash-2" style="width: 32px; height: 32px;"></i>
                </div>
                <h2 style="font-size: 2.5rem; margin-bottom: 8px;">850k</h2>
                <p class="text-muted font-semibold">Lbs of Food Saved From Waste</p>
            </div>
            <div class="card text-center" style="padding: 32px 24px;">
                <div style="background: #FEF3C7; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #D97706;">
                    <i data-lucide="users" style="width: 32px; height: 32px;"></i>
                </div>
                <h2 style="font-size: 2.5rem; margin-bottom: 8px;">5,400+</h2>
                <p class="text-muted font-semibold">Active Responders</p>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-6">
            <div class="card">
                <h3 class="mb-6">Monthly Donation Trends</h3>
                 <div class="flex items-end gap-4 h-[200px]" style="height: 200px; padding-top: 20px; border-bottom: 1px solid var(--border);">
                    <div style="flex:1; background: var(--surface-hover); height: 40%; border-radius: 4px 4px 0 0; position:relative;"><span style="position:absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-muted);">Jan</span></div>
                    <div style="flex:1; background: var(--surface-hover); height: 50%; border-radius: 4px 4px 0 0; position:relative;"><span style="position:absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-muted);">Feb</span></div>
                    <div style="flex:1; background: var(--primary-light); height: 80%; border-radius: 4px 4px 0 0; position:relative;"><span style="position:absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-muted);">Mar</span></div>
                    <div style="flex:1; background: var(--primary); height: 100%; border-radius: 4px 4px 0 0; position:relative; box-shadow: 0 0 10px rgba(16,185,129,0.3);"><span style="position:absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-muted); font-weight: bold;">Apr</span></div>
                 </div>
            </div>
            
            <div class="card">
                <h3 class="mb-4">Recent Success Stories</h3>
                <div class="flex flex-col gap-4">
                    <div class="flex gap-4 items-center">
                        <img src="banquet.png" style="width: 80px; height: 80px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0;">
                        <div>
                            <h4 class="text-md">Grand Hotel Banquet</h4>
                            <p class="text-sm text-muted mb-1">Donated 200 meals from an event cancellation, feeding 3 shelters.</p>
                            <span class="text-xs font-semibold text-primary">Read More →</span>
                        </div>
                    </div>
                    <div style="height:1px; background:var(--border);"></div>
                    <div class="flex gap-4 items-center">
                        <img src="bakery.png" style="width: 80px; height: 80px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0;">
                        <div>
                            <h4 class="text-md">Fresh Market Bakery</h4>
                            <p class="text-sm text-muted mb-1">Partnered to eliminate 100% of their daily surplus waste.</p>
                            <span class="text-xs font-semibold text-primary">Read More →</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ---------------- INITIALIZATION ---------------- //
document.addEventListener('DOMContentLoaded', () => {
    navigate('login');
});
