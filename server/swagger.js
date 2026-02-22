const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ApplyTrack API",
            version: "1.0.0",
            description:
                "REST API for ApplyTrack — a job application tracking platform. Manage users, jobs, tasks, and admin operations.",
            contact: {
                name: "ApplyTrack Team",
            },
        },
        servers: [
            {
                url: "http://localhost:{port}",
                description: "Local development server",
                variables: {
                    port: {
                        default: "8080",
                    },
                },
            },
        ],
        tags: [
            { name: "Auth", description: "Authentication (register, login, logout)" },
            { name: "Jobs", description: "Job application CRUD & statistics (requires auth)" },
            { name: "User", description: "User profile management (requires auth)" },
            { name: "Admin", description: "Admin-only operations (requires auth + admin)" },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "accessToken",
                    description: "JWT access token set as an HTTP-only cookie after login/register",
                },
            },
            schemas: {
                // ─── User ───────────────────────────────────────────────
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "64a1b2c3d4e5f6789012abcd" },
                        username: { type: "string", example: "johndoe" },
                        email: { type: "string", format: "email", example: "john@example.com" },
                        role: { type: "string", example: "Job Hunter" },
                        gender: {
                            type: "string",
                            enum: ["Male", "Female", "Prefer not to say", "Other", ""],
                            example: "Male",
                        },
                        education: { type: "string", example: "BS Computer Science" },
                        isAdmin: { type: "boolean", example: false },
                        hiredDetails: {
                            type: "object",
                            properties: {
                                company: { type: "string", example: "Google" },
                                position: { type: "string", example: "Software Engineer" },
                                dateHired: { type: "string", format: "date-time" },
                            },
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },

                // ─── Task (embedded in Job) ─────────────────────────────
                Task: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "64b2c3d4e5f67890abcd1234" },
                        title: { type: "string", example: "Submit portfolio" },
                        isCompleted: { type: "boolean", example: false },
                        dueDate: { type: "string", format: "date-time", nullable: true },
                    },
                },

                // ─── Job ────────────────────────────────────────────────
                Job: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "64c3d4e5f67890abcd123456" },
                        company: { type: "string", example: "Google" },
                        position: { type: "string", example: "Frontend Developer" },
                        currency: { type: "string", example: "USD" },
                        minSalary: { type: "number", example: 80000 },
                        maxSalary: { type: "number", example: 120000 },
                        jobType: {
                            type: "string",
                            enum: ["full-time", "part-time", "internship", "contract", "freelance"],
                            example: "full-time",
                        },
                        workSetting: {
                            type: "string",
                            enum: ["remote", "on-site", "hybrid"],
                            example: "remote",
                        },
                        status: {
                            type: "string",
                            enum: ["interview", "declined", "pending", "accepted", "offer", "ghosted"],
                            example: "pending",
                        },
                        jobLink: { type: "string", example: "https://careers.google.com/jobs/123" },
                        appliedAt: { type: "string", format: "date-time" },
                        interviewedAt: { type: "string", format: "date-time", nullable: true },
                        jobLocation: { type: "string", example: "New York, NY" },
                        tasks: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Task" },
                        },
                        createdBy: { type: "string", example: "64a1b2c3d4e5f6789012abcd" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },

                // ─── Reusable request bodies ────────────────────────────
                RegisterInput: {
                    type: "object",
                    required: ["username", "email", "password"],
                    properties: {
                        username: { type: "string", minLength: 3, maxLength: 20, example: "johndoe" },
                        email: { type: "string", format: "email", example: "john@example.com" },
                        password: { type: "string", minLength: 6, example: "secret123" },
                        role: { type: "string", example: "Job Hunter" },
                        gender: {
                            type: "string",
                            enum: ["Male", "Female", "Prefer not to say", "Other"],
                        },
                        education: { type: "string", example: "BS Computer Science" },
                    },
                },

                LoginInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email", example: "john@example.com" },
                        password: { type: "string", example: "secret123" },
                    },
                },

                CreateJobInput: {
                    type: "object",
                    required: ["company", "position", "jobType"],
                    properties: {
                        company: { type: "string", maxLength: 50, example: "Google" },
                        position: { type: "string", maxLength: 100, example: "Frontend Developer" },
                        jobType: {
                            type: "string",
                            enum: ["full-time", "part-time", "internship", "contract", "freelance"],
                            example: "full-time",
                        },
                        workSetting: {
                            type: "string",
                            enum: ["remote", "on-site", "hybrid"],
                            example: "remote",
                        },
                        status: {
                            type: "string",
                            enum: ["interview", "declined", "pending", "accepted", "offer", "ghosted"],
                            example: "pending",
                        },
                        currency: { type: "string", example: "USD" },
                        minSalary: { type: "number", example: 80000 },
                        maxSalary: { type: "number", example: 120000 },
                        jobLink: { type: "string", example: "https://careers.google.com/jobs/123" },
                        jobLocation: { type: "string", example: "New York, NY" },
                        appliedAt: { type: "string", format: "date-time" },
                        tasks: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["title"],
                                properties: {
                                    title: { type: "string", example: "Submit portfolio" },
                                    isCompleted: { type: "boolean", example: false },
                                    dueDate: { type: "string", format: "date-time" },
                                },
                            },
                        },
                    },
                },

                UpdateJobInput: {
                    type: "object",
                    properties: {
                        company: { type: "string", example: "Google" },
                        position: { type: "string", example: "Senior Frontend Developer" },
                        status: {
                            type: "string",
                            enum: ["interview", "declined", "pending", "accepted", "offer", "ghosted"],
                        },
                        jobType: {
                            type: "string",
                            enum: ["full-time", "part-time", "internship", "contract", "freelance"],
                        },
                        workSetting: {
                            type: "string",
                            enum: ["remote", "on-site", "hybrid"],
                        },
                        currency: { type: "string" },
                        minSalary: { type: "number" },
                        maxSalary: { type: "number" },
                        jobLink: { type: "string" },
                        jobLocation: { type: "string" },
                        tasks: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    _id: { type: "string" },
                                    title: { type: "string" },
                                    isCompleted: { type: "boolean" },
                                    dueDate: { type: "string", format: "date-time" },
                                },
                            },
                        },
                    },
                },

                UpdateUserProfileInput: {
                    type: "object",
                    properties: {
                        role: { type: "string", example: "Job Hunter" },
                        gender: {
                            type: "string",
                            enum: ["Male", "Female", "Prefer not to say", "Other", ""],
                        },
                        education: { type: "string", example: "MS Data Science" },
                    },
                },

                UpdateAdminProfileInput: {
                    type: "object",
                    properties: {
                        username: { type: "string", example: "adminuser" },
                        email: { type: "string", format: "email", example: "admin@example.com" },
                        gender: { type: "string" },
                        education: { type: "string" },
                        currentPassword: { type: "string", description: "Required when changing password" },
                        newPassword: { type: "string", minLength: 6, description: "New password (min 6 chars)" },
                    },
                },

                // ─── Common responses ───────────────────────────────────
                ErrorResponse: {
                    type: "object",
                    properties: {
                        msg: { type: "string", example: "Error message here" },
                    },
                },
            },
        },

        // ────────────────────────────────────────────────────────────
        //  PATHS
        // ────────────────────────────────────────────────────────────
        paths: {
            // ═══ AUTH ═══════════════════════════════════════════════
            "/api/auth/register": {
                post: {
                    tags: ["Auth"],
                    summary: "Register a new user",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RegisterInput" },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: "User created — access token set as HTTP-only cookie",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            user: {
                                                type: "object",
                                                properties: {
                                                    username: { type: "string" },
                                                    role: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        400: { description: "Validation error or user already exists", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },

            "/api/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "Log in with email & password",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/LoginInput" },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Authenticated — access token set as HTTP-only cookie",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            user: {
                                                type: "object",
                                                properties: {
                                                    username: { type: "string" },
                                                    role: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },

            "/api/auth/logout": {
                get: {
                    tags: ["Auth"],
                    summary: "Log out (clears cookie)",
                    responses: {
                        200: {
                            description: "Logged out",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: { msg: { type: "string", example: "User logged out!" } },
                                    },
                                },
                            },
                        },
                    },
                },
            },

            // ═══ JOBS ══════════════════════════════════════════════
            "/api/job": {
                get: {
                    tags: ["Jobs"],
                    summary: "Get all jobs for the authenticated user",
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        { name: "status", in: "query", schema: { type: "string", enum: ["all", "pending", "interview", "offer", "accepted", "declined", "ghosted"] }, description: "Filter by status" },
                        { name: "jobType", in: "query", schema: { type: "string", enum: ["all", "full-time", "part-time", "internship", "contract", "freelance"] }, description: "Filter by job type" },
                        { name: "workSetting", in: "query", schema: { type: "string", enum: ["all", "remote", "on-site", "hybrid"] }, description: "Filter by work setting" },
                        { name: "search", in: "query", schema: { type: "string" }, description: "Search by position or company" },
                        { name: "sort", in: "query", schema: { type: "string", enum: ["latest", "oldest", "salary-high", "salary-low", "latest-updated"] }, description: "Sort order" },
                        { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
                        { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" },
                    ],
                    responses: {
                        200: {
                            description: "Paginated list of jobs",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            jobs: { type: "array", items: { $ref: "#/components/schemas/Job" } },
                                            totalJobs: { type: "integer", example: 42 },
                                            numOfPages: { type: "integer", example: 5 },
                                            currentPage: { type: "integer", example: 1 },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
                post: {
                    tags: ["Jobs"],
                    summary: "Create a new job application",
                    security: [{ cookieAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CreateJobInput" },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: "Job created",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: { job: { $ref: "#/components/schemas/Job" } },
                                    },
                                },
                            },
                        },
                        400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },

            "/api/job/stats": {
                get: {
                    tags: ["Jobs"],
                    summary: "Get job statistics & 7-day activity for the authenticated user",
                    security: [{ cookieAuth: [] }],
                    responses: {
                        200: {
                            description: "Status counts and daily application activity",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            defaultStats: {
                                                type: "object",
                                                properties: {
                                                    pending: { type: "integer" },
                                                    interview: { type: "integer" },
                                                    declined: { type: "integer" },
                                                    accepted: { type: "integer" },
                                                    offer: { type: "integer" },
                                                    ghosted: { type: "integer" },
                                                },
                                            },
                                            activityData: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        name: { type: "string", example: "Mon" },
                                                        apps: { type: "integer", example: 3 },
                                                        date: { type: "string", example: "2026-02-22" },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },

            "/api/job/{id}": {
                patch: {
                    tags: ["Jobs"],
                    summary: "Update a job application",
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Job ID" },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateJobInput" },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Job updated",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: { job: { $ref: "#/components/schemas/Job" } },
                                    },
                                },
                            },
                        },
                        404: { description: "Job not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
                delete: {
                    tags: ["Jobs"],
                    summary: "Delete a job application",
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Job ID" },
                    ],
                    responses: {
                        200: {
                            description: "Job deleted",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: { msg: { type: "string", example: "Success! Job removed" } },
                                    },
                                },
                            },
                        },
                        404: { description: "Job not found" },
                    },
                },
            },

            // ═══ USER ══════════════════════════════════════════════
            "/api/user/me": {
                get: {
                    tags: ["User"],
                    summary: "Get current user (optional auth — returns null if not logged in)",
                    description: "Uses optional authentication. Returns `{ user }` if logged in, `{ user: null }` otherwise. Never returns 401.",
                    responses: {
                        200: {
                            description: "Current user or null",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            user: {
                                                oneOf: [
                                                    { $ref: "#/components/schemas/User" },
                                                    { type: "null" },
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },

            "/api/user/profile": {
                get: {
                    tags: ["User"],
                    summary: "Get authenticated user profile",
                    security: [{ cookieAuth: [] }],
                    responses: {
                        200: {
                            description: "User profile (without password)",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: { user: { $ref: "#/components/schemas/User" } },
                                    },
                                },
                            },
                        },
                        401: { description: "Not authenticated" },
                    },
                },
                patch: {
                    tags: ["User"],
                    summary: "Update user profile (gender, education, role)",
                    security: [{ cookieAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateUserProfileInput" },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Updated user",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: { user: { $ref: "#/components/schemas/User" } },
                                    },
                                },
                            },
                        },
                    },
                },
                delete: {
                    tags: ["User"],
                    summary: "Delete own account and all jobs",
                    security: [{ cookieAuth: [] }],
                    responses: {
                        200: {
                            description: "Account deleted",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: { user: { $ref: "#/components/schemas/User" } },
                                    },
                                },
                            },
                        },
                    },
                },
            },

            // ═══ ADMIN ═════════════════════════════════════════════
            "/api/admin/profile": {
                get: {
                    tags: ["Admin"],
                    summary: "Get admin profile",
                    security: [{ cookieAuth: [] }],
                    responses: {
                        200: {
                            description: "Admin user profile",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: { user: { $ref: "#/components/schemas/User" } },
                                    },
                                },
                            },
                        },
                    },
                },
                patch: {
                    tags: ["Admin"],
                    summary: "Update admin profile (includes optional password change)",
                    security: [{ cookieAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateAdminProfileInput" },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Updated admin profile",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: { user: { $ref: "#/components/schemas/User" } },
                                    },
                                },
                            },
                        },
                        400: { description: "Bad request (e.g. wrong current password)" },
                    },
                },
            },

            "/api/admin/users": {
                get: {
                    tags: ["Admin"],
                    summary: "Get all users with job count",
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        { name: "search", in: "query", schema: { type: "string" }, description: "Search users by username or email" },
                        { name: "sort", in: "query", schema: { type: "string", enum: ["newest", "oldest", "most-jobs"] }, description: "Sort order" },
                        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                        { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
                    ],
                    responses: {
                        200: {
                            description: "Paginated list of users",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            users: {
                                                type: "array",
                                                items: {
                                                    allOf: [
                                                        { $ref: "#/components/schemas/User" },
                                                        { type: "object", properties: { jobCount: { type: "integer", example: 12 } } },
                                                    ],
                                                },
                                            },
                                            totalUsers: { type: "integer" },
                                            numOfPages: { type: "integer" },
                                            currentPage: { type: "integer" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },

            "/api/admin/users/{id}": {
                get: {
                    tags: ["Admin"],
                    summary: "Get single user details with all their jobs",
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "User ID" },
                    ],
                    responses: {
                        200: {
                            description: "User details with jobs",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            user: { $ref: "#/components/schemas/User" },
                                            jobs: { type: "array", items: { $ref: "#/components/schemas/Job" } },
                                        },
                                    },
                                },
                            },
                        },
                        404: { description: "User not found" },
                    },
                },
                delete: {
                    tags: ["Admin"],
                    summary: "Delete a user and all their jobs (cannot delete admins)",
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "User ID" },
                    ],
                    responses: {
                        200: {
                            description: "User and their jobs deleted",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: { msg: { type: "string" } },
                                    },
                                },
                            },
                        },
                        404: { description: "User not found or is an admin" },
                    },
                },
            },

            "/api/admin/stats": {
                get: {
                    tags: ["Admin"],
                    summary: "Get platform-wide statistics",
                    security: [{ cookieAuth: [] }],
                    responses: {
                        200: {
                            description: "Platform statistics overview",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            totalUsers: { type: "integer", example: 150 },
                                            totalJobs: { type: "integer", example: 823 },
                                            totalAdmins: { type: "integer", example: 2 },
                                            jobStats: {
                                                type: "object",
                                                properties: {
                                                    pending: { type: "integer" },
                                                    interview: { type: "integer" },
                                                    declined: { type: "integer" },
                                                    accepted: { type: "integer" },
                                                    offer: { type: "integer" },
                                                    ghosted: { type: "integer" },
                                                },
                                            },
                                            jobTypeBreakdown: {
                                                type: "object",
                                                additionalProperties: { type: "integer" },
                                                example: { "full-time": 400, "internship": 200, "contract": 100 },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: [], // We define everything inline above
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
