# 📘 Skill: playwright-framework-architect

## Skill ID

playwright-framework-architect

------------------------------------------------------------------------

## 🧠 Skill Name

Scalable Playwright Framework Architect

------------------------------------------------------------------------

## 🎯 Purpose

The `playwright-framework-architect` skill designs and structures a
clean, scalable, and maintainable Playwright automation framework from
scratch.

It ensures enterprise-level architecture suitable for large projects
(2000--3000+ test cases) with strict traceability and CI/CD readiness.

------------------------------------------------------------------------

## 📌 Scope of Responsibility

-   Create clean folder structure
-   Define reusable fixtures
-   Implement Page Object Model (POM)
-   Create flow-based abstraction layer
-   Configure multi-role projects
-   Enable tagging and grouping
-   Optimize parallel execution
-   Enforce clean TypeScript structure
-   Ensure SonarQube-friendly code design

------------------------------------------------------------------------

## 📁 Recommended Folder Structure

e2e/ ├── config/ ├── fixtures/ │ └── auth.fixture.ts ├── pages/ │ ├──
login.page.ts │ ├── dashboard.page.ts ├── flows/ │ ├── login.flow.ts ├──
selectors/ │ └── selectors.json ├── utils/ │ ├── helpers.ts ├── tests/ │
├── URS-DV-QC-1/ │ │ ├── SRS-1/ │ │ │ ├── SDS-1.spec.ts

------------------------------------------------------------------------

## ⚙ Core Capabilities

### Framework Initialization

-   Setup Playwright with TypeScript
-   Configure playwright.config.ts
-   Enable retries and trace
-   Configure reporters (HTML, JUnit)

### Reusability Design

-   Implement reusable login functions
-   Create navigation helpers
-   Build modular flows
-   Avoid duplicate logic

### Multi-Role Execution

-   Configure separate storageState per role
-   Use Playwright projects for role-based execution
-   Support tagged test runs

### Performance Optimization

-   Enable parallel workers
-   Use API-assisted test setup
-   Reduce UI-heavy flows
-   Optimize test runtime

------------------------------------------------------------------------

## 🧼 Clean Code & Sonar Rules

Framework must: - Avoid magic strings - Centralize selectors - Use
strict TypeScript types - Keep functions under 20 lines - Avoid deep
nesting - Use meaningful naming conventions - Follow Single
Responsibility Principle

------------------------------------------------------------------------

## 🔐 Constraints

Must NOT: - Mix business logic inside spec files - Hardcode
credentials - Duplicate login steps across tests - Store selectors
inside test specs - Disable security mechanisms in production

------------------------------------------------------------------------

## 🚀 CI/CD Readiness

-   Support headless execution
-   Enable trace on failure
-   Generate HTML reports
-   Support environment variables
-   Run in Docker if required

------------------------------------------------------------------------

## 📌 Usage

Use skill: playwright-framework-architect\
Goal: Generate scalable Playwright automation framework structure with
reusable components and CI-ready configuration.

------------------------------------------------------------------------

## 🎯 Success Criteria

-   Clean modular architecture created
-   Reusable components implemented
-   Test grouping aligned with URS/SRS/SDS
-   CI-ready configuration
-   Maintainable and scalable framework
-   SonarQube compliant

------------------------------------------------------------------------

# End of Skill Definition
