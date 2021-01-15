FROM alpine:latest
RUN apk add --update --no-cache nodejs sqlite python3 npm

RUN mkdir /app
WORKDIR /app
COPY requirements.txt .
RUN python3 -m ensurepip
RUN python3 -m pip install -r requirements.txt

RUN mkdir /app/frontend
COPY frontend/package.json /app/frontend
WORKDIR /app/frontend
RUN npm install

COPY . /app
RUN npm run build

WORKDIR /app
RUN export PYTHONPATH=.
EXPOSE 8080
CMD ["python3", "-m", "srsly.app"]
