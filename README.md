# AlumniKonnect

AlumniKonnect is a web application that facilitates communication and collaboration among alumni of African Leadership University. It allows alumni to stay connected, share experiences, and work on various projects together.

## Hosted Site
- https://alumnikonnect.onrender.com

## Features

- **User Authentication**: Secure login using Google OAuth 2.0 and Email and password.
- **Dashboard**: Profile update and Display of created events.
- **Event Management**: Add, delete and edit events seamlessly.
- **Communication**: Alumni can interact and communicate with each other.
- **Opportunity Board**: Alumni can access professional and personal development opportunities.
- **Gallery**: View pictures of past events.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Abbiefied/AlumniKonnect.git
2. **Install Dependencies:**
   npm install
3. **Set up Environment Variables:** 
   - Replace the environment variables in the config.env file with yours. 
   - The variables in the file now are for development purpose only.
   - MONGO_URI=your_mongo_db_uri
   - GOOGLE_CLIENT_ID=your_google_client_id
   - GOOGLE_CLIENT_SECRET=your_google_client_secret
   - SESSION_SECRET=your_session_secret

4. **Usage:**

   **Development Mode**
   - npm run dev
   - Visit http://localhost:3000 in your web browser.
     
   **Production Mode**
   - npm start
   - Visit http://localhost:3000 in your web browser.

6. **Contributing:**
   - This project is not accepting contributions.

## Notes
- Render.com does not save images for the free plan. A paid plan is required to use the feature. As a result, uploaded images are not displayed after the browser is refreshed. The website will be scaled and moved to a better hosting platform in the future.

