const SECTION_ITEMS = [
    { label: 'DANIFICADO',   slug: 'danificado'   },
    { label: 'FRATURA',      slug: 'fratura'      },
    { label: 'RESÍDUOS',     slug: 'residuos'     },
    { label: 'PELOS',        slug: 'pelos'        },
    { label: 'HEMATOMAS',    slug: 'hematomas'    },
    { label: 'MELADO',       slug: 'melado'       },
    { label: 'SUJEIRA',      slug: 'sujeira'      },
    { label: 'MAL TOALETE',  slug: 'mal-toalete'  },
    { label: 'ADERENCIA',    slug: 'aderencia'    }
];

const TOP_SECTIONS = [
    { id: 'carcaca', label: 'CARCAÇA NÃO CONFORME', colorClass: 'amarelo', type: 'single' },
    { id: 'pe',      label: 'LOTE',                 colorClass: 'cinza',   type: 'lote'   }
];

const MAIN_SECTIONS = [
    { id: 'pernil',  label: 'PERNIL',  colorClass: 'azul'         },
    { id: 'barriga', label: 'BARRIGA', colorClass: 'amarelo-claro' },
    { id: 'carre',   label: 'CARRÉ',   colorClass: 'verde'        },
    { id: 'paleta',  label: 'PALETA',  colorClass: 'laranja'      }
];

function createCounterRow(id, label) {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
        <span class="item-name">${label}</span>
        <div class="counter-controls">
            <button class="counter-btn btn-minus" data-id="${id}" data-delta="-1">−</button>
            <div class="counter-display" id="${id}">0</div>
            <button class="counter-btn btn-plus" data-id="${id}" data-delta="1">+</button>
        </div>`;
    return item;
}

function createSection(id, label, colorClass, rows) {
    const section = document.createElement('div');
    section.className = 'section';

    const header = document.createElement('div');
    header.className = `section-header ${colorClass}`;
    header.textContent = label;
    section.appendChild(header);

    rows.forEach(row => section.appendChild(createCounterRow(row.id, row.label)));
    return section;
}

function renderTopSections() {
    const container = document.getElementById('top-section');

    TOP_SECTIONS.forEach(s => {
        const section = document.createElement('div');
        section.className = 'section';

        const header = document.createElement('div');
        header.className = `section-header ${s.colorClass}`;
        header.textContent = s.label;
        section.appendChild(header);

        if (s.type === 'single') {
            section.appendChild(createCounterRow(s.id, 'Total'));
        } else {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <span class="item-name">Total</span>
                <div class="counter-controls">
                    <input type="text" class="lote-input" id="lote-numero" placeholder="Nº ou Nome">
                    <button class="counter-btn btn-minus" data-id="${s.id}" data-delta="-1">−</button>
                    <div class="counter-display" id="${s.id}">0</div>
                    <button class="counter-btn btn-plus" data-id="${s.id}" data-delta="1">+</button>
                </div>`;
            section.appendChild(item);
        }

        container.appendChild(section);
    });
}

function renderMainSections() {
    const container = document.getElementById('main-grid');

    MAIN_SECTIONS.forEach(s => {
        const rows = SECTION_ITEMS.map(item => ({
            id: `${s.id}-${item.slug}`,
            label: item.label
        }));
        container.appendChild(createSection(s.id, s.label, s.colorClass, rows));
    });
}

function updateCounter(id, delta) {
    const el = document.getElementById(id);
    el.textContent = Math.max(0, parseInt(el.textContent) + delta);
    persistState();
}

function persistState() {
    const state = {};
    document.querySelectorAll('.counter-display').forEach(el => {
        state[el.id] = el.textContent;
    });
    const loteInput = document.getElementById('lote-numero');
    if (loteInput) state['lote-numero'] = loteInput.value;
    localStorage.setItem('contagemData', JSON.stringify(state));
}

function restoreState() {
    const saved = localStorage.getItem('contagemData');
    if (!saved) return;

    const state = JSON.parse(saved);
    document.querySelectorAll('.counter-display').forEach(el => {
        if (state[el.id] !== undefined) el.textContent = state[el.id];
    });

    const loteInput = document.getElementById('lote-numero');
    if (loteInput && state['lote-numero'] !== undefined) loteInput.value = state['lote-numero'];
}

function buildSummary() {
    let html = '';
    let total = 0;

    document.querySelectorAll('.counter-display').forEach(counter => {
        const value = parseInt(counter.textContent);
        if (value <= 0) return;

        const itemName = counter.closest('.item').querySelector('.item-name').textContent.trim();
        const sectionName = counter.closest('.section').querySelector('.section-header').textContent.trim();
        const label = itemName === 'Total' ? sectionName : `${sectionName} - ${itemName}`;

        html += `<div class="modal-item"><strong>${label}:</strong><span>${value}</span></div>`;
        total += value;
    });

    if (total === 0) {
        return '<div class="modal-item"><p>Nenhuma não conformidade registrada</p></div>';
    }

    html += `<div class="modal-item modal-item-total"><strong>TOTAL:</strong><strong>${total}</strong></div>`;
    return html;
}

function openModal() {
    document.getElementById('modal-body').innerHTML = buildSummary();
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function resetAll() {
    if (!confirm('Tem certeza que deseja resetar todas as contagens?')) return;
    document.querySelectorAll('.counter-display').forEach(el => { el.textContent = '0'; });
    const lote = document.getElementById('lote-numero');
    if (lote) lote.value = '';
    persistState();
    closeModal();
}

function drawSectionTable(doc, x, y, width, title, headerRgb, items, darkHeaderText) {
    const HEADER_H = 8.5;
    const ROW_H    = 6.5;
    const PAD      = 3.5;
    const total    = items.reduce((s, i) => s + i.value, 0);

    doc.setFillColor(...headerRgb);
    doc.rect(x, y, width, HEADER_H, 'F');

    if (darkHeaderText) {
        doc.setTextColor(44, 62, 80);
    } else {
        doc.setTextColor(255, 255, 255);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(title, x + PAD, y + 5.8);
    doc.text(`Total: ${total}`, x + width - PAD, y + 5.8, { align: 'right' });

    let rowY = y + HEADER_H;

    items.forEach((item, i) => {
        const shade = i % 2 === 0 ? 248 : 255;
        doc.setFillColor(shade, i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 250 : 255);
        doc.rect(x, rowY, width, ROW_H, 'F');
        doc.setTextColor(44, 62, 80);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(item.label, x + PAD + 2, rowY + 4.5);
        doc.setFont('helvetica', 'bold');
        doc.text(String(item.value), x + width - PAD, rowY + 4.5, { align: 'right' });
        rowY += ROW_H;
    });

    doc.setDrawColor(210, 215, 220);
    doc.setLineWidth(0.3);
    doc.rect(x, y, width, rowY - y);

    return rowY;
}

function generatePDF() {
    const responsavelInput = document.getElementById('responsavel');
    const responsavel = responsavelInput.value.trim();

    if (!responsavel) {
        alert('Por favor, preencha o nome do responsável.');
        responsavelInput.focus();
        return;
    }

    const loteNumero = document.getElementById('lote-numero').value.trim();
    const categorias = {
        carcaca: { total: 0 },
        pe:      { total: 0 },
        pernil:  { total: 0, items: [] },
        barriga: { total: 0, items: [] },
        carre:   { total: 0, items: [] },
        paleta:  { total: 0, items: [] }
    };

    let totalGeral = 0;

    document.querySelectorAll('.counter-display').forEach(counter => {
        const value = parseInt(counter.textContent);
        if (value <= 0) return;

        const id = counter.id;

        if (id === 'carcaca') {
            categorias.carcaca.total = value;
        } else if (id === 'pe') {
            categorias.pe.total = value;
        } else {
            const prefix = Object.keys(categorias).find(k => id.startsWith(k + '-'));
            if (prefix) {
                const itemLabel = counter.closest('.item').querySelector('.item-name').textContent.trim();
                categorias[prefix].items.push({ label: itemLabel, value });
                categorias[prefix].total += value;
            }
        }

        totalGeral += value;
    });

    if (totalGeral === 0) {
        alert('Nenhuma não conformidade registrada para gerar o relatório.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const now = new Date();

    function pad(n) { return String(n).padStart(2, '0'); }

    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    doc.setProperties({
        title: 'Relatório de Não Conformidades',
        subject: `Contagem - ${dateStr}`,
        author: responsavel,
        creator: 'Abaco Domporquito S/A'
    });

    const logo = new Image();
    logo.crossOrigin = 'Anonymous';
    let logoLoaded = false;
    let pdfBuilt = false;

    logo.onload  = () => { logoLoaded = true;  if (!pdfBuilt) { pdfBuilt = true; buildPDF(); } };
    logo.onerror = () => {                      if (!pdfBuilt) { pdfBuilt = true; buildPDF(); } };
    setTimeout(  () => { if (!logoLoaded && !pdfBuilt) { pdfBuilt = true; buildPDF(); } }, 2000);

    logo.src = 'img/dpa.png';

    function buildPDF() {
        const W  = 210;
        const H  = 297;
        const M  = 14;
        const CW = W - M * 2;

        doc.setFillColor(44, 62, 80);
        doc.rect(0, 0, W, 40, 'F');

        if (logoLoaded) {
            try { doc.addImage(logo, 'PNG', M, 10, 38, 13); } catch (_) {}
        }

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('ABACO DOMPORQUITO S/A', W - M, 19, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('RELATÓRIO DE NÃO CONFORMIDADES', W - M, 28, { align: 'right' });
        doc.setFontSize(7.5);
        doc.setTextColor(189, 195, 199);
        doc.text(`Nº ${String(now.getTime()).slice(-7)}`, W - M, 36, { align: 'right' });

        doc.setFillColor(236, 240, 241);
        doc.rect(M, 45, CW, 15, 'F');

        const metaItems = [
            { label: 'DATA',  value: dateStr },
            { label: 'HORA',  value: timeStr }
        ];
        if (loteNumero) metaItems.push({ label: 'LOTE', value: loteNumero });

        doc.setTextColor(44, 62, 80);
        doc.setFontSize(8.5);
        let metaX = M + 5;

        metaItems.forEach(seg => {
            doc.setFont('helvetica', 'bold');
            doc.text(seg.label + ':', metaX, 54);
            const lw = doc.getTextWidth(seg.label + ':');
            doc.setFont('helvetica', 'normal');
            doc.text(seg.value, metaX + lw + 2, 54);
            metaX += doc.getTextWidth(seg.label + ': ' + seg.value) + 14;
        });

        doc.setFillColor(52, 152, 219);
        doc.rect(M, 61, CW, 0.8, 'F');

        const SEC_COLORS = {
            pernil:  { rgb: [41, 128, 185],  dark: false },
            barriga: { rgb: [241, 196, 15],  dark: true  },
            carre:   { rgb: [30, 132, 73],   dark: false },
            paleta:  { rgb: [171, 90, 0],    dark: false }
        };

        const SEC_LABELS = {
            pernil: 'PERNIL', barriga: 'BARRIGA', carre: 'CARRÉ', paleta: 'PALETA'
        };

        const colW    = (CW - 6) / 2;
        const colLeft = M;
        const colRight = M + colW + 6;
        let yLeft  = 65;
        let yRight = 65;

        ['pernil', 'carre'].forEach(key => {
            if (categorias[key].total > 0) {
                const { rgb, dark } = SEC_COLORS[key];
                yLeft = drawSectionTable(doc, colLeft, yLeft, colW, SEC_LABELS[key], rgb, categorias[key].items, dark);
                yLeft += 5;
            }
        });

        ['barriga', 'paleta'].forEach(key => {
            if (categorias[key].total > 0) {
                const { rgb, dark } = SEC_COLORS[key];
                yRight = drawSectionTable(doc, colRight, yRight, colW, SEC_LABELS[key], rgb, categorias[key].items, dark);
                yRight += 5;
            }
        });

        let y = Math.max(yLeft, yRight) + 2;

        if (categorias.carcaca.total > 0 || categorias.pe.total > 0) {
            doc.setFillColor(245, 246, 247);
            doc.rect(M, y, CW, 12, 'F');
            doc.setDrawColor(210, 215, 220);
            doc.setLineWidth(0.3);
            doc.rect(M, y, CW, 12);

            doc.setFillColor(243, 156, 18);
            doc.rect(M, y, 3, 12, 'F');

            let infoX = M + 8;
            doc.setFontSize(9);

            if (categorias.carcaca.total > 0) {
                doc.setTextColor(44, 62, 80);
                doc.setFont('helvetica', 'bold');
                doc.text('CARCAÇA NÃO CONFORME:', infoX, y + 7.5);
                const lw = doc.getTextWidth('CARCAÇA NÃO CONFORME:');
                doc.setFont('helvetica', 'normal');
                doc.text(String(categorias.carcaca.total), infoX + lw + 3, y + 7.5);
                infoX += lw + 18;
            }

            if (categorias.pe.total > 0) {
                const loteLabel = loteNumero ? `LOTE ${loteNumero}:` : 'LOTE:';
                doc.setFont('helvetica', 'bold');
                doc.text(loteLabel, infoX, y + 7.5);
                const lw = doc.getTextWidth(loteLabel);
                doc.setFont('helvetica', 'normal');
                doc.text(String(categorias.pe.total), infoX + lw + 3, y + 7.5);
            }

            y += 16;
        }

        doc.setFillColor(44, 62, 80);
        doc.rect(M, y, CW, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(`TOTAL GERAL: ${totalGeral} ITENS`, W / 2, y + 10, { align: 'center' });

        y += 15;

        const sigY = Math.max(y + 28, H - 38);

        doc.setDrawColor(44, 62, 80);
        doc.setLineWidth(0.5);
        doc.line(W / 2 - 42, sigY, W / 2 + 42, sigY);

        doc.setTextColor(44, 62, 80);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(responsavel.toUpperCase(), W / 2, sigY + 7, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(120, 130, 140);
        doc.text('RESPONSÁVEL', W / 2, sigY + 13, { align: 'center' });

        const filename = `Relatorio_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}.pdf`;
        doc.save(filename);
        alert('Relatório PDF gerado com sucesso!');
        closeModal();
    }
}

function handleCounterClick(e) {
    const btn = e.target.closest('[data-id]');
    if (!btn) return;
    updateCounter(btn.dataset.id, parseInt(btn.dataset.delta));
}

function init() {
    renderTopSections();
    renderMainSections();
    restoreState();

    document.getElementById('btn-finalizar').addEventListener('click', openModal);
    document.getElementById('btn-close').addEventListener('click', closeModal);
    document.getElementById('btn-reset').addEventListener('click', resetAll);
    document.getElementById('btn-pdf').addEventListener('click', generatePDF);

    document.getElementById('modal').addEventListener('click', e => {
        if (e.target === document.getElementById('modal')) closeModal();
    });

    document.getElementById('top-section').addEventListener('click', handleCounterClick);
    document.getElementById('main-grid').addEventListener('click', handleCounterClick);

    document.getElementById('top-section').addEventListener('input', e => {
        if (e.target.id === 'lote-numero') persistState();
    });
}

document.addEventListener('DOMContentLoaded', init);
