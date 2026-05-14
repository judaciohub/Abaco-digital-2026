#!/usr/bin/env python3
import http.server
import socketserver
import socket
import json
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Spacer, Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

PORT = 65535


class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_POST(self):
        if self.path == '/generate-pdf':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data)
                self.generate_pdf(data)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success', 'message': 'PDF gerado com sucesso!'}).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode())
        else:
            super().do_GET()

    def generate_pdf(self, data):
        now = datetime.now()
        filename = f"relatorio_{now.strftime('%Y-%m-%d_%H-%M-%S')}.pdf"

        doc = SimpleDocTemplate(
            filename, pagesize=A4,
            topMargin=0.5 * inch, bottomMargin=0.5 * inch,
            leftMargin=0.75 * inch, rightMargin=0.75 * inch
        )
        elements = []
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='CenterBold', alignment=1, fontName='Helvetica-Bold', fontSize=12))
        styles.add(ParagraphStyle(name='SectionTitle', fontName='Helvetica-Bold', spaceAfter=8, fontSize=11))
        styles.add(ParagraphStyle(name='ItemStyle', fontName='Helvetica', leading=14, leftIndent=15))
        styles.add(ParagraphStyle(name='DateStyle', alignment=2, fontSize=9))
        styles.add(ParagraphStyle(name='TotalGeral', alignment=1, fontName='Helvetica-Bold', fontSize=12, spaceBefore=20))

        try:
            img = Image('img/dpa.png', width=1.5 * inch, height=0.4 * inch)
            img.hAlign = 'CENTER'
            elements.append(img)
            elements.append(Spacer(1, 12))
        except Exception:
            pass

        elements.append(Paragraph("ABACO DOMPORQUITO S/A", styles['CenterBold']))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph("RELATORIO DE CONTAGEM", styles['CenterBold']))
        elements.append(Spacer(1, 12))

        date_str = now.strftime("%d/%m/%Y, %H:%M:%S")
        elements.append(Paragraph(f"DATA E HORA: {date_str}", styles['DateStyle']))
        elements.append(Spacer(1, 20))

        grouped_data = {
            'CARCAÇA NÃO CONFORME': {},
            'LOTE': {},
            'PERNIL': {},
            'BARRIGA': {},
            'CARRÉ': {},
            'PALETA': {}
        }

        total_geral = 0
        counts = data.get('counts', [])

        for item in counts:
            value = int(item['value'])
            total_geral += value
            label = item['label']

            if 'CARCAÇA' in label:
                grouped_data['CARCAÇA NÃO CONFORME'][label] = value
            elif 'LOTE' in label:
                grouped_data['LOTE'][label] = value
            else:
                category, _, sub_item = label.partition(' - ')
                if category in grouped_data:
                    grouped_data[category][sub_item.capitalize()] = value

        elements.append(Paragraph("CONTAGEM:", styles['SectionTitle']))
        elements.append(Spacer(1, 8))

        top_section_content = []

        if grouped_data['CARCAÇA NÃO CONFORME']:
            total_carcaca = sum(grouped_data['CARCAÇA NÃO CONFORME'].values())
            top_section_content.append(
                Paragraph(f"CARCAÇA NÃO CONFORME (TOTAL: {total_carcaca})", styles['SectionTitle'])
            )

        if grouped_data['LOTE']:
            total_lote = sum(grouped_data['LOTE'].values())
            lote_numero = data.get('lote_numero', '')
            titulo_lote = f"LOTE {lote_numero} (TOTAL: {total_lote})" if lote_numero else f"LOTE (TOTAL: {total_lote})"
            top_section_content.append(Paragraph(titulo_lote, styles['SectionTitle']))

        if top_section_content:
            t_top = Table([top_section_content], colWidths=[3.25 * inch, 3.25 * inch])
            t_top.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')]))
            elements.append(t_top)
            elements.append(Spacer(1, 15))

        main_sections = ['PERNIL', 'BARRIGA', 'CARRÉ', 'PALETA']
        col_data = [[], []]

        for i, section_name in enumerate(main_sections):
            col_index = i % 2
            section_content = []

            if grouped_data[section_name]:
                total_section = sum(grouped_data[section_name].values())
                section_content.append(
                    Paragraph(f"{section_name} (TOTAL: {total_section})", styles['SectionTitle'])
                )
                for item, value in grouped_data[section_name].items():
                    section_content.append(Paragraph(f"{item}: {value}", styles['ItemStyle']))

                if col_data[col_index]:
                    col_data[col_index].append(Spacer(1, 15))
                col_data[col_index].extend(section_content)

        if any(col_data[0]) or any(col_data[1]):
            main_table = Table([[col_data[0], col_data[1]]], colWidths=[3.25 * inch, 3.25 * inch])
            main_table.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')]))
            elements.append(main_table)

        elements.append(Paragraph(f"TOTAL GERAL: {total_geral} ITENS", styles['TotalGeral']))
        elements.append(Spacer(1, 60))

        responsible_name = data.get('responsible', 'Não informado')
        elements.append(Paragraph("________________________________________", styles['CenterBold']))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph(responsible_name, styles['CenterBold']))

        doc.build(elements)
        print(f"Relatório gerado: {filename}")


def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "localhost"


socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("0.0.0.0", PORT), RequestHandler) as httpd:
    local_ip = get_local_ip()
    print("=" * 60, flush=True)
    print(f"Servidor rodando na porta {PORT}", flush=True)
    print("=" * 60, flush=True)
    print(f"\nAcesse no tablet ou qualquer dispositivo:", flush=True)
    print(f"   http://{local_ip}:{PORT}", flush=True)
    print(f"   http://localhost:{PORT}", flush=True)
    print(f"\nPressione Ctrl+C para parar o servidor\n", flush=True)
    print("=" * 60, flush=True)
    httpd.serve_forever()
