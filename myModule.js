var mysql = require('mysql2');
var fs = require('fs');
var path = require('path');
var profileManagement = require('./profileManagement');
var internshipManagement = require('./internshipManagement');

function connectToDB() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Aayan1234#",
        database: "internship_management"
    });
}

function handleAuth(res, mySess, loginPath, page, callback) {
    if (!mySess.getMySession().userName) { res.writeHead(302, {'Location': loginPath}); res.end(); return; }
    callback(res, mySess);
}

exports.navigateToCompanyDashboard = (res, mySess) => handleAuth(res, mySess, '/company_login.html', 'dashboardcompany.html', (res) => fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); }));

exports.navigateToStudentDashboard = (res, mySess) => handleAuth(res, mySess, '/student_login.html', 'dashboardstudent.html', (res) => fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardstudent.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); }));

exports.applyInternship = (res, body, mySess) => handleAuth(res, mySess, '/student_login.html', 'applyinternship.html', (res) => {
    const { internship_id, resume } = body;
    if (!internship_id || !resume) { fs.readFile(path.join(__dirname, 'html', 'pages', 'applyinternship.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('status').textContent = 'Error: Resume and internship ID are required';</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('SELECT student_id FROM students WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'applyinternship.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('status').textContent = 'Error: Student not found';</script>"); }); return; }
        const student_id = result[0].student_id;
        con.query('INSERT INTO applications (student_id, internship_id, status, resume, created_at) VALUES (?, ?, ?, ?, NOW())', [student_id, internship_id, 'Pending', resume], (err) => {
            con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'applyinternship.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('status').textContent = 'Error applying: ' + err.message;</script>"); }); } else { fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardstudent.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Applied successfully!');</script>"); }); }
        });
    });
});

exports.createInternship = (res, body, mySess) => handleAuth(res, mySess, '/company_login.html', 'newinternshipcompany.html', (res) => {
    const { title, location, type, skills, salary, duration, deadline } = body;
    if (!title || !location || !type || !skills || !salary || !duration || !deadline) { fs.readFile(path.join(__dirname, 'html', 'pages', 'newinternshipcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('status').textContent = 'Error: All fields are required';</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('SELECT company_id FROM companies WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'newinternshipcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('status').textContent = 'Error: Company not found';</script>"); }); return; }
        const company_id = result[0].company_id;
        con.query('INSERT INTO internships (company_id, title, location, type, skills, salary, duration, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [company_id, title, location, type, skills, salary, duration, deadline], (err) => {
            con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'newinternshipcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('status').textContent = 'Error posting: ' + err.message;</script>"); }); } else { fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Internship posted!');</script>"); }); }
        });
    });
});

exports.deleteInternship = (res, body, mySess) => handleAuth(res, mySess, '/company_login.html', 'dashboardcompany.html', (res) => {
    const { internship_id } = body;
    if (!internship_id) { fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Internship ID required');</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('SELECT company_id FROM companies WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Company not found');</script>"); }); return; }
        const company_id = result[0].company_id;
        con.query('DELETE FROM internships WHERE internship_id = ? AND company_id = ?', [internship_id, company_id], (err) => {
            con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error deleting internship: ' + err.message + '')</script>"); }); } else { fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Internship deleted!')</script>"); }); }
        });
    });
});

exports.deleteApplication = (res, body, mySess) => handleAuth(res, mySess, '/company_login.html', 'applicationcompany.html', (res) => {
    const { application_id } = body;
    if (!application_id) { fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Application ID required');</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('SELECT company_id FROM companies WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Company not found');</script>"); }); return; }
        const company_id = result[0].company_id;
        con.query('DELETE a FROM applications a JOIN internships i ON a.internship_id = i.internship_id WHERE a.application_id = ? AND i.company_id = ?', [application_id, company_id], (err) => {
            con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error deleting application: ' + err.message + '')</script>"); }); } else { fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Application deleted!')</script>"); }); }
        });
    });
});

exports.updateStatus = (res, body, mySess) => handleAuth(res, mySess, '/company_login.html', 'applicationcompany.html', (res) => {
    const { application_id, status } = body;
    if (!application_id || !status) { fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Application ID and status required');</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('SELECT company_id FROM companies WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Company not found');</script>"); }); return; }
        const company_id = result[0].company_id;
        con.query('UPDATE applications a JOIN internships i ON a.internship_id = i.internship_id SET a.status = ? WHERE a.application_id = ? AND i.company_id = ?', [status, application_id, company_id], (err) => {
            con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error updating: ' + err.message + '')</script>"); }); } else { fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Status updated!')</script>"); }); }
        });
    });
});

exports.logout = (res, mySess) => { mySess.deleteSession(); fs.readFile(path.join(__dirname, 'html', 'pages', 'index.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); }); };

exports.login = (res) => fs.readFile(path.join(__dirname, 'html', 'pages', 'index.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); });

exports.listInternships = (res, mySess) => handleAuth(res, mySess, '/student_login.html', 'internshipstudent.html', (res) => {
    const con = connectToDB(); con.connect();
    con.query('SELECT * FROM internships', (err, results) => {
        con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'internshipstudent.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error fetching internships');</script>"); }); } else { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify(results)); }
    });
});

exports.listInternshipsCompany = (res, mySess) => handleAuth(res, mySess, '/company_login.html', 'internshipcompany.html', (res) => {
    const con = connectToDB(); con.connect();
    con.query('SELECT company_id FROM companies WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'internshipcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Company not found');</script>"); }); return; }
        const company_id = result[0].company_id;
        con.query('SELECT * FROM internships WHERE company_id = ?', [company_id], (err, results) => {
            con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'internshipcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error fetching internships');</script>"); }); } else { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify(results)); }
        });
    });
});

exports.listApplicationsStudent = (res, mySess) => handleAuth(res, mySess, '/student_login.html', 'applicationstudent.html', (res) => {
    const con = connectToDB(); con.connect();
    con.query('SELECT student_id FROM students WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationstudent.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Student not found');</script>"); }); return; }
        const student_id = result[0].student_id;
        con.query('SELECT a.*, i.title, c.company_name, a.created_at AS applied_on FROM applications a JOIN internships i ON a.internship_id = i.internship_id JOIN companies c ON i.company_id = c.company_id WHERE a.student_id = ?', [student_id], (err, results) => {
            con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationstudent.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error fetching applications: ' + err.message);</script>"); }); } else { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify(results)); }
        });
    });
});

exports.listApplicationsCompany = (res, mySess) => handleAuth(res, mySess, '/company_login.html', 'applicationcompany.html', (res) => {
    const con = connectToDB(); con.connect();
    con.query('SELECT company_id FROM companies WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Company not found');</script>"); }); return; }
        const company_id = result[0].company_id;
        con.query('SELECT a.*, s.student_name, s.email, i.title FROM applications a JOIN students s ON a.student_id = s.student_id JOIN internships i ON a.internship_id = i.internship_id WHERE i.company_id = ?', [company_id], (err, results) => {
            con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error fetching applications');</script>"); }); } else { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify(results)); }
        });
    });
});

exports.searchApplications = (res, body, mySess) => handleAuth(res, mySess, '/company_login.html', 'applicationcompany.html', (res) => {
    const { search } = body;
    if (!search) { res.writeHead(302, {'Location': '/applicationcompany.html'}); res.end(); return; }
    const con = connectToDB(); con.connect();
    con.query('SELECT company_id FROM companies WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Company not found');</script>"); }); return; }
        const company_id = result[0].company_id;
        con.query('SELECT a.*, s.student_name, s.email, i.title FROM applications a JOIN students s ON a.student_id = s.student_id JOIN internships i ON a.internship_id = i.internship_id WHERE i.company_id = ? AND s.student_name LIKE ?', [company_id, `%${search}%`], (err, results) => {
            con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'applicationcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error searching applications');</script>"); }); } else { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify(results)); }
        });
    });
});

exports.searchInternships = (res, body, mySess) => handleAuth(res, mySess, '/student_login.html', 'internshipstudent.html', (res) => {
    const { location, skills, min_salary } = body; // Match the form field name "min_salary"
    const con = connectToDB(); con.connect();
    let query = 'SELECT * FROM internships WHERE 1=1'; let params = [];
    if (location) { query += ' AND location = ?'; params.push(location); }
    if (skills) { query += ' AND skills LIKE ?'; params.push(`%${skills}%`); }
    if (min_salary) { query += ' AND salary >= ?'; params.push(min_salary); }
    con.query(query, params, (err, results) => {
        con.end();
        fs.readFile(path.join(__dirname, 'html', 'pages', 'internshipstudent.html'), (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end(data + "<script>alert('Error loading page');</script>");
            } else {
                let htmlResults = '';
                if (err) {
                    htmlResults = "<p style='color:red'>Error searching internships: " + err.message + "</p>";
                } else if (!results || results.length === 0) {
                    htmlResults = "<p>No internships found.</p>";
                } else {
                    htmlResults = "<h3>Search Results:</h3>";
                    results.forEach(internship => {
                        htmlResults += `<div style="margin:10px 0; padding:10px; border:1px solid #ccc;">
                            <p>Title: ${internship.title || 'N/A'}</p>
                            <p>Location: ${internship.location || 'N/A'}</p>
                            <p>Type: ${internship.type || 'N/A'}</p>
                            <p>Skills: ${internship.skills || 'N/A'}</p>
                            <p>Salary: ${internship.salary || 'N/A'}</p>
                            <p>Duration: ${internship.duration || 'N/A'}</p>
                            <p>Deadline: ${internship.deadline || 'N/A'}</p>
                        </div>`;
                    });
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data + htmlResults);
            }
        });
    });
});

exports.getInternship = (res, query) => {
    const { internship_id } = query;
    if (!internship_id) { res.writeHead(400, {'Content-Type': 'application/json'}); res.end(JSON.stringify({error: 'Internship ID required'})); return; }
    const con = connectToDB(); con.connect();
    con.query('SELECT * FROM internships WHERE internship_id = ?', [internship_id], (err, results) => {
        con.end(); if (err || !results.length) { res.writeHead(404, {'Content-Type': 'application/json'}); res.end(JSON.stringify({error: 'Internship not found'})); } else { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify(results[0])); }
    });
};

exports.updateCompanyProfile = profileManagement.updateCompanyProfile;
exports.updateStudentProfile = profileManagement.updateStudentProfile;
exports.editInternship = internshipManagement.editInternship;