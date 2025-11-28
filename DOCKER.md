# 🐳 Guia Docker - EdTech Frontend

Este documento fornece instruções para executar a aplicação EdTech Frontend usando Docker.

## 📋 Pré-requisitos

- **Docker** 20.10+ instalado ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose** 1.29+ instalado (incluído no Docker Desktop)
- **Backend rodando** em `http://127.0.0.1:8080` (ajuste conforme necessário)

## 🚀 Quick Start

### 1. Build e execute a aplicação

```bash
docker-compose up --build
```

Este comando irá:
- Fazer build da imagem Docker
- Criar e iniciar o container
- Mapear a porta 80 do container para a porta 80 da máquina host

### 2. Acesse a aplicação

Abra seu navegador e acesse:
```
http://localhost
```

### 3. Parar a aplicação

```bash
docker-compose down
```

---

## 🔧 Comandos úteis

### Build apenas
```bash
docker-compose build
```

### Executar em background
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f
```

### Parar containers
```bash
docker-compose stop
```

### Remover containers e volumes
```bash
docker-compose down -v
```

### Reconstruir sem cache
```bash
docker-compose build --no-cache
```

---

## 🔌 Configuração do Backend

Por padrão, a aplicação espera o backend em `http://127.0.0.1:8080`.

### Se usar um backend em Docker (mesma rede)

Descomente a seção `backend` no `docker-compose.yml` e ajuste a configuração conforme necessário.

### Se o backend está em outro host

Edite `nginx.conf` e altere as linhas:
```nginx
proxy_pass http://seu-backend-host:8080;
```

---

## 📁 Arquivos Docker

| Arquivo | Descrição |
|---------|-----------|
| `Dockerfile` | Define como construir a imagem da aplicação |
| `docker-compose.yml` | Orquestra os containers (frontend, backend, etc.) |
| `.dockerignore` | Arquivos/diretórios ignorados na build |
| `nginx.conf` | Configuração do servidor web Nginx |
| `.env.docker` | Variáveis de ambiente para Docker |

---

## 🛡️ Segurança

O arquivo `nginx.conf` inclui headers de segurança:
- `X-Frame-Options`: Previne clickjacking
- `X-Content-Type-Options`: Previne MIME type sniffing
- `X-XSS-Protection`: Proteção contra XSS
- `Referrer-Policy`: Controla informações de referência

---

## 🐛 Troubleshooting

### Porta 80 já em uso
```bash
# Altere a porta no docker-compose.yml
# De: "80:80"
# Para: "8000:80"

# Depois acesse: http://localhost:8000
```

### Backend não responde
- Verifique se o backend está rodando em `http://127.0.0.1:8080`
- Se rodando em outro host, atualize `nginx.conf`
- Verifique os logs: `docker-compose logs nginx`

### Cache issues
```bash
# Limpe cache e volumes
docker-compose down -v
docker system prune -a
docker-compose up --build
```

---

## 📊 Monitoramento

Ver status dos containers:
```bash
docker-compose ps
```

Ver recursos utilizados:
```bash
docker stats
```

---

## 🚀 Deploy em Produção

1. **Build a imagem:**
   ```bash
   docker build -t seu-registry/edtech-frontend:v1.0 .
   ```

2. **Push para registry:**
   ```bash
   docker push seu-registry/edtech-frontend:v1.0
   ```

3. **Deploy com Kubernetes/Docker Swarm** (conforme sua infraestrutura)

---

## 📝 Notas

- A aplicação é estateless (sem estado), facilitando scaling horizontal
- Gzip compression está ativado para melhor performance
- Cache de 1 ano para assets estáticos (JS, CSS, imagens)
- Suporta hot reload em desenvolvimento com volume mounts (adicionar ao docker-compose.yml se necessário)

---

Para dúvidas, consulte a [documentação oficial do Docker](https://docs.docker.com/).
