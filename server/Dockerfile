# Development build
# Use only for development
# Unoptimized image size due to development dependencies being packaged

FROM python:3.11-slim-bookworm AS base

WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "-m", "flask", "--app", "server", "run", "-p", "5000", "--host=0.0.0.0"]


