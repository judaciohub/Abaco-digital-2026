# ABACO DOMPORQUITO S/A - Sistema de Contagem

Sistema web para registro e relatório de não conformidades na linha de produção.

## 📋 Descrição

Aplicação para contagem de não conformidades em diferentes categorias de produtos (pernil, barriga, carré, paleta) com geração automática de relatórios em PDF.

## 🚀 Funcionalidades

- ✅ Contagem de não conformidades por categoria
- ✅ Campo para identificação de LOTE
- ✅ Interface touch-friendly para tablets
- ✅ Geração de relatório PDF
- ✅ Resumo visual antes de gerar relatório
- ✅ Função de resetar contagem

## 📦 Categorias

1. **CARCAÇA NÃO CONFORME** - Contagem geral
2. **LOTE** - Contagem com identificação de número/nome do lote
3. **PERNIL** - Danificado, Fratura, Resíduos, Pelos, Hematomas, Melado, Sujeira, Mal Toalete, Aderência
4. **BARRIGA** - Danificado, Fratura, Resíduos, Pelos, Hematomas, Melado, Sujeira, Mal Toalete, Aderência
5. **CARRÉ** - Danificado, Fratura, Resíduos, Pelos, Hematomas, Melado, Sujeira, Mal Toalete, Aderência
6. **PALETA** - Danificado, Fratura, Resíduos, Pelos, Hematomas, Melado, Sujeira, Mal Toalete, Aderência

## 🔧 Instalação

### Requisitos

- Python 3.11+
- pip

### Passos

1. Clone o repositório
```bash
git clone [seu-repositorio]
cd "abaco 2026"
```

2. Crie e ative um ambiente virtual
```bash
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows PowerShell
```

3. Instale as dependências
```bash
pip install reportlab
```

4. Execute o servidor
```bash
python server.py
```

5. Acesse no navegador
```
http://localhost:65535
```

## 🌐 Acesso em Rede Local

O servidor exibe automaticamente o IP da rede local para acesso de outros dispositivos:
```
http://[SEU-IP]:65535
```

## 📱 Uso

1. Abra a aplicação no navegador (ou tablet)
2. Para LOTE: digite o número/nome no campo de texto
3. Use os botões **+** e **−** para incrementar/decrementar contadores
4. Clique em **Finalizar Contagem** para revisar
5. Digite o nome do responsável
6. Clique em **Gerar Relatório** para criar o PDF

## 📄 Estrutura de Arquivos

```
abaco 2026/
│
├── index.html          # Interface web principal
├── server.py           # Servidor HTTP + geração de PDF
├── .gitignore          # Arquivos ignorados pelo Git
├── img/                # Imagens (logo, etc)
├── CHANGELOG.md        # Histórico de alterações
└── README.md           # Este arquivo
```

## 🔄 Últimas Atualizações

Ver [CHANGELOG.md](CHANGELOG.md) para histórico completo.

**Versão 28/04/2026:**
- Renomeação: CABEÇA VIVA → LOTE
- Adicionado campo para número/nome do lote
- Invertida ordem: PALETA ↔ BARRIGA

## 📝 Licença

© 2026 ABACO DOMPORQUITO S/A

## 👤 Autor

Desenvolvimento interno - SUPORTE TI
