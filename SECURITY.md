# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Switchy seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **[your-email@example.com]** (replace with your actual email)

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

- Type of issue (e.g., buffer overflow, privilege escalation, etc.)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- Acknowledgment of your vulnerability report within 48 hours
- Regular updates on our progress
- Credit for your discovery in our release notes (if desired)

## Security Considerations

Switchy requires accessibility permissions to function. This is necessary to:

1. Read clipboard content (for text selection)
2. Simulate keyboard input (for text replacement)
3. Detect keyboard layouts

These permissions are only used for the core functionality of the application and are never used to:

- Track user activity
- Send data to external servers
- Access files or data beyond selected text
- Monitor keystrokes outside of explicit user actions

## Best Practices for Users

1. **Download from official sources only** - GitHub releases or official website
2. **Verify checksums** - Always verify download integrity
3. **Keep updated** - Install security updates promptly
4. **Review permissions** - Only grant necessary accessibility permissions
5. **Use on trusted devices** - Don't install on shared/public computers

## Privacy

Switchy operates entirely offline and does not:

- Collect any user data
- Send any information to external servers
- Store user input beyond the conversion process
- Include analytics or tracking

All text conversion happens locally on your device.
