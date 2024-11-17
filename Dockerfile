# Dockerfile

# Base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y build-essential libpq-dev

# Install dependencies
RUN pip install --upgrade pip

# Copy the entire project directory to the container
COPY . /app/

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Install Gunicorn
RUN pip install gunicorn

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Collect static files for Nginx to serve
RUN python manage.py collectstatic --noinput

# Run Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "shopping_web_app.wsgi:application"]
