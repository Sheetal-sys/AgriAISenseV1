from io import BytesIO
from datetime import datetime
import uuid

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)


def get_focus_label(score):
    if score is None:
        return "Unknown"

    score = float(score)

    if score < 50:
        return "Very blurry"
    if score < 150:
        return "Slightly blurry"
    if score < 500:
        return "Acceptable"
    if score < 2000:
        return "Good"
    return "Very sharp"


def get_brightness_label(score):
    if score is None:
        return "Unknown"

    score = float(score)

    if score < 50:
        return "Very dark"
    if score < 90:
        return "Dark"
    if score < 180:
        return "Good lighting"
    if score < 220:
        return "Bright"
    return "Overexposed"


def generate_prediction_report(data: dict) -> BytesIO:
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "AgriAITitle",
        parent=styles["Title"],
        fontSize=22,
        textColor=colors.HexColor("#0f766e"),
        spaceAfter=10,
        alignment=1
    )

    subtitle_style = ParagraphStyle(
        "AgriAISubtitle",
        parent=styles["BodyText"],
        fontSize=10,
        textColor=colors.HexColor("#475569"),
        alignment=1,
        spaceAfter=16
    )

    section_style = ParagraphStyle(
        "SectionTitle",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=colors.HexColor("#166534"),
        spaceBefore=14,
        spaceAfter=8
    )

    normal_style = ParagraphStyle(
        "NormalText",
        parent=styles["BodyText"],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#111827")
    )

    note_style = ParagraphStyle(
        "NoteText",
        parent=styles["BodyText"],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#475569")
    )

    story = []

    report_id = f"AGR-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    generated_on = datetime.now().strftime("%d %b %Y, %I:%M %p")

    blur_score = data.get("blur_score")
    brightness_score = data.get("brightness_score")

    focus_label = get_focus_label(blur_score)
    brightness_label = get_brightness_label(brightness_score)

    story.append(Paragraph("AgriAI Crop Disease Detection Report", title_style))
    story.append(
        Paragraph(
            "AI-generated crop health report for disease detection and advisory support.",
            subtitle_style
        )
    )

    meta_data = [
        ["Report ID", report_id],
        ["Generated On", generated_on],
        ["System", "AgriAI Sense V1"],
        ["Report Type", "Crop Disease Detection"]
    ]

    meta_table = Table(meta_data, colWidths=[120, 370])
    meta_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#ccfbf1")),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#134e4a")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#99f6e4")),
                ("PADDING", (0, 0), (-1, -1), 7),
                ("VALIGN", (0, 0), (-1, -1), "TOP")
            ]
        )
    )

    story.append(meta_table)
    story.append(Spacer(1, 0.18 * inch))

    prediction_data = [
        ["Crop", data.get("crop", "N/A")],
        ["Disease", data.get("disease", "N/A")],
        ["Class Name", data.get("class_name", "N/A")],
        ["Confidence", f'{data.get("confidence", "N/A")} %'],
        ["Reliability", data.get("confidence_level", "N/A")],
        ["Severity", data.get("severity", "N/A")],
        ["Status", data.get("status", "N/A")]
    ]

    story.append(Paragraph("Prediction Summary", section_style))

    prediction_table = Table(prediction_data, colWidths=[120, 370])
    prediction_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#dcfce7")),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#14532d")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#bbf7d0")),
                ("PADDING", (0, 0), (-1, -1), 7),
                ("VALIGN", (0, 0), (-1, -1), "TOP")
            ]
        )
    )

    story.append(prediction_table)

    quality_data = [
        ["Image Focus", focus_label],
        ["Blur Score", str(blur_score or "N/A")],
        ["Lighting", brightness_label],
        ["Brightness Score", str(brightness_score or "N/A")]
    ]

    story.append(Paragraph("Image Quality Analysis", section_style))

    quality_table = Table(quality_data, colWidths=[120, 370])
    quality_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#e0f2fe")),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#075985")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#bae6fd")),
                ("PADDING", (0, 0), (-1, -1), 7),
                ("VALIGN", (0, 0), (-1, -1), "TOP")
            ]
        )
    )

    story.append(quality_table)

    def add_section(title, value):
        story.append(Paragraph(title, section_style))
        story.append(Paragraph(str(value or "N/A"), normal_style))
        story.append(Spacer(1, 0.07 * inch))

    add_section("Cause", data.get("cause"))
    add_section("Symptoms", data.get("symptoms"))
    add_section("Treatment Recommendation", data.get("treatment"))
    add_section("Prevention Guidance", data.get("prevention"))

    story.append(Spacer(1, 0.15 * inch))

    disclaimer = (
        "<b>Disclaimer:</b> This report is generated by an AI-based decision-support system. "
        "It should not replace advice from certified agriculture experts or local crop specialists."
    )

    story.append(Paragraph(disclaimer, note_style))

    doc.build(story)

    buffer.seek(0)
    return buffer