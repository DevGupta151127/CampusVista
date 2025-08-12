// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// Logout functionality
function logout() {
    window.location.replace("login.html");
}

// DOM Elements
const studentName = document.getElementById('studentName');
const welcomeName = document.getElementById('welcomeName');
const logoutBtn = document.getElementById('logoutBtn');
const sidebar = document.querySelector('.sidebar');
const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
const sidebarToggle = document.querySelector('.sidebar-toggle');

// Payment Method Handling
const paymentMethod = document.getElementById('paymentMethod');
const paymentDetails = document.getElementById('paymentDetails');
const feePaymentForm = document.getElementById('feePaymentForm');

// Fetch student data from backend
async function fetchStudentData() {
    const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
    if (!studentData.rollNumber) return null;
    try {
        const res = await fetch(`https://campusvista-ziwq.onrender.com/api/students/${studentData.rollNumber}`);
        if (!res.ok) throw new Error('Failed to fetch student data');
        return await res.json();
    } catch (err) {
        console.error('Error fetching student data:', err);
        return null;
    }
}

// Render dashboard sections with real data
async function renderDashboard() {
    const student = await fetchStudentData();
    if (!student) return;
    
    // Set names
    if (studentName) studentName.textContent = student.name;
    if (welcomeName) welcomeName.textContent = student.name;

    // Render Academics section
    renderAcademicsSection(student);

    // Render fee summary
    renderFeeSection(student);
}

// Render Academics Section
async function renderAcademicsSection(student) {
    const academicSection = document.getElementById('academic');
    if (!academicSection || !student.rollNumber) return;
    academicSection.innerHTML = `<div class='text-center py-5'><div class='spinner-border text-primary' role='status'></div><div>Loading courses...</div></div>`;
    try {
        const res = await fetch(`https://campusvista-ziwq.onrender.com/api/courses/${student.rollNumber}/courses`);
        if (!res.ok) throw new Error('Failed to fetch courses');
        const courses = await res.json();
        
        let html = `
        <div class="card mb-4 shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="fas fa-graduation-cap me-2"></i>My Courses</h5>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Instructor</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>`;
        
        courses.forEach(course => {
            const gradeBadge = course.grade 
                ? `<span class='badge bg-success fs-6'><i class='fas fa-star me-1'></i>${course.grade}</span>` 
                : '<span class="text-muted">-</span>';
            html += `
            <tr>
                <td class="fw-bold">${course.code}</td>
                <td>${course.name}</td>
                <td>${course.instructor}</td>
                <td>${gradeBadge}</td>
            </tr>`;
        });

        html += `</tbody></table></div></div></div>`;
        academicSection.innerHTML = html;
    } catch (err) {
        academicSection.innerHTML = '<div class="alert alert-danger">Failed to load courses. Please try again later.</div>';
        console.error('Error loading courses:', err);
    }
}

// Render Fee Section
async function renderFeeSection(student) {
    const feeSection = document.getElementById('fees');
    if (!feeSection || !student.rollNumber) return;
    
    try {
        // Fetch fee data
        const res = await fetch(`https://campusvista-ziwq.onrender.com/api/fees/${student.rollNumber}`);
        if (!res.ok) throw new Error('Failed to fetch fee data');
        const feeData = await res.json();
        
        // Update fee summary
        updateFeeSummary(feeData);
        
        // Update payment history
        updatePaymentHistory(feeData.transactions || []);
        
    } catch (err) {
        feeSection.innerHTML = '<div class="alert alert-danger">Failed to load fee details. Please try again later.</div>';
        console.error('Error loading fee data:', err);
    }
}

// Update fee summary
function updateFeeSummary(feeData) {
    const feeSummary = document.querySelector('.fee-summary');
    if (!feeSummary) return;

    feeSummary.innerHTML = `
        <div class="fee-item d-flex justify-content-between mb-3">
            <span>Total Fees:</span>
            <strong>₹${feeData.totalFees?.toLocaleString('en-IN') || '0'}</strong>
        </div>
        <div class="fee-item d-flex justify-content-between mb-3">
            <span>Paid Amount:</span>
            <strong class="text-success">₹${feeData.paidAmount?.toLocaleString('en-IN') || '0'}</strong>
        </div>
        <div class="fee-item d-flex justify-content-between mb-3">
            <span>Due Amount:</span>
            <strong class="text-danger">₹${feeData.dueAmount?.toLocaleString('en-IN') || '0'}</strong>
        </div>
        <div class="fee-item d-flex justify-content-between">
            <span>Due Date:</span>
            <strong class="text-warning">${feeData.dueDate || 'N/A'}</strong>
        </div>
    `;
}

// Update payment history
function updatePaymentHistory(transactions) {
    const tableBody = document.querySelector('#fees table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = transactions.map(transaction => `
        <tr>
            <td>${transaction.transactionId || 'N/A'}</td>
            <td>${transaction.date || 'N/A'}</td>
            <td>₹${transaction.amount?.toLocaleString('en-IN') || '0'}</td>
            <td>${transaction.method || 'N/A'}</td>
            <td><span class="badge bg-${transaction.status === 'Success' ? 'success' : 'danger'}">${transaction.status || 'Pending'}</span></td>
            <td><button class="btn btn-sm btn-outline-primary" onclick="downloadReceipt('${transaction.transactionId || ''}')">
                <i class="fas fa-download me-1"></i>Download
            </button></td>
        </tr>
    `).join('');
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    renderDashboard();
});

// Check Authentication
function checkAuth() {
    try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
        
        if (!isAuthenticated || !studentData.rollNumber) {
            window.location.href = 'login.html';
            return;
        }
        
        // Update student name
        if (studentName) studentName.textContent = studentData.name || 'Student';
        if (welcomeName) welcomeName.textContent = studentData.name || 'Student';
        
    } catch (error) {
        console.error('Auth Check Error:', error);
        window.location.href = 'login.html';
    }
}

// Handle Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            // Clear authentication data
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('studentData');
            
            // Redirect to login page
            window.location.href = 'login.html';
        }
    });
}

// Handle Sidebar Navigation
function handleSidebarNavigation(e) {
    try {
        e.preventDefault();
        
        // Remove active class from all links
        sidebarLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Get section id from href
        const sectionId = this.getAttribute('href').substring(1);
        
        // Load section content
        loadSection(sectionId);
        
        // Close sidebar on mobile
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('show');
        }
    } catch (error) {
        console.error('Sidebar Navigation Error:', error);
    }
}

// Toggle Sidebar on Mobile
function toggleSidebar() {
    try {
        sidebar.classList.toggle('show');
    } catch (error) {
        console.error('Toggle Sidebar Error:', error);
    }
}

// Add toggle button for mobile
const toggleBtn = document.createElement('button');
toggleBtn.className = 'btn btn-primary d-lg-none position-fixed bottom-0 end-0 m-3 rounded-circle';
toggleBtn.style.width = '50px';
toggleBtn.style.height = '50px';
toggleBtn.style.zIndex = '1000';
toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
toggleBtn.onclick = toggleSidebar;
document.body.appendChild(toggleBtn);

// Close sidebar when clicking outside
document.addEventListener('click', function(e) {
    try {
        if (window.innerWidth <= 992 && 
            !sidebar.contains(e.target) && 
            !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    } catch (error) {
        console.error('Click Outside Error:', error);
    }
});

// Handle Window Resize
window.addEventListener('resize', function() {
    try {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('show');
        }
    } catch (error) {
        console.error('Window Resize Error:', error);
    }
});

// Update Stats
function updateStats() {
    try {
        const stats = {
            courses: mockData.academic.courses.length,
            attendance: mockData.attendance.overall,
            assignments: mockData.assignments.pending.length,
            notifications: 2
        };
        
        console.log('Updating Stats:', stats);
        
        // Update stat cards with animation
        document.querySelectorAll('.stat-card').forEach(card => {
            const value = card.querySelector('h3');
            const label = card.querySelector('p');
            const targetValue = parseInt(value.textContent);
            
            animateValue(value, 0, targetValue, 1000);
            
            if (label.textContent.includes('Courses')) {
                value.textContent = stats.courses;
            } else if (label.textContent.includes('Attendance')) {
                value.textContent = stats.attendance + '%';
            } else if (label.textContent.includes('Assignments')) {
                value.textContent = stats.assignments;
            } else if (label.textContent.includes('Notifications')) {
                value.textContent = stats.notifications;
            }
        });
    } catch (error) {
        console.error('Update Stats Error:', error);
    }
}

// Animate value counter
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Handle Section Loading
function loadSection(sectionId) {
    try {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show selected section
        const section = document.getElementById(sectionId);
        if (!section) {
            console.error('Section not found:', sectionId);
            return;
        }
        
        console.log('Loading Section:', sectionId);
        
        // For overview section, just show it without loading state
        if (sectionId === 'overview') {
            section.style.display = 'block';
            return;
        }

        // For fees section, load fee data
        if (sectionId === 'fees') {
            section.style.display = 'block';
            loadFeesSection();
            return;
        }
        
        // Show loading state for other sections
        section.style.display = 'block';
        section.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
        
        // Simulate API call
        setTimeout(() => {
            let content = '';
            
            switch(sectionId) {
                case 'academic':
                    content = generateAcademicContent();
                    break;
                case 'attendance':
                    content = generateAttendanceContent();
                    break;
                case 'assignments':
                    content = generateAssignmentsContent();
                    break;
                default:
                    content = `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            This section is under development.
                        </div>
                    `;
            }
            
            section.innerHTML = content;
            console.log('Section loaded:', sectionId);
        }, 1000);
    } catch (error) {
        console.error('Load Section Error:', error);
    }
}

// Generate Academic Section Content
function generateAcademicContent() {
    try {
        return `
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3 class="card-title">${mockData.academic.gpa}</h3>
                            <p class="text-muted">Current GPA</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3 class="card-title">${mockData.academic.credits}</h3>
                            <p class="text-muted">Credits Completed</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3 class="card-title">${mockData.academic.courses.length}</h3>
                            <p class="text-muted">Current Courses</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Current Courses</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Code</th>
                                    <th>Instructor</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${mockData.academic.courses.map(course => `
                                    <tr>
                                        <td>${course.name}</td>
                                        <td>${course.code}</td>
                                        <td>${course.instructor}</td>
                                        <td>${course.grade}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Generate Academic Content Error:', error);
        return '<div class="alert alert-danger">Error loading academic content</div>';
    }
}

// Generate Attendance Section Content
function generateAttendanceContent() {
    try {
        return `
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3 class="card-title">${mockData.attendance.overall}%</h3>
                            <p class="text-muted">Overall Attendance</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Subject-wise Attendance</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${mockData.attendance.subjects.map(subject => `
                                    <tr>
                                        <td>${subject.name}</td>
                                        <td>${subject.percentage}%</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Generate Attendance Content Error:', error);
        return '<div class="alert alert-danger">Error loading attendance content</div>';
    }
}

// Generate Assignments Section Content
function generateAssignmentsContent() {
    try {
        return `
            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Pending Assignments</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                ${mockData.assignments.pending.map(assignment => `
                                    <div class="list-group-item">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 class="mb-1">${assignment.title}</h6>
                                                <small class="text-muted">${assignment.subject} - Due: ${assignment.dueDate}</small>
                                            </div>
                                            <button class="btn btn-sm btn-primary">Submit</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Completed Assignments</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                ${mockData.assignments.completed.map(assignment => `
                                    <div class="list-group-item">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 class="mb-1">${assignment.title}</h6>
                                                <small class="text-muted">Submitted: ${assignment.submittedDate}</small>
                                            </div>
                                            <span class="badge bg-success">Grade: ${assignment.grade}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Generate Assignments Content Error:', error);
        return '<div class="alert alert-danger">Error loading assignments content</div>';
    }
}

// UPI Validation Constants
const UPI_APPS = {
    'gpay': ['@okaxis', '@okhdfcbank', '@okicici', '@oksbi', '@okbob'],
    'phonepe': ['@ybl', '@ibl', '@axl'],
    'paytm': ['@paytm'],
    'bhim': ['@upi'],
    'amazonpay': ['@apl'],
    'whatsapp': ['@ybl'],
    'naviaxis': ['@naviaxis'],
    'axis': ['@axl'],
    'hdfc': ['@hdfcbank'],
    'icici': ['@icici'],
    'sbi': ['@sbi'],
    'bob': ['@bob']
};

const UPI_REGEX = /^[a-zA-Z0-9._-]{3,50}@[a-zA-Z]{3,}$/;
const INVALID_CHARS_REGEX = /[^a-zA-Z0-9._-]/;
const COMMON_SCAM_PATTERNS = [
    'admin',
    'support',
    'help',
    'service',
    'official',
    'verify',
    'update',
    'secure',
    'bank',
    'customer',
    'care'
];

async function checkInternetConnection() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch('https://www.google.com/favicon.ico', {
            mode: 'no-cors',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return true;
    } catch (error) {
        return false;
    }
}

async function verifyUPI(upiId) {
    try {
        // Check internet connection first
        const isOnline = await checkInternetConnection();
        if (!isOnline) {
            throw new Error('No internet connection. Please check your connection and try again.');
        }

        // Basic format validation
        if (!UPI_REGEX.test(upiId)) {
            throw new Error('Invalid UPI ID format. Please enter a valid UPI ID.');
        }

        // Extract username and handle
        const [username, handle] = upiId.split('@');
        
        // Additional username validation
        if (INVALID_CHARS_REGEX.test(username)) {
            throw new Error('Username contains invalid characters. Only letters, numbers, dots, underscores, and hyphens are allowed.');
        }

        // Check for common scam patterns in username
        const usernameLower = username.toLowerCase();
        for (const pattern of COMMON_SCAM_PATTERNS) {
            if (usernameLower.includes(pattern)) {
                throw new Error('This UPI ID appears to be suspicious. Please use your personal UPI ID.');
            }
        }

        // Validate handle against known UPI apps
        const isValidHandle = Object.values(UPI_APPS).some(appHandles => 
            appHandles.includes('@' + handle)
        );
        
        if (!isValidHandle) {
            throw new Error('Invalid UPI handle. Please use a registered UPI app.');
        }

        // Online verification with the payment gateway
        try {
            // Simulate API call to verify UPI ID
            const response = await Promise.race([
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ 
                            isValid: true, 
                            message: 'UPI ID verified successfully' 
                        });
                    }, 1000);
                }),
                new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error('Verification timeout. Please try again.'));
                    }, 10000); // 10 second timeout
                })
            ]);

            return response;
        } catch (apiError) {
            throw new Error('Unable to verify UPI ID with payment gateway. Please try again later.');
        }
    } catch (error) {
        console.error('UPI Verification Error:', error);
        return {
            isValid: false,
            message: error.message || 'UPI verification failed'
        };
    }
}

async function verifyUPIHandler() {
    const upiInput = document.getElementById('upiId');
    const verifyButton = document.getElementById('verifyUpiButton');
    const upiStatus = document.getElementById('upiStatus');
    
    if (!upiInput || !verifyButton || !upiStatus) {
        console.error('Required UPI elements not found');
        return;
    }

    try {
        // Show loading state
        verifyButton.disabled = true;
        verifyButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verifying...';
        upiStatus.textContent = '';
        
        const upiId = upiInput.value.trim();

        // First check internet connection
        const isOnline = await checkInternetConnection();
        if (!isOnline) {
            upiStatus.innerHTML = '<span class="text-warning"><i class="fas fa-exclamation-triangle"></i> No internet connection. Only basic format validation performed.</span>';
            
            // Do basic offline validation
            const isValidFormat = UPI_REGEX.test(upiId);
            const [username, handle] = upiId.split('@');
            const isValidUsername = username.length >= 3 && username.length <= 50;
            const isValidHandle = Object.values(UPI_APPS).some(appHandle => '@' + handle === appHandle);
            
            if (isValidFormat && isValidUsername && isValidHandle) {
                upiInput.classList.add('is-valid');
                upiInput.classList.remove('is-invalid');
                document.querySelector('button[type="submit"]').disabled = false;
                upiStatus.innerHTML += '<br><small class="text-muted">Note: Full verification will be performed when payment is processed.</small>';
            } else {
                upiInput.classList.add('is-invalid');
                upiInput.classList.remove('is-valid');
                document.querySelector('button[type="submit"]').disabled = true;
                upiStatus.innerHTML = '<span class="text-danger"><i class="fas fa-times-circle"></i> Invalid UPI ID format</span>';
            }
            return;
        }
        
        // If online, proceed with full verification
        const result = await verifyUPI(upiId);
        
        // Update UI based on verification result
        if (result.isValid) {
            upiStatus.innerHTML = '<span class="text-success"><i class="fas fa-check-circle"></i> ' + result.message + '</span>';
            upiInput.classList.add('is-valid');
            upiInput.classList.remove('is-invalid');
            document.querySelector('button[type="submit"]').disabled = false;
        } else {
            upiStatus.innerHTML = '<span class="text-danger"><i class="fas fa-times-circle"></i> ' + result.message + '</span>';
            upiInput.classList.add('is-invalid');
            upiInput.classList.remove('is-valid');
            document.querySelector('button[type="submit"]').disabled = true;
        }
    } catch (error) {
        console.error('UPI Handler Error:', error);
        upiStatus.innerHTML = '<span class="text-danger"><i class="fas fa-times-circle"></i> Verification failed. Please try again.</span>';
        upiInput.classList.add('is-invalid');
        upiInput.classList.remove('is-valid');
    } finally {
        // Reset button state
        verifyButton.disabled = false;
        verifyButton.innerHTML = 'Verify UPI';
    }
}

// Update payment method handler to include QR code option
paymentMethod.addEventListener('change', function(e) {
    const method = e.target.value;
    let html = '';
    
    if (method === 'upi') {
        html = `
            <div class="mb-3">
                <div class="d-flex justify-content-center mb-3">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-primary active" data-upi-mode="id">Enter UPI ID</button>
                        <button type="button" class="btn btn-outline-primary" data-upi-mode="qr">Scan QR Code</button>
                    </div>
                </div>
                
                <div id="upiIdSection">
                    <label for="upiId" class="form-label">UPI ID</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="upiId" placeholder="yourname@upi" required>
                        <button class="btn btn-outline-primary" type="button" id="verifyUpiButton" onclick="verifyUPIHandler()">
                            Verify UPI
                        </button>
                    </div>
                    <div id="upiStatus" class="form-text mt-2"></div>
                </div>

                <div id="upiQRSection" style="display: none;">
                    <div class="text-center">
                        <div id="qrCodeContainer" class="mb-3">
                            <!-- QR code will be generated here -->
                        </div>
                        <p class="text-muted mb-2">Scan this QR code with any UPI app to pay</p>
                        <div id="qrPaymentStatus" class="alert alert-info">
                            Waiting for payment...
                            <div class="spinner-border spinner-border-sm ms-2" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-2">
                    <small class="text-muted">Supported UPI Apps:</small>
                    <div class="d-flex gap-2 mt-1">
                        <img src="assets/images/gpay.png" alt="Google Pay" title="Google Pay" height="25">
                        <img src="assets/images/phonepe.png" alt="PhonePe" title="PhonePe" height="25">
                        <img src="assets/images/paytm.png" alt="Paytm" title="Paytm" height="25">
                        <img src="assets/images/bhim.png" alt="BHIM" title="BHIM" height="25">
                    </div>
                </div>
            </div>
        `;
    } else if (method === 'card') {
        html = `
            <div class="mt-3">
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label">Card Number</label>
                        <input type="text" class="form-control" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Expiry Date</label>
                        <input type="text" class="form-control" placeholder="MM/YY" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">CVV</label>
                        <input type="password" class="form-control" placeholder="***" required maxlength="3">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Card Holder Name</label>
                        <input type="text" class="form-control" placeholder="Name on card" required>
                    </div>
                </div>
            </div>
        `;
    } else if (method === 'netbanking') {
        html = `
            <div class="mt-3">
                <label class="form-label">Select Bank</label>
                <select class="form-select" required>
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                </select>
            </div>
        `;
    }
    
    paymentDetails.innerHTML = html;
    
    // Add event listeners for UPI mode toggle buttons
    if (method === 'upi') {
        const upiModeButtons = document.querySelectorAll('[data-upi-mode]');
        const upiIdSection = document.getElementById('upiIdSection');
        const upiQRSection = document.getElementById('upiQRSection');
        
        upiModeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                upiModeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Show/hide sections
                const mode = this.getAttribute('data-upi-mode');
                if (mode === 'qr') {
                    upiIdSection.style.display = 'none';
                    upiQRSection.style.display = 'block';
                    generateQRCode();
                } else {
                    upiIdSection.style.display = 'block';
                    upiQRSection.style.display = 'none';
                    stopPaymentStatusCheck();
                }
            });
        });
    }
});

// Function to generate QR code and start payment monitoring
async function generateQRCode() {
    const amount = document.getElementById('paymentAmount').value;
    if (!amount) {
        showNotification('Please enter payment amount first', 'warning');
        return;
    }

    const qrContainer = document.getElementById('qrCodeContainer');
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    
    try {
        // Create a unique payment reference
        const paymentRef = `FEE${Date.now()}`;
        
        // Show static UPI QR code with your details
        qrContainer.innerHTML = `
            <div class="text-center">
                <img src="assets/images/upi-qr.png" alt="UPI QR Code" class="img-fluid" style="max-width: 250px;">
                <div class="mt-3">
                    <p class="mb-1"><strong>Amount to Pay:</strong> ₹${parseFloat(amount).toLocaleString('en-IN')}</p>
                    <p class="mb-1"><strong>UPI ID:</strong> <span id="upiIdDisplay">devgupta4589@naviaxis</span></p>
                    <button class="btn btn-sm btn-outline-primary mt-2" onclick="copyUPIId()">
                        <i class="fas fa-copy me-1"></i>Copy UPI ID
                    </button>
                </div>
                <div class="mt-3">
                    <small class="text-muted">
                        1. Scan QR or copy UPI ID<br>
                        2. Enter amount: ₹${parseFloat(amount).toLocaleString('en-IN')}<br>
                        3. Complete payment in your UPI app<br>
                        4. Wait for confirmation
                    </small>
                </div>
            </div>
        `;

        // Start checking payment status
        startPaymentStatusCheck(paymentRef);
        
    } catch (error) {
        console.error('QR Generation Error:', error);
        showNotification('Failed to show QR code. Please try again.', 'danger');
    }
}

// Function to copy UPI ID
function copyUPIId() {
    const upiId = document.getElementById('upiIdDisplay').textContent;
    navigator.clipboard.writeText(upiId).then(() => {
        showNotification('UPI ID copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy UPI ID', 'danger');
    });
}

// Function to check payment status
async function checkPaymentStatus(paymentRef) {
    try {
        // This would be replaced with actual API call to your backend
        const response = await fetch('/api/check-payment-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentRef })
        });

        if (!response.ok) {
            throw new Error('Failed to check payment status');
        }

        const result = await response.json();
        return result.status;
    } catch (error) {
        console.error('Payment Status Check Error:', error);
        return 'pending';
    }
}

let statusCheckInterval;

// Function to start payment status checking
function startPaymentStatusCheck(paymentRef) {
    const statusElement = document.getElementById('qrPaymentStatus');
    
    statusCheckInterval = setInterval(async () => {
        const status = await checkPaymentStatus(paymentRef);
        
        if (status === 'completed') {
            statusElement.className = 'alert alert-success';
            statusElement.innerHTML = '<i class="fas fa-check-circle me-2"></i>Payment successful!';
            
            // Update fee summary and payment history
            const amount = parseFloat(document.getElementById('paymentAmount').value);
            updatePaymentData(amount, paymentRef);
            
            // Stop checking
            stopPaymentStatusCheck();
            
        } else if (status === 'failed') {
            statusElement.className = 'alert alert-danger';
            statusElement.innerHTML = '<i class="fas fa-times-circle me-2"></i>Payment failed. Please try again.';
            stopPaymentStatusCheck();
        }
    }, 5000); // Check every 5 seconds
}

// Function to stop payment status checking
function stopPaymentStatusCheck() {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
    }
}

// Function to update payment data after successful payment
function updatePaymentData(amount, transactionId) {
    // Update mock data
    mockData.fees.paidAmount += amount;
    mockData.fees.dueAmount -= amount;
    
    // Add transaction to history
    const transaction = {
        transactionId: transactionId,
        date: new Date().toLocaleDateString('en-GB'),
        amount: amount,
        method: 'UPI (QR)',
        status: 'Success'
    };
    mockData.fees.transactions.unshift(transaction);

    // Update UI
    updateFeeSummary(mockData.fees);
    updatePaymentHistory(mockData.fees.transactions);
    
    // Show success notification
    showNotification('Payment successful! Your fee details have been updated.', 'success');
}

// Function to process payment using Razorpay
async function processPayment(paymentData) {
    try {
        const studentData = JSON.parse(localStorage.getItem('studentData'));
        
        // Create Razorpay order
        const orderResponse = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: paymentData.amount,
                currency: 'INR',
                receipt: `fee_${Date.now()}`,
                payment_capture: 1, // Auto capture the payment
                notes: {
                    studentId: studentData.rollNumber,
                    studentName: studentData.name,
                    paymentType: 'College Fees'
                }
            })
        });
        
        if (!orderResponse.ok) {
            throw new Error('Failed to create payment order');
        }

        const orderData = await orderResponse.json();
        
        // Configure Razorpay payment options
        const options = {
            key: razorpayKey, // Your Razorpay Key ID
            amount: paymentData.amount * 100, // Amount in paise
            currency: 'INR',
            name: 'CampusVista',
            description: 'Fee Payment',
            order_id: orderData.id,
            prefill: {
                name: studentData.name,
                email: studentData.email,
                contact: studentData.phone
            },
            notes: {
                studentId: studentData.rollNumber,
                paymentType: 'fees'
            },
            theme: {
                color: '#2c3e50'
            },
            handler: function(response) {
                // Verify payment signature
                verifyPayment(response, orderData);
            }
        };

        // If UPI payment method is selected
        if (paymentData.method === 'upi') {
            const upiId = document.getElementById('upiId').value;
            if (!upiId) {
                throw new Error('Please enter UPI ID');
            }
            options.method = 'upi';
            options.upi = {
                vpa: upiId,
                flow: 'collect'  // Collect payment directly
            };
        }

        // Initialize Razorpay payment
        const razorpay = new Razorpay(options);
        razorpay.open();

    } catch (error) {
        console.error('Payment Error:', error);
        showNotification(error.message || 'Payment failed! Please try again.', 'danger');
        throw error;
    }
}

// Function to verify payment with backend
async function verifyPayment(paymentResponse, orderData) {
    try {
        const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                order: orderData
            })
        });

        if (!response.ok) {
            throw new Error('Payment verification failed');
        }

        const result = await response.json();

        if (result.verified) {
            // Update UI with success
            showNotification('Payment successful! Amount will be credited to institute account within 24-48 hours.', 'success');
            
            // Update payment history
            const transaction = {
                transactionId: paymentResponse.razorpay_payment_id,
                date: new Date().toLocaleDateString('en-GB'),
                amount: orderData.amount / 100,
                method: 'UPI',
                status: 'Success'
            };

            // Update local data
            mockData.fees.paidAmount += transaction.amount;
            mockData.fees.dueAmount -= transaction.amount;
            mockData.fees.transactions.unshift(transaction);

            // Update UI
            updateFeeSummary(mockData.fees);
            updatePaymentHistory(mockData.fees.transactions);
        } else {
            throw new Error('Payment verification failed');
        }
    } catch (error) {
        console.error('Verification Error:', error);
        showNotification('Payment verification failed! Please contact support.', 'danger');
    }
}

// Function to fetch fee details
async function fetchFeeDetails() {
    try {
        // This will be replaced with actual API call
        // const response = await fetch('/api/student/fees');
        // const data = await response.json();
        
        // Using mock data for now
        return mockData.fees;
    } catch (error) {
        console.error('Error fetching fee details:', error);
        throw error;
    }
}

// Function to update fee summary
function updateFeeSummary(feeData) {
    const feeSummary = document.querySelector('.fee-summary');
    if (!feeSummary) return;

    feeSummary.innerHTML = `
        <div class="fee-item d-flex justify-content-between mb-3">
            <span>Total Fees:</span>
            <strong>₹${feeData.totalFees.toLocaleString('en-IN')}</strong>
        </div>
        <div class="fee-item d-flex justify-content-between mb-3">
            <span>Paid Amount:</span>
            <strong class="text-success">₹${feeData.paidAmount.toLocaleString('en-IN')}</strong>
        </div>
        <div class="fee-item d-flex justify-content-between mb-3">
            <span>Due Amount:</span>
            <strong class="text-danger">₹${feeData.dueAmount.toLocaleString('en-IN')}</strong>
        </div>
        <div class="fee-item d-flex justify-content-between">
            <span>Due Date:</span>
            <strong class="text-warning">${feeData.dueDate}</strong>
        </div>
    `;
}

// Function to update payment history
function updatePaymentHistory(transactions) {
    const tableBody = document.querySelector('#fees table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = transactions.map(transaction => `
        <tr>
            <td>${transaction.transactionId}</td>
            <td>${transaction.date}</td>
            <td>₹${transaction.amount.toLocaleString('en-IN')}</td>
            <td>${transaction.method}</td>
            <td><span class="badge bg-${transaction.status === 'Success' ? 'success' : 'danger'}">${transaction.status}</span></td>
            <td><a href="#" class="btn btn-sm btn-outline-primary" onclick="downloadReceipt('${transaction.transactionId}')"><i class="fas fa-download me-1"></i>Download</a></td>
        </tr>
    `).join('');
}

// Function to download receipt
function downloadReceipt(transactionId) {
    // This will be replaced with actual receipt download logic
    const transaction = mockData.fees.transactions.find(t => t.transactionId === transactionId);
    if (!transaction) return;

    // Create receipt content
    const receiptContent = `
        CampusVista Fee Receipt
        ----------------------
        Transaction ID: ${transaction.transactionId}
        Date: ${transaction.date}
        Amount: ₹${transaction.amount.toLocaleString('en-IN')}
        Payment Method: ${transaction.method}
        Status: ${transaction.status}
    `;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${transaction.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Update payment form submission handler
feePaymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const amount = document.getElementById('paymentAmount').value;
    const method = paymentMethod.value;
    
    // Validate amount
    if (parseInt(amount) > mockData.fees.dueAmount) {
        showNotification('Payment amount cannot exceed due amount!', 'danger');
        return;
    }

    // For UPI payments, verify UPI ID first
    if (method === 'upi') {
        const upiId = document.getElementById('upiId');
        if (!upiId || upiId.getAttribute('data-verified') !== 'true') {
            showNotification('Please verify UPI ID before proceeding', 'warning');
            return;
        }
    }
    
    // Show loading state
    const submitBtn = feePaymentForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    submitBtn.disabled = true;

    try {
        // Process payment
        const result = await processPayment({
            amount: parseInt(amount),
            method: method,
            studentId: JSON.parse(localStorage.getItem('studentData')).rollNumber
        });

        // Show success message
        showNotification('Payment successful! Transaction ID: ' + result.transactionId, 'success');
        
        // Reset form
        feePaymentForm.reset();
        paymentDetails.innerHTML = '';

    } catch (error) {
        showNotification(error.message || 'Payment failed! Please try again.', 'danger');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Load fees section data
async function loadFeesSection() {
    try {
        const feeData = await fetchFeeDetails();
        updateFeeSummary(feeData);
        updatePaymentHistory(feeData.transactions);
    } catch (error) {
        console.error('Error loading fees section:', error);
        showNotification('Error loading fee details. Please refresh the page.', 'danger');
    }
}

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.innerHTML = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Initializing Dashboard');
        
        // Check authentication
        checkAuth();
        
        // Update stats
        updateStats();
        
        // Show overview section by default
        document.getElementById('overview').style.display = 'block';
        
        // Add event listeners to sidebar links
        if (sidebarLinks) {
            sidebarLinks.forEach(link => {
                link.addEventListener('click', handleSidebarNavigation);
            });
        }
        
        // Add event listener for mobile sidebar toggle
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }
        
        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Dashboard Initialization Error:', error);
    }
}); 
