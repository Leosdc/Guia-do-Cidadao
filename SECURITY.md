# Security Policy

## Supported Versions

Only the latest version of Guia do Cidadão is supported for security updates.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please do NOT open a public issue. Instead, please report it via the methods below:

1. **Direct Contact:** [Insert contact method or email if available]
2. **GitHub Private Reporting:** Use the "Report a vulnerability" button in the "Security" tab.

We take all security reports seriously and will respond as quickly as possible.

## Security Best Practices in this Repo

- **Secrets:** We do not commit API keys or secrets directly to the repository. We use Secret Manager for backend secrets and environment variables for client-side configuration.
- **Validation:** All user inputs and file uploads are validated in the backend.
- **Rules:** Firebase Firestore and Storage rules are configured to restrict access to authenticated users only.
