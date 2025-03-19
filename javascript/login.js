// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// DOM Elements
const loginForm = document.getElementById('loginForm');
const rollNumberInput = document.getElementById('rollNumber');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Form Validation
function validateForm() {
    let isValid = true;
    
    // Reset previous validation states
    loginForm.classList.remove('was-validated');
    
    // Validate Roll Number
    if (!rollNumberInput.value) {
        showError(rollNumberInput, 'Roll number is required');
        isValid = false;
    } else if (!/^\d{12}$/.test(rollNumberInput.value)) {
        showError(rollNumberInput, 'Roll number must be 12 digits');
        isValid = false;
    }
    
    // Validate Password
    if (!passwordInput.value) {
        showError(passwordInput, 'Password is required');
        isValid = false;
    } else if (passwordInput.value.length < 8) {
        showError(passwordInput, 'Password must be at least 8 characters');
        isValid = false;
    }
    
    return isValid;
}

// Show Error Message
function showError(input, message) {
    input.classList.add('is-invalid');
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = message;
    }
}

// Toggle Password Visibility
togglePasswordBtn.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

// Handle Remember Me
function handleRememberMe() {
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedRollNumber', rollNumberInput.value);
    } else {
        localStorage.removeItem('rememberedRollNumber');
    }
}

// Check for Remembered Roll Number
function checkRememberedRollNumber() {
    const rememberedRollNumber = localStorage.getItem('rememberedRollNumber');
    if (rememberedRollNumber) {
        rollNumberInput.value = rememberedRollNumber;
        rememberMeCheckbox.checked = true;
    }
}

// Show Success Message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        Login successful! Redirecting...
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    loginForm.insertAdjacentElement('beforebegin', successDiv);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Mock Student Data (Replace with actual API call)
const mockStudents = {
    '220031020064': {
        name: 'Dev Gupta',
        rollNumber: '220031020064',
        password: 'Dev@Gupta',
        department: 'Computer Science',
        year: '2nd Year'
    },
    '220031020045': {
        name: 'Amit Rathore',
        rollNumber: '220031020045',
        password: 'Amit@Rathore',
        department: 'Computer Science',
        year: '2nd Year'
    },
    '220031020112': {
        name: 'Rahul Gangwar',
        rollNumber: '220031020112',
        password: 'Rahul@Gangwar',
        department: 'Computer Science',
        year: '2nd Year'
    },
    '220031020129': {
        name: 'Sandeep Gupta',
        rollNumber: '220031020129',
        password: 'Sandeep@Gupta',
        department: 'Computer Science',
        year: '2nd Year'
    }
};

// Handle Form Submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check credentials
        const rollNumber = rollNumberInput.value;
        const password = passwordInput.value;
        
        const student = mockStudents[rollNumber];
        
        if (student && student.password === password) {
            // Handle Remember Me
            handleRememberMe();
            
            // Store authentication data
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('studentData', JSON.stringify({
                name: student.name,
                rollNumber: student.rollNumber,
                department: student.department,
                year: student.year
            }));
            
            // Show success message
            showSuccessMessage();
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'student_dashboard.html';
            }, 1500);
        } else {
            throw new Error('Invalid credentials');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showError(passwordInput, 'Invalid roll number or password');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// Input Event Listeners
rollNumberInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkRememberedRollNumber();
    
    // Add input validation on blur
    rollNumberInput.addEventListener('blur', function() {
        if (this.value && !/^\d{12}$/.test(this.value)) {
            showError(this, 'Roll number must be 12 digits');
        }
    });
    
    passwordInput.addEventListener('blur', function() {
        if (this.value && this.value.length < 8) {
            showError(this, 'Password must be at least 8 characters');
        }
    });
});