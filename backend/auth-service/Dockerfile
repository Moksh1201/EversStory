FROM python:3.9-slim-buster

WORKDIR /app

# Copy your code
COPY . /app/

# Add this line to install certificates
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

# Install Python deps
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir python-multipart

EXPOSE 8001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
