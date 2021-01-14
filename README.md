# Srs.ly

A proof-of-concept spaced repetition system built on top of hypothes.is.

See [this blog post](https://blog.jethro.dev/posts/taking_srs_seriously/ "this blog post") for more details.

![review](img/review.gif)

## Installation

Using Docker is probably the easiest way to deploy this.

1. Clone the repo:

```sh
git clone https://github.com/jethrokuan/srs.ly/
```

2. Move `.env.example` into `.env`, and edit your Hypothes.is user and API token. Get your API token e[here](https://hypothes.is/account/developer).

3. Build the docker image with `docker build -t srsly .`

4. Run the docker image:

```sh
docker run -d -p 8080:8080 -v ~/db:/db srsly
```
