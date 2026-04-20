// State to track current route
let currentRoute = 'login'; 
let userRole = 'donor'; // 'donor', 'ngo', or 'volunteer'

// Main Render Function
function navigate(route) {
    currentRoute = route;
    const appEl = document.getElementById('app');
    
    // Smooth transition out (optional step)
    appEl.innerHTML = ''; 
    
    let content = '';
    
    // Wrap non-login pages with Top Nav
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
    
    // Initialize icons after rendering
    if (window.lucide) {
        lucide.createIcons();
    }
    
    window.scrollTo(0, 0);
}

// ---------------- SCREENS ---------------- //

function renderTopNav() {
    return `
        <nav class="top-nav">
            <div class="layout-container flex items-center justify-between">
                <div class="brand-logo" style="cursor:pointer;" onclick="navigate('dashboard')">
                    <i data-lucide="leaf"></i> EcoBite
                </div>
                <div class="nav-links">
                    <button class="nav-link ${currentRoute === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')">Home</button>
                    <button class="nav-link ${currentRoute === 'donate' ? 'active' : ''}" onclick="navigate('donate')">Donate</button>
                    <button class="nav-link ${currentRoute === 'volunteer' ? 'active' : ''}" onclick="navigate('volunteer')">Task Hub</button>
                    <button class="nav-link ${currentRoute === 'ngo' ? 'active' : ''}" onclick="navigate('ngo')">NGO View</button>
                    <button class="nav-link ${currentRoute === 'analytics' ? 'active' : ''}" onclick="navigate('analytics')">Impact</button>
                    <div style="width: 1px; height: 24px; background: var(--border); margin: 0 8px;"></div>
                    <button class="btn btn-outline" style="padding: 8px; border-radius: 50%;"><i data-lucide="bell" style="width: 18px; height: 18px;"></i></button>
                    <button class="btn btn-outline" style="padding: 8px; border-radius: 50%;" onclick="navigate('login')"><i data-lucide="user" style="width: 18px; height: 18px;"></i></button>
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
                
               <div style="margin-top: 48px; width: 340px; height: 340px; border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden; position: relative; animation: fadeIn 0.8s ease-out;">
    <img src="hero.png" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" alt="A beautiful glowing box of fresh food">
</div>

            </div>
            
            <!-- Right Login Side -->
            <div style="padding: 48px; display: flex; flex-direction: column; justify-content: center; max-width: 500px; margin: 0 auto; width: 100%;">
                <h2 style="font-size: 2rem; margin-bottom: 8px;">Welcome Back</h2>
                <p class="text-muted mb-8 text-lg">Sign in to continue your impact.</p>
                
                <div class="flex gap-2 mb-8" style="background: var(--surface-hover); padding: 4px; border-radius: var(--radius-sm);">
                    <button class="btn flex-1" style="background: white; box-shadow: var(--shadow-sm);">Donor</button>
                    <button class="btn flex-1 text-muted">NGO</button>
                    <button class="btn flex-1 text-muted">Volunteer</button>
                </div>
                
                <div class="flex flex-col gap-4 mb-6">
                    <div>
                        <label class="text-sm font-semibold mb-2" style="display: block;">Email Address</label>
                        <input type="email" class="input-field" placeholder="hello@example.com">
                    </div>
                    <div>
                        <label class="text-sm font-semibold mb-2" style="display: block;">Password</label>
                        <input type="password" class="input-field" placeholder="••••••••">
                    </div>
                </div>
                
                <button class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 1rem; padding: 14px;" onclick="navigate('dashboard')">Sign In to Dashboard</button>
                
                <p class="text-center text-sm text-muted mt-8">Don't have an account? <span class="text-primary font-semibold" style="cursor:pointer;">Sign up here</span></p>
            </div>
        </div>
    `;
}

// 2. Home Dashboard
function renderDashboard() {
    return `
        <h1 class="mb-2">Donor Dashboard</h1>
        <p class="text-muted mb-8">Welcome back! Check your impact and nearby needs.</p>
        
        <!-- Emergency Banner -->
        <div class="card mb-8 flex items-center justify-between" style="border-left: 4px solid var(--danger); background: #FEF2F2;">
            <div class="flex items-center gap-4">
                <div style="background: #FEE2E2; padding: 12px; border-radius: 50%; color: var(--danger);">
                    <i data-lucide="alert-triangle"></i>
                </div>
                <div>
                    <h3 style="color: var(--danger);">Emergency Food Request</h3>
                    <p style="color: #991B1B; font-size: 0.875rem;">Local shelter in downtown needs hot meals for 50 people urgently.</p>
                </div>
            </div>
            <button class="btn" style="background: var(--danger); color: white;">Respond Now</button>
        </div>

        <div class="grid grid-cols-3 gap-6 mb-8">
            <!-- Hero Action Cards -->
            <div class="card flex flex-col items-center justify-center text-center" style="grid-column: span 1; background: var(--primary); color: white; cursor: pointer;" onclick="navigate('donate')">
                <i data-lucide="package-plus" style="width: 48px; height: 48px; margin-bottom: 16px;"></i>
                <h2>Donate Food</h2>
                <p style="opacity: 0.9; margin-top: 8px;">Schedule a pickup for excess food</p>
            </div>
            
            <div class="card" style="grid-column: span 2; display: flex; gap: 24px;">
                <div class="flex-1">
                    <h3 class="mb-4">Live Tracking Map Preview</h3>
                    <div style="width: 100%; height: 160px; background: #E2E8F0; border-radius: var(--radius-sm); border: 2px dashed #CBD5E1; display:flex; align-items:center; justify-content:center; color: #64748B;">
                        [ Map Interactive View ]<br>Active Pickups: 2
                    </div>
                </div>
            </div>
        </div>

        <h3 class="mb-4">Platform Impact Highlights</h3>
        <div class="grid grid-cols-4 gap-6 mb-8">
            <div class="card">
                <p class="text-muted text-sm font-semibold mb-1">Meals Saved</p>
                <h2 style="font-size: 2rem;">24,500</h2>
                <p class="text-sm text-primary flex items-center mt-2"><i data-lucide="trending-up" style="width:14px; margin-right:4px;"></i> +12% this week</p>
            </div>
            <div class="card">
                <p class="text-muted text-sm font-semibold mb-1">NGOs Connected</p>
                <h2 style="font-size: 2rem;">128</h2>
            </div>
            <div class="card">
                <p class="text-muted text-sm font-semibold mb-1">Active Volunteers</p>
                <h2 style="font-size: 2rem;">845</h2>
            </div>
            <div class="card">
                <p class="text-muted text-sm font-semibold mb-1">Carbon Offset (kg)</p>
                <h2 style="font-size: 2rem;">12.4k</h2>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-6">
            <div>
                <h3 class="mb-4">Recent Donation History</h3>
                <div class="flex flex-col gap-4">
                    <div class="card flex items-center justify-between" style="padding: 16px;">
                        <div class="flex items-center gap-4">
                            <div style="background: var(--surface-hover); padding: 12px; border-radius: var(--radius-sm);">
                                <i data-lucide="pizza" class="text-muted"></i>
                            </div>
                            <div>
                                <h4 style="font-size: 1rem;">15 Pasta Trays</h4>
                                <p class="text-sm text-muted">Donated 2 hrs ago • Delivered by John D.</p>
                            </div>
                        </div>
                        <span class="badge badge-success">Completed</span>
                    </div>
                    <div class="card flex items-center justify-between" style="padding: 16px;">
                        <div class="flex items-center gap-4">
                            <div style="background: var(--surface-hover); padding: 12px; border-radius: var(--radius-sm);">
                                <i data-lucide="apple" class="text-muted"></i>
                            </div>
                            <div>
                                <h4 style="font-size: 1rem;">Fresh Produce Box</h4>
                                <p class="text-sm text-muted">Donated yesterday • Delivered</p>
                            </div>
                        </div>
                        <span class="badge badge-success">Completed</span>
                    </div>
                </div>
            </div>
            
            <div>
                <h3 class="mb-4">Nearby NGOs</h3>
                <div class="flex flex-col gap-4">
                    <div class="card flex justify-between items-center" style="padding: 16px;">
                        <div>
                            <h4>City Hope Shelter</h4>
                            <p class="text-sm text-muted">Requires: Hot meals, Breads • 1.2 miles away</p>
                        </div>
                        <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.75rem;">View Needs</button>
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
                        <select class="input-field">
                            <option>Cooked Meals</option>
                            <option>Fresh Produce</option>
                            <option>Packaged/Canned</option>
                            <option>Bakery</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-sm font-semibold mb-2" style="display: block;">Quantity / Servings</label>
                        <input type="number" class="input-field" placeholder="e.g. 50 servings">
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="text-sm font-semibold mb-2" style="display: block;">Food Freshness Status / Description</label>
                    <textarea class="input-field" rows="3" placeholder="Prepared 2 hours ago. Needs to be consumed within 12 hours."></textarea>
                </div>
                
                <div class="mb-6">
                    <label class="text-sm font-semibold mb-2" style="display: block;">Upload Food Image (Optional)</label>
                    <div style="border: 2px dashed var(--border); border-radius: var(--radius-sm); padding: 32px; text-align: center; color: var(--text-muted); background: var(--surface-hover);">
                        <i data-lucide="image" style="width: 32px; height: 32px; margin-bottom: 8px;"></i>
                        <p>Click to upload or drag & drop</p>
                    </div>
                </div>
                
                <hr style="border: 0; border-top: 1px solid var(--border); margin: 24px 0;">
                
                <h3 class="mb-4 text-xl">Pickup Information</h3>
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div style="grid-column: span 2;">
                        <label class="text-sm font-semibold mb-2" style="display: block;">Pickup Address</label>
                        <input type="text" class="input-field" value="123 Corporate Blvd, 4th Floor">
                    </div>
                    <div>
                        <label class="text-sm font-semibold mb-2" style="display: block;">Requested Pickup Time</label>
                        <input type="time" class="input-field" value="14:30">
                    </div>
                </div>
                
                <div class="flex justify-end gap-4 mt-8">
                    <button class="btn btn-outline">Cancel</button>
                    <button class="btn btn-primary" onclick="navigate('tracking')">Submit Donation <i data-lucide="check" style="width:16px;"></i></button>
                </div>
            </div>
            
            <div>
                <div class="card mb-6">
                    <h3 class="mb-4">Progress Tracker</h3>
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-3">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--primary); color: white; display:flex; align-items:center; justify-content:center; font-size: 12px;"><i data-lucide="check" style="width:12px;"></i></div>
                            <span class="font-semibold text-sm">Enter Details</span>
                        </div>
                        <div style="width: 2px; height: 16px; background: var(--border); margin-left: 11px;"></div>
                        <div class="flex items-center gap-3">
                            <div style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--primary); display:flex; align-items:center; justify-content:center; font-size: 12px;">2</div>
                            <span class="text-muted text-sm">Review Logistics</span>
                        </div>
                        <div style="width: 2px; height: 16px; background: var(--border); margin-left: 11px;"></div>
                        <div class="flex items-center gap-3">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--surface-hover); color: var(--text-muted); display:flex; align-items:center; justify-content:center; font-size: 12px;">3</div>
                            <span class="text-muted text-sm">Confirm & Track</span>
                        </div>
                    </div>
                </div>
                
                <div class="card bg-primary-light" style="background: var(--primary-light); border: none;">
                    <h4 class="mb-2 text-primary font-semibold flex items-center gap-2"><i data-lucide="info" style="width:16px;"></i> Safety Guidelines</h4>
                    <p class="text-sm" style="color: var(--primary-hover);">Ensure all prepared food is kept at appropriate temperatures before pickup. Our volunteers carry insulated bags.</p>
                </div>
            </div>
        </div>
    `;
}

// 4. Volunteer Assignment Screen
function renderVolunteer() {
    return `
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="mb-2">Available Tasks</h1>
                <p class="text-muted">Pick up donations and deliver to NGOs in your vicinity.</p>
            </div>
            <div class="flex gap-2">
                <button class="btn btn-outline"><i data-lucide="filter" style="width:16px;"></i> Filter</button>
                <button class="btn btn-outline"><i data-lucide="map" style="width:16px;"></i> Map View</button>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-6">
            <!-- Task Card 1 -->
            <div class="card">
                <div class="flex justify-between items-start mb-4">
                    <span class="badge badge-danger flex items-center gap-1"><i data-lucide="clock" style="width:12px;"></i> High Priority</span>
                    <span class="text-lg font-semibold">$0</span>
                </div>
                <h3 class="mb-2 text-xl">50x Cooked Meals (Pasta)</h3>
                <p class="text-muted text-sm mb-6" style="line-height: 1.6;">Prepared 30 mins ago. Needs enclosed delivery.</p>
                
                <div class="flex flex-col gap-4 mb-8 relative">
                    <div style="position: absolute; left: 15px; top: 20px; bottom: 20px; width: 2px; border-left: 2px dashed var(--border);"></div>
                    <div class="flex gap-4 items-center z-10" style="background: var(--surface);">
                        <div style="background: var(--surface-hover); border-radius: 50%; padding: 8px;"><i data-lucide="map-pin" class="text-muted" style="width:16px;"></i></div>
                        <div>
                            <p class="text-xs text-muted mb-1">PICKUP at 2:00 PM</p>
                            <p class="text-sm font-semibold">Grand Hotel Banquet, 12th Street</p>
                        </div>
                    </div>
                    <div class="flex gap-4 items-center z-10" style="background: var(--surface);">
                        <div style="background: var(--primary-light); border-radius: 50%; padding: 8px; color: var(--primary);"><i data-lucide="flag" style="width:16px;"></i></div>
                        <div>
                            <p class="text-xs text-muted mb-1">DROPOFF (2.4 miles)</p>
                            <p class="text-sm font-semibold">City Hope Center</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-4">
                    <button class="btn btn-primary flex-1" onclick="navigate('tracking')">Accept Task</button>
                    <button class="btn btn-outline" style="width: auto;">Reject</button>
                </div>
            </div>
            
            <!-- Task Card 2 -->
            <div class="card">
                <div class="flex justify-between items-start mb-4">
                    <span class="badge" style="background: #E0F2FE; color: #0284C7;">Standard</span>
                </div>
                <h3 class="mb-2 text-xl">Bakery Surplus (Breads & Pastries)</h3>
                <p class="text-muted text-sm mb-6" style="line-height: 1.6;">Shelf-stable for 2 days. 2 large boxes.</p>
                
                <div class="flex flex-col gap-4 mb-8 relative">
                    <div style="position: absolute; left: 15px; top: 20px; bottom: 20px; width: 2px; border-left: 2px dashed var(--border);"></div>
                    <div class="flex gap-4 items-center z-10" style="background: var(--surface);">
                        <div style="background: var(--surface-hover); border-radius: 50%; padding: 8px;"><i data-lucide="map-pin" class="text-muted" style="width:16px;"></i></div>
                        <div>
                            <p class="text-xs text-muted mb-1">PICKUP at 4:30 PM</p>
                            <p class="text-sm font-semibold">Sunrise Bakery, West Ave</p>
                        </div>
                    </div>
                    <div class="flex gap-4 items-center z-10" style="background: var(--surface);">
                        <div style="background: var(--primary-light); border-radius: 50%; padding: 8px; color: var(--primary);"><i data-lucide="flag" style="width:16px;"></i></div>
                        <div>
                            <p class="text-xs text-muted mb-1">DROPOFF (1.1 miles)</p>
                            <p class="text-sm font-semibold">Community Food Bank</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-4">
                    <button class="btn btn-primary flex-1">Accept Task</button>
                    <button class="btn btn-outline" style="width: auto;">Reject</button>
                </div>
            </div>
        </div>
    `;
}

// 5. Live Tracking Screen
function renderTracking() {
    return `
        <div class="flex items-center mb-6">
            <button class="btn btn-outline mr-4" onclick="navigate('volunteer')" style="padding: 8px;"><i data-lucide="arrow-left" style="width:16px;height:16px;"></i></button>
            <h1>Live Tracking</h1>
            <span class="badge badge-warning ml-4">On the Way</span>
        </div>
        
        <div class="grid grid-cols-3 gap-6">
            <!-- Map Area -->
            <div class="card" style="grid-column: span 2; padding: 0; overflow: hidden; height: 600px; display: flex; flex-direction: column;">
                <div style="flex: 1; background: #E2E8F0; position: relative;">
                    <!-- Simulated Map Graphic -->
                    <div style="position: absolute; inset:0; display:flex; align-items:center; justify-content:center; flex-direction: column; color: var(--text-muted); opacity: 0.8; font-weight: 600;">
                        <i data-lucide="map" style="width:64px; height:64px; margin-bottom: 16px;"></i>
                        [ Interactive Map UI (Prototype) ]
                    </div>
                    <!-- Route visualization mockup -->
                    <svg style="position: absolute; inset: 0; width: 100%; height: 100%;" preserveAspectRatio="none" viewBox="0 0 100 100">
                         <path d="M20,80 Q40,40 80,20" stroke="var(--primary)" stroke-width="2" fill="none" stroke-dasharray="4" />
                         <circle cx="20" cy="80" r="3" fill="var(--surface)" stroke="var(--text-muted)" stroke-width="1.5" />
                         <circle cx="80" cy="20" r="3" fill="var(--surface)" stroke="var(--primary)" stroke-width="1.5" />
                         <!-- Moving vehicle dot -->
                         <circle cx="50" cy="48" r="4" fill="var(--primary)">
                            <animate attributeName="cx" values="20;80" dur="4s" repeatCount="indefinite" />
                            <animate attributeName="cy" values="80;20" dur="4s" repeatCount="indefinite" />
                         </circle>
                    </svg>
                </div>
            </div>
            
            <!-- Side Panel -->
            <div class="flex flex-col gap-6">
                <div class="card">
                    <h3 class="flex items-center gap-2 mb-4"><i data-lucide="clock" class="text-primary"></i> Est. Delivery: 14 mins</h3>
                    
                    <div style="background: var(--surface-hover); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 24px;">
                        <p class="text-sm font-semibold mb-1">Food Freshness Timer</p>
                        <div class="flex items-center justify-between mb-2">
                            <div style="width: 80%; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
                                <div style="width: 75%; height: 100%; background: var(--success);"></div>
                            </div>
                            <span class="text-xs font-semibold text-success">Good</span>
                        </div>
                        <p class="text-xs text-muted">Recommend delivery within 45 mins.</p>
                    </div>
                    
                    <h4 class="text-sm font-semibold text-muted mb-4 uppercase tracking-wider">Volunteer Details</h4>
                    <div class="flex items-center gap-4 mb-6">
                        <div style="width:48px; height:48px; border-radius:50%; background: #CBD5E1; overflow:hidden;">
                            <img src="https://ui-avatars.com/api/?name=Alex+Parker&background=CBD5E1&color=0F172A" style="width:100%; height:100%;" alt="Alex">
                        </div>
                        <div style="flex: 1;">
                            <h4 class="mb-0.5">Alex Parker</h4>
                            <p class="text-xs text-muted flex items-center"><i data-lucide="star" style="width:12px; margin-right:2px; color: var(--warning); fill: var(--warning);"></i> 4.9 (120 deliveries)</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <button class="btn btn-outline flex justify-center"><i data-lucide="phone"></i> Call</button>
                        <button class="btn btn-primary flex justify-center"><i data-lucide="message-square"></i> Message</button>
                    </div>
                </div>
                
                <div class="card">
                    <h4 class="mb-4">Task Status</h4>
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-3 opacity-50">
                            <i data-lucide="check-circle-2" class="text-primary"></i>
                            <span class="text-sm font-semibold">Assigned</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <i data-lucide="check-circle-2" class="text-primary"></i>
                            <span class="text-sm font-semibold">Pickup Complete</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <i data-lucide="clock" class="text-warning"></i>
                            <span class="text-sm font-semibold">On the Way</span>
                        </div>
                        <div class="flex items-center gap-3 opacity-50">
                            <i data-lucide="circle" class="text-muted"></i>
                            <span class="text-sm font-semibold text-muted">Delivered</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 6. NGO Dashboard
function renderNGO() {
    return `
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="mb-2">NGO Command Center</h1>
                <p class="text-muted">Manage incoming food, request resources, and trace impact.</p>
            </div>
            <button class="btn btn-primary"><i data-lucide="plus"></i> Request Food</button>
        </div>
        
        <div class="grid grid-cols-4 gap-6 mb-8">
            <div class="card">
                <p class="text-muted text-sm font-semibold mb-1">Total Received (Week)</p>
                <h2 style="font-size: 2rem;">450 lbs</h2>
            </div>
            <div class="card bg-primary-light" style="background: var(--primary-light); border: none;">
                <p class="text-primary text-sm font-semibold mb-1">Incoming Now</p>
                <h2 style="font-size: 2rem; color: var(--primary-hover);">2 deliveries</h2>
            </div>
            <div class="card">
                <p class="text-muted text-sm font-semibold mb-1">Pending Requests</p>
                <h2 style="font-size: 2rem;">1</h2>
            </div>
            <div class="card">
                <p class="text-muted text-sm font-semibold mb-1">Meals Distributed</p>
                <h2 style="font-size: 2rem;">1,200</h2>
            </div>
        </div>
        
        <div class="grid grid-cols-3 gap-6">
            <div class="card" style="grid-column: span 2;">
                <h3 class="mb-4">Active Incoming Deliveries</h3>
                
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
                            <th style="padding: 12px 8px;">Donation Item</th>
                            <th style="padding: 12px 8px;">Volunteer</th>
                            <th style="padding: 12px 8px;">ETA</th>
                            <th style="padding: 12px 8px;">Status</th>
                            <th style="padding: 12px 8px;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 16px 8px; font-weight: 500;">50x Pasta Trays</td>
                            <td style="padding: 16px 8px;">Alex P.</td>
                            <td style="padding: 16px 8px; font-weight: 600;">14 mins</td>
                            <td style="padding: 16px 8px;"><span class="badge badge-warning">On Route</span></td>
                            <td style="padding: 16px 8px;"><button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" onclick="navigate('tracking')">Track</button></td>
                        </tr>
                        <tr>
                            <td style="padding: 16px 8px; font-weight: 500;">20 Fresh Salads</td>
                            <td style="padding: 16px 8px;">Maria S.</td>
                            <td style="padding: 16px 8px; font-weight: 600;">--</td>
                            <td style="padding: 16px 8px;"><span class="badge" style="background:var(--surface-hover);">Pending Pickup</span></td>
                            <td style="padding: 16px 8px;"><button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="card">
                <h3 class="mb-4">Quick Analytics</h3>
                <!-- Simple CSS Bar Chart -->
                <div class="flex flex-col gap-4 mb-6">
                    <div>
                        <div class="flex justify-between text-sm mb-1"><span>Cooked Meals</span> <span class="font-semibold">65%</span></div>
                        <div style="width: 100%; height: 8px; background: var(--surface-hover); border-radius: 4px; overflow: hidden;">
                            <div style="width: 65%; height: 100%; background: var(--primary);"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1"><span>Produce</span> <span class="font-semibold">25%</span></div>
                        <div style="width: 100%; height: 8px; background: var(--surface-hover); border-radius: 4px; overflow: hidden;">
                            <div style="width: 25%; height: 100%; background: #3B82F6;"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1"><span>Bakery/Other</span> <span class="font-semibold">10%</span></div>
                        <div style="width: 100%; height: 8px; background: var(--surface-hover); border-radius: 4px; overflow: hidden;">
                            <div style="width: 10%; height: 100%; background: var(--warning);"></div>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-outline" style="width: 100%;" onclick="navigate('analytics')">View Full Report</button>
            </div>
        </div>
    `;
}

// 7. Impact / Analytics Screen
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
                 <!-- CSS mock chart -->
                 <div class="flex items-end gap-4 h-[200px]" style="height: 200px; padding-top: 20px; border-bottom: 1px solid var(--border);">
                    <div style="flex:1; background: var(--surface-hover); height: 40%; border-radius: 4px 4px 0 0; position:relative;">
                        <span style="position:absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-muted);">Jan</span>
                    </div>
                    <div style="flex:1; background: var(--surface-hover); height: 50%; border-radius: 4px 4px 0 0; position:relative;">
                        <span style="position:absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-muted);">Feb</span>
                    </div>
                    <div style="flex:1; background: var(--primary-light); height: 80%; border-radius: 4px 4px 0 0; position:relative;">
                        <span style="position:absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-muted);">Mar</span>
                    </div>
                    <div style="flex:1; background: var(--primary); height: 100%; border-radius: 4px 4px 0 0; position:relative; box-shadow: 0 0 10px rgba(16,185,129,0.3);">
                        <span style="position:absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-muted); font-weight: bold;">Apr</span>
                    </div>
                 </div>
            </div>
            
            <div class="card">
                <h3 class="mb-4">Recent Success Stories</h3>
                <div class="flex flex-col gap-4">
                    <div class="flex gap-4 items-center">
                        <img src="https://images.unsplash.com/photo-1593113565214-80afcb4dd27b?q=80&w=150&auto=format&fit=crop" style="width: 80px; height: 80px; border-radius: var(--radius-sm); object-fit: cover;">
                        <div>
                            <h4 class="text-md">Grand Hotel Banquet</h4>
                            <p class="text-sm text-muted mb-1">Donated 200 meals from an event cancellation, feeding 3 shelters.</p>
                            <span class="text-xs font-semibold text-primary">Read More →</span>
                        </div>
                    </div>
                    <div style="height:1px; background:var(--border);"></div>
                    <div class="flex gap-4 items-center">
                        <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=150&auto=format&fit=crop" style="width: 80px; height: 80px; border-radius: var(--radius-sm); object-fit: cover;">
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
