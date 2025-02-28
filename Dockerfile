FROM enclave_base
WORKDIR /app

# update system and install needed dependencies
RUN yum update -y && \
    yum install -y gcc openssl-devel bzip2-devel libffi-devel \
    zlib-devel wget tar gzip make which \
    iproute git unzip # we only need git now, not nodejs/npm

# install socat
RUN wget http://www.dest-unreach.org/socat/download/socat-1.8.0.2.tar.gz -P /tmp && \
    cd /tmp && tar xzf socat-1.8.0.2.tar.gz && \
    cd socat-1.8.0.2 && \
    ./configure && make && make install && \
    cd ~ && rm -rf /tmp/socat-1.8.0.2 /tmp/socat-1.8.0.2.tar.gz

# install ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

RUN ollama serve & sleep 10 && ollama pull llama3.2:3b

# install bun
RUN curl -fsSL https://bun.sh/install | bash
# Add bun to PATH
ENV PATH="/root/.bun/bin:${PATH}"

# set HOME for ollama to work properly
ENV HOME=/root

# clone and build chatbot-ollama ui with bun
COPY . /app/

ENV DEFAULT_MODEL="llama3.2:3b"
ENV OLLAMA_HOST="http://127.0.0.1:11434"
RUN echo "OLLAMA_HOST=http://127.0.0.1:11434" > /app/.env.local && \
    echo "DEFAULT_MODEL=llama3.2:3b" >> /app/.env.local

# copy our entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
