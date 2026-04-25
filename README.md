


# Project Flowchart

This flowchart outlines the main user interactions and navigation paths within the application.

1.  **Application Launch**
    *   User opens the application.
    *   Lands on the **Dashboard** page (overview).

2.  **Bottom Navigation Bar**
    *   User can navigate between main sections using the bottom navigation:
        *   **Dashboard**: Overview of key metrics.
        *   **Attendance**: Record daily attendance for sites and laborers.
        *   **Team**: Manage team members and view their individual progress.
        *   **Site**: Manage work sites (Maliks) and view their individual progress.

3.  **Attendance Page Flow**
    *   User selects a "Malik" (site) from a dropdown.
    *   The list of laborers updates based on the selected site's historical attendance.
    *   User can assign/unassign laborers for the selected site for the current day.
    *   User clicks "Save Assignments" to record attendance.

4.  **Team Management Flow**
    *   User navigates to the **Team** page.
    *   **Viewing Team Members:** A list of all team members is displayed.
    *   **Adding a Team Member:**
        *   User clicks the "Add Team Member" button.
        *   A form modal appears.
        *   User fills in member details and submits.
        *   New member is added to the list.
    *   **Viewing Team Member Progress/Profile:**
        *   User clicks on a specific team member's name from the list.
        *   Navigates to the **Team Member Progress Report** page.
        *   **From Team Member Progress Report:**
            *   Displays profile details (name, role, avatar).
            *   Shows estimated monthly earnings.
            *   Presents a monthly calendar marking attendance (Present/Absent).
            *   User can navigate between months in the calendar.
            *   **Editing Team Member:**
                *   User clicks the "Edit" button.
                *   An edit form modal appears (pre-filled with current data).
                *   User modifies details and submits.
                *   Changes are saved.
            *   **Deleting Team Member:**
                *   User clicks the "Delete" button.
                *   A confirmation might appear (not explicitly implemented, but good practice).
                *   Team member is removed from the system.
            *   **Returning to Team List:**
                *   User clicks the "Back to List" button.
                *   Returns to the main **Team** page.

5.  **Site Management Flow**
    *   User navigates to the **Site** page.
    *   **Viewing Sites:** A list of all sites (Maliks) is displayed.
    *   **Adding a Site:**
        *   User clicks the "Add Site" button.
        *   A form modal appears.
        *   User fills in site details and submits.
        *   New site is added to the list.
    *   **Viewing Site Progress/Details:**
        *   User clicks on a specific site's name from the list.
        *   Navigates to the **Site Progress Report** page.
        *   **From Site Progress Report:**
            *   Displays site details (name, location).
            *   Shows estimated monthly site earnings.
            *   Presents a monthly calendar marking site activity (Active/Inactive).
            *   User can navigate between months in the calendar.
            *   **Editing Site:**
                *   User clicks the "Edit" button.
                *   An edit form modal appears (pre-filled with current data).
                *   User modifies details and submits.
                *   Changes are saved.
            *   **Deleting Site:**
                *   User clicks the "Delete" button.
                *   A confirmation might appear.
                *   Site is removed from the system.
            *   **Returning to Site List:**
                *   User clicks the "Back to List" button.
                *   Returns to the main **Site** page.

                
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started 

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.