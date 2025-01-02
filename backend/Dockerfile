FROM python:3.11

WORKDIR /app

COPY ./requirements.txt .
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY ./samplescape ./samplescape/

CMD ["fastapi", "run", "samplescape/main.py", "--proxy-headers", "--port", "8000"]