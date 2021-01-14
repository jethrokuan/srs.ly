FROM alpine:latest
RUN apk add --update --no-cache nodejs sqlite python3 npm

COPY requirements.txt .
RUN python3 -m ensurepip
RUN python3 -m pip install -r requirements.txt

COPY . /app
WORKDIR /app/frontend
RUN npm run build

WORKDIR /app
RUN export PYTHONPATH=.
RUN mkdir /db
EXPOSE 8080
CMD ["python3", "-m", "srsly.app"]
