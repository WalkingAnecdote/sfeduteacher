FROM php:8.0-fpm

# Arguments defined in docker-compose.yml
ARG user
ARG uid

# Install system dependencies
RUN apt-get update && apt-get install -y \
    sudo \
    supervisor \
    git \
    curl \
#    freetype-dev \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    zip \
#    php-zip \
    unzip \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
#    libjpeg-turbo-dev \
#    zlib1g-dev \
    imagemagick libmagickwand-dev --no-install-recommends \
    libzip-dev \
    && pecl install imagick \
    && pecl install -o -f redis \
    && docker-php-ext-enable redis \
    && docker-php-ext-enable imagick \
    && docker-php-ext-install zip \
    && docker-php-ext-install php-zip \
    #&& docker-php-ext-configure gd --with-freetype --with-jpeg \
    #&& docker-php-ext-install gd
    # Install the PHP gd library
    docker-php-ext-configure gd  \
            --prefix=/usr \
	    #--with-freetype=/usr/include/ \
	    #--with-jpeg=/usr/include/ \
            --with-jpeg \
           # --with-webp \
           # --with-xpm \
            --with-freetype; \
    docker-php-ext-configure gd \
      --with-freetype=/usr/include/ \
      # --with-png=/usr/include/ \ # No longer necessary as of 7.4; https://github.com/docker-library/php/pull/910#issuecomment-559383597
      --with-jpeg=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-enable gd;
    #docker-php-ext-install gd;

RUN docker-php-ext-configure opcache --enable-opcache \
    && docker-php-ext-install opcache
# Copy configuration
COPY docker/php/opcache.ini $PHP_INI_DIR/conf.d/

RUN apt-get install -y cron

# Imagick
#RUN printf "\n" | pecl install imagick
#RUN docker-php-ext-enable imagick



COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY crontab /etc/cron.d/my_cron
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/my_cron

# Apply cron job
RUN crontab /etc/cron.d/my_cron

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Run the command on container startup
CMD cron && tail -f /var/log/cron.log


RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath

EXPOSE 9000
EXPOSE 80
ENV TERM xterm


# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user && \
    adduser $user sudo
# Set working directory
WORKDIR /app

#USER $user

#EXPOSE 9000
#EXPOSE 80

RUN echo user=root >>  /etc/supervisor/supervisord.conf
CMD ["/usr/bin/supervisord", "-n"]

#CMD ["php-fpm"]
