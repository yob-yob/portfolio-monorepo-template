# Bun Monorepo (SvelteKit + ElysiaJS) template

# FYI: Project is mostly written by Hand... the only time AI has helped me is on the UI design and improvements and project documentation as well... other than that the AI is ALWAYS in `ASK` mode

Okay so the main purpose of this Repository is to showcase my Ability to use and integrate the following tools and frameworks.

- BunJs
- ElysiaJs
- SvelteKit
- BetterAuth
- Drizzle
- Typescript

P.S. This project is purely for educational purposes only to study and learn new tools

## The Goal

The main goal of this project is to setup a project template and consider this as my BASE CORE features for a Multi-Tenant SaaS Application.
so if I need to create a Multi-Tenant SaaS application I can go back and reach for this project and start of from this instead of starting off from scratch.


## What I've done

I have implemented a lot of features in this project it's mostly around the Better-Auth Integration when it comes to UI / UX

- Mainly the Authentication Flow Like Login and Logout
- Installation flow for the first time the application has ever started and creating for the Super Admin account
- On Boarding Flow for time user registrations
- Organization & Team Switcher
- Organization Settings
  - Logo Update
  - Organization Name Update
  - Team Manager
    - Listing of teams
    - Creating and Deleting a new team
    - joining and Leaving a team
  - Member Manager (WIP)
  - Billing (WIP)
  - RBAC (WIP)
- User Profile Settings
  - Avatar Update
  - Name Update
  - Email Change 
    - With SMTP integration for Sending OTP via Email
    - Implemented in a Secure way with proper verification flow
  - Session Manager
  - Connected Accounts Manager
  - User Organizations managers
  - Account Deletion / Account Retention (I haven't really had the time to look into this more since User deletion feature requires a lot of thought and business decision to be made)
- I have also orchestrated the SvelteKit Application to properly separate the Layouts depending on context
- I have setup ElysiaJS as my backend 
  - I have setup a simple Health Endpoint
  - the biggest features here is the Storage Solution where I needed to integrate with an S3 server and use a Self-signed url as my Upload URL on the Client Side
- I have also used tools like BiomeJS as my Formatter and Linter, it is properly and heavly configured to specifically meet the needs of the project
- I have also used ShadCN-Svelte as my Goto Pre-built UI Components, this allows to move a bit faster into the project
- I have tried my best to make the entire application TypeSafe


## TODO

- Use this a template for my next project (I will probably create another one like this that directly uses Convex) but for now this will do.
- Create a Super-admin Platform Dashboard 
  - Where a Platform Admin can see ALL organization created on the platform
  - The super admin can also see all users registered in the platform and which organizations they belong to
  - Implement the User Banning Feature from Better-Auth
- Integrate with BTCPay (Create a Better-Auth Plugin for BTCPay)
  - Integrate this with Organization Billing
- 