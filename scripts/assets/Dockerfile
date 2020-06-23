FROM alpine:3.12.0

ENV ASSET_ROOT ${ASSET_ROOT:-/var/www/assets}
RUN mkdir -p $ASSET_ROOT

WORKDIR $ASSET_ROOT

COPY public .

CMD ['/bin/bash']