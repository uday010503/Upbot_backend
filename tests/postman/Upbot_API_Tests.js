// Global variables
let authToken = '';
let createdUrlId = '';

// Test suite for Authentication
pm.test("Authentication Tests", function () {
    // Test user registration
    pm.test("Register new user", function () {
        const registerRequest = {
            url: pm.variables.get("baseUrl") + "/auth/register",
            method: "POST",
            header: {
                "Content-Type": "application/json"
            },
            body: {
                mode: "raw",
                raw: JSON.stringify({
                    email: "test@example.com",
                    password: "Test@123"
                })
            }
        };

        pm.sendRequest(registerRequest, function (err, res) {
            pm.test("Status code is 201", function () {
                pm.expect(res.code).to.eql(201);
            });
            pm.test("Response has user data", function () {
                const jsonData = pm.response.json();
                pm.expect(jsonData).to.have.property('user');
                pm.expect(jsonData).to.have.property('token');
            });
        });
    });

    // Test user login
    pm.test("Login with credentials", function () {
        const loginRequest = {
            url: pm.variables.get("baseUrl") + "/auth/login",
            method: "POST",
            header: {
                "Content-Type": "application/json"
            },
            body: {
                mode: "raw",
                raw: JSON.stringify({
                    email: "test@example.com",
                    password: "Test@123"
                })
            }
        };

        pm.sendRequest(loginRequest, function (err, res) {
            pm.test("Status code is 200", function () {
                pm.expect(res.code).to.eql(200);
            });
            pm.test("Response has token", function () {
                const jsonData = pm.response.json();
                pm.expect(jsonData).to.have.property('token');
                authToken = jsonData.token;
                pm.environment.set("authToken", authToken);
            });
        });
    });
});

// Test suite for URL Management
pm.test("URL Management Tests", function () {
    // Test create URL
    pm.test("Create new URL", function () {
        const createUrlRequest = {
            url: pm.variables.get("baseUrl") + "/urls",
            method: "POST",
            header: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + authToken
            },
            body: {
                mode: "raw",
                raw: JSON.stringify({
                    name: "Test URL",
                    url: "https://example.com",
                    isActive: true,
                    checkInterval: 10
                })
            }
        };

        pm.sendRequest(createUrlRequest, function (err, res) {
            pm.test("Status code is 201", function () {
                pm.expect(res.code).to.eql(201);
            });
            pm.test("Response has URL data", function () {
                const jsonData = pm.response.json();
                pm.expect(jsonData).to.have.property('_id');
                createdUrlId = jsonData._id;
                pm.environment.set("urlId", createdUrlId);
            });
        });
    });

    // Test get all URLs
    pm.test("Get all URLs", function () {
        const getUrlsRequest = {
            url: pm.variables.get("baseUrl") + "/urls",
            method: "GET",
            header: {
                "Authorization": "Bearer " + authToken
            }
        };

        pm.sendRequest(getUrlsRequest, function (err, res) {
            pm.test("Status code is 200", function () {
                pm.expect(res.code).to.eql(200);
            });
            pm.test("Response is an array", function () {
                pm.expect(pm.response.json()).to.be.an('array');
            });
        });
    });

    // Test get single URL
    pm.test("Get URL by ID", function () {
        const getUrlRequest = {
            url: pm.variables.get("baseUrl") + "/urls/" + createdUrlId,
            method: "GET",
            header: {
                "Authorization": "Bearer " + authToken
            }
        };

        pm.sendRequest(getUrlRequest, function (err, res) {
            pm.test("Status code is 200", function () {
                pm.expect(res.code).to.eql(200);
            });
            pm.test("Response has correct URL data", function () {
                const jsonData = pm.response.json();
                pm.expect(jsonData._id).to.eql(createdUrlId);
            });
        });
    });

    // Test update URL
    pm.test("Update URL", function () {
        const updateUrlRequest = {
            url: pm.variables.get("baseUrl") + "/urls/" + createdUrlId,
            method: "PUT",
            header: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + authToken
            },
            body: {
                mode: "raw",
                raw: JSON.stringify({
                    name: "Updated Test URL",
                    checkInterval: 15
                })
            }
        };

        pm.sendRequest(updateUrlRequest, function (err, res) {
            pm.test("Status code is 200", function () {
                pm.expect(res.code).to.eql(200);
            });
            pm.test("Response has updated data", function () {
                const jsonData = pm.response.json();
                pm.expect(jsonData.name).to.eql("Updated Test URL");
                pm.expect(jsonData.checkInterval).to.eql(15);
            });
        });
    });
});

// Test suite for Statistics
pm.test("Statistics Tests", function () {
    // Test get dashboard stats
    pm.test("Get dashboard statistics", function () {
        const getStatsRequest = {
            url: pm.variables.get("baseUrl") + "/stats/dashboard",
            method: "GET",
            header: {
                "Authorization": "Bearer " + authToken
            }
        };

        pm.sendRequest(getStatsRequest, function (err, res) {
            pm.test("Status code is 200", function () {
                pm.expect(res.code).to.eql(200);
            });
            pm.test("Response has all required stats", function () {
                const jsonData = pm.response.json();
                pm.expect(jsonData).to.have.property('totalUrls');
                pm.expect(jsonData).to.have.property('activeUrls');
                pm.expect(jsonData).to.have.property('healthyUrls');
                pm.expect(jsonData).to.have.property('totalChecks');
            });
        });
    });

    // Test get URL history
    pm.test("Get URL history", function () {
        const getHistoryRequest = {
            url: pm.variables.get("baseUrl") + "/stats/history/" + createdUrlId,
            method: "GET",
            header: {
                "Authorization": "Bearer " + authToken
            }
        };

        pm.sendRequest(getHistoryRequest, function (err, res) {
            pm.test("Status code is 200", function () {
                pm.expect(res.code).to.eql(200);
            });
            pm.test("Response is an array", function () {
                pm.expect(pm.response.json()).to.be.an('array');
            });
        });
    });
});

// Cleanup test
pm.test("Cleanup - Delete URL", function () {
    const deleteUrlRequest = {
        url: pm.variables.get("baseUrl") + "/urls/" + createdUrlId,
        method: "DELETE",
        header: {
            "Authorization": "Bearer " + authToken
        }
    };

    pm.sendRequest(deleteUrlRequest, function (err, res) {
        pm.test("Status code is 200", function () {
            pm.expect(res.code).to.eql(200);
        });
    });
}); 