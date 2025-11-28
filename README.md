# Finance Tracker

Aplicativo de controle financeiro pessoal.

## Configuração

1.  **Instalar dependências** (já realizado):
    ```bash
    npm install
    ```

2.  **Configurar Firebase**:
    - Edite o arquivo `src/firebaseConfig.js`.
    - Adicione suas credenciais do Firebase (API Key, Project ID, etc.).
    - No [Console do Firebase](https://console.firebase.google.com/):
        - Habilite **Authentication** (ative o provedor "Anônimo").
        - Crie um banco de dados **Firestore** (em modo de teste ou produção).

## Como Rodar

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O terminal irá exibir um link (geralmente `http://localhost:5173`). Clique nele para acessar o aplicativo no seu navegador.
