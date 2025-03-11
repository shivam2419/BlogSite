# BlogSite

BlogSite is a Django-based blogging platform that allows users to create, edit, and share blog posts. This project is designed to help you learn and implement basic Django functionality such as models, views, templates, and user authentication.

## Features

- **User Authentication**: Sign up, log in, and log out.
- **Blog Creation**: Users can create, edit, and delete blog posts.
- **Comment/Like Section**: Users can comment and like on blog posts.
- **Responsive Design**: The site is fully responsive, adapting to both mobile and desktop screens.
- **Admin Interface**: Manage blog posts and users via Django’s built-in admin interface.
- **JWT Authentication**: Used JWT tokens for authorization and authentication of users.

## Requirements

- Python 3.x
- Django 3.x or later
- SQLite or PostgreSQL (configured in the settings)
- Git (for version control)

## Installation

1. **Clone the repository**:
   Open a terminal and clone the repository to your local machine:

   ```bash
   git clone https://github.com/shivam2419/BlogSite.git
   cd BlogSite
   
2. **Create and activate a virtual environment**:

    ```bash
    python -m venv venv
    # On Windows
    venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    
3. **Install dependencies**:

    ```bash
    Copy
    pip install -r requirements.txt
    
4. **Apply migrations**:

    ```bash
    python manage.py makemigrations
    python manage.py migrate

5. **Create a superuser (for accessing the Django admin panel)**:

    ```bash
    python manage.py createsuperuser
  Follow the prompts to set up the superuser account.

6. **Run the development server**:

    ```bash
    python manage.py runserver
  Open your browser and go to http://127.0.0.1:8000/ to view the site.


**Contributing**
  Fork the repository.
  Create a new branch (git checkout -b feature-name).
  Make your changes.
  Commit your changes (git commit -am 'Add new feature').
  Push to the branch (git push origin feature-name).
  Create a new Pull Request.
  
**Acknowledgments**
  Django framework for building the web application.
  SQLite for the database.





