# 1. Base Image: Use a stable Python base for production
FROM python:3.10-slim

# 2. Set the Working Directory for the container
WORKDIR /usr/src/app

# Set environment variable for unbuffered output (Best Practice)
ENV PYTHONUNBUFFERED 1

# 3. Copy Requirements & Install: Use correct path to requirements.txt
# This leverages Docker's layer caching for faster subsequent builds.
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy Application Code: Copy the rest of the project
COPY . .


# ... (Lines 1-6 are the same as before)
# ----------------------------------------
# 5. Set the final entry directory for the application
WORKDIR /usr/src/app/backend

# 6. Expose Port (Informational for the container)
EXPOSE 8000

# 7. Define the Startup Command (The Fix is here!)
# Use the Python interpreter directly to ensure the module is found
# This prevents the shell from needing to locate 'uvicorn' in the $PATH
# Use Gunicorn as the process manager for production stability and scalability
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "api.main:app", "-b", "0.0.0.0:$PORT"]