// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// DOM Elements
const studentName = document.getElementById('studentName');
const welcomeName = document.getElementById('welcomeName');
const logoutBtn = document.getElementById('logoutBtn');
const sidebar = document.querySelector('.sidebar');
const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
const sidebarToggle = document.querySelector('.sidebar-toggle');

// Log DOM elements for debugging
console.log('DOM Elements:', {
    studentName: studentName,
    welcomeName: welcomeName,
    logoutBtn: logoutBtn,
    sidebar: sidebar,
    sidebarLinks: sidebarLinks
});

// Mock Data (Replace with API calls)
const mockData = {
    academic: {
        courses: [
            { name: 'Mathematics', code: 'MATH101', instructor: 'Dr. Smith', grade: 'A' },
            { name: 'Physics', code: 'PHY101', instructor: 'Dr. Johnson', grade: 'B+' },
            { name: 'Chemistry', code: 'CHEM101', instructor: 'Dr. Williams', grade: 'A-' }
        ],
        gpa: 3.8,
        credits: 45
    },
    attendance: {
        overall: 95,
        subjects: [
            { name: 'Mathematics', percentage: 98 },
            { name: 'Physics', percentage: 92 },
            { name: 'Chemistry', percentage: 95 }
        ]
    },
    assignments: {
        pending: [
            { title: 'Calculus Assignment', dueDate: '2024-03-20', subject: 'Mathematics' },
            { title: 'Lab Report', dueDate: '2024-03-22', subject: 'Physics' }
        ],
        completed: [
            { title: 'Chemistry Project', submittedDate: '2024-03-15', grade: 'A' }
        ]
    }
};

// Check Authentication
function checkAuth() {
    try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
        
        console.log('Auth Check:', {
            isAuthenticated,
            studentData
        });
        
        if (!isAuthenticated || !studentData.rollNumber) {
            console.log('Authentication failed, redirecting to login');
            window.location.href = 'login.html';
            return;
        }
        
        // Update student name
        if (studentName) studentName.textContent = studentData.name || 'Student';
        if (welcomeName) welcomeName.textContent = studentData.name || 'Student';
        
        console.log('Authentication successful');
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