// DATA CACHE STORAGE LAYER
let studentsDatabase = [];

// PRELOADER & INITIALIZATION LIFECYCLE EVENT
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
    }, 2200);
    
    renderStatisticsMetrics();
    
    // Start our live top-bar console ticker system
    startLiveConsoleTicker();
});

// NEW: LIVE SYSTEM TICKER LOGIC (Runs every second)
function startLiveConsoleTicker() {
    const updateTicker = () => {
        const now = new Date();
        
        // Options to cleanly format the date string
        const dateOptions = { month: 'short', day: '2-digit', year: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', dateOptions);
        
        // Options to format 24-hour exact system time strings
        const formattedTime = now.toTimeString().split(' ')[0];

        // Safely write directly to the top bar DOM hooks
        document.getElementById('liveHeaderDate').innerText = formattedDate;
        document.getElementById('liveHeaderTime').innerText = formattedTime;
    };
    
    updateTicker(); // Fire immediately on init
    setInterval(updateTicker, 1000); // Re-run loop execution every 1 second
}

// CORE FORM SUBMISSION ENGINE FOR STUDENT MANAGEMENT
function handleStudentEnrollment(event) {
    event.preventDefault();

    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const course = document.getElementById('studentCourse').value;
    const progress = parseInt(document.getElementById('studentProgress').value);
    const status = document.getElementById('studentStatus').value;

    const studentRecord = { name, email, course, progress, status };
    studentsDatabase.push(studentRecord);

    renderStatisticsMetrics();
    appendRecordToRegistryTable();

    document.getElementById('enrollmentForm').reset();
    goToStudentPage();
}

function renderStatisticsMetrics() {
    const totalCount = studentsDatabase.length;
    document.getElementById('totalStudentsCount').innerText = totalCount;

    if (totalCount === 0) {
        document.getElementById('avgProgressMetrics').innerText = '0%';
        return;
    }
    const totalProgressSum = studentsDatabase.reduce((acc, current) => acc + current.progress, 0);
    const calculatedAvg = Math.round(totalProgressSum / totalCount);
    document.getElementById('avgProgressMetrics').innerText = `${calculatedAvg}%`;
}

function appendRecordToRegistryTable() {
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = '';

    studentsDatabase.forEach(student => {
        const row = document.createElement('tr');
        row.className = 'student-row';
        row.setAttribute('data-status', student.status);

        const badgeClass = student.status === 'active' ? 'badge-active' : 'badge-completed';
        const formattedStatus = student.status.charAt(0).toUpperCase() + student.status.slice(1);

        row.innerHTML = `
            <td><strong>${student.name}</strong><br><span style="font-size:12px;color:#7f8c8d;">${student.email}</span></td>
            <td>${student.course}</td>
            <td>
                <div class="progress-container">
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${student.progress}%; background-color: ${student.status === 'completed' ? '#3498db' : '#2ecc71'}; height: 100%;"></div>
                    </div>
                    <span style="font-size:13px; font-weight:bold;">${student.progress}%</span>
                </div>
            </td>
            <td><span class="badge ${badgeClass}">${formattedStatus}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// NAVIGATION ROUTERS
function goToStudentPage() {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('student-page').style.display = 'block';
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "#1e272e";
}

function goToHomePage() {
    document.getElementById('student-page').style.display = 'none';
    document.getElementById('home-page').style.display = 'block';
    document.body.style.backgroundImage = "url('images (8).jpeg')";
}

// FILTER SYSTEMS
function filterStudents() {
    const searchInput = document.getElementById('studentSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const tableRows = document.querySelectorAll('.student-row');

    tableRows.forEach(row => {
        const textContent = row.innerText.toLowerCase();
        const rowStatus = row.getAttribute('data-status');

        const matchesSearch = textContent.includes(searchInput);
        const matchesStatus = (statusFilter === 'all' || rowStatus === statusFilter);

        if (matchesSearch && matchesStatus) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}