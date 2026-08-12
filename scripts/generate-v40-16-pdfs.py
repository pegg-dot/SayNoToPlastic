#!/usr/bin/env python3
"""Generate v40.16 printable worksheets, challenges, and one-page press briefings.

The wording is intentionally grounded in the supplied Dr. Haddad drafts and the
site's evidence-status records. No production provider or source-review state is
changed by this generator.
"""
from __future__ import annotations

from pathlib import Path
from typing import Iterable, Sequence

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
DOWNLOADS = PUBLIC / "downloads"
PRESS = PUBLIC / "press-briefs"
LOGO = PUBLIC / "brand" / "sntp-wordmark-microplastic.png"

DOWNLOADS.mkdir(parents=True, exist_ok=True)
PRESS.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#07111D")
DEEP_NAVY = colors.HexColor("#03090F")
GOLD = colors.HexColor("#D9A55F")
GOLD_DARK = colors.HexColor("#93672E")
IVORY = colors.HexColor("#F4EDE2")
PAPER = colors.HexColor("#FBF7EF")
INK = colors.HexColor("#1A1713")
MUTED = colors.HexColor("#625C53")
LINE = colors.HexColor("#C9BDA8")
PALE_GOLD = colors.HexColor("#EEE0C8")
WHITE = colors.white

PAGE_W, PAGE_H = LETTER
MARGIN_X = 0.55 * inch
MARGIN_TOP = 0.62 * inch
MARGIN_BOTTOM = 0.54 * inch

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="BrandKicker", fontName="Helvetica-Bold", fontSize=7.5, leading=9, tracking=1.5, textColor=GOLD, spaceAfter=6))
styles.add(ParagraphStyle(name="DocTitle", fontName="Times-Roman", fontSize=29, leading=30, textColor=INK, spaceAfter=8))
styles.add(ParagraphStyle(name="DocDeck", fontName="Times-Roman", fontSize=11, leading=15, textColor=MUTED, spaceAfter=14))
styles.add(ParagraphStyle(name="SectionHead", fontName="Times-Roman", fontSize=17, leading=19, textColor=INK, spaceBefore=8, spaceAfter=8, keepWithNext=True))
styles.add(ParagraphStyle(name="SmallHead", fontName="Helvetica-Bold", fontSize=7.5, leading=9, tracking=1.1, textColor=GOLD_DARK, spaceBefore=4, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name="BodySNTP", fontName="Times-Roman", fontSize=9.6, leading=13.3, textColor=MUTED, spaceAfter=6))
styles.add(ParagraphStyle(name="BodySmall", fontName="Times-Roman", fontSize=8.4, leading=11.3, textColor=MUTED, spaceAfter=4))
styles.add(ParagraphStyle(name="BriefTitle", fontName="Times-Roman", fontSize=25.5, leading=26, textColor=INK, spaceAfter=6))
styles.add(ParagraphStyle(name="BriefSub", fontName="Times-Italic", fontSize=11.5, leading=14, textColor=GOLD_DARK, spaceAfter=8))
styles.add(ParagraphStyle(name="BriefBody", fontName="Times-Roman", fontSize=8.35, leading=10.7, textColor=MUTED, spaceAfter=4))
styles.add(ParagraphStyle(name="BriefBullet", fontName="Times-Roman", fontSize=8.15, leading=10.5, textColor=MUTED, leftIndent=12, firstLineIndent=-8, bulletIndent=0, spaceAfter=3))
styles.add(ParagraphStyle(name="Tiny", fontName="Helvetica", fontSize=6.6, leading=8.2, textColor=MUTED))
styles.add(ParagraphStyle(name="TinyWhite", fontName="Helvetica", fontSize=6.6, leading=8.2, textColor=colors.HexColor("#D8DEE3")))
styles.add(ParagraphStyle(name="DayTitle", fontName="Times-Roman", fontSize=12.3, leading=14, textColor=INK, spaceAfter=3))
styles.add(ParagraphStyle(name="DayBody", fontName="Times-Roman", fontSize=8.6, leading=11.3, textColor=MUTED))
styles.add(ParagraphStyle(name="Commitment", fontName="Times-Roman", fontSize=11, leading=14, textColor=INK))


def _safe(text: str) -> str:
    return (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace("—", "-").replace("–", "-").replace("’", "'").replace("“", '"').replace("”", '"'))


class CheckItem(Flowable):
    def __init__(self, text: str, width: float, font_size: float = 9.1, leading: float = 12.1, box: float = 10):
        super().__init__()
        self.text = text
        self.width = width
        self.box = box
        self.paragraph = Paragraph(_safe(text), ParagraphStyle(
            name=f"Check-{id(self)}", fontName="Times-Roman", fontSize=font_size,
            leading=leading, textColor=MUTED,
        ))
        _, ph = self.paragraph.wrap(width - box - 10, 1000)
        self.height = max(box, ph) + 7

    def wrap(self, avail_width, avail_height):
        self.width = min(self.width, avail_width)
        self.paragraph.wrap(self.width - self.box - 10, avail_height)
        return self.width, self.height

    def draw(self):
        c = self.canv
        y = self.height - self.box - 1
        c.setStrokeColor(LINE)
        c.setLineWidth(0.8)
        c.rect(0, y, self.box, self.box, fill=0, stroke=1)
        self.paragraph.drawOn(c, self.box + 10, self.height - self.paragraph.height - 1)


class LinedArea(Flowable):
    def __init__(self, label: str, width: float, lines: int = 3):
        super().__init__()
        self.label = label
        self.width = width
        self.lines = lines
        self.height = 18 + lines * 18

    def wrap(self, avail_width, avail_height):
        self.width = min(self.width, avail_width)
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(GOLD_DARK)
        c.drawString(0, self.height - 8, self.label.upper())
        c.setStrokeColor(LINE)
        c.setLineWidth(0.55)
        y = self.height - 25
        for _ in range(self.lines):
            c.line(0, y, self.width, y)
            y -= 18


class StatusPill(Flowable):
    def __init__(self, text: str, width: float = 190):
        super().__init__()
        self.text = text
        self.width = width
        self.height = 22

    def wrap(self, avail_width, avail_height):
        return min(self.width, avail_width), self.height

    def draw(self):
        c = self.canv
        c.setFillColor(PALE_GOLD)
        c.setStrokeColor(GOLD)
        c.roundRect(0, 0, self.width, self.height, 3, fill=1, stroke=1)
        c.setFillColor(GOLD_DARK)
        c.setFont("Helvetica-Bold", 6.5)
        c.drawCentredString(self.width / 2, 7.5, self.text.upper())


def _header_footer(canvas, doc, section: str = "SAY NO TO PLASTIC"):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_X, 0.38 * inch, PAGE_W - MARGIN_X, 0.38 * inch)
    canvas.setFont("Helvetica-Bold", 6.2)
    canvas.setFillColor(GOLD_DARK)
    canvas.drawString(MARGIN_X, 0.23 * inch, section)
    canvas.setFont("Helvetica", 6.2)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(PAGE_W - MARGIN_X, 0.23 * inch, f"saynotoplastic.com  |  {doc.page}")
    canvas.restoreState()


def _brand_banner(canvas, doc, title: str = ""):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE_H - 0.48 * inch, PAGE_W, 0.48 * inch, fill=1, stroke=0)
    if LOGO.exists():
        img = Image(str(LOGO), width=2.18 * inch, height=0.363 * inch)
        img.drawOn(canvas, MARGIN_X, PAGE_H - 0.425 * inch)
    if title:
        canvas.setFont("Helvetica-Bold", 6.4)
        canvas.setFillColor(GOLD)
        canvas.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 0.28 * inch, title.upper())
    canvas.restoreState()


def make_doc(path: Path, on_page, top_margin=MARGIN_TOP, bottom_margin=MARGIN_BOTTOM):
    doc = BaseDocTemplate(
        str(path), pagesize=LETTER, leftMargin=MARGIN_X, rightMargin=MARGIN_X,
        topMargin=top_margin, bottomMargin=bottom_margin,
        title=path.stem.replace("-", " ").title(), author="Say No To Plastic",
        subject="Evidence-aware education and practical action",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    template = PageTemplate(id="main", frames=frame, onPage=on_page)
    doc.addPageTemplates(template)
    return doc


REDUCE_GROUPS = [
    ("01", "Food and drink", "Start with the plastic that repeatedly touches what you eat and drink.", [
        "Replace frequently used plastic kitchen items with wood, ceramic, stainless steel, or glass when practical.",
        "Avoid routine plastic water bottles and use glass or stainless-steel drinkware.",
        "Compare reverse osmosis or another maintained water filter with local water quality and household needs.",
        "Avoid heating food in plastic containers.",
        "Store leftovers in glass, ceramic, or stainless steel when practical.",
        "Reduce single-use plastic foodware and choose fresh or minimally processed foods over heavily packaged alternatives when practical.",
    ]),
    ("02", "Home and indoor air", "Dust, textiles, furnishings, ventilation, and cleaning shape the indoor environment.", [
        "Vacuum and dust regularly using a well-sealed machine with a HEPA filter when possible.",
        "Use damp cleaning methods that remove dust rather than repeatedly moving it into the air.",
        "Ventilate the home when outdoor air quality and weather make it reasonable.",
        "Focus on repeated routines rather than trying to create a particle-free home.",
    ]),
    ("03", "Clothing and personal care", "Choose durable materials and review the products that contact skin every day.", [
        "Choose natural fibers such as cotton, linen, wool, or hemp when a garment already needs replacement and the material fits the use.",
        "Keep serviceable clothing in use instead of replacing an entire wardrobe.",
        "Review cosmetics and personal-care products for unnecessary synthetic polymers and plastic-associated endocrine-disrupting chemicals.",
        "Prioritize products that are useful, maintainable, and appropriate for the person using them.",
    ]),
    ("04", "Build one habit at a time", "The goal is not perfection. The goal is a small change that can be repeated for years.", [
        "Identify the highest-frequency plastic contact in your routine.",
        "Choose one realistic replacement or behavior change.",
        "Keep established medical, food-safety, hygiene, and accessibility guidance first.",
        "Review what worked before adding another change.",
        "Share one clear, evidence-aware idea with another person.",
    ]),
]

SEVEN_DAY = [
    (1, "Notice what repeats", "Write down the three plastic contacts that repeat most often in your day. Choose only one to work on first."),
    (2, "Change one hot-food habit", "Move one reheating or hot-food routine away from plastic when a safe practical alternative is available."),
    (3, "Choose a reusable drink container", "Use a glass or stainless-steel bottle or cup for one routine that normally relies on disposable plastic."),
    (4, "Store one meal differently", "Use glass, ceramic, or stainless steel for one leftover or prepared meal when practical."),
    (5, "Remove one disposable item", "Choose one recurring single-use cup, utensil, plate, or takeout container to avoid or replace."),
    (6, "Improve one indoor-air routine", "Use a damp-dusting, vacuuming, or ventilation routine that fits your home and outdoor-air conditions."),
    (7, "Keep what worked", "Review the week. Keep the one change that felt realistic, and explain one evidence-aware idea to someone else."),
]

THIRTY_DAY = [
    ("Map your routine", "List repeated plastic contact around food, drinks, storage, clothing, dust, and personal care."),
    ("Choose one priority", "Pick the highest-frequency contact that is realistic to change this month."),
    ("Stop one hot-plastic habit", "Use a safe non-plastic alternative for one reheating or hot-food routine."),
    ("Change one drink routine", "Use glass or stainless steel for one drink you have often."),
    ("Change one storage routine", "Store one recurring leftover or packed meal without plastic when practical."),
    ("Review your water context", "Check local water information and the maintenance needs of any filter you use or consider."),
    ("Week-one review", "Keep the change that worked. Do not add another simply to make the list longer."),
    ("Remove one disposable item", "Target one recurring cup, utensil, plate, bag, or takeout container."),
    ("Damp dust one zone", "Clean one high-use room in a way that removes dust rather than redistributing it."),
    ("Check your vacuum setup", "Confirm that the vacuum is sealed and that filters are maintained according to instructions."),
    ("Ventilate when appropriate", "Open windows or use ventilation only when outdoor air quality, weather, and safety allow."),
    ("Review one garment", "When replacement is already needed, compare durable natural and synthetic options for the actual use."),
    ("Keep serviceable clothing", "Avoid replacing a usable wardrobe simply to complete a challenge."),
    ("Week-two review", "Note which home or clothing change is likely to last."),
    ("Read how detection works", "Learn why collection, blanks, preparation, instrument choice, and contamination control matter."),
    ("Read the exposome", "Place individual plastic choices inside a wider lifetime environmental context."),
    ("Read one verified study chapter", "Choose a study from the Science page and read its sample, method, finding, and limitations."),
    ("Practice the claim ladder", "Rewrite one headline so detection, association, and causation are not confused."),
    ("Compare particles and chemicals", "Keep microplastic-particle evidence separate from BPA, phthalate, and other chemical evidence."),
    ("Choose one body-system overview", "Read its known-versus-uncertain section before sharing the topic."),
    ("Week-three review", "Write one sentence that accurately states what the evidence does not yet show."),
    ("Review one personal-care product", "Check whether a product contains unnecessary synthetic polymers or plastic-associated ingredients, without assuming a health effect."),
    ("Use one product longer", "Prioritize durability and maintenance over replacing items for appearance alone."),
    ("Plan one low-plastic meal routine", "Choose a fresh or minimally packaged option when it fits budget, access, and dietary needs."),
    ("Prepare a reusable kit", "Place the cup, bottle, container, or utensils you actually use where they are easy to remember."),
    ("Share one accurate finding", "Name the study type and its limit when you discuss it with another person."),
    ("Invite one practical change", "Ask a household, school, or workplace to test one realistic reduction rather than demand perfection."),
    ("Review health and safety boundaries", "Keep medical care, hygiene, food safety, infant feeding, accessibility, and emergencies ahead of plastic reduction."),
    ("Choose the next month's habit", "Add only one new change after the first has become routine."),
    ("Close the loop", "Record what changed, what did not, and which evidence question you want to follow next."),
]


PRESS_BRIEFS = [
    {
        "filename": "cardiovascular-system.pdf",
        "number": "01",
        "title": "Heart and Arteries",
        "subtitle": "Two human studies, two distinct questions",
        "status": "Verified primary studies linked",
        "overview": "Human studies have detected plastic-derived material in diseased artery plaque and coronary blood. These findings are important associations; they do not prove that plastic directly causes heart attacks or strokes.",
        "supports": [
            "A 2024 human study detected microplastics and nanoplastics in more than half of surgically removed carotid plaques.",
            "Plastic-containing plaques were associated with a higher combined rate of heart attack, stroke, or death during follow-up.",
            "A 2026 coronary-blood study reported detection in 84% of acute-heart-attack patients, 40% with chronic coronary disease, and 32% with normal coronary arteries.",
            "Higher particle measurements were reported alongside higher inflammatory markers in that study.",
        ],
        "limits": [
            "The studies do not establish that particles caused the cardiovascular events.",
            "They do not support routine clinical microplastic testing or a new treatment pathway.",
            "Established risk factors - blood pressure, cholesterol, diabetes, smoking, obesity, and inactivity - remain primary prevention priorities.",
        ],
        "language": "Say: 'The studies found plastic-derived material and a concerning association that deserves further investigation.' Avoid: 'Microplastics have been proven to cause heart attacks.'",
        "sources": "Primary sources linked on the site: New England Journal of Medicine (2024) and European Heart Journal (2026). Source draft: The heart.pdf.",
        "url": "saynotoplastic.com/science/body/cardiovascular-system",
    },
    {
        "filename": "pregnancy-early-life.pdf",
        "number": "02",
        "title": "Pregnancy and Early Life",
        "subtitle": "Placental detection with a no-blame boundary",
        "status": "Partial primary-source record",
        "overview": "The supplied material describes detection reports across placenta and other pregnancy or early-life samples. The site links a placenta study, while several broader sample claims remain in primary-source review.",
        "supports": [
            "A linked human placenta study supports the central statement that plastic-derived material has been measured in placental samples.",
            "The supplied draft also discusses umbilical cord blood, amniotic fluid, meconium, breast milk, and fetal tissues.",
            "Pregnancy is a sensitive developmental period and an important research priority.",
        ],
        "limits": [
            "Detection does not prove miscarriage, birth defects, developmental disorders, or childhood disease.",
            "The broader sample claims require complete primary-paper review before production approval.",
            "No parent should be blamed for an exposure embedded in modern environments.",
        ],
        "language": "Lead with care: 'Research is investigating when exposure begins and what detection means.' Keep established prenatal care, nutrition, infant feeding, sterilization, and medical guidance first.",
        "sources": "Linked placenta study plus Dr. Haddad's supplied draft: The first 1000 days.pdf. Broader primary bibliography remains a publication gate.",
        "url": "saynotoplastic.com/science/body/pregnancy-early-life",
    },
    {
        "filename": "female-reproductive-health.pdf",
        "number": "03",
        "title": "Female Reproductive Health",
        "subtitle": "Follicular fluid, tissue questions, and uncertainty",
        "status": "Partial primary-source record",
        "overview": "Scientists have reported microplastic detection in female reproductive environments, including follicular fluid. Detection confirms that measured material reached a sample; it does not establish infertility or reproductive disease.",
        "supports": [
            "A linked 2025 human study identified microplastics in follicular fluid collected during IVF treatment.",
            "The supplied draft discusses reports involving ovaries and uterine tissue and research questions involving fibroids and endometriosis.",
            "Plastic-associated endocrine-disrupting chemicals are a related but separate evidence category.",
        ],
        "limits": [
            "Current evidence does not prove impaired fertility, reduced egg quality, fibroids, or endometriosis were caused by microplastics.",
            "Tissue and disease-association claims beyond the linked follicular-fluid study need full source review.",
            "The findings do not create a clinical screening or treatment recommendation.",
        ],
        "language": "Say: 'The finding raises important questions about exposure near developing eggs.' Avoid claims that the study proves infertility or predicts an individual's outcome.",
        "sources": "Linked 2025 follicular-fluid study plus Dr. Haddad's supplied draft: Female reproductive.pdf.",
        "url": "saynotoplastic.com/science/body/female-reproductive-health",
    },
    {
        "filename": "detection-methods.pdf",
        "number": "04",
        "title": "How Detection Works",
        "subtitle": "From sample collection to polymer identification",
        "status": "Editorial framework and source notes",
        "overview": "Detection studies begin with a defined biological sample, remove biological material carefully, analyze what remains, and identify polymer or particle characteristics with specialized instruments.",
        "supports": [
            "Methods may report particle count, size, shape, chemistry, spectral signature, or polymer mass.",
            "Collection materials, blanks, air controls, cleaning, and quality assurance are essential because plastic is common in laboratories.",
            "Commonly reported polymers include PE, PP, PET, PS, and PVC.",
        ],
        "limits": [
            "Different methods do not produce perfectly interchangeable results.",
            "Detection alone does not establish origin, dose, biological response, persistence, or disease causation.",
            "Methods continue to evolve, so detection thresholds and contamination controls must be reviewed study by study.",
        ],
        "language": "A reliable explanation names the sample, preparation, instrument, polymer criteria, controls, result, and limitations before discussing health meaning.",
        "sources": "Editorial explainer grounded in Dr. Haddad's supplied draft: Detecting microplastics.pdf, with study-specific methods linked in the site's Science record.",
        "url": "saynotoplastic.com/science/how-detection-works",
    },
    {
        "filename": "particles-vs-endocrine-chemicals.pdf",
        "number": "05",
        "title": "Particles vs. Endocrine Chemicals",
        "subtitle": "Related subjects, different evidence bases",
        "status": "Primary-source review in progress",
        "overview": "Microplastic particles and plastic-associated chemicals such as BPA and phthalates are connected topics, but they are not the same exposure and should not be presented as one evidence category.",
        "supports": [
            "The endocrine system coordinates growth, metabolism, reproduction, sleep, mood, and energy through hormone signaling.",
            "BPA, phthalates, and other endocrine-disrupting chemicals have been studied for decades and have a broader evidence base than microplastic particles.",
            "Researchers are investigating whether particles may carry chemicals or contribute through inflammation or oxidative stress.",
        ],
        "limits": [
            "Chemical evidence cannot automatically be attributed to the physical particle itself.",
            "The supplied draft's individual hormone and metabolic claims need a complete primary bibliography before production approval.",
            "The material does not establish an individual diagnosis or treatment recommendation.",
        ],
        "language": "Use separate sentences for particle evidence and chemical evidence. Name which exposure the study actually measured.",
        "sources": "Source-review briefing grounded in Dr. Haddad's supplied draft: Endocrine.pdf.",
        "url": "saynotoplastic.com/science/body/endocrine-metabolic-system",
    },
    {
        "filename": "reduce-exposure.pdf",
        "number": "06",
        "title": "Reducing Exposure",
        "subtitle": "Progress, not perfection",
        "status": "Editorial framework and source notes",
        "overview": "Completely avoiding plastic is neither realistic nor necessary. The practical goal is to identify repeated contacts and make one safe, workable change at a time.",
        "supports": [
            "Start with repeated contact around food, drinks, heat, and storage.",
            "Consider indoor dust, ventilation, clothing, cosmetics, and personal-care routines without trying to create a particle-free home.",
            "Keep serviceable products in use and prioritize durable, maintainable alternatives when replacement is already needed.",
            "Small, consistent changes are more useful than dramatic, short-lived efforts.",
        ],
        "limits": [
            "This framework is not a detox, treatment, guarantee, or purity standard.",
            "Medical care, hygiene, food safety, infant feeding, accessibility, emergencies, and local water guidance come first.",
            "Product choices should not be marketed as preventing infertility, kidney disease, cardiovascular disease, or another condition.",
        ],
        "language": "Invite one realistic next step. Avoid fear-based claims, expensive overhauls, and unsupported health promises.",
        "sources": "Practical framework grounded in Dr. Haddad's supplied draft: Reduce exposure.pdf.",
        "url": "saynotoplastic.com/solutions/reduce-exposure",
    },
]


def build_reduce_worksheet():
    path = DOWNLOADS / "reduce-exposure-worksheet.pdf"
    def on_page(c, d):
        _brand_banner(c, d, "Exposure worksheet")
        _header_footer(c, d, "PRACTICAL EXPOSURE REDUCTION")
    doc = make_doc(path, on_page, top_margin=0.67 * inch)
    story = [
        Paragraph("PRACTICAL WORKSHEET", styles["BrandKicker"]),
        Paragraph("Choose less. Keep what works.", styles["DocTitle"]),
        Paragraph("Use this worksheet to notice repeated plastic contact, mark ideas worth considering, and choose one priority for the next month. The goal is not perfection; it is a safe change you can repeat.", styles["DocDeck"]),
        StatusPill("Grounded in Reduce exposure.pdf", 182), Spacer(1, 13),
    ]
    usable = doc.width
    for idx, (number, title, summary, actions) in enumerate(REDUCE_GROUPS):
        if idx == 2:
            story.append(PageBreak())
            story.extend([
                Paragraph("CONTINUE THE INVENTORY", styles["BrandKicker"]),
                Paragraph("Look beyond the kitchen.", styles["DocTitle"]),
                Paragraph("Clothing, personal care, dust, ventilation, and everyday routines also shape the environment around you. Keep what is useful; change what is practical.", styles["DocDeck"]),
            ])
        section = [
            Paragraph(f"{number} / {_safe(title)}", styles["SectionHead"]),
            Paragraph(_safe(summary), styles["BodySNTP"]),
        ]
        section.extend(CheckItem(action, usable, font_size=9.0, leading=12.0) for action in actions)
        section.append(Spacer(1, 8))
        story.append(KeepTogether(section))
    story.extend([
        Spacer(1, 10),
        Paragraph("ONE PRIORITY FOR THE NEXT MONTH", styles["SmallHead"]),
        LinedArea("The one action I will practice", usable, 2),
        LinedArea("The cue, location, or routine that will make it easier", usable, 3),
        LinedArea("What I will review before adding another change", usable, 2),
        Spacer(1, 8),
        Paragraph("Safety boundary", styles["SmallHead"]),
        Paragraph("Keep established medical care, hygiene, food safety, infant feeding, accessibility, emergency needs, and local water guidance first. This worksheet is educational and does not provide medical advice.", styles["BodySNTP"]),
    ])
    doc.build(story)
    return path


def challenge_day_block(day: int, title: str, text: str, width: float):
    box = CheckItem(f"Day {day:02d} - {title}: {text}", width, font_size=9.0, leading=12.0, box=11)
    return KeepTogether([box, LinedArea("What I noticed", width, 1), Spacer(1, 5)])


def build_seven_day():
    path = DOWNLOADS / "sntp-7-day-challenge.pdf"
    def on_page(c, d):
        _brand_banner(c, d, "7-day challenge")
        _header_footer(c, d, "SEVEN DAYS - ONE REALISTIC CHANGE")
    doc = make_doc(path, on_page, top_margin=0.67 * inch)
    story = [
        Paragraph("SELF-PACED PRACTICE", styles["BrandKicker"]),
        Paragraph("Seven days. One realistic reset.", styles["DocTitle"]),
        Paragraph("This is not a detox, treatment, or purity test. Use one week to notice repeated contact, try practical changes, and keep the single routine that fits your life.", styles["DocDeck"]),
        StatusPill("Progress, not perfection", 160), Spacer(1, 14),
    ]
    for day, title, text in SEVEN_DAY[:4]:
        story.append(challenge_day_block(day, title, text, doc.width))
    story.append(PageBreak())
    story.extend([
        Paragraph("DAYS 05-07", styles["BrandKicker"]),
        Paragraph("Keep what can last.", styles["DocTitle"]),
        Paragraph("A small repeated change is more useful than an expensive or short-lived overhaul.", styles["DocDeck"]),
    ])
    for day, title, text in SEVEN_DAY[4:]:
        story.append(challenge_day_block(day, title, text, doc.width))
    story.extend([
        Spacer(1, 7),
        LinedArea("The one change I am keeping", doc.width, 2),
        LinedArea("One accurate sentence I can share", doc.width, 2),
        Paragraph("Keep medical care, hygiene, food safety, infant feeding, accessibility, and emergencies ahead of plastic-reduction goals.", styles["Tiny"]),
    ])
    doc.build(story)
    return path


def build_thirty_day():
    path = DOWNLOADS / "sntp-30-day-challenge.pdf"
    def on_page(c, d):
        _brand_banner(c, d, "30-day challenge")
        _header_footer(c, d, "THIRTY DAYS - LEARN, ACT, REVIEW")
    doc = make_doc(path, on_page, top_margin=0.67 * inch)
    story = [
        Paragraph("SELF-PACED PRACTICE", styles["BrandKicker"]),
        Paragraph("Thirty days. A slower path from evidence to routine.", styles["DocTitle"]),
        Paragraph("The month combines practical changes with evidence literacy. It begins with one repeated exposure, then adds methods, the exposome, body-system context, and accurate sharing.", styles["DocDeck"]),
        StatusPill("Device-free printable companion", 190), Spacer(1, 12),
        Paragraph("How to use this plan", styles["SectionHead"]),
        Paragraph("Check one day at a time. Skip or adapt any task that conflicts with medical care, hygiene, food safety, infant feeding, accessibility, budget, housing, or local environmental guidance. Do not replace useful items simply to complete the plan.", styles["BodySNTP"]),
        LinedArea("My one priority for this month", doc.width, 3),
        PageBreak(),
    ]
    week_ranges = [(0,7),(7,14),(14,21),(21,30)]
    week_titles = [
        "Week 1 - Notice and choose",
        "Week 2 - Home, clothing, and durable use",
        "Week 3 - Read the evidence carefully",
        "Week 4 - Practice, share, and keep what works",
    ]
    for week_index, (start, end) in enumerate(week_ranges):
        story.extend([
            Paragraph(f"WEEK {week_index + 1}", styles["BrandKicker"]),
            Paragraph(week_titles[week_index], styles["DocTitle"]),
        ])
        for i in range(start, end):
            title, text = THIRTY_DAY[i]
            story.append(CheckItem(f"Day {i + 1:02d} - {title}: {text}", doc.width, font_size=8.7, leading=11.3, box=10))
        story.extend([
            Spacer(1, 8),
            LinedArea("Week review - what is likely to last", doc.width, 2),
        ])
        if week_index < len(week_ranges) - 1:
            story.append(PageBreak())
    story.extend([
        Spacer(1, 7),
        Paragraph("Close the loop", styles["SmallHead"]),
        LinedArea("What changed", doc.width, 2),
        LinedArea("What did not change", doc.width, 2),
        LinedArea("The evidence question I want to follow next", doc.width, 2),
        Paragraph("This plan is educational. It does not diagnose, treat, prevent, or guarantee a health outcome.", styles["Tiny"]),
    ])
    doc.build(story)
    return path


def _brief_page(canvas, doc):
    _brand_banner(canvas, doc, "Evidence briefing")
    _header_footer(canvas, doc, "MEDIA BRIEF - EVIDENCE BEFORE SENSATION")


def _bullet(text: str):
    return Paragraph(f"- {_safe(text)}", styles["BriefBullet"])


def build_press_brief(brief: dict):
    path = PRESS / brief["filename"]
    doc = make_doc(path, _brief_page, top_margin=0.66 * inch, bottom_margin=0.52 * inch)
    left = [Paragraph("WHAT THE CURRENT MATERIAL SUPPORTS", styles["SmallHead"])] + [_bullet(x) for x in brief["supports"]]
    right = [Paragraph("WHAT IT DOES NOT ESTABLISH", styles["SmallHead"])] + [_bullet(x) for x in brief["limits"]]
    columns = Table([[left, right]], colWidths=[doc.width * 0.5, doc.width * 0.5], hAlign="LEFT")
    columns.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("LEFTPADDING", (0,0), (0,0), 0),
        ("RIGHTPADDING", (0,0), (0,0), 14),
        ("LEFTPADDING", (1,0), (1,0), 14),
        ("RIGHTPADDING", (1,0), (1,0), 0),
        ("LINEBEFORE", (1,0), (1,0), 0.6, LINE),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
    ]))
    story = [
        Paragraph(f"BRIEF {brief['number']}", styles["BrandKicker"]),
        Paragraph(_safe(brief["title"]), styles["BriefTitle"]),
        Paragraph(_safe(brief["subtitle"]), styles["BriefSub"]),
        StatusPill(_safe(brief["status"]), 210),
        Spacer(1, 9),
        Paragraph(_safe(brief["overview"]), styles["BriefBody"]),
        Spacer(1, 5),
        columns,
        Spacer(1, 7),
        Table([
            [Paragraph("INTERVIEW-SAFE LANGUAGE", styles["SmallHead"]), Paragraph(_safe(brief["language"]), styles["BriefBody"])],
            [Paragraph("SOURCE STATUS", styles["SmallHead"]), Paragraph(_safe(brief["sources"]), styles["BriefBody"])],
        ], colWidths=[1.35*inch, doc.width-1.35*inch], style=TableStyle([
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#F0E7D9")),
            ("GRID", (0,0), (-1,-1), 0.5, LINE),
            ("LEFTPADDING", (0,0), (-1,-1), 9),
            ("RIGHTPADDING", (0,0), (-1,-1), 9),
            ("TOPPADDING", (0,0), (-1,-1), 7),
            ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ])),
        Spacer(1, 8),
        Paragraph("FULL TOPIC AND SOURCE RECORD", styles["SmallHead"]),
        Paragraph(_safe(brief["url"]), styles["BriefBody"]),
        Spacer(1, 4),
        Paragraph("Medical boundary: public education only. Do not use this briefing for personal diagnosis, treatment, testing, or emergency guidance.", styles["Tiny"]),
    ]
    doc.build(story)
    return path


def main():
    generated = [build_reduce_worksheet(), build_seven_day(), build_thirty_day()]
    generated.extend(build_press_brief(item) for item in PRESS_BRIEFS)
    for path in generated:
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
