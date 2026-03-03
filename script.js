// Get DOM elements
const loginForm = document.getElementById('loginForm');
const teacherForm = document.getElementById('teacherForm');
const adminForm = document.getElementById('adminForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorMessageText = errorMessage ? errorMessage.querySelector('p') : null;
const savedDataSection = document.getElementById('savedDataSection');
const savedDataDisplay = document.getElementById('savedDataDisplay');
const teacherDataSection = document.getElementById('teacherDataSection');
const teacherDataDisplay = document.getElementById('teacherDataDisplay');
const adminDataSection = document.getElementById('adminDataSection');
const adminDataDisplay = document.getElementById('adminDataDisplay');

// Determine role from URL or storage
function getCurrentRole() {
    const params = new URLSearchParams(window.location.search);
    return params.get('role') || localStorage.getItem('userRole') || 'student';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    const role = getCurrentRole();
    localStorage.setItem('userRole', role);
    
    // make sure correct form is visible
    if (role === 'teacher') {
        if (loginForm) loginForm.style.display = 'none';
        if (teacherForm) teacherForm.style.display = 'block';
        if (adminForm) adminForm.style.display = 'none';
        document.getElementById('formTitle').textContent = 'Teacher Login';
        checkTeacherData();
    } else if (role === 'admin') {
        if (loginForm) loginForm.style.display = 'none';
        if (teacherForm) teacherForm.style.display = 'none';
        if (adminForm) adminForm.style.display = 'block';
        document.getElementById('formTitle').textContent = 'Admin Login';
        checkAdminData();
    } else {
        // default student view
        if (loginForm) loginForm.style.display = 'block';
        if (teacherForm) teacherForm.style.display = 'none';
        if (adminForm) adminForm.style.display = 'none';
        document.getElementById('formTitle').textContent = 'Login';
        checkSavedData();
    }
});

// Handle form submission for students
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Collect data from the input fields
        const studentData = {
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value.trim(),
            loginTime: new Date().toLocaleString()
        };

        // Send the data to the Backend
        try {
            const response = await fetch('http://localhost:3000/api/student/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Success:", result.message);
                showSuccess();
                localStorage.setItem('studentLogin', JSON.stringify(studentData));
                
                // Redirect to student dashboard after successful login
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            }
        } catch (error) {
            console.error("Connection Error:", error);
            showError("The server is not responding. Did you run 'npm start'?");
        }
    });
}

// Handle form submission for teachers
if (teacherForm) {
    teacherForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('teacherUsername').value.trim();
        const password = document.getElementById('teacherPassword').value.trim();

        const teacherData = {
            username: username,
            password: password,
            loginTime: new Date().toLocaleString()
        };
        
        try {
            localStorage.setItem('teacherLogin', JSON.stringify(teacherData));
            showSuccess();
            teacherForm.style.display = 'none';
            setTimeout(() => {
                // Redirect to teacher dashboard after successful login
                window.location.href = 'teacher.html';
            }, 1000);
        } catch (err) {
            showError('Failed to save teacher data.');
        }
    });
}

// Handle form submission for admin
if (adminForm) {
    adminForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();

        const adminData = {
            username: username,
            password: password,
            loginTime: new Date().toLocaleString()
        };
        
        try {
            localStorage.setItem('adminLogin', JSON.stringify(adminData));
            showSuccess();
            adminForm.style.display = 'none';
            setTimeout(() => {
                // Show admin dashboard inline
                displayAdminInfo(adminData);
            }, 1000);
        } catch (err) {
            showError('Failed to save admin data.');
        }
    });
}

// Check and display saved student data
function checkSavedData() {
    const savedData = localStorage.getItem('studentLogin');

    if (savedData && savedDataSection) {
        const student = JSON.parse(savedData);
        displayStudentInfo(student);
        loginForm.style.display = 'none';
        teacherForm.style.display = 'none';
        adminForm.style.display = 'none';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        savedDataSection.style.display = 'block';
        if (teacherDataSection) teacherDataSection.style.display = 'none';
        if (adminDataSection) adminDataSection.style.display = 'none';
    } else if (loginForm) {
        loginForm.style.display = 'block';
        if (savedDataSection) savedDataSection.style.display = 'none';
    }
}

// Check and display saved teacher data
function checkTeacherData() {
    const saved = localStorage.getItem('teacherLogin');
    if (saved && teacherDataSection) {
        const teacher = JSON.parse(saved);
        displayTeacherInfo(teacher);
        teacherForm.style.display = 'none';
        loginForm.style.display = 'none';
        adminForm.style.display = 'none';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        teacherDataSection.style.display = 'block';
        savedDataSection.style.display = 'none';
        if (adminDataSection) adminDataSection.style.display = 'none';
    } else if (teacherForm) {
        teacherForm.style.display = 'block';
        if (teacherDataSection) teacherDataSection.style.display = 'none';
    }
}

// Check and display saved admin data
function checkAdminData() {
    const saved = localStorage.getItem('adminLogin');
    if (saved && adminDataSection) {
        const admin = JSON.parse(saved);
        displayAdminInfo(admin);
        adminForm.style.display = 'none';
        loginForm.style.display = 'none';
        teacherForm.style.display = 'none';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        adminDataSection.style.display = 'block';
        if (savedDataSection) savedDataSection.style.display = 'none';
        if (teacherDataSection) teacherDataSection.style.display = 'none';
    } else if (adminForm) {
        adminForm.style.display = 'block';
        if (adminDataSection) adminDataSection.style.display = 'none';
    }
}

// Sample data for demonstration purposes
const sampleData = {
    grades: [
        { subject: 'Mathematics', grade: 88, status: 'complete' },
        { subject: 'Physics', grade: 92, status: 'complete' },
        { subject: 'English', grade: null, status: 'incomplete' },
        { subject: 'Computer Science', grade: 95, status: 'complete' }
    ],
    subjects: ['Mathematics', 'Physics', 'English', 'Computer Science', 'History'],
    schedule: [
        { day: 'Monday', time: '08:00-10:00', subject: 'Mathematics' },
        { day: 'Monday', time: '09:00-11:00', subject: 'Physics' },
        { day: 'Friday', time: '13:00-15:00', subject: 'Computer Science' }
    ],
    records: [
        { type: 'Transcript', date: '2026-01-15' },
        { type: 'Attendance', date: '2026-02-28' }
    ],
    missingRecords: ['Medical clearance', 'Library card'],
    tasks: [
        { description: 'Submit final project', due: '2026-03-10', completed: false },
        { description: 'Attend counseling', due: '2026-03-05', completed: false }
    ],
    recoveryPlan: {
        goal: 'Raise English grade',
        milestones: [
            { task: 'Review chapters 1-3', deadline: '2026-03-07' },
            { task: 'Take practice quiz', deadline: '2026-03-09' }
        ]
    }
};

// helper: detect schedule conflicts
function detectScheduleConflicts(schedule) {
    const conflicts = [];
    schedule.forEach((s1, i) => {
        schedule.slice(i+1).forEach(s2 => {
            if (s1.day === s2.day) {
                const [s1start, s1end] = s1.time.split('-').map(t => parseInt(t.replace(':',''),10));
                const [s2start, s2end] = s2.time.split('-').map(t => parseInt(t.replace(':',''),10));
                if (s1start < s2end && s2start < s1end) {
                    conflicts.push(`${s1.subject} conflicts with ${s2.subject} on ${s1.day}`);
                }
            }
        });
    });
    return conflicts;
}

// sample data for a teacher dashboard
const sampleTeacherData = {
    students: [
        { name: 'Alice Reyes', course: 'BS IT', progress: '80%', remedial: ['English essay'], makeup: ['Math quiz'] },
        { name: 'Ben Cruz', course: 'BS Nursing', progress: '65%', remedial: ['Chemistry lab'], makeup: [] },
        { name: 'Carla Molina', course: 'BS CE', progress: '90%', remedial: [], makeup: ['History exam'] }
    ]
};

// Display teacher information and tools
function displayTeacherInfo(teacher) {
    if (!teacherDataDisplay) return;
    
    let html = `
        <div class="data-item">
            <strong>Username:</strong> ${escapeHtml(teacher.username)}
        </div>
        <div class="data-item">
            <strong>Login Time:</strong> ${escapeHtml(teacher.loginTime)}
        </div>
        <hr>
        <h3>Student List</h3>
        <table border="1" cellpadding="4">
            <tr><th>Name</th><th>Course</th><th>Progress</th><th>Remedial</th><th>Makeup</th><th>Actions</th></tr>
            ${sampleTeacherData.students.map(s => `
                <tr>
                    <td>${escapeHtml(s.name)}</td>
                    <td>${escapeHtml(s.course)}</td>
                    <td>${escapeHtml(s.progress)}</td>
                    <td>${escapeHtml(s.remedial.join(', ') || 'None')}</td>
                    <td>${escapeHtml(s.makeup.join(', ') || 'None')}</td>
                    <td><button class="btn-update" data-student="${escapeHtml(s.name)}">Update Record</button></td>
                </tr>
            `).join('')}
        </table>
    `;
    teacherDataDisplay.innerHTML = html;
    
    // attach update listeners
    document.querySelectorAll('.btn-update').forEach(btn => {
        btn.addEventListener('click', () => {
            const studentName = btn.getAttribute('data-student');
            alert('Update record for ' + studentName + ' (simulation)');
        });
    });
}

// Display admin information
function displayAdminInfo(admin) {
    if (!adminDataDisplay) return;
    
    let html = `
        <div class="data-item">
            <strong>Username:</strong> ${escapeHtml(admin.username)}
        </div>
        <div class="data-item">
            <strong>Login Time:</strong> ${escapeHtml(admin.loginTime)}
        </div>
        <hr>
        <h3>Admin Dashboard</h3>
        <p>Welcome to the administrator dashboard. You have full access to manage the system.</p>
        <div class="admin-features">
            <h4>System Overview</h4>
            <ul>
                <li>Total Students: 150</li>
                <li>Total Teachers: 25</li>
                <li>Active Courses: 10</li>
            </ul>
        </div>
    `;
    adminDataDisplay.innerHTML = html;
}

// render notifications
function renderNotifications() {
    const container = document.getElementById('notifications');
    if (!container) return;
    container.innerHTML = notifications.map(n => `<div class="notification">${escapeHtml(n)}</div>`).join('');
}

// simulate real-time notifications
let notifications = [];
function startNotificationSimulation() {
    setInterval(() => {
        const msg = `Message at ${new Date().toLocaleTimeString()}`;
        notifications.push(msg);
        renderNotifications();
    }, 5000);
}

// render basic analytics
function renderAnalytics(student, sampleData) {
    const container = document.getElementById('analytics');
    if (!container) return;
    const completedGrades = sampleData.grades.filter(g => g.grade != null).map(g => g.grade);
    const avg = completedGrades.length ? (completedGrades.reduce((a,b)=>a+b,0)/completedGrades.length).toFixed(2) : 'N/A';
    const incompleteCount = sampleData.grades.filter(g => g.grade == null).length;
    const missingRecordsCount = sampleData.missingRecords.length;
    container.innerHTML = `
        <div>Average grade: ${avg}</div>
        <div>Incomplete subjects: ${incompleteCount}</div>
        <div>Missing records: ${missingRecordsCount}</div>
    `;
}

// Display student information with extended dashboard
function displayStudentInfo(student) {
    if (!savedDataDisplay) return;
    
    // base personal info
    let html = `
        <div class="data-item">
            <strong>Username:</strong> ${escapeHtml(student.username)}
        </div>
        <div class="data-item">
            <strong>Login Time:</strong> ${escapeHtml(student.loginTime)}
        </div>
    `;

    // append samples
    html += `
        <hr>
        <h3>Sample Grades</h3>
        <ul>
            ${sampleData.grades.map(g => `<li>${escapeHtml(g.subject)}: ${g.grade != null ? escapeHtml(g.grade) : '<em>Incomplete</em>'}</li>`).join('')}
        </ul>
        <h3>Incomplete Grades</h3>
        <ul>
            ${sampleData.grades.filter(g=>g.grade==null).map(g=>`<li>${escapeHtml(g.subject)}</li>`).join('')}
        </ul>
        <h3>Sample Schedule</h3>
        <ul>
            ${sampleData.schedule.map(s => `<li>${escapeHtml(s.day)} ${escapeHtml(s.time)} – ${escapeHtml(s.subject)}</li>`).join('')}
        </ul>
    `;

    // evaluate issues for alert message
    const missing = sampleData.missingRecords.length > 0;
    const conflicts = detectScheduleConflicts(sampleData.schedule);
    if (missing || conflicts.length) {
        const alertDiv = document.getElementById('issueAlert');
        if (alertDiv) {
            alertDiv.textContent = 'Attention: you have ' + 
                (missing ? `${sampleData.missingRecords.length} incomplete record(s)` : '') + 
                (missing && conflicts.length ? ' and ' : '') + 
                (conflicts.length ? `${conflicts.length} schedule conflict(s)` : '') + 
                '. Please organize your subjects.';
        }
    }

    // append conflict details
    if (conflicts.length) {
        html += `
            <div class="conflicts">
                <strong>Schedule Conflicts Detected:</strong>
                <ul>
                    ${conflicts.map(c=>`<li>${escapeHtml(c)}<br>Suggestion: reschedule one of the conflicting classes.</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // missing records and tasks
    html += `
        <h3>Missing Records</h3>
        <ul>${sampleData.missingRecords.map(r=>`<li>${escapeHtml(r)}</li>`).join('')}</ul>
        <h3>Unfinished Tasks</h3>
        <ul>${sampleData.tasks.map(t=>`<li>${escapeHtml(t.description)} (due ${escapeHtml(t.due)})</li>`).join('')}</ul>
        <h3>Recovery Plan</h3>
        <div>Goal: ${escapeHtml(sampleData.recoveryPlan.goal)}</div>
        <ul>${sampleData.recoveryPlan.milestones.map(m=>`<li>${escapeHtml(m.task)} by ${escapeHtml(m.deadline)}</li>`).join('')}</ul>
    `;

    savedDataDisplay.innerHTML = html;

    // render analytics and notifications
    renderAnalytics(student, sampleData);
    renderNotifications();
    startNotificationSimulation();
}

// handle sync button
const syncBtn = document.getElementById('syncRecordsBtn');
if (syncBtn) {
    syncBtn.addEventListener('click', () => {
        alert('Record sync initiated. (Simulation)');
    });
}

// Show success message
function showSuccess() {
    if (successMessage) {
        successMessage.style.display = 'block';
        if (errorMessage) errorMessage.style.display = 'none';

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
}

// Show error message
function showError(message) {
    if (errorMessage && errorMessageText) {
        errorMessageText.textContent = message;
        errorMessage.style.display = 'block';
        if (successMessage) successMessage.style.display = 'none';

        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 4000);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle logout for all user types
function performLogout() {
    // Clear all session data
    localStorage.removeItem('studentLogin');
    localStorage.removeItem('teacherLogin');
    localStorage.removeItem('adminLogin');
    localStorage.removeItem('userRole');
    
    // Reset forms if they exist
    if (loginForm) loginForm.reset();
    if (teacherForm) teacherForm.reset();
    if (adminForm) adminForm.reset();
    
    // Hide sections if they exist
    if (loginForm) loginForm.style.display = 'block';
    if (teacherForm) teacherForm.style.display = 'none';
    if (adminForm) adminForm.style.display = 'none';
    if (savedDataSection) savedDataSection.style.display = 'none';
    if (teacherDataSection) teacherDataSection.style.display = 'none';
    if (adminDataSection) adminDataSection.style.display = 'none';
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    
    // Redirect to index page after logout
    window.location.href = 'index.html';
}

// Attach logout event listeners
document.querySelectorAll('.btn-logout').forEach(btn => {
    btn.addEventListener('click', performLogout);
});

