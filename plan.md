Plan: Python Console CareerCrafter MVC
Build a Python console application in python_console that follows OOP + MVC and connects directly to MySQL, while reusing the same domain boundaries and business rules already present in your backend.

Steps

Phase 1: Initialize Python console structure for MVC layers, configuration, and startup flow.
Add centralized configuration loading and database session management (with connection health check and clean error handling).
Phase 2: Map SQLAlchemy entities to current schema tables and constraints.
Implement repository classes for users/auth, profiles, jobs, applications, resume sections, and notifications.
Phase 3: Implement business services.
Add auth service with registration/login/logout, bcrypt password checks, and role-based profile bootstrap.
Add job seeker services for browse/filter jobs, job detail view, apply flow, and “my applications”.
Add employer services for create/manage jobs, view applicants, and update application statuses with transition rules.
Add profile services for seeker/employer self-management.
Phase 4: Implement MVC console interaction.
Build controllers to orchestrate services and normalize error handling.
Build role-based console views/menus (guest, seeker, employer) with input validation.
Add session context and menu router loop.
Phase 5: Seed/demo and validation.
Add optional seed workflow and smoke-path test script.
Finalize usage documentation and runbook.
Dependencies and parallelism

Steps 2-3 can run in parallel once the structure exists.
Entity mapping blocks repositories and services.
Seeker and employer services can be developed in parallel after auth + repositories are ready.
Controllers/views depend on services.
Seeding, smoke tests, and docs can run in parallel after main flow is complete.
Relevant files to mirror behavior

Schema.sql
User.java
JobSeeker.java
Employer.java
JobListing.java
Application.java
Role.java
Status.java
JobStatus.java
ApplicationService.java
JobListingService.java
application.properties
Verification

Database connectivity test succeeds.
Registration creates one user and the correct role profile.
Login validates bcrypt hashes correctly.
Employer can post/close jobs; seeker cannot access employer-only actions.
Seeker can apply only to active jobs and only once per job.
Employer status updates persist and enforce valid transitions.
End-to-end scenario succeeds: employer posts job → seeker applies → employer updates status → seeker sees new status.
Decisions captured

Scope: Standard v1 (auth/profile + browse/apply + employer management).
Data path: Direct MySQL access.
Architecture: Single-package MVC with OOP service/repository layers.
Excluded in v1: advanced resume file storage integration and admin workflows.