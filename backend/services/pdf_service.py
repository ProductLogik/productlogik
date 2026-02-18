import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas

class PDFService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        """Setup custom styles for a premium look"""
        self.brand_color = colors.HexColor("#059669")  # Brand green
        self.text_color = colors.HexColor("#1f2937")  # Dark gray
        
        self.title_style = ParagraphStyle(
            'BrandTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=self.brand_color,
            spaceAfter=12,
            fontName='Helvetica-Bold'
        )
        
        self.theme_style = ParagraphStyle(
            'ThemeTitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=self.text_color,
            spaceBefore=10,
            spaceAfter=6,
            fontName='Helvetica-Bold'
        )
        
        self.body_style = ParagraphStyle(
            'CustomBody',
            parent=self.styles['BodyText'],
            fontSize=11,
            textColor=self.text_color,
            leading=14
        )

    def generate_report(self, analysis_data: dict, tier: str = "demo") -> io.BytesIO:
        """
        Generate a professional PDF report from analysis results.
        
        Args:
            analysis_data: The JSON result from AI analysis.
            tier: User tier ('demo', 'pro', or 'team').
            
        Returns:
            io.BytesIO: Buffer containing the PDF data.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm
        )
        
        elements = []
        
        # --- 1. Header ---
        elements.append(Paragraph("ProductLogik Intelligence Report", self.title_style))
        elements.append(Paragraph(f"Analysis Summary: {analysis_data.get('executive_summary', 'No summary available.')}", self.body_style))
        elements.append(Spacer(1, 1*cm))
        
        # --- 2. Themes Section ---
        elements.append(Paragraph("Key Problem Themes", self.styles['Heading2']))
        elements.append(Spacer(1, 0.5*cm))
        
        for theme in analysis_data.get('themes', []):
            elements.append(Paragraph(theme.get('name', 'Unnamed Theme'), self.theme_style))
            elements.append(Paragraph(f"<b>Sentiment:</b> {theme.get('sentiment')} | <b>Confidence:</b> {theme.get('confidence')}%", self.body_style))
            elements.append(Paragraph(theme.get('summary', ''), self.body_style))
            
            # Evidence Sub-section
            if theme.get('evidence'):
                elements.append(Paragraph("<i>Key Evidence:</i>", self.body_style))
                for quote in theme.get('evidence', []):
                    elements.append(Paragraph(f"• \"{quote}\"", self.body_style))
            
            elements.append(Spacer(1, 0.5*cm))

        # --- Watermark for Demo Tier ---
        def add_watermark(canvas_obj, doc_obj):
            if tier == "demo":
                canvas_obj.saveState()
                canvas_obj.setFont('Helvetica-Bold', 60)
                canvas_obj.setFillAlpha(0.1)
                canvas_obj.setStrokeColor(colors.lightgrey)
                canvas_obj.translate(A4[0]/2, A4[1]/2)
                canvas_obj.rotate(45)
                canvas_obj.drawCentredString(0, 0, "DEMO - PRODUCTLOGIK")
                canvas_obj.restoreState()

        # Build PDF
        doc.build(elements, onFirstPage=add_watermark, onLaterPages=add_watermark)
        
        buffer.seek(0)
        return buffer

pdf_service = PDFService()
