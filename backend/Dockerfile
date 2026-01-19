FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONNUNBUFFERED=1

WORKDIR /app

COPY requeriments.txt .
RUN pip install --no-cache-dir -r requeriments.txt

COPY . .

# Carpeta donde SQLite guarda la DB
RUN mkdir -p instance

EXPOSE 5000

CMD [ "python", "app_flask.py" ]