# Changelog - ABACO 2026

## Versão 28/04/2026

### Alterações Realizadas

#### 1. Renomeação: CABEÇA VIVA → LOTE
- **Arquivos modificados:** `index.html`, `server.py`
- Alterado o nome da categoria "CABEÇA VIVA" para "LOTE" em toda a aplicação
- Atualizado título da seção na interface
- Atualizado no código JavaScript de geração de PDF
- Atualizado no servidor Python para geração de relatórios

#### 2. Campo de Número/Nome do Lote
- **Arquivo modificado:** `index.html`
- Adicionado campo de input para digitar número ou nome do lote
- Campo posicionado ao lado esquerdo do botão menos (−)
- Placeholder: "Nº ou Nome"
- Largura: 150px com estilo responsivo
- O valor digitado é incluído no título do relatório PDF: "LOTE [número] (TOTAL: X)"

#### 3. Inversão de Ordem: PALETA ↔ BARRIGA
- **Arquivos modificados:** `index.html`, `server.py`
- Invertida a ordem de exibição das seções PALETA e BARRIGA
- **Nova ordem:**
  - PERNIL
  - BARRIGA (antes era PALETA)
  - CARRÉ
  - PALETA (antes era BARRIGA)
- Alteração refletida tanto na interface quanto na geração de PDFs

### Arquivos para Upload

#### Arquivos Principais (OBRIGATÓRIOS):
- ✅ `index.html` - Interface principal da aplicação
- ✅ `server.py` - Servidor Python para geração de PDFs
- ✅ `.gitignore` - Configuração Git

#### Arquivos Opcionais:
- ❌ `.venv/` - Ambiente virtual Python (NÃO INCLUIR - já está no .gitignore)
- ❌ `*.pdf` - Arquivos de relatório gerados (NÃO INCLUIR)

### Instruções para Upload Manual no GitHub

1. Acesse seu repositório no GitHub
2. Clique em "Add file" → "Upload files"
3. Arraste e solte os seguintes arquivos:
   - `index.html`
   - `server.py`
   - `CHANGELOG.md` (este arquivo)
4. Na caixa de commit, adicione a mensagem:
   ```
   Atualização v28/04/2026: Renomeação LOTE, campo número lote, inversão PALETA/BARRIGA
   ```
5. Clique em "Commit changes"

### Dependências Python

Se necessário reinstalar em outro ambiente:
```bash
pip install reportlab
```

### Como Executar

```bash
# Ativar ambiente virtual
.venv\Scripts\Activate.ps1

# Executar servidor
python server.py
```

Servidor rodará em: http://localhost:65535
