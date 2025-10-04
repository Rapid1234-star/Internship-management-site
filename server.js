var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var path = require('path');
var auth = require('./auth');
var myModule = require('./myModule');
var mySess = require('./mySession');

http.createServer((req, res) => {
    var body = ''; req.on('data', chunk => body += chunk.toString()); req.on('end', () => {
        body = querystring.parse(body); var pathname = url.parse(req.url).pathname; var query = url.parse(req.url, true).query;
        if (pathname.startsWith('/css/')) { fs.readFile(path.join(__dirname, 'html', pathname), (err, data) => { if (err) { res.writeHead(404, {'Content-Type': 'text/plain'}); res.end('404 Not Found'); } else { res.writeHead(200, {'Content-Type': 'text/css'}); res.end(data); } }); return; }
        if (pathname.startsWith('/js/')) { fs.readFile(path.join(__dirname, 'html', pathname), (err, data) => { if (err) { res.writeHead(404, {'Content-Type': 'text/plain'}); res.end('404 Not Found'); } else { res.writeHead(200, {'Content-Type': 'application/javascript'}); res.end(data); } }); return; }
        if (pathname.endsWith('.html') && pathname !== '/index.html') { fs.readFile(path.join(__dirname, 'html', 'pages', pathname), (err, data) => { if (err) myModule.login(res); else { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); } }); return; }
        if (pathname === '/company_signup' && req.method === 'POST') auth.signupCompany(res, body, mySess);
        else if (pathname === '/student_signup' && req.method === 'POST') auth.signupStudent(res, body, mySess);
        else if (pathname === '/company_login' && req.method === 'POST') auth.loginCompany(res, body, mySess);
        else if (pathname === '/student_login' && req.method === 'POST') auth.loginStudent(res, body, mySess);
        else if (pathname === '/company_dashboard') myModule.navigateToCompanyDashboard(res, mySess);
        else if (pathname === '/student_dashboard') myModule.navigateToStudentDashboard(res, mySess);
        else if (pathname === '/create_internship' && req.method === 'POST') myModule.createInternship(res, body, mySess);
        else if (pathname === '/apply_internship' && req.method === 'POST') myModule.applyInternship(res, body, mySess);
        else if (pathname === '/delete_internship' && req.method === 'POST') myModule.deleteInternship(res, body, mySess);
        else if (pathname === '/update_status' && req.method === 'POST') myModule.updateStatus(res, body, mySess);
        else if (pathname === '/delete_application' && req.method === 'POST') myModule.deleteApplication(res, body, mySess);
        else if (pathname === '/logout') myModule.logout(res, mySess);
        else if (pathname === '/update_student_details' && req.method === 'POST') myModule.updateStudentProfile(res, body, mySess);
        else if (pathname === '/update_company_details' && req.method === 'POST') myModule.updateCompanyProfile(res, body, mySess);
        else if (pathname === '/list_internships' && req.method === 'GET') myModule.listInternships(res, mySess);
        else if (pathname === '/list_internships_company' && req.method === 'GET') myModule.listInternshipsCompany(res, mySess);
        else if (pathname === '/list_applications_student' && req.method === 'GET') myModule.listApplicationsStudent(res, mySess);
        else if (pathname === '/list_applications_company' && req.method === 'GET') myModule.listApplicationsCompany(res, mySess);
        else if (pathname === '/search_applications' && req.method === 'POST') myModule.searchApplications(res, body, mySess);
        else if (pathname === '/search_internships' && req.method === 'POST') myModule.searchInternships(res, body, mySess);
        else if (pathname === '/get_internship' && req.method === 'GET') myModule.getInternship(res, query);
        else if (pathname === '/edit_internship' && req.method === 'POST') myModule.editInternship(res, body, mySess);
        else myModule.login(res);
    });
}).listen(8080, () => console.log('Server running at http://localhost:8080/'));